# Bilingual Site (Swedish + English) — Design

**Date:** 2026-04-22
**Status:** Approved, pending implementation plan

## Goal

The Devbit website supports two locales — Swedish (`sv`) and English (`en`) — across every page, the CV PDF, and metadata. On first visit the browser's language decides the initial locale (Swedish if `navigator.language` starts with `sv`, English otherwise). The user can toggle locales from the header; the choice persists across visits.

## Key Decisions

| Area | Decision |
| --- | --- |
| URL strategy | Locale-prefixed routes: `/sv/...` and `/en/...` |
| Library | `next-intl` (App Router + static export support, ICU messages, `Intl.*` integration) |
| Default / fallback locale | English |
| String storage | **Hybrid**: UI chrome in `next-intl` JSON messages; long-form prose attached to structured data as inline localized fields |
| Root `/` behavior | Client-side redirect shim: `localStorage.locale` → `navigator.language` → `/en` fallback |
| Locale persistence | `localStorage.locale`, written on every toggle; URL is authoritative during navigation |
| CV PDF | Follows site locale; filename `cv-michael-hultman-${locale}.pdf` |
| Language toggle | Small `SV` / `EN` pill in header next to `ThemeToggle`, mirrored into mobile nav |
| Translation author | Claude drafts Swedish; user reviews |
| Not translated | Architectural/programming terms (Domain Event, Aggregate, Command, Policy, Event Sourcing, CQRS, etc.) stay English in both locales |

## Architecture

### Route structure

All pages move under a `[locale]` dynamic segment. The static export produces `out/en/*` and `out/sv/*` trees.

```
src/app/
  layout.tsx                    # pass-through (no <html>/<body> here)
  page.tsx                      # root "/" redirect shim
  not-found.tsx                 # deep-link recovery (same shim, preserves pathname)
  [locale]/
    layout.tsx                  # <html lang={locale}>, NextIntlClientProvider, Header, JSON-LD
    page.tsx                    # Event Storming homepage
    about/page.tsx
    career/page.tsx
    contact/page.tsx
    projects/page.tsx
    services/page.tsx
```

`[locale]/layout.tsx` exports `generateStaticParams()` returning `[{ locale: 'en' }, { locale: 'sv' }]`.

Per the standard `next-intl` pattern (and to avoid hydration warnings), `<html>` and `<body>` live in `[locale]/layout.tsx`, not in the root layout. The root `layout.tsx` becomes a Fragment pass-through for `{children}`.

### Root redirect shim (`src/app/page.tsx`)

A minimal client component — no fonts, no Header, no layout chrome. Its only job:

1. Read `localStorage.getItem('locale')`. If `'sv'` or `'en'`, `location.replace('/' + saved)`.
2. Else read `navigator.language`. If it starts with `sv` (case-insensitive), replace to `/sv`. Otherwise `/en`.
3. `<noscript>` fallback: `<meta http-equiv="refresh" content="0; url=/en">`.

The detection runs as early as possible (inline `<script>` in the head, or a `useLayoutEffect`) to minimize blank-flash.

### Deep-link recovery (`src/app/not-found.tsx`)

A user hitting `/career` from an old bookmark renders the same redirect shim but preserves the pathname: `location.replace('/' + detectedLocale + currentPathname)`.

### `next.config.ts`

- `output: "export"` stays.
- `trailingSlash: true` added so `/sv/career/` resolves to `sv/career/index.html` on static hosts.

## Strings: the hybrid model

### UI chrome — `next-intl` messages

```
src/messages/
  en.json
  sv.json
```

Namespaced by feature area: `nav`, `header`, `home`, `career`, `about`, `contact`, `services`, `projects`, `cv`, `common`, `meta.*`. Components consume via `useTranslations('namespace')`.

ICU plural rules handle number agreement in both locales (e.g. `"{count, plural, one {# år} other {# år}}"` — Swedish happens to be identical in both forms, but English differs).

### Structured content — inline localized fields

The data files (`career-events.ts`, `projects.ts`, `services.ts`, `cv-data.ts`, `skills.ts`, `languages.ts`, `site-config.ts`) change their prose fields from `string` to `LocalizedString`:

```ts
// src/lib/i18n.ts
export type Locale = 'en' | 'sv';
export type LocalizedString = { en: string; sv: string };
export const LOCALES: readonly Locale[] = ['en', 'sv'] as const;
export const DEFAULT_LOCALE: Locale = 'en';
export function loc(value: LocalizedString, locale: Locale): string {
  return value[locale];
}
```

Example:

```ts
// before
{ id: 'role-spotify', title: 'Senior Engineer', description: 'Built ...' }

// after
{
  id: 'role-spotify',
  title: { en: 'Senior Engineer', sv: 'Senior ingenjör' },
  description: { en: 'Built ...', sv: 'Byggde ...' },
}
```

Structural/non-localized fields stay as-is: `id`, `date`, `type`, `technologies: string[]`, `icon`, `href`.

**Note on nav hrefs.** `site-config.ts` stores unprefixed paths (`/services`, `/career`). Components that render nav (Header, mobile nav, landing board) must prefix with the active locale at render time: `` `/${locale}${link.href}` ``. A small helper `localizedHref(href, locale)` in `src/lib/i18n.ts` centralizes this.

Components read `locale` from the route (`params.locale` in server components, `useLocale()` in client components) and call `loc(event.title, locale)`.

### Supporting files

- `src/i18n/routing.ts` — `{ locales, defaultLocale }` shared definition.
- `src/i18n/request.ts` — `next-intl`'s server-side config; loads the right JSON bundle per request/build.

## Language toggle

`src/components/layout/language-toggle.tsx`:

- Reads `useLocale()` and `usePathname()`.
- Renders a pill showing the *other* locale (so clicking advances): on `/en/*` shows `SV`, on `/sv/*` shows `EN`.
- On click: writes `localStorage.locale`, builds the swapped path (`/en/career` ↔ `/sv/career`), calls `router.replace(newPath)`.
- Sits in `Header` next to `ThemeToggle`; mirrored into `mobile-nav.tsx`.

Keyboard-accessible, matches existing button styles.

## CV PDF

`cv-data.ts` becomes locale-aware:

```ts
export function buildCvData(locale: Locale): CvData { ... }
```

It assembles the other data files and resolves all `LocalizedString` fields via `loc(...)`. The returned `CvData` shape contains only plain `string` fields — `cv-document.tsx` is unchanged structurally; only section labels are passed in (either as props or a small `labels: CvLabels` object sourced from the same locale).

`DownloadCVButton`:

- reads `useLocale()` and calls `buildCvData(locale)`.
- passes `data` and `labels` into `<CVDocument />`.
- filename: `cv-michael-hultman-${locale}.pdf`.
- button label comes from `useTranslations('about')` → `t('downloadCv')`.

`@react-pdf/renderer` does not interact with `next-intl`; it consumes plain strings. This is the reason for the hybrid string strategy.

## Metadata / SEO

Every page exports a localized `generateMetadata({ params })`:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.career' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/career`,
      languages: { en: '/en/career', sv: '/sv/career' },
    },
  };
}
```

`alternates.languages` emits `<link rel="alternate" hreflang="...">` tags so both locales get indexed correctly. `meta.en` / `meta.sv` namespaces (plus `meta.jsonLd` for the structured data) hold all per-page title/description content.

The JSON-LD `Organization` block currently in the root layout moves into `[locale]/layout.tsx` and pulls its `name` / `description` from `getTranslations('meta.jsonLd')`.

## `<html lang>` and `Intl` formatting

- `<html lang={locale}>` set in `[locale]/layout.tsx`.
- Both locales are LTR — no `dir` switching.
- Dates on career events format via `Intl.DateTimeFormat(locale === 'sv' ? 'sv-SE' : 'en-US', ...)`. `next-intl`'s `useFormatter()` is a thin wrapper over the same thing and is preferred where already inside an `NextIntlClientProvider`.

## What does NOT change

- Event Storming board sticky-note labels for architectural terms (Domain Event, Aggregate, Command, Policy, Event Sourcing) — stay English in both locales.
- React Flow / system diagram code under `src/components/diagram/` — legacy, unused by main nav.
- Tailwind theme tokens, fonts, dark-mode mechanism.
- `output: "export"` — site is still fully static.
- Contact form `mailto:` behavior.

## Dependencies

- **Add:** `next-intl` (latest version compatible with Next 16; verify at implementation time).
- **Remove:** none.

## Risks and things to verify during implementation

1. **Next 16 + `next-intl` compatibility.** Next.js 16 is new; `AGENTS.md` warns APIs may differ from training data. First implementation step: read `node_modules/next/dist/docs/` for App Router + i18n + static-export guidance, and check `next-intl` release notes for Next 16 support. Fallback: pin `next-intl` to the highest version known to support Next 16 static export.
2. **`params` is async in Next 15+.** All `page.tsx`/`generateMetadata` functions that read `params` must `await` it: `const { locale } = await params`. Affects every page in the refactor.
3. **`<html>` / `<body>` placement.** Placing them in the wrong layout is the most common `next-intl` hydration pitfall. Plan follows the documented pattern: root layout is a pass-through; `<html>` and `<body>` live in `[locale]/layout.tsx`.
4. **Redirect shim flash.** `/` briefly shows a blank page before `location.replace`. Acceptable cost for correctness. Can be masked by a centered brand mark + spinner if polish is required.
5. **Framer Motion content swap on toggle.** Toggling locale mid-animation on the Event Storming board may flash. Mitigated by `router.replace` doing a full route transition.
6. **Translation quality.** Claude drafts Swedish; user reviews. Expect voice/terminology corrections on the long-form career and project copy.

## Implementation order (high-level)

Detailed plan will be produced by the `writing-plans` skill. High-level outline:

1. Install `next-intl`; create `src/i18n/routing.ts` and `src/i18n/request.ts`; re-home `<html>` / `<body>` to the new locale layout.
2. Create `[locale]` segment; move existing pages under it; wire `generateStaticParams`.
3. Build root redirect shim (`/`) and deep-link recovery (`not-found.tsx`).
4. Define `LocalizedString` and `loc()` helper. Refactor data files (`career-events`, `services`, `projects`, `skills`, `languages`, `site-config`, `cv-data`) to use localized fields.
5. Extract UI chrome strings to `messages/en.json`, duplicate to `messages/sv.json`.
6. Build `LanguageToggle`; wire into `Header` and `mobile-nav`.
7. Localize CV PDF: `buildCvData(locale)` and `DownloadCVButton` consume locale.
8. Per-page localized `generateMetadata` with `hreflang` alternates; move JSON-LD into locale layout.
9. Draft Swedish translations for all copy (UI chrome and structured content).
10. Build sanity check: `npm run build` produces `out/en/*` and `out/sv/*`; every route present in both; `/` shim redirects correctly in both Swedish and non-Swedish browsers; CV PDF downloads with locale suffix.

## Success criteria

- Fresh visitor with Swedish browser landing on `/` ends up on `/sv/...` without flashing English content.
- Fresh visitor with English (or any non-Swedish) browser landing on `/` ends up on `/en/...`.
- Toggling language persists across page loads and sessions (until cleared).
- Every page renders correctly in both locales, with matching layout and no untranslated user-facing prose (excluding the architectural terms listed above).
- CV PDF download matches the current site locale and uses a locale-suffixed filename.
- `<link rel="alternate" hreflang>` tags present on every page.
- `npm run build` succeeds; `npm run lint` clean; static export produces both locale trees.
