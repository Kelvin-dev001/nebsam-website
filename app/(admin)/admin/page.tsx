import { Shell } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { isDatabaseConfigured } from '@/lib/content';

/**
 * Admin shell — Sprint 3 delivers the SHELL only.
 *
 * The CMS itself is Sprint 9 (publishing workflow, editor) and Sprint 12
 * (orders pipeline, inbox, media library, roles, audit log). Building any of
 * it now would be merging sprints, which brief PART 25 lists as a failure mode.
 *
 * What this page does today is honest about that, and about whether the
 * database exists at all.
 */
export default async function AdminDashboard() {
  const configured = isDatabaseConfigured();

  const sections = [
    { name: 'Content', detail: 'Solutions, products, industries, FAQs', sprint: 'Sprint 9' },
    { name: 'Blog', detail: 'Posts, categories, authors, revisions', sprint: 'Sprint 9' },
    { name: 'Shop', detail: 'Prices, availability, featured', sprint: 'Sprint 12' },
    { name: 'Orders', detail: 'Pipeline, notes, export', sprint: 'Sprint 12' },
    { name: 'Inbox', detail: 'Contact, quote, demo, installation, suggestions', sprint: 'Sprint 12' },
    { name: 'Trust', detail: 'Testimonials, certifications, client logos', sprint: 'Sprint 12' },
    { name: 'Operations', detail: 'Certificates, branches, coverage', sprint: 'Sprint 11' },
    { name: 'Media library', detail: 'Upload, alt text, privacy check', sprint: 'Sprint 12' },
  ];

  return (
    <Shell className="py-section">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-h1 md:text-md-h1">Admin</h1>
        <Badge tone={configured ? 'ok' : 'warn'}>
          {configured ? 'Database connected' : 'Database not configured'}
        </Badge>
      </div>

      {!configured ? (
        <div className="mt-6 max-w-prose rounded-panel border border-state-warn-ink/30 bg-surface p-5">
          <h2 className="font-display-tight text-h3">Supabase is not connected yet</h2>
          <p className="mt-2 text-body text-text-secondary">
            The schema exists as reviewed migrations in <code className="font-mono text-mono">supabase/migrations/</code>,
            but nothing has been applied. To bring this up, set{' '}
            <code className="font-mono text-mono">NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
            <code className="font-mono text-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{' '}
            <code className="font-mono text-mono">SUPABASE_SERVICE_ROLE_KEY</code> in{' '}
            <code className="font-mono text-mono">.env.local</code>, then run the migrations and
            regenerate <code className="font-mono text-mono">types/database.ts</code>.
          </p>
        </div>
      ) : null}

      <h2 className="mt-10 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
        Planned sections
      </h2>
      <dl className="mt-4 border-t border-border-hairline">
        {sections.map((section) => (
          <div
            key={section.name}
            className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border-hairline py-3.5"
          >
            <div>
              <dt className="text-body font-medium">{section.name}</dt>
              <dd className="text-body-sm text-text-secondary">{section.detail}</dd>
            </div>
            <span className="shrink-0 font-mono text-mono uppercase tracking-[0.06em] text-text-secondary">
              {section.sprint}
            </span>
          </div>
        ))}
      </dl>

      <p className="mt-8 max-w-prose text-body-sm text-text-secondary">
        Roles are enforced in Supabase row level security, not in this interface. A hidden button is
        not a permission — see <code className="font-mono text-mono">supabase/migrations/0008_rls_policies.sql</code>.
      </p>
    </Shell>
  );
}
