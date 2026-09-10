#!/usr/bin/env node
/**
 * ROLE SEPARATION, VERIFIED AGAINST RLS RATHER THAN AGAINST THE UI.
 *
 * The Sprint 12 gate: "Role separation verified per role AGAINST RLS, not the
 * UI." `docs/CMS_ARCHITECTURE.md` §2 — "a hidden button is not a permission".
 *
 * ── Why this cannot be done by clicking around the admin ────────────────────
 *
 * Because the admin does not use RLS. Every admin page and every admin action
 * runs under the SERVICE-ROLE key, which bypasses row level security entirely
 * (`lib/admin/actor.ts` says so at length). What actually gates the admin UI is
 * `requireStaff()`, called in each page and action.
 *
 * So there are two boundaries, not one, and they protect different things:
 *
 *   - `requireStaff()` protects the ADMIN. Signing in as a `viewer` and opening
 *     /admin/certificates gets a redirect from that call, not from a policy.
 *   - RLS protects the DATABASE from anything holding an anon key and a session
 *     — a compromised browser session, a future client-side query, a mistake in
 *     a later sprint that reaches for `publicClient()` instead of the service
 *     role.
 *
 * Testing the UI would prove the first and say nothing about the second. This
 * script proves the second: it creates a real auth user per role, signs in, and
 * asks the database directly what that session can do.
 *
 * ── What it does to the project ─────────────────────────────────────────────
 *
 * It creates four throwaway auth users and four `profiles` rows, runs the
 * matrix, then deletes all of them. It refuses to run against anything but the
 * configured project, and every probe write is either a rejection (expected) or
 * is rolled back by deleting the row it made.
 *
 * Usage: npm run verify:roles
 */

import { readFileSync, existsSync } from 'node:fs';

function env(name) {
  if (process.env[name]) return process.env[name];
  if (!existsSync('.env.local')) return undefined;
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const match = line.match(new RegExp(`^${name}=(.*)$`));
    if (match) return match[1].replace(/\s+#.*$/, '').trim();
  }
  return undefined;
}

const URL = env('NEXT_PUBLIC_SUPABASE_URL');
const ANON = env('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const SERVICE = env('SUPABASE_SERVICE_ROLE_KEY');

if (!URL || !ANON || !SERVICE) {
  console.error('\n  verify:roles: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are all required.\n');
  process.exit(1);
}

const ROLES = ['viewer', 'sales', 'editor', 'admin'];
const RUN = Math.random().toString(36).slice(2, 10);
const PASSWORD = `Rls-${RUN}-${Math.random().toString(36).slice(2, 10)}!`;

const service = (path, init = {}) =>
  fetch(`${URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

/** A request made AS a signed-in staff member: anon key plus their session JWT. */
const asUser = (token, path, init = {}) =>
  fetch(`${URL}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
  });

const created = [];
let failures = 0;
let checks = 0;

function record(ok, label, detail) {
  checks += 1;
  if (ok) {
    console.log(`    ok    ${label}`);
  } else {
    failures += 1;
    console.log(`    FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

async function createStaff(role) {
  const email = `rls-${role}-${RUN}@nebsam-rls-test.invalid`;

  const made = await service('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email, password: PASSWORD, email_confirm: true }),
  });
  if (!made.ok) throw new Error(`could not create ${role} user: ${made.status} ${await made.text()}`);
  const user = await made.json();
  created.push(user.id);

  // The profile is what grants the role. An auth user with no profile row is
  // not staff at all — which is itself one of the assertions below.
  const profile = await service('/rest/v1/profiles', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ id: user.id, email, full_name: `RLS ${role}`, role }),
  });
  if (!profile.ok) throw new Error(`could not create ${role} profile: ${await profile.text()}`);

  const signedIn = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  if (!signedIn.ok) throw new Error(`could not sign in as ${role}: ${await signedIn.text()}`);
  const session = await signedIn.json();

  return { id: user.id, email, token: session.access_token };
}

async function cleanup() {
  for (const id of created) {
    await service(`/rest/v1/profiles?id=eq.${id}`, { method: 'DELETE' }).catch(() => {});
    await service(`/auth/v1/admin/users/${id}`, { method: 'DELETE' }).catch(() => {});
  }
}

/**
 * Distinguish "policy allowed it and there were no rows" from "policy denied
 * it", by making sure a row EXISTS first using the service role.
 *
 * This is the difference between a test that proves something and a test that
 * passes because the table is empty. Sprint 11 recorded the same class of
 * mistake in its penetration test — a section passing for the wrong reason.
 */
async function readWithRows(token, table, seedRow) {
  const seeded = await service(`/rest/v1/${table}`, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(seedRow),
  });
  const seededOk = seeded.ok;
  const seededBody = seededOk ? await seeded.json() : null;
  const seededId = Array.isArray(seededBody) && seededBody[0] ? seededBody[0].id : null;

  const res = await asUser(token, `/${table}?select=id&limit=5`);
  const text = await res.text();
  let visible = 0;
  try {
    const parsed = JSON.parse(text);
    visible = Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    visible = 0;
  }

  if (seededId) {
    await service(`/rest/v1/${table}?id=eq.${seededId}`, { method: 'DELETE' }).catch(() => {});
  }

  return { seededOk, visible, status: res.status };
}

async function canWrite(token, table, row) {
  const res = await asUser(token, `/${table}`, { method: 'POST', body: JSON.stringify(row) });
  const text = await res.text();

  if (res.ok) {
    // It went through. Undo it, so a passing test does not leave a row behind.
    try {
      const parsed = JSON.parse(text);
      const id = Array.isArray(parsed) && parsed[0] ? parsed[0].id : null;
      if (id) await service(`/rest/v1/${table}?id=eq.${id}`, { method: 'DELETE' });
    } catch {
      /* nothing to undo */
    }
  }

  return { allowed: res.ok, status: res.status, body: text.slice(0, 160) };
}

console.log(`\n  Role separation against RLS — run ${RUN}`);
console.log(`  ${URL}\n`);

try {
  const staff = {};
  for (const role of ROLES) staff[role] = await createStaff(role);
  console.log(`  Created four staff accounts: ${ROLES.join(', ')}\n`);

  // ── 1. Content: any staff member reads, editor and above write ────────────
  console.log('  Content — staff read, editor+ write');
  for (const role of ROLES) {
    const { visible } = await readWithRows(staff[role].token, 'solutions', {
      slug: `rls-probe-${RUN}-${role}`,
      name: 'RLS probe',
      status: 'draft',
    });
    record(visible > 0, `${role} can read solutions`);
  }
  for (const role of ROLES) {
    const write = await canWrite(staff[role].token, 'solutions', {
      slug: `rls-write-${RUN}-${role}`,
      name: 'RLS write probe',
      status: 'draft',
    });
    const expected = role === 'editor' || role === 'admin';
    record(
      write.allowed === expected,
      `${role} ${expected ? 'can' : 'cannot'} write solutions`,
      write.allowed === expected ? '' : `got ${write.status} ${write.body}`,
    );
  }

  // ── 2. Commerce: sales and above ─────────────────────────────────────────
  console.log('\n  Commerce — sales+ read and write, viewer neither');
  for (const role of ROLES) {
    const { visible } = await readWithRows(staff[role].token, 'orders', {
      order_number: `RLS-${RUN}-${role}`,
      status: 'new',
      subtotal_kes: 0,
    });
    const expected = role !== 'viewer';
    record(
      (visible > 0) === expected,
      `${role} ${expected ? 'can' : 'cannot'} read orders`,
      (visible > 0) === expected ? '' : `saw ${visible} row(s)`,
    );
  }
  for (const role of ROLES) {
    const write = await canWrite(staff[role].token, 'submissions', {
      type: 'contact',
      payload: { probe: RUN },
      status: 'new',
    });
    const expected = role !== 'viewer';
    record(
      write.allowed === expected,
      `${role} ${expected ? 'can' : 'cannot'} write submissions`,
      write.allowed === expected ? '' : `got ${write.status} ${write.body}`,
    );
  }

  // ── 3. Trust and operations: staff read, ADMIN write ─────────────────────
  console.log('\n  Trust — staff read, admin-only write');
  for (const role of ROLES) {
    const write = await canWrite(staff[role].token, 'certifications', {
      name: `RLS probe ${RUN}`,
      issuer: 'RLS probe',
    });
    const expected = role === 'admin';
    record(
      write.allowed === expected,
      `${role} ${expected ? 'can' : 'cannot'} write certifications`,
      write.allowed === expected ? '' : `got ${write.status} ${write.body}`,
    );
  }

  // ── 4. The clearance gate: an editor may not clear a download ────────────
  //
  // This is the single most specific policy on the project — 0008's
  // `with check (is_staff('editor') and cleared_for_publication = false)` —
  // and it is the one most worth proving, because the UI ALSO hides the
  // control and a UI test would pass either way.
  console.log('\n  The download clearance gate');
  {
    const seeded = await service('/rest/v1/downloads', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        slug: `rls-clear-${RUN}`,
        title: 'RLS clearance probe',
        status: 'draft',
      }),
    });
    const [row] = seeded.ok ? await seeded.json() : [null];

    if (!row) {
      record(false, 'could seed a download to test the clearance gate');
    } else {
      const editorTitle = await asUser(staff.editor.token, `/downloads?id=eq.${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: 'RLS editor edit' }),
      });
      record(editorTitle.ok, 'editor can edit a download that stays uncleared');

      const editorClear = await asUser(staff.editor.token, `/downloads?id=eq.${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          cleared_for_publication: true,
          cleared_by: staff.editor.id,
          cleared_at: new Date().toISOString(),
        }),
      });
      // PostgREST returns 200 with an EMPTY array when the USING clause matched
      // nothing, and 403 when the WITH CHECK clause rejected the new row. Here
      // the row IS visible to an editor, so the refusal comes from WITH CHECK.
      const editorBody = await editorClear.text();
      const editorBlocked = !editorClear.ok || editorBody.trim() === '[]';
      record(
        editorBlocked,
        'editor CANNOT set cleared_for_publication',
        editorBlocked ? '' : `got ${editorClear.status} ${editorBody.slice(0, 160)}`,
      );

      const adminClear = await asUser(staff.admin.token, `/downloads?id=eq.${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          cleared_for_publication: true,
          cleared_by: staff.admin.id,
          cleared_at: new Date().toISOString(),
        }),
      });
      const adminBody = await adminClear.text();
      record(
        adminClear.ok && adminBody.trim() !== '[]',
        'admin CAN set cleared_for_publication',
        adminClear.ok ? '' : `got ${adminClear.status} ${adminBody.slice(0, 160)}`,
      );

      await service(`/rest/v1/downloads?id=eq.${row.id}`, { method: 'DELETE' });
    }
  }

  // ── 5. Verification: the tightest surface on the project ─────────────────
  //
  // 0008 has NO select policy on installation_certificates for anyone —
  // "not for admin, not for anyone". So every role, including admin, must see
  // nothing, and this is the assertion that catches a future migration
  // helpfully adding one.
  console.log('\n  Verification — no session may read certificates, not even admin');
  for (const role of ROLES) {
    const res = await asUser(staff[role].token, '/installation_certificates?select=id&limit=1');
    const body = await res.text();
    let rows = -1;
    try {
      const parsed = JSON.parse(body);
      rows = Array.isArray(parsed) ? parsed.length : -1;
    } catch {
      rows = -1;
    }
    record(
      !res.ok || rows === 0,
      `${role} cannot read installation_certificates`,
      !res.ok || rows === 0 ? '' : `saw ${rows} row(s)`,
    );
  }
  for (const role of ROLES) {
    const res = await asUser(staff[role].token, '/installation_plates_restricted?select=certificate_id&limit=1');
    const body = await res.text();
    let rows = -1;
    try {
      const parsed = JSON.parse(body);
      rows = Array.isArray(parsed) ? parsed.length : -1;
    } catch {
      rows = -1;
    }
    const expectRows = role === 'admin';
    // Admin HAS a policy here (`for all`), so a non-empty read would be legal.
    // The table is empty in a clean project, so the assertion is that a
    // non-admin is refused or sees nothing, and that admin's request is not
    // refused at the permission level.
    record(
      expectRows ? res.ok : !res.ok || rows === 0,
      `${role} ${expectRows ? 'is permitted' : 'is refused'} on installation_plates_restricted`,
      expectRows ? (res.ok ? '' : `got ${res.status}`) : '',
    );
  }

  // ── 6. Audit log: admin reads, NOBODY writes ─────────────────────────────
  console.log('\n  Audit log — admin reads, nobody writes');
  for (const role of ROLES) {
    const write = await canWrite(staff[role].token, 'audit_log', {
      action: 'rls.probe',
      entity: 'probe',
      diff: { run: RUN },
    });
    record(
      !write.allowed,
      `${role} cannot INSERT into audit_log`,
      write.allowed ? 'the insert succeeded' : '',
    );
  }
  {
    /**
     * The read test does NOT seed a row, and this is the one place in the
     * script where that matters.
     *
     * `readWithRows` exists because PostgREST answers a policy denial on SELECT
     * with 200 and an empty array, so an empty result proves nothing unless a
     * row is known to exist — it seeds one with the service role, reads, then
     * deletes it.
     *
     * On `audit_log` the delete does not work, and correctly so: migration 0007
     * installs before-delete and before-update triggers that raise
     * `audit_log is append-only`, and a trigger applies to the service role too.
     * The first version of this script seeded here anyway and left two
     * permanent `rls.probe.read` entries behind — a verification script quietly
     * writing to the tamper-proof log it is verifying.
     *
     * So: ask the service role whether the log has any rows, and only then
     * assert. An empty log is reported as UNTESTABLE rather than passed, since
     * "admin saw nothing" and "admin was denied" are the same response.
     */
    const counted = await service('/rest/v1/audit_log?select=id&limit=1', {
      headers: { Prefer: 'count=exact' },
    });
    const existing = Number(
      (counted.headers.get('content-range') ?? '*/0').split('/')[1] ?? 0,
    );

    if (existing === 0) {
      console.log('    skip  audit_log read — the log is empty, so a read and a denial look alike');
    } else {
      const adminRead = await asUser(staff.admin.token, '/audit_log?select=id&limit=5');
      const adminBody = await adminRead.text();
      let adminRows = 0;
      try {
        adminRows = JSON.parse(adminBody).length;
      } catch {
        adminRows = 0;
      }
      record(adminRead.ok && adminRows > 0, 'admin can read audit_log');

      const nonAdmin = await asUser(staff.sales.token, '/audit_log?select=id&limit=5');
      const body = await nonAdmin.text();
      let rows = -1;
      try {
        rows = JSON.parse(body).length;
      } catch {
        rows = -1;
      }
      record(!nonAdmin.ok || rows === 0, 'sales cannot read audit_log', rows > 0 ? `saw ${rows}` : '');
    }
  }

  // ── 7. Profiles: self only, unless admin ─────────────────────────────────
  console.log('\n  Profiles — self only, unless admin');
  for (const role of ROLES) {
    const res = await asUser(staff[role].token, '/profiles?select=id,role');
    const body = await res.text();
    let rows = [];
    try {
      rows = JSON.parse(body);
    } catch {
      rows = [];
    }
    if (role === 'admin') {
      record(Array.isArray(rows) && rows.length > 1, 'admin can read every profile');
    } else {
      const onlySelf =
        Array.isArray(rows) && rows.length === 1 && rows[0].id === staff[role].id;
      record(onlySelf, `${role} sees only their own profile`, onlySelf ? '' : `saw ${rows.length}`);
    }
  }
  // The escalation that matters: a viewer promoting themselves.
  {
    const escalate = await asUser(staff.viewer.token, `/profiles?id=eq.${staff.viewer.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: 'admin' }),
    });
    const body = await escalate.text();
    const blocked = !escalate.ok || body.trim() === '[]';
    record(blocked, 'a viewer CANNOT promote themselves to admin', blocked ? '' : body.slice(0, 160));
  }

  // ── 8. The anon key, one more time ───────────────────────────────────────
  console.log('\n  The anon key');
  for (const table of ['orders', 'submissions', 'profiles', 'audit_log', 'installation_certificates']) {
    const res = await fetch(`${URL}/rest/v1/${table}?select=*&limit=1`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    });
    const body = await res.text();
    let rows = -1;
    try {
      const parsed = JSON.parse(body);
      rows = Array.isArray(parsed) ? parsed.length : -1;
    } catch {
      rows = -1;
    }
    record(!res.ok || rows === 0, `anon cannot read ${table}`, rows > 0 ? `saw ${rows}` : '');
  }
} catch (error) {
  console.error(`\n  verify:roles: ${error.message}\n`);
  failures += 1;
} finally {
  await cleanup();
  console.log('\n  Test accounts removed.');
}

console.log(`\n  ${checks - failures}/${checks} checks passed\n`);
process.exit(failures > 0 ? 1 : 0);
