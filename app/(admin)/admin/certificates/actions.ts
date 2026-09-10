'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { serviceClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/admin/actor';
import { recordAudit } from '@/lib/admin/audit';
import { plateHash, phoneFactorHash, toBytea, fromBytea } from '@/lib/verification/hashing';
import { parseCsv, prepareImport, type ImportPlan } from '@/lib/admin/certificate-import';

/**
 * CERTIFICATE IMPORT.
 *
 * `docs/CMS_ARCHITECTURE.md` §6.1 and `docs/SECURITY_REQUIREMENTS.md` §1.5.
 *
 * ── Three properties this file exists to hold ───────────────────────────────
 *
 * 1. NO PLAINTEXT PLATE REACHES `installation_certificates`. The plate is
 *    normalised and HMAC'd here, and the only plaintext copy goes to
 *    `installation_plates_restricted`, which is admin-only, never joined into
 *    the lookup path, and exists solely so a secret rotation is recoverable —
 *    without it, rotating `CERT_PLATE_HMAC_SECRET` would leave nothing to
 *    re-hash from.
 *
 * 2. THE DRY RUN AND THE IMPORT SHARE ONE CODE PATH. `prepareImport` produces
 *    the plan; the preview renders it and the commit writes it. A preview
 *    computed by different code from the import is a preview that can pass
 *    while the import does something else, which is worse than no preview.
 *
 * 3. THE AUDIT ENTRY RECORDS COUNTS, NEVER CONTENTS. §6.1 is explicit. An audit
 *    trail listing the plates imported would be a plaintext plate list in a
 *    table, which is the one thing this entire subsystem is designed to prevent.
 *
 * ── "Transactional", honestly ───────────────────────────────────────────────
 *
 * §6.1 asks for a transactional import: partial imports do not happen. This
 * writes through PostgREST, which has no cross-request transaction — so what is
 * achieved is weaker than a `BEGIN … COMMIT` and the difference is stated
 * rather than glossed:
 *
 *   - Certificates are written in ONE request as a single array upsert. Postgres
 *     runs that statement in an implicit transaction, so all rows land or none
 *     do. That is genuinely atomic.
 *   - The restricted plate table is a SECOND request. If it fails after the
 *     first succeeded, the certificates exist and their plaintext backups do
 *     not — which is recoverable by re-running the same file, and is the
 *     failure direction that costs least: the lookup works, and only a future
 *     secret rotation is impaired.
 *   - Nothing is written at all unless the plan has zero rejections. An operator
 *     fixes the file rather than importing 340 of 350 rows and reconciling by
 *     hand.
 *
 * A truly atomic import needs a database function taking the whole batch, which
 * is a data-model change and is recorded in the Sprint 12 report as the
 * improvement rather than claimed as done.
 */

export type ImportResult =
  | { ok: true; mode: 'preview'; plan: SerialisablePlan }
  | { ok: true; mode: 'committed'; inserted: number; updated: number; message: string }
  | { ok: false; message: string };

/**
 * The plan as it crosses to the client.
 *
 * Note what is REMOVED: every digest, the plaintext plate and the plaintext
 * phone. The preview shows line numbers, the plate AS WRITTEN IN THE FILE — the
 * operator's own input, which they are already looking at — counts, and
 * reasons. A digest in a page's serialised props is a digest in the HTML.
 */
export interface SerialisablePlan {
  insertCount: number;
  updateCount: number;
  rejected: { line: number; reference: string; reason: string }[];
  duplicatesInFile: { line: number; reference: string; reason: string }[];
  headers: string[];
  totalDataRows: number;
  /** A handful of prepared lines, so the operator can see dates parsed correctly. */
  sample: { line: number; plate: string; installedOn: string | null; expiresOn: string | null }[];
}

const MAX_ROWS = 5000;
const MAX_BYTES = 2 * 1024 * 1024;

function hashPair(normalisedPlate: string, normalisedPhoneFactor: string) {
  return {
    plateHashHex: plateHash(normalisedPlate).toString('hex'),
    phoneHashHex: phoneFactorHash(normalisedPhoneFactor).toString('hex'),
  };
}

/** Every plate digest already stored, so the plan can distinguish new from replaced. */
async function existingPlateHashes(): Promise<Set<string>> {
  const hashes = new Set<string>();
  const pageSize = 1000;

  for (let page = 0; ; page += 1) {
    const { data, error } = await serviceClient()
      .from('installation_certificates')
      .select('plate_hash')
      .range(page * pageSize, page * pageSize + pageSize - 1);

    if (error || !data || data.length === 0) break;
    for (const row of data) {
      const buffer = fromBytea(row.plate_hash);
      if (buffer.length > 0) hashes.add(buffer.toString('hex'));
    }
    if (data.length < pageSize) break;
  }

  return hashes;
}

async function buildPlan(file: File): Promise<{ plan: ImportPlan } | { error: string }> {
  if (file.size === 0) return { error: 'That file is empty.' };
  if (file.size > MAX_BYTES) {
    return { error: `That file is ${Math.round(file.size / 1024)} KB. The ceiling is 2 MB.` };
  }
  if (!/\.csv$/i.test(file.name)) {
    return { error: 'The file must be a .csv. Export it from the spreadsheet as CSV.' };
  }

  const text = await file.text();
  const rows = parseCsv(text);

  if (rows.length > MAX_ROWS + 1) {
    return { error: `That file has ${rows.length - 1} rows. Import at most ${MAX_ROWS} at a time.` };
  }

  const plan = prepareImport(rows, {
    existingPlateHashes: await existingPlateHashes(),
    hash: hashPair,
  });

  return { plan };
}

function serialise(plan: ImportPlan): SerialisablePlan {
  return {
    insertCount: plan.inserts.length,
    updateCount: plan.updates.length,
    rejected: plan.rejected,
    duplicatesInFile: plan.duplicatesInFile,
    headers: plan.headers,
    totalDataRows: plan.totalDataRows,
    sample: [...plan.inserts, ...plan.updates].slice(0, 5).map((row) => ({
      line: row.line,
      // The normalised plate, not the digest. It is what the operator typed,
      // reduced the way the lookup will reduce it — which is the one thing
      // worth showing, because a plate that normalised unexpectedly is a
      // certificate nobody will ever find.
      plate: row.normalisedPlate,
      installedOn: row.installedOn,
      expiresOn: row.expiresOn,
    })),
  };
}

/** THE DRY RUN. Writes nothing. */
export async function previewCertificateImport(
  _previous: ImportResult | null,
  formData: FormData,
): Promise<ImportResult> {
  const actor = await requireStaff('admin');
  if (!actor) return { ok: false, message: 'Only an administrator can import certificates.' };

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, message: 'Choose a CSV file.' };

  const built = await buildPlan(file);
  if ('error' in built) return { ok: false, message: built.error };

  // A preview is not a write, but it IS a read of the whole certificate table
  // and a hashing of somebody's file. Worth recording that it happened.
  await recordAudit({
    actorId: actor.id,
    action: 'certificate.import_preview',
    entity: 'installation_certificate',
    diff: {
      rows: built.plan.totalDataRows,
      inserts: built.plan.inserts.length,
      updates: built.plan.updates.length,
      rejected: built.plan.rejected.length,
    },
  });

  return { ok: true, mode: 'preview', plan: serialise(built.plan) };
}

/**
 * THE IMPORT.
 *
 * Re-parses the file rather than trusting a plan sent back from the browser.
 * The alternative — posting the prepared plan to a commit action — would mean
 * accepting plate digests, dates and a certificate number from the client for
 * direct insertion into the most sensitive table on the project. The file is
 * uploaded twice and hashed twice; that is a few hundred milliseconds against
 * an endpoint that would otherwise write whatever it was handed.
 */
export async function commitCertificateImport(
  _previous: ImportResult | null,
  formData: FormData,
): Promise<ImportResult> {
  const actor = await requireStaff('admin');
  if (!actor) return { ok: false, message: 'Only an administrator can import certificates.' };

  const confirmed = z
    .literal('IMPORT')
    .safeParse(formData.get('confirm'));
  if (!confirmed.success) {
    return { ok: false, message: 'Type IMPORT to confirm you have read the preview.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, message: 'Choose the same CSV file again.' };

  const built = await buildPlan(file);
  if ('error' in built) return { ok: false, message: built.error };

  const { plan } = built;

  // ALL OR NOTHING ON VALIDATION. See the header: an operator fixes the file
  // rather than importing 340 of 350 rows and reconciling by hand.
  if (plan.rejected.length > 0 || plan.duplicatesInFile.length > 0) {
    return {
      ok: false,
      message: `Nothing was imported. ${plan.rejected.length} row(s) could not be read and ${plan.duplicatesInFile.length} duplicate plate(s) were found in the file. Fix the file and try again.`,
    };
  }

  const rows = [...plan.inserts, ...plan.updates];
  if (rows.length === 0) return { ok: false, message: 'There is nothing to import.' };

  const db = serviceClient();

  // ONE request, one array. Postgres runs it in an implicit transaction, so
  // every row lands or none does. `onConflict: plate_hash` is what makes a
  // re-run of the same file idempotent rather than a unique-violation.
  const { error: certificateError } = await db.from('installation_certificates').upsert(
    rows.map((row) => ({
      plate_hash: toBytea(Buffer.from(row.plateHashHex, 'hex')),
      phone_last4_hash: toBytea(Buffer.from(row.phoneHashHex, 'hex')),
      certificate_number_last4: row.certificateNumberLast4,
      installed_on: row.installedOn,
      expires_on: row.expiresOn,
      status: 'active',
      updated_at: new Date().toISOString(),
    })),
    { onConflict: 'plate_hash' },
  );

  if (certificateError) {
    return {
      ok: false,
      message: `Nothing was imported. The database refused the batch: ${certificateError.message}`,
    };
  }

  /**
   * The restricted plate store, as a second request.
   *
   * It is keyed by `certificate_id`, so the ids have to be read back — the
   * upsert above cannot return them for conflicting rows in a way that maps
   * cleanly onto the input. So: fetch the ids for these digests, then upsert
   * the plaintext against them.
   *
   * A failure here is reported and does NOT roll back the certificates. See the
   * header on why that is the right failure direction: verification works, and
   * only a future secret rotation is impaired, which re-running the same file
   * repairs.
   */
  const digests = rows.map((row) => toBytea(Buffer.from(row.plateHashHex, 'hex')));
  const { data: stored } = await db
    .from('installation_certificates')
    .select('id, plate_hash')
    .in('plate_hash', digests);

  const idByDigest = new Map(
    (stored ?? []).map((row) => [fromBytea(row.plate_hash).toString('hex'), row.id]),
  );

  const restricted = rows.flatMap((row) => {
    const id = idByDigest.get(row.plateHashHex);
    if (!id) return [];
    return [
      {
        certificate_id: id,
        plate_plaintext: row.platePlaintext,
        phone_plaintext: row.phonePlaintext,
      },
    ];
  });

  const { error: restrictedError } = await db
    .from('installation_plates_restricted')
    .upsert(restricted, { onConflict: 'certificate_id' });

  await recordAudit({
    actorId: actor.id,
    action: 'certificate.import',
    entity: 'installation_certificate',
    // COUNTS ONLY. §6.1: "Every import written to audit_log with row counts,
    // never row contents." A list of imported plates in the audit log would be
    // the plaintext plate list this whole subsystem exists to prevent.
    diff: {
      rows: rows.length,
      inserted: plan.inserts.length,
      updated: plan.updates.length,
      restricted_written: restricted.length,
      restricted_error: restrictedError ? restrictedError.message : null,
    },
  });

  revalidatePath('/admin/certificates');
  revalidatePath('/admin');

  if (restrictedError) {
    return {
      ok: false,
      message: `${rows.length} certificate(s) were imported, but the restricted plate store failed: ${restrictedError.message}. Verification works. Re-run the same file to repair the backup a secret rotation would need.`,
    };
  }

  return {
    ok: true,
    mode: 'committed',
    inserted: plan.inserts.length,
    updated: plan.updates.length,
    message: `Imported ${plan.inserts.length} new and replaced ${plan.updates.length} existing certificate(s).`,
  };
}
