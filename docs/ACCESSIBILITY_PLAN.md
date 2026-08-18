# ACCESSIBILITY PLAN

Standard, test method, known risks.

**Target: WCAG 2.2 AA.**

**Accessibility is never traded for a visual effect. If an effect cannot be made accessible, the
effect is cut.** That is a brief rule (PART 15), not a preference, and it settles every argument
this document might otherwise have to have.

---

## 1. Standards applied

Semantic HTML first; ARIA only where semantics genuinely fall short. Most accessibility bugs are
introduced by reaching for ARIA before reaching for the right element.

| Area | Requirement |
|---|---|
| Contrast | 4.5:1 body text, 3:1 large text (≥ 24 px, or ≥ 19 px bold) and meaningful non-text UI |
| Focus | Visible ring on every interactive element, ≥ 2 px with 2 px offset, never clipped or swallowed |
| Keyboard | Full operability — mega menu, cart, carousels, modals, verification form, admin |
| Structure | One H1 per page, no skipped heading levels, landmark regions, skip-to-content link |
| Images | Alt text on every image, written for a human; genuinely decorative images `alt=""` and nothing else |
| Forms | Programmatically associated labels, inline specific errors, errors announced |
| Motion | `prefers-reduced-motion` honoured at every level |
| Targets | ≥ 44 × 44 px |
| Language | `lang` on `<html>`; ready for `sw` without refactoring |

### 1.1 WCAG 2.2 additions specifically

The 2.2 criteria are the ones most often missed because they are newer:

- **2.4.11 Focus Not Obscured.** A focused element must not be hidden behind a sticky header or a
  cookie banner. The site has both — this is checked explicitly.
- **2.5.7 Dragging Movements.** Any drag interaction needs a non-drag alternative. Relevant to the
  admin media library.
- **2.5.8 Target Size.** 24 × 24 px minimum; we hold 44 × 44 px.
- **3.2.6 Consistent Help.** Contact and WhatsApp appear in the same place on every page.
- **3.3.7 Redundant Entry.** The quote and booking forms do not re-ask for information already given.

---

## 2. Contrast — already verified

The full computed table is in `docs/DESIGN_SYSTEM.md` §3. Every token pair intended for text passes
AA; several reach AAA. Failing combinations are recorded there explicitly so they are not attempted:

- `brand-blue-light` `#85A4D2` on white — **2.55:1**, surfaces and illustration only
- `state-warn-inverse` `#D08833` on white — 2.90:1, use `#8A5406` on light
- `brand-signal` `#2E7BF6` on white — 3.98:1, large text and non-text only
- `border-hairline` `#DCE3ED` — decorative rules only, never an input border

The system separates **decorative** borders from **functional** ones for exactly this reason: a
1.29:1 hairline is correct for a divider and illegal for an input border.

**Where contrast usually breaks on a site like this is dark and glass sections**, and that is where
it gets checked first, not last.

---

## 3. Test method

Automated tooling catches roughly a third of real issues. The rest needs a keyboard and a screen
reader.

### Every sprint
- `axe` / Lighthouse Accessibility ≥ 95 on every new or changed route
- **Keyboard-only pass** on every new interactive element — no mouse, at all
- Contrast checked on any new dark or glass surface
- `prefers-reduced-motion` verified on any new animation
- Headings and landmarks inspected in the accessibility tree, not just visually

### Critical paths — screen-reader tested, not merely axe-tested
1. Navigation, including the mega menu
2. Quote form
3. Cart → WhatsApp order
4. Certificate verification
5. Contact and installation booking

Tested with **NVDA on Windows** and **VoiceOver on iOS** — iOS because the audience is mobile-first
and iOS VoiceOver behaves differently enough from desktop readers to matter.

### Viewports
360 px (the real floor for the audience), 768, 1024, 1440, 1920+.

### Sprint 14
Full audit across every template, both screen readers, keyboard-only end-to-end, zoom to 200% and
400% reflow, and a forced-colours (Windows High Contrast) pass.

---

## 4. Known risks, named in advance

| # | Risk | Why it is a risk here | Mitigation |
|---|---|---|---|
| A1 | **Dark and glass sections swallowing the focus ring** | The design is built on a light/dark section rhythm; glass is explicitly rationed but present | Focus ring is `brand-signal`, verified at 3.98:1 on white and 4.62:1 on navy. Checked per surface |
| A2 | **The mega menu** | Multi-level navigation is the single most common keyboard trap on a site this size | Full keyboard spec before build: arrow keys, `Esc` closes and restores focus, `Tab` exits, no hover-only reveal |
| A3 | **Bot protection blocking keyboard users** | Brief 9.2 and PART 16 both require Turnstile that never blocks keyboard-only users | Turnstile in managed mode with an accessible fallback; **tested with keyboard only before it ships** |
| A4 | **The signature telemetry element** | Continuous Level 3 motion in the reader's field of view | Capped at three concurrent pulses; fully static under reduced motion; conveys nothing by motion alone |
| A5 | **Specification tables on 360 px** | Radio and tracker spec tables are wide and dense | Horizontally scrollable container with a visible affordance and keyboard scroll; never a client-only tab |
| A6 | **Certificate verification error states** | Security requires *identical* generic copy whether the plate is unknown or the second factor is wrong | The generic message must still be announced to a screen reader and associated with the form — security constraint and accessibility requirement resolved together, not traded |
| A7 | **Admin rich-text editor** | Editors are typically the worst-served component for keyboard and screen-reader users | Constrained toolbar with real buttons and labels; a non-technical staff member must be able to publish unaided (Sprint 9 gate) |
| A8 | **Cookie banner obscuring focus** | WCAG 2.2 2.4.11 | Banner is dismissible, focus-managed, and never overlays a focused element |
| A9 | **Alt text quality** | The CMS makes alt text a required field, but "required" produces `image` if nobody cares | Media library requires it **and** the review checklist reads it. Alt text is written for a human |
| A10 | **Certificate scan images** | Certifications are evidence; an image of a document is unreadable to a screen reader | Each carries a text summary of its substantive terms alongside the image — which the certifications page needs anyway for SEO |

---

## 5. Forms

Every form on the site — contact, quote, demo, installation booking, suggestions, verification, cart
pre-checkout, admin.

- Labels are visible and programmatically associated. Placeholder text is never the label.
- Required fields marked in text, not by colour or an asterisk alone.
- Errors are **inline, specific and adjacent** — "Enter a phone number starting +254", never "Invalid
  input". Announced via a live region and focus moved to the first error.
- Server-side Zod validation is the source of truth; client validation is a convenience. Error copy
  is identical from both.
- Success is a real acknowledgement with a next step, not a toast that vanishes.
- Autocomplete attributes on name, phone, email.
- The suggestions form's anonymous option is a genuine choice, clearly labelled.

---

## 6. Content accessibility

Accessibility is not only a component concern.

- Headings describe the section; no heading used for visual size alone.
- Link text is meaningful out of context — never "click here" or a bare URL.
- Plain-language answer paragraph under each question heading (which is also what assistants lift).
- Abbreviations expanded on first use per page: NTSA, PSV, ADAS, DMS, PoC, ICD, ODPC, KEBS, CAK,
  PSRA, ECTS.
- Tables have real `<th>` with `scope`. Layout tables do not exist.
- No text baked into images where it carries information.

The abbreviation rule earns double: it serves screen-reader users and it is exactly the explicit,
self-contained phrasing that LLM retrieval rewards.

---

## 7. Definition of done, per route

- [ ] Keyboard-only: reachable, operable, visible focus throughout, no traps
- [ ] Focus never obscured by the sticky header or cookie banner
- [ ] One H1, logical heading order, landmarks correct
- [ ] Contrast verified on this route's surfaces, including dark and glass
- [ ] Every image has considered alt text; decorative images `alt=""`
- [ ] Forms labelled, errors inline, specific and announced
- [ ] Reduced motion: content complete, meaning intact
- [ ] Touch targets ≥ 44 px at 360 px width
- [ ] Zoom to 200% without loss of content or function
- [ ] axe / Lighthouse A11y ≥ 95
- [ ] Screen-reader pass if the route is on a critical path
