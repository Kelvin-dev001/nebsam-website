'use client';

import * as React from 'react';
import { useActionState } from 'react';
import {
  previewCertificateImport,
  commitCertificateImport,
  type ImportResult,
} from '@/app/(admin)/admin/certificates/actions';
import { Button } from '@/components/ui/button';
import { StatusPill, ScrollTable, Th, Td } from '@/components/admin/primitives';

/**
 * THE CERTIFICATE IMPORTER.
 *
 * Two forms, in sequence: preview, then import. `docs/CMS_ARCHITECTURE.md`
 * §6.1 requires "a dry-run preview showing row counts, duplicates and malformed
 * rows BEFORE any write", and the shape here makes that structural — the commit
 * form does not exist until a preview has been rendered.
 *
 * ── Why the file is chosen twice ────────────────────────────────────────────
 *
 * The commit re-uploads and re-parses the file rather than posting back a plan
 * the browser is holding. Sending the prepared plan would mean the endpoint
 * accepting plate digests and dates from the client for direct insertion into
 * the most sensitive table on the project.
 *
 * A browser cannot re-populate a file input for security reasons, so the
 * operator picks the same file again. That is friction, and it is bought
 * deliberately: it also means somebody who walked away between the preview and
 * the import cannot commit a plan they can no longer see.
 */
export function CertificateImporter() {
  const [preview, previewAction, previewing] = useActionState<ImportResult | null, FormData>(
    previewCertificateImport,
    null,
  );
  const [commit, commitAction, committing] = useActionState<ImportResult | null, FormData>(
    commitCertificateImport,
    null,
  );

  const plan = preview && preview.ok && preview.mode === 'preview' ? preview.plan : null;
  const problems = plan ? [...plan.rejected, ...plan.duplicatesInFile] : [];
  const importable = plan !== null && problems.length === 0 && plan.insertCount + plan.updateCount > 0;

  return (
    <div className="mt-8 flex flex-col gap-8">
      <form
        action={previewAction}
        encType="multipart/form-data"
        className="flex flex-col gap-5 rounded-panel border border-border-hairline bg-surface p-5"
      >
        <div>
          <h2 className="font-display-tight text-h3">1. Check the file</h2>
          <p className="mt-1 max-w-prose text-body-sm text-text-secondary">
            Nothing is written at this step. The file is read, every plate is normalised and hashed
            the same way the customer lookup will hash it, and you are shown what would happen.
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">
            CSV file <span className="font-normal text-text-secondary">(required)</span>
          </span>
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 py-2 text-body"
          />
        </label>

        <Button type="submit" variant="secondary" disabled={previewing}>
          {previewing ? 'Reading…' : 'Check the file'}
        </Button>

        <div role="status" aria-live="polite">
          {preview && !preview.ok ? (
            <p className="rounded-panel border border-state-alert-ink/40 bg-surface p-3 text-body-sm text-state-alert-ink">
              {preview.message}
            </p>
          ) : null}
        </div>
      </form>

      {plan ? (
        <section aria-labelledby="preview-heading" className="flex flex-col gap-5">
          <div>
            <h2 id="preview-heading" className="font-display-tight text-h3">
              What would happen
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              {plan.totalDataRows} data row{plan.totalDataRows === 1 ? '' : 's'} read. Columns found:{' '}
              <code className="font-mono text-mono">{plan.headers.join(', ')}</code>
            </p>
          </div>

          <ul className="flex flex-wrap gap-3">
            <li className="rounded-panel border border-border-hairline bg-surface px-4 py-3">
              <span className="block font-display text-h3 tabular-nums">{plan.insertCount}</span>
              <span className="text-body-sm text-text-secondary">new certificates</span>
            </li>
            <li className="rounded-panel border border-state-warn-ink/40 bg-surface px-4 py-3">
              <span className="block font-display text-h3 tabular-nums">{plan.updateCount}</span>
              <span className="text-body-sm text-text-secondary">would REPLACE an existing one</span>
            </li>
            <li
              className={[
                'rounded-panel border bg-surface px-4 py-3',
                problems.length > 0 ? 'border-state-alert-ink/50' : 'border-border-hairline',
              ].join(' ')}
            >
              <span className="block font-display text-h3 tabular-nums">{problems.length}</span>
              <span className="text-body-sm text-text-secondary">cannot be imported</span>
            </li>
          </ul>

          {plan.updateCount > 0 ? (
            <p className="max-w-prose rounded-panel border border-state-warn-ink/40 bg-surface p-4 text-body-sm">
              <strong>{plan.updateCount} row(s) match a certificate that already exists.</strong>{' '}
              One certificate is stored per vehicle, so importing will replace those records —
              including their dates and their second factor. If that is not what you intend, remove
              those rows from the file.
            </p>
          ) : null}

          {plan.sample.length > 0 ? (
            <div>
              <h3 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                First few rows, as they were understood
              </h3>
              <p className="mt-1 max-w-prose text-body-sm text-text-secondary">
                Check the dates and the plates. A plate that normalised unexpectedly is a
                certificate the customer will never find — the letter O is folded to a zero, and
                spaces and hyphens are dropped.
              </p>
              <ScrollTable label="Sample rows">
                <thead>
                  <tr>
                    <Th>Line</Th>
                    <Th>Plate, normalised</Th>
                    <Th>Installed</Th>
                    <Th>Expires</Th>
                  </tr>
                </thead>
                <tbody>
                  {plan.sample.map((row) => (
                    <tr key={row.line}>
                      <Td className="font-mono text-mono text-text-secondary">{row.line}</Td>
                      <Td className="font-mono text-mono">{row.plate}</Td>
                      <Td className="font-mono text-mono">{row.installedOn ?? '—'}</Td>
                      <Td className="font-mono text-mono">{row.expiresOn ?? '—'}</Td>
                    </tr>
                  ))}
                </tbody>
              </ScrollTable>
            </div>
          ) : null}

          {problems.length > 0 ? (
            <div>
              <h3 className="font-mono text-label uppercase tracking-[0.08em] text-state-alert-ink">
                Rows that stop the import
              </h3>
              <p className="mt-1 max-w-prose text-body-sm text-text-secondary">
                Nothing will be imported while any row is unreadable. Fix the file and check it
                again — importing most of it and reconciling the rest by hand is how a certificate
                register stops matching reality.
              </p>
              <ScrollTable label="Problem rows">
                <thead>
                  <tr>
                    <Th>Line</Th>
                    <Th>As written</Th>
                    <Th>Why</Th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr key={`${problem.line}-${problem.reason}`}>
                      <Td className="font-mono text-mono text-text-secondary">{problem.line}</Td>
                      <Td className="font-mono text-mono">{problem.reference}</Td>
                      <Td className="text-body-sm">{problem.reason}</Td>
                    </tr>
                  ))}
                </tbody>
              </ScrollTable>
            </div>
          ) : null}
        </section>
      ) : null}

      {importable ? (
        <form
          action={commitAction}
          encType="multipart/form-data"
          className="flex flex-col gap-5 rounded-panel border border-brand-signal-ink/40 bg-surface p-5"
        >
          <div>
            <h2 className="font-display-tight text-h3">2. Import</h2>
            <p className="mt-1 max-w-prose text-body-sm text-text-secondary">
              Choose the <strong>same file</strong> again. It is read and hashed a second time
              rather than trusting anything this page is holding — a plan posted back from a browser
              is a plan somebody can edit, and this writes to the most sensitive table on the site.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">The same CSV file</span>
            <input
              type="file"
              name="file"
              accept=".csv,text/csv"
              required
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 py-2 text-body"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">
              Type <code className="font-mono">IMPORT</code> to confirm
            </span>
            <input
              name="confirm"
              required
              autoComplete="off"
              placeholder="IMPORT"
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 font-mono text-mono"
            />
          </label>

          <Button type="submit" variant="primary" disabled={committing}>
            {committing ? 'Importing…' : `Import ${plan.insertCount + plan.updateCount} certificate(s)`}
          </Button>

          <div role="status" aria-live="polite">
            {commit ? (
              <p
                className={[
                  'rounded-panel border p-3 text-body-sm',
                  commit.ok
                    ? 'border-state-ok-ink/40 text-state-ok-ink'
                    : 'border-state-alert-ink/40 text-state-alert-ink',
                ].join(' ')}
              >
                {commit.ok && commit.mode === 'committed' ? commit.message : null}
                {!commit.ok ? commit.message : null}
              </p>
            ) : null}
          </div>
        </form>
      ) : null}

      {plan && !importable && problems.length === 0 ? (
        <p className="text-body-sm text-text-secondary">
          <StatusPill tone="neutral">Nothing to import</StatusPill> Every row in the file is already
          stored exactly as it appears, or the file has no data rows.
        </p>
      ) : null}
    </div>
  );
}
