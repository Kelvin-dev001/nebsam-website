import 'server-only';
import { serviceClient } from '@/lib/supabase/server';

/**
 * THE AUDIT LOG WRITER.
 *
 * Brief PART 16 and `docs/CMS_ARCHITECTURE.md` §8: every admin create, update
 * and delete is recorded with actor, action, entity, entity id, diff and
 * timestamp. Append-only — no update or delete policy exists for anyone,
 * including admin, and migration 0007 backs that with triggers so a future
 * migration adding a policy by mistake still cannot mutate history.
 *
 * ── Why this moved out of the blog actions ──────────────────────────────────
 *
 * Sprint 9 wrote an `audit()` helper inside `app/(admin)/admin/blog/actions.ts`
 * with `entity` hard-coded to `'blog_post'`. That was correct while the blog was
 * the only thing the admin could change. Sprint 12 adds orders, submissions,
 * products, downloads, media and certificate imports, and six copies of a
 * logging helper is six chances for one of them to be forgotten in the seventh.
 *
 * ── What a diff may and may not contain ─────────────────────────────────────
 *
 * CLAUDE.md §10: no PII in logs. The log records WHAT CHANGED, not the content
 * that changed — a submission's audit entry carries its id and its new status,
 * never the enquirer's phone number, and a certificate import records row counts,
 * never rows. `redactedDiff` exists so that rule is applied by a function rather
 * than remembered by whoever writes the next action.
 *
 * The write is deliberately NOT awaited-and-checked by callers. A failure to log
 * must not roll back a change a staff member has already been told succeeded;
 * it is recorded to the server log and the change stands. That is the lesser of
 * two bad outcomes, and it is a decision rather than an oversight.
 */

/** Values a diff may hold. Deliberately narrow — no nested objects, no arrays of records. */
export type AuditValue = string | number | boolean | null | undefined;

export type AuditEntity =
  | 'blog_post'
  | 'submission'
  | 'order'
  | 'product'
  | 'download'
  | 'media'
  | 'certification'
  | 'installation_certificate'
  | 'profile';

/**
 * Field names that must never reach the log, whatever a caller passes.
 *
 * This is a denylist and denylists are weaker than allowlists — but the diff
 * shape varies per entity, so an allowlist would have to be maintained per
 * entity and would fail open on a field somebody forgot to add. Here the
 * failure mode is the safer one: an unlisted sensitive field is a bug to fix,
 * while a listed one cannot be logged even by accident.
 */
const FORBIDDEN = new Set([
  'name',
  'customer_name',
  'full_name',
  'phone',
  'customer_phone',
  'email',
  'message',
  'plate',
  'plate_plaintext',
  'payload',
  'ip_hash',
  'notes',
  'body',
]);

/** Strip anything the log must not carry, and flatten to storable JSON. */
export function redactedDiff(diff: Record<string, AuditValue>): Record<string, AuditValue> {
  const out: Record<string, AuditValue> = {};
  for (const [key, value] of Object.entries(diff)) {
    if (FORBIDDEN.has(key)) continue;
    if (value === undefined) continue;
    out[key] = value;
  }
  return out;
}

export interface AuditInput {
  actorId: string | null;
  action: string;
  entity: AuditEntity;
  entityId?: string | null;
  diff?: Record<string, AuditValue>;
}

export async function recordAudit({
  actorId,
  action,
  entity,
  entityId = null,
  diff = {},
}: AuditInput): Promise<void> {
  const safe = redactedDiff(diff);
  const { error } = await serviceClient()
    .from('audit_log')
    .insert({
      actor_id: actorId,
      action,
      entity,
      entity_id: entityId,
      // Round-tripped through JSON because `diff` is a jsonb column whose
      // generated type is Json, which Record<string, AuditValue> does not
      // satisfy. It also guarantees the value is actually storable.
      diff: JSON.parse(JSON.stringify(safe)),
    });

  if (error) {
    // Logged, not thrown. See the header: a logging failure must not undo a
    // change the staff member has already been told succeeded.
    console.error(`[audit] failed to record ${action} on ${entity}:`, error.message);
  }
}
