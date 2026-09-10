import 'server-only';
import { normalisePlate, normalisePhoneFactor } from '@/lib/verification/hashing';

/**
 * CERTIFICATE CSV PARSING AND VALIDATION.
 *
 * `docs/CMS_ARCHITECTURE.md` §6.1: "The only bulk-data path in the admin, and it
 * touches the most sensitive table on the project."
 *
 * ── The format ──────────────────────────────────────────────────────────────
 *
 * Register item V04 — the certificate source and format — is STILL OPEN. This
 * is built to the legacy specimen and the client's instruction of 10 September
 * 2026 to proceed on that basis, and the assumption is stated on the import
 * screen itself so nobody has to read this file to discover it:
 *
 *     plate, phone, certificate_number, installed_on, expires_on
 *
 * The specimen shows a serial of the form `P051510924U/2007` and a validity of
 * one year. Only the LAST FOUR characters of the certificate number are ever
 * stored (migration 0006) — enough for a support call to disambiguate, useless
 * for enumeration.
 *
 * V04 also asks whether the certificate number is SEQUENTIAL, and that question
 * is not answered by building this. If it is sequential it needs enumeration
 * hardening of its own, and the four stored characters make that a smaller
 * problem than it would otherwise be but not a solved one.
 *
 * ── What this module does not do ────────────────────────────────────────────
 *
 * It does not write. It parses, validates, hashes and reports — and the caller
 * decides whether to commit. That separation is what makes a genuine dry run
 * possible: the SAME code path produces the preview and the import, so a
 * preview cannot pass while the import does something different.
 */

/** A row as it appears in the file, before anything is normalised. */
export interface RawRow {
  line: number;
  plate: string;
  phone: string;
  certificate_number: string;
  installed_on: string;
  expires_on: string;
}

/** A row that will be written. Holds digests AND plaintext — see the writer. */
export interface PreparedRow {
  line: number;
  /** The normalised plate. Kept for the restricted operational table only. */
  normalisedPlate: string;
  plateHashHex: string;
  phoneHashHex: string;
  certificateNumberLast4: string | null;
  installedOn: string | null;
  expiresOn: string | null;
  /** Retained for `installation_plates_restricted`. Never for the lookup table. */
  platePlaintext: string;
  phonePlaintext: string;
}

export interface RowProblem {
  line: number;
  /** The plate as written, so the operator can find the line. Never a hash. */
  reference: string;
  reason: string;
}

export interface ImportPlan {
  /** Rows that will be inserted. */
  inserts: PreparedRow[];
  /** Rows that will REPLACE an existing certificate for the same plate. */
  updates: PreparedRow[];
  /** Rows that cannot be written, with the reason. */
  rejected: RowProblem[];
  /** Rows appearing more than once in the file itself. */
  duplicatesInFile: RowProblem[];
  /** Header names actually found, so a mismatched file is obvious. */
  headers: string[];
  totalDataRows: number;
}

const REQUIRED_HEADERS = ['plate', 'phone'] as const;

/**
 * A minimal RFC 4180 reader.
 *
 * Handles quoted fields, escaped quotes and both line endings. It does NOT
 * handle a quoted field containing a newline, which is refused rather than
 * mis-parsed — no legitimate column in this format contains one, and a parser
 * that half-supports it is how a plate ends up split across two records.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  // Strip a UTF-8 BOM. Excel writes one, and it otherwise becomes part of the
  // first header name — so `plate` arrives as `﻿plate` and the column is
  // reported missing on a file that is completely correct.
  const source = text.replace(/^﻿/, '');

  for (const rawLine of source.split(/\r?\n/)) {
    if (rawLine.trim() === '') continue;
    const fields: string[] = [];
    let field = '';
    let inQuotes = false;

    for (let index = 0; index < rawLine.length; index += 1) {
      const char = rawLine[index];
      if (inQuotes) {
        if (char === '"') {
          if (rawLine[index + 1] === '"') {
            field += '"';
            index += 1;
          } else {
            inQuotes = false;
          }
        } else {
          field += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(field);
        field = '';
      } else {
        field += char;
      }
    }
    fields.push(field);
    rows.push(fields.map((value) => value.trim()));
  }

  return rows;
}

/** `2026-09-10`, `10/09/2026` and `10-09-2026` all mean the same date here. */
function parseDate(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  // Day first, because that is how dates are written in Kenya and everywhere
  // else this file might be produced. A month-first reading of 10/09/2026
  // would be off by a month for eleven days in twelve and correct-looking
  // throughout.
  const dmy = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(value);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    if (day < 1 || day > 31 || month < 1 || month > 12) return null;
    return `${dmy[3]}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return null;
}

/** Does the date exist? `2026-02-30` parses by shape and is not a day. */
function isRealDate(iso: string): boolean {
  const date = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === iso;
}

export interface PrepareOptions {
  /** Plates already in `installation_certificates`, as lowercase hex digests. */
  existingPlateHashes: Set<string>;
  /** Produces the digests. Injected so the caller supplies the real hashing. */
  hash: (normalisedPlate: string, normalisedPhoneFactor: string) => {
    plateHashHex: string;
    phoneHashHex: string;
  };
}

/**
 * Turn a parsed CSV into a plan.
 *
 * Every row is either an insert, an update or a rejection, and nothing is
 * silently dropped. A row missing a plate is reported by line number; a row
 * whose plate normalises to fewer than four characters is rejected rather than
 * hashed, because a two-character key would match far too much.
 */
export function prepareImport(rows: string[][], options: PrepareOptions): ImportPlan {
  const plan: ImportPlan = {
    inserts: [],
    updates: [],
    rejected: [],
    duplicatesInFile: [],
    headers: [],
    totalDataRows: 0,
  };

  if (rows.length === 0) {
    plan.rejected.push({ line: 0, reference: '—', reason: 'The file is empty.' });
    return plan;
  }

  const headers = rows[0].map((value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '_'));
  plan.headers = headers;

  const missing = REQUIRED_HEADERS.filter((name) => !headers.includes(name));
  if (missing.length > 0) {
    plan.rejected.push({
      line: 1,
      reference: 'header',
      reason: `The file is missing the column${missing.length > 1 ? 's' : ''} ${missing.join(' and ')}. Found: ${headers.join(', ') || 'nothing'}.`,
    });
    return plan;
  }

  const column = (name: string) => headers.indexOf(name);
  const columns = {
    plate: column('plate'),
    phone: column('phone'),
    certificate: [column('certificate_number'), column('certificate'), column('number')].find(
      (index) => index >= 0,
    ) ?? -1,
    installed: [column('installed_on'), column('installed'), column('installed_date')].find(
      (index) => index >= 0,
    ) ?? -1,
    expires: [column('expires_on'), column('expires'), column('expiry'), column('expiry_date')].find(
      (index) => index >= 0,
    ) ?? -1,
  };

  // Digests seen in THIS file, so a plate listed twice is caught before the
  // database is asked. Two rows for one plate would otherwise be one insert and
  // one silent overwrite, and the operator would never know which won.
  const seenInFile = new Map<string, number>();

  for (let index = 1; index < rows.length; index += 1) {
    const fields = rows[index];
    const line = index + 1;
    plan.totalDataRows += 1;

    const rawPlate = fields[columns.plate] ?? '';
    const rawPhone = fields[columns.phone] ?? '';
    const reference = rawPlate || `line ${line}`;

    if (!rawPlate.trim()) {
      plan.rejected.push({ line, reference, reason: 'No plate.' });
      continue;
    }

    const normalisedPlate = normalisePlate(rawPlate);
    if (normalisedPlate.length < 4) {
      plan.rejected.push({
        line,
        reference,
        reason: `“${rawPlate}” reduces to “${normalisedPlate}”, which is too short to be a plate.`,
      });
      continue;
    }

    const phoneFactor = normalisePhoneFactor(rawPhone);
    if (phoneFactor.length !== 4) {
      plan.rejected.push({
        line,
        reference,
        // The phone is the SECOND FACTOR. Without it the certificate can be
        // looked up by plate alone, which brief 9.2 forbids outright — so this
        // is a rejection, never a row written with a null factor.
        reason: rawPhone.trim()
          ? `The phone “${rawPhone}” gives fewer than four digits. The last four digits are the second factor and the certificate cannot be verified without them.`
          : 'No phone number. It is the second factor and a certificate cannot be written without one.',
      });
      continue;
    }

    const { plateHashHex, phoneHashHex } = options.hash(normalisedPlate, phoneFactor);

    const firstSeen = seenInFile.get(plateHashHex);
    if (firstSeen !== undefined) {
      plan.duplicatesInFile.push({
        line,
        reference,
        reason: `The same plate already appears on line ${firstSeen}. Only one certificate per vehicle is stored, so this row would overwrite that one.`,
      });
      continue;
    }
    seenInFile.set(plateHashHex, line);

    const rawInstalled = columns.installed >= 0 ? (fields[columns.installed] ?? '') : '';
    const rawExpires = columns.expires >= 0 ? (fields[columns.expires] ?? '') : '';
    const installedOn = parseDate(rawInstalled);
    const expiresOn = parseDate(rawExpires);

    if (rawInstalled.trim() && !installedOn) {
      plan.rejected.push({ line, reference, reason: `Installed date “${rawInstalled}” is not a date.` });
      continue;
    }
    if (rawExpires.trim() && !expiresOn) {
      plan.rejected.push({ line, reference, reason: `Expiry date “${rawExpires}” is not a date.` });
      continue;
    }
    if (installedOn && !isRealDate(installedOn)) {
      plan.rejected.push({ line, reference, reason: `Installed date “${rawInstalled}” is not a real day.` });
      continue;
    }
    if (expiresOn && !isRealDate(expiresOn)) {
      plan.rejected.push({ line, reference, reason: `Expiry date “${rawExpires}” is not a real day.` });
      continue;
    }
    if (installedOn && expiresOn && expiresOn < installedOn) {
      plan.rejected.push({
        line,
        reference,
        reason: 'The expiry date is before the installation date.',
      });
      continue;
    }

    const rawCertificate = columns.certificate >= 0 ? (fields[columns.certificate] ?? '') : '';
    // Last four ALPHANUMERIC characters. The specimen serial is
    // `P051510924U/2007`, whose last four are `2007` — the slash and anything
    // else punctuational is dropped so the stored value matches the CHECK
    // constraint in 0006.
    const certificateDigits = rawCertificate.replace(/[^0-9A-Za-z]/g, '');
    const certificateNumberLast4 =
      certificateDigits.length >= 4 ? certificateDigits.slice(-4) : null;

    const prepared: PreparedRow = {
      line,
      normalisedPlate,
      plateHashHex,
      phoneHashHex,
      certificateNumberLast4,
      installedOn,
      expiresOn,
      platePlaintext: normalisedPlate,
      phonePlaintext: rawPhone.trim(),
    };

    if (options.existingPlateHashes.has(plateHashHex)) plan.updates.push(prepared);
    else plan.inserts.push(prepared);
  }

  return plan;
}
