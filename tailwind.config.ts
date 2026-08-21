import type { Config } from 'tailwindcss';

/**
 * Tailwind maps onto the CSS variables in app/globals.css — it never defines a
 * colour of its own. One source of truth; see docs/DESIGN_SYSTEM.md.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-navy': 'var(--brand-navy)',
        'brand-navy-raised': 'var(--brand-navy-raised)',
        'brand-blue': 'var(--brand-blue)',
        'brand-blue-light': 'var(--brand-blue-light)',
        'brand-signal': 'var(--brand-signal)',
        'brand-signal-ink': 'var(--brand-signal-ink)',
        ink: 'var(--ink)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        'surface-inverse': 'var(--surface-inverse)',
        'border-hairline': 'var(--border-hairline)',
        'border-strong': 'var(--border-strong)',
        'border-hairline-inverse': 'var(--border-hairline-inverse)',
        'border-strong-inverse': 'var(--border-strong-inverse)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-inverse': 'var(--text-inverse)',
        'text-secondary-inverse': 'var(--text-secondary-inverse)',
        'state-ok': 'var(--state-ok)',
        'state-ok-ink': 'var(--state-ok-ink)',
        'state-warn': 'var(--state-warn)',
        'state-warn-ink': 'var(--state-warn-ink)',
        'state-alert': 'var(--state-alert)',
        'state-alert-ink': 'var(--state-alert-ink)',
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      // 1.200 mobile / 1.250 desktop. Body never below 16px.
      fontSize: {
        label: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        mono: ['0.875rem', { lineHeight: '1.5' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.55' }],
        h3: ['1.3125rem', { lineHeight: '1.3' }],
        h2: ['1.5625rem', { lineHeight: '1.22' }],
        h1: ['1.875rem', { lineHeight: '1.15' }],
        display: ['2.25rem', { lineHeight: '1.05' }],
        'md-body': ['1.0625rem', { lineHeight: '1.6' }],
        'md-h3': ['1.625rem', { lineHeight: '1.28' }],
        'md-h2': ['2.125rem', { lineHeight: '1.2' }],
        'md-h1': ['2.75rem', { lineHeight: '1.1' }],
        'md-display': ['3.75rem', { lineHeight: '1.02' }],
      },
      borderRadius: {
        data: 'var(--radius-data)',
        control: 'var(--radius-control)',
        panel: 'var(--radius-panel)',
      },
      spacing: {
        section: '4rem',
        'section-lg': '6rem',
      },
      maxWidth: {
        prose: '62ch',
        shell: '78rem',
      },
      transitionTimingFunction: {
        'out-quart': 'var(--ease-out-quart)',
        'out-expo': 'var(--ease-out-expo)',
        'in-out-quad': 'var(--ease-in-out-quad)',
      },
      transitionDuration: {
        micro: 'var(--dur-micro)',
        reveal: 'var(--dur-reveal)',
      },
    },
  },
  plugins: [],
};

export default config;
