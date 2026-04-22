# Bilingual Site (Swedish + English) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the entire site (including the CV PDF) available in Swedish and English at `/sv/*` and `/en/*`, with a browser-language-detected redirect at `/`, persistent user choice via `localStorage`, and per-page `hreflang` metadata.

**Architecture:** Locale-prefixed routes under a `[locale]` dynamic segment built statically for both locales via `generateStaticParams`. `next-intl` handles UI-chrome strings (nav, buttons, headings, metadata). Structured content in `src/data/*` carries its own Swedish/English copy as inline `LocalizedString` fields resolved at render time via a small `loc()` helper. Root `/` is a client-side redirect shim. Language toggle sits next to the theme toggle in the header and swaps the locale prefix of the current path.

**Tech Stack:** Next.js 16 App Router (static export, `output: "export"`), React 19, TypeScript, `next-intl@^4`, Tailwind CSS v4, Framer Motion, `@react-pdf/renderer`.

**Spec:** `docs/superpowers/specs/2026-04-22-i18n-swedish-english-design.md`

**Testing note:** This project has no test framework (`CLAUDE.md` states this). TDD-style "write a failing test" steps are replaced by:
- `npx tsc --noEmit` for type correctness
- `npm run lint` for lint
- `npm run build` (static export to `out/`) for build correctness and presence of both locale trees
- `npm run dev` + manually hitting specific URLs for behaviour checks

**Every task ends with a commit.** Commits are frequent so the branch can be bisected if something regresses.

---

## Phase 1 — Foundations

### Task 1: Install `next-intl` and configure `next.config.ts`

**Files:**
- Modify: `package.json` (via `npm install`)
- Modify: `next.config.ts`

- [ ] **Step 1: Install next-intl**

Run: `npm install next-intl`
Expected: installs `next-intl@^4.x` into `dependencies`, updates `package-lock.json`.

Verify the version supports Next 16 App Router + static export. If installation pulls a pre-release or fails, pin explicitly: `npm install next-intl@latest`. If that still fails, check `node_modules/next-intl/package.json` and consult `node_modules/next/dist/docs/` for Next 16 compatibility guidance.

- [ ] **Step 2: Enable `trailingSlash` in `next.config.ts`**

Replace the file content with:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
```

`trailingSlash: true` ensures `/sv/career/` resolves to `sv/career/index.html` on static hosts. The `next-intl` plugin wires the `./src/i18n/request.ts` file (created in Task 3) into the build.

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: passes (the `request.ts` file referenced in the plugin doesn't exist yet, but `createNextIntlPlugin` only resolves the path at build time, not at tsc time).

If tsc errors on the plugin import, proceed — the next task creates the file. Do NOT move on if there's any other error.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json next.config.ts
git commit -m "feat(i18n): install next-intl and enable trailingSlash"
```

---

### Task 2: Create the shared i18n helper module

**Files:**
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: Write `src/lib/i18n.ts`**

```ts
export type Locale = "en" | "sv";

export const LOCALES: readonly Locale[] = ["en", "sv"] as const;

export const DEFAULT_LOCALE: Locale = "en";

export type LocalizedString = { en: string; sv: string };

export function loc(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localizedHref(href: string, locale: Locale): string {
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  const clean = href.startsWith("/") ? href : `/${href}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

export function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${nextLocale}`;
  if (isLocale(parts[0])) parts[0] = nextLocale;
  else parts.unshift(nextLocale);
  return "/" + parts.join("/");
}

export function detectBrowserLocale(navigatorLanguage: string | undefined | null): Locale {
  if (!navigatorLanguage) return DEFAULT_LOCALE;
  return navigatorLanguage.toLowerCase().startsWith("sv") ? "sv" : "en";
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: passes, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat(i18n): add Locale, LocalizedString, and path helpers"
```

---

### Task 3: Create `next-intl` routing and request config

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`

- [ ] **Step 1: Write `src/i18n/routing.ts`**

```ts
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

export const routing = {
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
} as const;
```

- [ ] **Step 2: Write `src/i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { DEFAULT_LOCALE } from "@/lib/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
```

This file is referenced by the plugin in `next.config.ts`. It tells `next-intl` which locale to use for the current request and which JSON bundle to load. At build time (since we're statically exporting), it runs once per `[locale]` param.

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: the `@/messages/*.json` imports may error because the files don't exist yet. Create placeholder stubs to unblock the type checker:

```bash
mkdir -p src/messages
echo '{}' > src/messages/en.json
echo '{}' > src/messages/sv.json
```

Re-run `npx tsc --noEmit`.
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/routing.ts src/i18n/request.ts src/messages/en.json src/messages/sv.json
git commit -m "feat(i18n): add next-intl routing config and empty message stubs"
```

---

## Phase 2 — Route restructure

### Task 4: Create `[locale]/layout.tsx` with `generateStaticParams`

**Files:**
- Create: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Write the new locale layout**

This file takes over everything currently in `src/app/layout.tsx` (`<html>`, `<body>`, fonts, Header, JSON-LD). Copy the existing `src/app/layout.tsx` contents and adapt.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { inter, jetbrainsMono, dmSerifDisplay } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://devbit.se"),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const typedLocale = locale as Locale;

  return (
    <html lang={typedLocale} className={`${inter.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  name: "Michael Hultman",
                  jobTitle: typedLocale === "sv" ? "Systemarkitekt & Senior Utvecklare" : "System Architect & Senior Developer",
                  url: `https://devbit.se/${typedLocale}`,
                  email: "michael@devbit.se",
                  telephone: "+46737120558",
                  address: { "@type": "PostalAddress", addressLocality: "Vänersborg", addressCountry: "SE" },
                  worksFor: { "@type": "Organization", name: "Devbit Consulting AB" },
                },
                {
                  "@type": "Organization",
                  name: "Devbit Consulting AB",
                  url: "https://devbit.se",
                  logo: "https://devbit.se/logo.svg",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat(i18n): add [locale] layout with NextIntlClientProvider"
```

---

### Task 5: Reduce root layout to a pass-through

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace root layout with a pass-through Fragment**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://devbit.se"),
  title: "Devbit Consulting | Michael Hultman — System Architect & Senior Developer",
  description:
    "Freelance System Architect and Senior Developer specializing in distributed systems, C#/.NET, Go, DDD, CQRS, Event Sourcing, and cloud infrastructure (Azure, AWS, Kubernetes). Available for consulting in Sweden and remote internationally.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

The root layout no longer renders `<html>` or `<body>` — those come from `[locale]/layout.tsx`. This is the standard `next-intl` pattern and prevents duplicate-root hydration warnings.

Note: root-level `metadata` still applies to `/` (the redirect shim created in Task 7) and to any page without its own metadata. Per-page/per-locale `generateMetadata` overrides it inside `[locale]`.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(i18n): strip root layout to pass-through"
```

---

### Task 6: Move existing pages under `[locale]/`

**Files:**
- Move: `src/app/about/page.tsx` → `src/app/[locale]/about/page.tsx`
- Move: `src/app/career/page.tsx` → `src/app/[locale]/career/page.tsx`
- Move: `src/app/contact/page.tsx` → `src/app/[locale]/contact/page.tsx`
- Move: `src/app/projects/page.tsx` → `src/app/[locale]/projects/page.tsx`
- Move: `src/app/services/page.tsx` → `src/app/[locale]/services/page.tsx`
- Move: `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- Delete: `src/app/old/page.tsx` (legacy test page; remove entirely)

- [ ] **Step 1: Move pages using `git mv`**

```bash
git mv src/app/page.tsx src/app/[locale]/page.tsx
git mv src/app/about src/app/[locale]/about
git mv src/app/career src/app/[locale]/career
git mv src/app/contact src/app/[locale]/contact
git mv src/app/projects src/app/[locale]/projects
git mv src/app/services src/app/[locale]/services
git rm -r src/app/old
```

- [ ] **Step 2: Add `setRequestLocale` to each page**

For `next-intl`'s static rendering to work, each page in `[locale]` must call `setRequestLocale(locale)` at the top. Edit each of the six moved pages (`page.tsx`, `about/page.tsx`, `career/page.tsx`, `contact/page.tsx`, `projects/page.tsx`, `services/page.tsx`) to accept `params` and call `setRequestLocale`.

Example — change `src/app/[locale]/career/page.tsx` from:

```tsx
export default function CareerPage() {
  return ( ... );
}
```

to:

```tsx
import { setRequestLocale } from "next-intl/server";

export default async function CareerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return ( ... );
}
```

Apply the same shape to every moved page. The homepage (`[locale]/page.tsx`) also gets this treatment.

The page metadata (`export const metadata`) is left as-is for now — Task 24 replaces each with a localized `generateMetadata`.

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: passes (consumer components still reference untranslated data; that's OK until Phase 3).

- [ ] **Step 4: Commit**

```bash
git add src/app
git commit -m "feat(i18n): move pages under [locale] segment"
```

---

### Task 7: Root redirect shim and deep-link recovery

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/components/layout/locale-redirect.tsx` (shared redirect logic)

- [ ] **Step 1: Write the shared redirect component**

```tsx
"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE, detectBrowserLocale, isLocale, type Locale } from "@/lib/i18n";

interface LocaleRedirectProps {
  preservePath?: boolean;
}

export function LocaleRedirect({ preservePath = false }: LocaleRedirectProps) {
  useEffect(() => {
    let target: Locale = DEFAULT_LOCALE;
    try {
      const stored = localStorage.getItem("locale");
      if (stored && isLocale(stored)) {
        target = stored;
      } else if (typeof navigator !== "undefined") {
        target = detectBrowserLocale(navigator.language);
      }
    } catch {
      // localStorage unavailable (private mode, SSR fallback) — stay on DEFAULT_LOCALE
    }

    let destination = `/${target}`;
    if (preservePath && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path && path !== "/") destination = `/${target}${path.replace(/\/$/, "")}`;
    }

    window.location.replace(destination);
  }, [preservePath]);

  return null;
}
```

- [ ] **Step 2: Write the root `/` shim**

```tsx
// src/app/page.tsx
import { LocaleRedirect } from "@/components/layout/locale-redirect";

export const dynamic = "force-static";

export default function RootRedirect() {
  return (
    <>
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en/" />
      </noscript>
      <LocaleRedirect />
    </>
  );
}
```

Note: because root layout is now a pass-through Fragment, this page renders without `<html>`/`<body>`. That is a problem for a statically exported HTML file — browsers need an enclosing document.

**Resolution:** the root shim gets its own minimal layout-less HTML wrapper. Change `src/app/page.tsx` to a full HTML document:

```tsx
import { LocaleRedirect } from "@/components/layout/locale-redirect";

export const dynamic = "force-static";

export const metadata = {
  title: "Devbit Consulting",
  robots: { index: false, follow: false },
};

export default function RootRedirect() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
        </noscript>
      </head>
      <body>
        <LocaleRedirect />
      </body>
    </html>
  );
}
```

Marked `noindex` so crawlers don't index the shim as a duplicate.

- [ ] **Step 3: Write `src/app/not-found.tsx`**

```tsx
import { LocaleRedirect } from "@/components/layout/locale-redirect";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
        </noscript>
      </head>
      <body>
        <LocaleRedirect preservePath />
      </body>
    </html>
  );
}
```

A user hitting `/career` without a locale prefix lands here, and the shim redirects to `/en/career` or `/sv/career` as appropriate.

- [ ] **Step 4: Type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/not-found.tsx src/components/layout/locale-redirect.tsx
git commit -m "feat(i18n): add / redirect shim and deep-link recovery"
```

---

### Task 8: Build sanity check — both locale trees emitted

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: build completes. `out/` contains `out/en/` and `out/sv/` directories, each with `index.html`, `about/index.html`, `career/index.html`, `contact/index.html`, `projects/index.html`, `services/index.html`.

If build fails with hydration or layout-related errors, re-read `node_modules/next/dist/docs/` and the `next-intl` App Router guide. The most common cause is misplaced `<html>`/`<body>`.

- [ ] **Step 2: Visual smoke test**

Run: `npm run dev`
In the browser:
- `http://localhost:3000/` — should redirect to `/en/` or `/sv/` based on browser language.
- `http://localhost:3000/en/` — homepage renders in English.
- `http://localhost:3000/sv/` — homepage renders in English (still; Swedish translations come in Phase 3–5).
- `http://localhost:3000/en/career/` — career page renders.
- `http://localhost:3000/career/` — redirects to `/en/career/` (or `/sv/career/`).

Ctrl-C to stop the dev server.

- [ ] **Step 3: Commit** (checkpoint — nothing to add unless edits were made)

```bash
git status
```
If clean, skip. Otherwise:
```bash
git commit -am "fix(i18n): build sanity fixes"
```

---

## Phase 3 — Data layer refactor to `LocalizedString`

### Task 9: Update `src/lib/types.ts` with localized shapes

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Replace `src/lib/types.ts`**

```ts
import type { LocalizedString } from "./i18n";

export type EventType =
  | "EducationCompleted"
  | "RoleStarted"
  | "SkillAcquired"
  | "ProjectDelivered"
  | "ProjectInProgress"
  | "CompanyFounded";

export interface CareerEventPayload {
  role?: LocalizedString;
  domain?: LocalizedString;
  tech?: string[];
  degree?: LocalizedString;
  scope?: LocalizedString;
  skills?: string[];
  status?: string;
}

export interface CareerEvent {
  id: string;
  type: EventType;
  timestamp: string;
  endTimestamp?: string;
  source: string;
  payload: CareerEventPayload;
  children?: CareerEvent[];
}

export interface Service {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
}

export interface Project {
  id: string;
  title: LocalizedString;
  client: string;
  domain: LocalizedString;
  challenge: LocalizedString;
  approach: LocalizedString;
  result: LocalizedString;
  tech: string[];
}

export interface SiteLink {
  label: LocalizedString;
  href: string;
  description: LocalizedString;
  icon: string;
}
```

Type labels (`EventType` values like `"RoleStarted"`) stay as identifiers — they render unchanged as architectural-terminology sticky labels in the UI.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: fails in every data file and consumer. That is expected — the following tasks fix them in order.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat(i18n): make structured data types use LocalizedString"
```

---

### Task 10: Refactor `src/data/site-config.ts`

**Files:**
- Modify: `src/data/site-config.ts`

- [ ] **Step 1: Replace file**

```ts
import type { SiteLink } from "@/lib/types";
import type { LocalizedString } from "@/lib/i18n";

export const siteLinks: SiteLink[] = [
  {
    label: { en: "Services", sv: "Tjänster" },
    href: "/services",
    description: { en: "Architecture, Development, Cloud", sv: "Arkitektur, utveckling, cloud" },
    icon: "Settings",
  },
  {
    label: { en: "Career", sv: "Karriär" },
    href: "/career",
    description: { en: "Event-sourced timeline", sv: "Event-sourced tidslinje" },
    icon: "ScrollText",
  },
  {
    label: { en: "Projects", sv: "Projekt" },
    href: "/projects",
    description: { en: "Case studies", sv: "Fallstudier" },
    icon: "Star",
  },
  {
    label: { en: "About", sv: "Om mig" },
    href: "/about",
    description: { en: "CV & personal", sv: "CV och personligt" },
    icon: "User",
  },
  {
    label: { en: "Contact", sv: "Kontakt" },
    href: "/contact",
    description: { en: "Get in touch", sv: "Hör av dig" },
    icon: "Mail",
  },
];

export const contactInfo = {
  email: "michael@devbit.se",
  phone: "+46 73-712 05 58",
  location: { en: "Vänersborg, Sweden", sv: "Vänersborg, Sverige" } as LocalizedString,
  availability: {
    en: "Available for contracts across Sweden and remote internationally.",
    sv: "Tillgänglig för uppdrag i Sverige och remote internationellt.",
  } as LocalizedString,
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/site-config.ts
git commit -m "feat(i18n): localize site config (nav labels, contact prose)"
```

---

### Task 11: Refactor `src/data/languages.ts` and `src/data/skills.ts`

**Files:**
- Modify: `src/data/languages.ts`
- Modify: `src/data/skills.ts`

- [ ] **Step 1: Rewrite `src/data/languages.ts`**

```ts
import type { LocalizedString } from "@/lib/i18n";

export interface LanguageEntry {
  name: LocalizedString;
  level: LocalizedString;
}

export const languages: LanguageEntry[] = [
  {
    name: { en: "Swedish", sv: "Svenska" },
    level: { en: "native", sv: "modersmål" },
  },
  {
    name: { en: "English", sv: "Engelska" },
    level: { en: "fluent", sv: "flytande" },
  },
  {
    name: { en: "German", sv: "Tyska" },
    level: { en: "basic", sv: "grundläggande" },
  },
];
```

- [ ] **Step 2: Leave `src/data/skills.ts` as-is**

The `skills` list (C#, .NET, Go, Azure, …) contains technical identifiers that don't translate. No change needed.

The one entry that is prose — `"AI-Assisted Development"` and `"Context Engineering"` — stays in English in both locales per the "programming terms stay English" constraint.

- [ ] **Step 3: Commit**

```bash
git add src/data/languages.ts
git commit -m "feat(i18n): localize languages list"
```

---

### Task 12: Refactor `src/data/services.ts`

**Files:**
- Modify: `src/data/services.ts`

- [ ] **Step 1: Rewrite**

```ts
import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    id: "architecture",
    title: { en: "System Architecture", sv: "Systemarkitektur" },
    description: {
      en: "Distributed systems design, DDD, CQRS, event sourcing. From monolith decomposition to greenfield design.",
      sv: "Design av distribuerade system, DDD, CQRS, event sourcing. Från monolitnedbrytning till greenfield-design.",
    },
    icon: "Cpu",
  },
  {
    id: "development",
    title: { en: "Senior Development", sv: "Senior utveckling" },
    description: {
      en: "Hands-on C#/.NET development. Clean code, test-driven, production-ready systems.",
      sv: "Hands-on-utveckling i C#/.NET. Ren kod, test-driven och produktionsredo.",
    },
    icon: "Code",
  },
  {
    id: "cloud",
    title: { en: "Cloud & DevOps", sv: "Cloud & DevOps" },
    description: {
      en: "Azure, AWS, Kubernetes. Cloud migrations, infrastructure automation, CI/CD pipelines.",
      sv: "Azure, AWS, Kubernetes. Molnmigreringar, infrastrukturautomatisering och CI/CD-pipelines.",
    },
    icon: "Cloud",
  },
  {
    id: "consulting",
    title: { en: "Technical Consulting", sv: "Teknisk rådgivning" },
    description: {
      en: "Architecture reviews, tech strategy, team mentoring. Helping teams level up.",
      sv: "Arkitekturgranskningar, teknisk strategi, mentorskap. Hjälper team att växa.",
    },
    icon: "MessageSquare",
  },
  {
    id: "ai",
    title: { en: "AI-Assisted Development", sv: "AI-Assisted Development" },
    description: {
      en: "Practical experience integrating AI into development workflows. Context engineering, prompt design, and getting consistent results from AI tools.",
      sv: "Praktisk erfarenhet av att integrera AI i utvecklingsflöden. Context engineering, promptdesign och att få konsekventa resultat från AI-verktyg.",
    },
    icon: "Cpu",
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/services.ts
git commit -m "feat(i18n): localize services data"
```

---

### Task 13: Refactor `src/data/projects.ts`

**Files:**
- Modify: `src/data/projects.ts`

- [ ] **Step 1: Rewrite**

```ts
import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "worldstream-deployer",
    title: { en: "Datacenter Deployer", sv: "Deployer för datacenter" },
    client: "Worldstream Netherlands",
    domain: { en: "Infrastructure", sv: "Infrastruktur" },
    challenge: {
      en: "The datacenter was using a licensed third-party product for switch configuration deployment and wanted to replace it with their own software, better tailored to their needs and vendor agnostic.",
      sv: "Datacentret använde en licensierad tredjepartsprodukt för konfigurationsdeployment till switchar och ville ersätta den med en egen lösning, bättre anpassad till deras behov och leverantörsoberoende.",
    },
    approach: {
      en: "Built a deployer app in Go running on Kubernetes, with gRPC for the backend and a React frontend for operators.",
      sv: "Byggde en deployer-app i Go som kör på Kubernetes, med gRPC i backend och ett React-gränssnitt för operatörer.",
    },
    result: {
      en: "Automated configuration deployment to datacenter switches.",
      sv: "Automatiserad konfigurationsdeployment till datacenter-switchar.",
    },
    tech: ["Go", "Kubernetes", "gRPC", "React"],
  },
  {
    id: "volvo-energy",
    title: { en: "Energy Service Cloud", sv: "Energy Service Cloud" },
    client: "Volvo Energy",
    domain: { en: "EV Charging / Automotive", sv: "EV-laddning / Fordon" },
    challenge: {
      en: "Needed a cloud backend to communicate with wallboxes and other energy devices in real time using MQTT and OCPP.",
      sv: "Behövde ett molnbaserat backend för att kommunicera med wallboxar och andra energi-enheter i realtid via MQTT och OCPP.",
    },
    approach: {
      en: "Used Microsoft Orleans on AWS for an actor-based setup, with gRPC between services and GraphQL for the client API.",
      sv: "Använde Microsoft Orleans på AWS för en aktörsbaserad lösning, med gRPC mellan tjänster och GraphQL för klient-API:et.",
    },
    result: {
      en: "A working cloud platform that manages IoT energy devices with real-time monitoring and control.",
      sv: "En fungerande molnplattform som hanterar IoT-energienheter med realtidsövervakning och styrning.",
    },
    tech: ["C#", "Orleans", "AWS", "MQTT", "OCPP", "gRPC", "GraphQL"],
  },
  {
    id: "collector-bank",
    title: { en: "Banking Platform", sv: "Bankplattform" },
    client: "Collector Bank",
    domain: { en: "Banking / FinTech", sv: "Bank / FinTech" },
    challenge: {
      en: "Several core banking systems needed to be built or modernized — credit evaluation, savings accounts, fraud detection, and regulatory compliance.",
      sv: "Flera centrala banksystem behövde byggas eller moderniseras — kreditvärdering, sparkonton, bedrägeridetektering och regelefterlevnad.",
    },
    approach: {
      en: "Built microservices on Azure and Kubernetes using C#, CQRS, and Event Sourcing for each system.",
      sv: "Byggde mikrotjänster på Azure och Kubernetes i C# med CQRS och Event Sourcing för varje system.",
    },
    result: {
      en: "Delivered five systems: credit evaluation, savings accounts, anti-fraud, GDPR data cleanup, and anti-money laundering integration.",
      sv: "Levererade fem system: kreditvärdering, sparkonton, bedrägeriskydd, GDPR-dataröjning och integration för penningtvättskontroll.",
    },
    tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing"],
  },
  {
    id: "stena-line",
    title: { en: "Booking System Modernization", sv: "Modernisering av bokningssystem" },
    client: "Stena Line",
    domain: { en: "Shipping / Logistics", sv: "Sjöfart / Logistik" },
    challenge: {
      en: "A large monolithic booking system needed to be broken up to make it easier to work on and scale.",
      sv: "Ett stort monolitiskt bokningssystem behövde brytas upp för att bli enklare att arbeta med och skala.",
    },
    approach: {
      en: "Defined distributed architecture patterns and service boundaries using C# and ASP.NET Core. Started the migration from monolith to separate services.",
      sv: "Definierade mönster för distribuerad arkitektur och tjänstegränser med C# och ASP.NET Core. Inledde migreringen från monolit till separata tjänster.",
    },
    result: {
      en: "Established the architectural foundation and patterns for the ongoing transformation of the booking system.",
      sv: "La den arkitektoniska grunden och mönster för den pågående omvandlingen av bokningssystemet.",
    },
    tech: ["C#", "ASP.NET Core", "Distributed Systems"],
  },
  {
    id: "worldstream-vxlan",
    title: { en: "VXLAN/EVPN Automation", sv: "Automatisering av VXLAN/EVPN" },
    client: "Worldstream Netherlands",
    domain: { en: "Infrastructure", sv: "Infrastruktur" },
    challenge: {
      en: "Setting up VXLAN/EVPN networks at the datacenter was done manually, which took time and led to mistakes.",
      sv: "VXLAN/EVPN-nätverken i datacentret sattes upp manuellt, vilket tog tid och ledde till fel.",
    },
    approach: {
      en: "Built the system from scratch in Go using DDD, CQRS, and Event Sourcing.",
      sv: "Byggde systemet från grunden i Go med DDD, CQRS och Event Sourcing.",
    },
    result: {
      en: "Automated the VXLAN/EVPN setup process, cutting down setup time and removing manual errors.",
      sv: "Automatiserade uppsättningen av VXLAN/EVPN, vilket kapade uppsättningstiden och eliminerade manuella fel.",
    },
    tech: ["Go", "DDD", "CQRS", "Event Sourcing"],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat(i18n): localize project case study data"
```

---

### Task 14: Refactor `src/data/career-events.ts`

**Files:**
- Modify: `src/data/career-events.ts`

- [ ] **Step 1: Rewrite**

Full replacement — every `role`, `domain`, `scope`, and `degree` payload becomes `{ en, sv }`. Type labels (`"RoleStarted"`, etc.) and the `status` enum value (`"available_for_hire"`) stay as identifiers.

```ts
import type { CareerEvent } from "@/lib/types";

export const careerEvents: CareerEvent[] = [
  {
    id: "devbit-freelance",
    type: "RoleStarted",
    timestamp: "2022-08",
    endTimestamp: "present",
    source: "Devbit Consulting AB",
    payload: {
      role: { en: "Freelance System Architect / Developer", sv: "Frilansande systemarkitekt / utvecklare" },
      domain: { en: "Consulting", sv: "Konsultation" },
      tech: ["C#", "Go", "Orleans", "AWS", "Azure", "Kubernetes", "gRPC", "GraphQL"],
    },
    children: [
      {
        id: "worldstream-deployer",
        type: "ProjectInProgress",
        timestamp: "2025-06",
        source: "Worldstream Netherlands",
        payload: {
          scope: {
            en: "Building a deployer system that handles configuration deployment to datacenter switches, using Go, Kubernetes, gRPC, and React",
            sv: "Bygger ett deployer-system som hanterar konfigurationsdeployment till datacenter-switchar, med Go, Kubernetes, gRPC och React",
          },
        },
      },
      {
        id: "volvo-energy-cloud",
        type: "ProjectDelivered",
        timestamp: "2023-12",
        endTimestamp: "2025-06",
        source: "Volvo Energy",
        payload: {
          scope: {
            en: "Built a cloud backend for wallboxes and other energy devices using MQTT, OCPP, Orleans, AWS, gRPC, and GraphQL",
            sv: "Byggde ett molnbaserat backend för wallboxar och andra energi-enheter med MQTT, OCPP, Orleans, AWS, gRPC och GraphQL",
          },
        },
      },
      {
        id: "stena-booking",
        type: "ProjectDelivered",
        timestamp: "2023-01",
        endTimestamp: "2023-12",
        source: "Stena Line",
        payload: {
          scope: {
            en: "Helped establish distributed architecture patterns and started the migration of the booking system from monolith to separate services using C# and ASP.NET Core",
            sv: "Hjälpte till att etablera mönster för distribuerad arkitektur och inledde migreringen av bokningssystemet från monolit till separata tjänster med C# och ASP.NET Core",
          },
        },
      },
      {
        id: "worldstream-freelance",
        type: "ProjectDelivered",
        timestamp: "2022-08",
        endTimestamp: "2023-01",
        source: "Worldstream Netherlands",
        payload: {
          scope: {
            en: "Continued working on the VXLAN/EVPN automation systems as a freelancer",
            sv: "Fortsatte arbeta med VXLAN/EVPN-automatiseringen som frilansare",
          },
        },
      },
    ],
  },
  {
    id: "devbit-founded",
    type: "CompanyFounded",
    timestamp: "2022",
    source: "Devbit Consulting AB",
    payload: { status: "available_for_hire" },
  },
  {
    id: "evolve-afry",
    type: "RoleStarted",
    timestamp: "2021-03",
    endTimestamp: "2022-08",
    source: "Evolve / Afry",
    payload: {
      role: { en: "Consultant Architect / Developer", sv: "Konsultarkitekt / utvecklare" },
      domain: { en: "Consulting", sv: "Konsultation" },
      tech: ["C#", "Go", "Azure", "Kubernetes", "DDD", "CQRS", "Event Sourcing"],
    },
    children: [
      {
        id: "worldstream-vxlan",
        type: "ProjectDelivered",
        timestamp: "2021-09",
        endTimestamp: "2022-08",
        source: "Worldstream Netherlands",
        payload: {
          scope: {
            en: "Built system to automate VXLAN/EVPN network setup using Go, DDD, CQRS, and Event Sourcing",
            sv: "Byggde system för att automatisera VXLAN/EVPN-nätverksuppsättning med Go, DDD, CQRS och Event Sourcing",
          },
        },
      },
      {
        id: "cuviva-migration",
        type: "ProjectDelivered",
        timestamp: "2021-03",
        endTimestamp: "2021-09",
        source: "Cuviva",
        payload: {
          scope: {
            en: "Moved an existing system from Azure to a hybrid cloud setup running on Kubernetes",
            sv: "Flyttade ett befintligt system från Azure till en hybrid moln-lösning på Kubernetes",
          },
        },
      },
    ],
  },
  {
    id: "collector-bank",
    type: "RoleStarted",
    timestamp: "2017-02",
    endTimestamp: "2021-03",
    source: "Collector Bank",
    payload: {
      role: { en: "Architect", sv: "Arkitekt" },
      domain: { en: "Banking / FinTech", sv: "Bank / FinTech" },
      tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing"],
    },
    children: [
      {
        id: "collector-credit", type: "ProjectDelivered", timestamp: "2017-02", source: "Collector Bank",
        payload: { scope: { en: "Built a credit evaluation system running on Kubernetes and Azure", sv: "Byggde ett kreditvärderingssystem som kör på Kubernetes och Azure" } },
      },
      {
        id: "collector-savings", type: "ProjectDelivered", timestamp: "2018-01", source: "Collector Bank",
        payload: { scope: { en: "Developed a savings account system for both individual and business customers", sv: "Utvecklade ett sparkontosystem för både privat- och företagskunder" } },
      },
      {
        id: "collector-antifraud", type: "ProjectDelivered", timestamp: "2019-01", source: "Collector Bank",
        payload: { scope: { en: "Updated and improved the anti-fraud detection system", sv: "Uppdaterade och förbättrade bedrägeridetekteringssystemet" } },
      },
      {
        id: "collector-gdpr", type: "ProjectDelivered", timestamp: "2019-06", source: "Collector Bank",
        payload: { scope: { en: "Added GDPR support with data cleanup routines and reporting", sv: "La till GDPR-stöd med dataröjningsrutiner och rapportering" } },
      },
      {
        id: "collector-aml", type: "ProjectDelivered", timestamp: "2020-01", source: "Collector Bank",
        payload: { scope: { en: "Integrated anti-money laundering (AML) checks into the core banking platform", sv: "Integrerade kontroller mot penningtvätt (AML) i den centrala bankplattformen" } },
      },
    ],
  },
  {
    id: "autocom",
    type: "RoleStarted",
    timestamp: "2007-08",
    endTimestamp: "2017-02",
    source: "Autocom Diagnostic Partner",
    payload: {
      role: { en: "Software Developer", sv: "Mjukvaruutvecklare" },
      domain: { en: "Automotive Diagnostics", sv: "Fordonsdiagnostik" },
      tech: ["C#", ".NET"],
    },
    children: [
      {
        id: "autocom-reverse", type: "ProjectDelivered", timestamp: "2007-08", source: "Autocom",
        payload: { scope: { en: "Built tools for capturing and simulating vehicle diagnostic protocols", sv: "Byggde verktyg för att fånga och simulera fordonsdiagnostiska protokoll" } },
      },
      {
        id: "autocom-licensing", type: "ProjectDelivered", timestamp: "2010-01", source: "Autocom",
        payload: { scope: { en: "Designed and built a licensing system for the diagnostic products", sv: "Designade och byggde ett licenssystem för diagnostikprodukterna" } },
      },
      {
        id: "autocom-testing", type: "ProjectDelivered", timestamp: "2013-01", source: "Autocom",
        payload: { scope: { en: "Built a system for testing and preparing devices before shipping", sv: "Byggde ett system för att testa och förbereda enheter innan leverans" } },
      },
    ],
  },
  {
    id: "edu-west",
    type: "EducationCompleted",
    timestamp: "2001",
    endTimestamp: "2005",
    source: "University West",
    payload: { degree: { en: "Computer Science / Information Systems", sv: "Datavetenskap / Informationssystem" } },
  },
  {
    id: "edu-thu",
    type: "EducationCompleted",
    timestamp: "1996",
    endTimestamp: "1998",
    source: "Högskolan Trollhättan/Uddevalla",
    payload: { degree: { en: "Business Economics", sv: "Företagsekonomi" } },
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/career-events.ts
git commit -m "feat(i18n): localize career event prose (role/scope/domain/degree)"
```

---

### Task 15: Refactor `src/data/cv-data.ts` into `buildCvData(locale)`

**Files:**
- Modify: `src/data/cv-data.ts`

- [ ] **Step 1: Replace file**

The function resolves all `LocalizedString` fields into plain strings so the PDF document stays locale-agnostic.

```ts
import { careerEvents } from "@/data/career-events";
import { contactInfo } from "@/data/site-config";
import { skills } from "@/data/skills";
import { languages } from "@/data/languages";
import { loc, type Locale } from "@/lib/i18n";
import type { CareerEvent } from "@/lib/types";

const consultingRoleIds = ["devbit-freelance", "evolve-afry"];

export interface TimelineEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  type: "employment" | "consulting";
  via?: string;
  description?: string;
  highlights?: string[];
}

export interface CvLanguage {
  name: string;
  level: string;
}

export interface CvEducation {
  id: string;
  source: string;
  timestamp: string;
  endTimestamp?: string;
  degree: string;
}

export interface CvContact {
  email: string;
  phone: string;
  location: string;
  availability: string;
}

export interface CvData {
  name: string;
  title: string;
  photo: string;
  contact: CvContact;
  linkedin: string;
  skills: string[];
  languages: CvLanguage[];
  timeline: TimelineEntry[];
  education: CvEducation[];
}

function buildTimeline(locale: Locale, roleLabelFallback: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const evt of careerEvents) {
    if (evt.type !== "RoleStarted") continue;
    const roleText = evt.payload.role ? loc(evt.payload.role, locale) : roleLabelFallback;

    if (consultingRoleIds.includes(evt.id)) {
      for (const child of evt.children ?? []) {
        entries.push({
          id: child.id,
          company: child.source,
          role: roleText,
          startDate: child.timestamp,
          endDate: child.endTimestamp,
          type: "consulting",
          via: evt.source,
          description: child.payload.scope ? loc(child.payload.scope, locale) : undefined,
        });
      }
    } else {
      entries.push({
        id: evt.id,
        company: evt.source,
        role: roleText,
        startDate: evt.timestamp,
        endDate: evt.endTimestamp,
        type: "employment",
        highlights: (evt.children ?? [])
          .map((c: CareerEvent) => (c.payload.scope ? loc(c.payload.scope, locale) : ""))
          .filter(Boolean),
      });
    }
  }

  return entries.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

function buildEducation(locale: Locale): CvEducation[] {
  return careerEvents
    .filter((e) => e.type === "EducationCompleted")
    .map((e) => ({
      id: e.id,
      source: e.source,
      timestamp: e.timestamp,
      endTimestamp: e.endTimestamp,
      degree: e.payload.degree ? loc(e.payload.degree, locale) : "",
    }));
}

export function buildCvData(locale: Locale): CvData {
  const titles = {
    en: "Senior System Architect / Developer",
    sv: "Senior systemarkitekt / utvecklare",
  };
  const roleFallback = { en: "Consultant", sv: "Konsult" };

  return {
    name: "Michael Hultman",
    title: titles[locale],
    photo: "https://devbit.se/michael.jpg",
    contact: {
      email: contactInfo.email,
      phone: contactInfo.phone,
      location: loc(contactInfo.location, locale),
      availability: loc(contactInfo.availability, locale),
    },
    linkedin: "https://www.linkedin.com/in/michael-hultman-28545741/",
    skills,
    languages: languages.map((l) => ({
      name: loc(l.name, locale),
      level: loc(l.level, locale),
    })),
    timeline: buildTimeline(locale, roleFallback[locale]),
    education: buildEducation(locale),
  };
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: errors in `DownloadCvButton` and `CvDocument` (they still import `cvData` directly). These are fixed in Phase 7.

- [ ] **Step 3: Commit**

```bash
git add src/data/cv-data.ts
git commit -m "feat(i18n): replace cvData with buildCvData(locale)"
```

---

## Phase 4 — Message files and provider wiring

### Task 16: Write `src/messages/en.json`

**Files:**
- Modify: `src/messages/en.json`

- [ ] **Step 1: Replace `src/messages/en.json` with the full message bundle**

```json
{
  "nav": {
    "home": "Home"
  },
  "header": {
    "toggleTheme": "Toggle dark mode",
    "toggleLanguage": "Switch language",
    "toggleMenu": "Toggle menu"
  },
  "home": {
    "sectionLabel": "Customer journey"
  },
  "pages": {
    "services": { "label": "Services", "title": "What Devbit Brings", "description": "System architecture, hands-on development, cloud infrastructure, and strategic consulting." },
    "career":   { "label": "Career Stream", "title": "Career.EventStore.replay()", "description": "20+ years of software engineering, replayed as an event stream. Click roles to expand project details." },
    "projects": { "label": "Projects", "title": "Case Studies", "description": "Featured projects across EV charging, banking, shipping, and datacenter infrastructure." },
    "about":    { "label": "About", "title": "Michael Hultman", "description": "System Architect & Senior Developer" },
    "contact":  { "label": "Contact", "title": "Get In Touch", "description": "Have a project in mind? Let's talk." }
  },
  "sticky": {
    "services": "Services",
    "career": "Career Stream",
    "projects": "Projects",
    "about": "About",
    "contact": "Contact",
    "back": "← back"
  },
  "career": {
    "streamHeader": "Career.EventStore.replay() — {count} events",
    "projectsCollapsed": "// {count, plural, one {# project} other {# projects}}",
    "fieldRole": "role",
    "fieldDomain": "domain",
    "fieldTech": "tech",
    "fieldDegree": "degree",
    "fieldStatus": "status",
    "fieldScope": "scope"
  },
  "project": {
    "sectionChallenge": "challenge",
    "sectionApproach": "approach",
    "sectionResult": "result"
  },
  "about": {
    "paragraphs": [
      "With over 20 years in the software industry, I specialize in distributed systems, cloud infrastructure, and clean architecture. My expertise lies in the .NET platform, especially C#, with deep experience in DDD, CQRS, and Event Sourcing.",
      "I keep up with the latest trends in the industry and have spent the past two and a half years working hands-on with AI-assisted development, focusing on context engineering, structuring sessions and prompts to get the most out of AI tools.",
      "I run Devbit Consulting AB from Vänersborg, Sweden."
    ],
    "expertise": "Expertise",
    "viewCareerStream": "View interactive Career Event Stream →",
    "downloadCv": "Download CV",
    "downloadCvBroker": "Download CV (Broker)",
    "downloadGenerating": "Generating...",
    "experienceHeading": "Experience",
    "educationHeading": "Education",
    "languagesHeading": "Languages"
  },
  "experience": [
    { "title": "Freelance System Architect / Developer", "company": "Devbit Consulting AB", "dates": "Aug 2022 — Present", "description": "Freelance consulting. Clients: Worldstream (datacenter deployer), Volvo Energy (IoT cloud backend), Stena Line (booking system modernization)." },
    { "title": "Consultant Architect / Developer", "company": "Evolve / Afry", "dates": "Mar 2021 — Aug 2022", "description": "Consulting assignments: Worldstream (Go/DDD/CQRS systems), Cuviva (Azure to Kubernetes migration for medtech)." },
    { "title": "Architect", "company": "Collector Bank", "dates": "Feb 2017 — Mar 2021", "description": "Credit evaluation, anti-fraud, GDPR compliance, and AML on Azure/Kubernetes." },
    { "title": "Software Developer", "company": "Autocom Diagnostic Partner", "dates": "Aug 2007 — Feb 2017", "description": "Vehicle diagnostic tools, licensing systems, and distributed device testing." }
  ],
  "education": [
    { "title": "Computer Science / Information Systems", "company": "University West", "dates": "2001 — 2005" },
    { "title": "Business Economics", "company": "Högskolan Trollhättan/Uddevalla", "dates": "1996 — 1998" }
  ],
  "contact": {
    "labels": { "email": "Email", "phone": "Phone", "location": "Location", "linkedin": "LinkedIn" },
    "linkedinName": "Michael Hultman"
  },
  "contactForm": {
    "namePlaceholder": "Your name",
    "emailPlaceholder": "Email address",
    "subjectPlaceholder": "Subject (optional)",
    "messagePlaceholder": "Tell me about your project...",
    "submit": "Send Message",
    "defaultSubject": "Website inquiry",
    "errors": {
      "nameRequired": "Name is required",
      "emailInvalid": "Invalid email address",
      "messageMin": "Message must be at least 10 characters"
    }
  },
  "board": {
    "websiteVisited": "Website Visited",
    "exploreServices": "Explore Services",
    "interestSparked": "Interest Sparked",
    "checkBackground": "Check Background",
    "trustPolicy": "If experience matches → build trust",
    "candidateEvaluated": "Candidate Evaluated",
    "reviewCaseStudies": "Review Case Studies",
    "doesThisPersonDeliver": "Does this person deliver?",
    "linkedin": "LinkedIn",
    "learnAboutPerson": "Learn About Person",
    "decisionMade": "Decision Made",
    "reachPolicy": "If convinced → reach out",
    "sendMessage": "Send Message",
    "messageSent": "Message Sent",
    "consultantHired": "Consultant Hired 🎉",
    "youAreHere": "← You are here",
    "aggregates": {
      "services": "Services",
      "servicesSub": "Architecture · Dev · Cloud",
      "career": "Career Stream",
      "careerSub": "Event-sourced timeline",
      "projects": "Projects",
      "projectsSub": "Case studies & results",
      "about": "About",
      "aboutSub": "CV · Skills · Background",
      "contact": "Contact",
      "contactSub": "Get in touch"
    }
  },
  "cv": {
    "contact": "Contact",
    "profileSummary": "Profile",
    "summary": "Senior System Architect and Developer with 20+ years in the industry. Specialises in distributed systems, cloud, and clean architecture on the .NET platform (C#) with deep experience in DDD, CQRS, and Event Sourcing.",
    "experience": "Experience",
    "education": "Education",
    "skills": "Skills",
    "languages": "Languages",
    "consultingVia": "via {company}",
    "present": "Present"
  },
  "meta": {
    "home": {
      "title": "Devbit Consulting | Michael Hultman — System Architect & Senior Developer",
      "description": "System Architect and Senior Developer specializing in distributed systems, C#/.NET, cloud infrastructure, and clean architecture. Available for consulting."
    },
    "services": {
      "title": "Services — Devbit Consulting | Michael Hultman",
      "description": "System architecture, backend development, and cloud consulting services. C#/.NET, Go, Azure, AWS, Kubernetes, DDD, CQRS, Event Sourcing. Available for freelance consulting."
    },
    "career": {
      "title": "Career Stream — Devbit Consulting | Michael Hultman",
      "description": "Career timeline of Michael Hultman — 20+ years in software development, from automotive diagnostics to fintech and cloud infrastructure consulting."
    },
    "projects": {
      "title": "Projects — Devbit Consulting | Michael Hultman",
      "description": "Consulting case studies: Volvo Energy IoT cloud, Stena Line booking modernization, Worldstream datacenter automation, Collector Bank fintech platform."
    },
    "about": {
      "title": "About — Devbit Consulting | Michael Hultman",
      "description": "Michael Hultman — Freelance System Architect and Senior Developer. 20+ years experience in distributed systems, C#/.NET, Go, and cloud infrastructure. Based in Vänersborg, Sweden."
    },
    "contact": {
      "title": "Contact — Devbit Consulting | Michael Hultman",
      "description": "Hire a freelance system architect and senior developer. Contact Michael Hultman at Devbit Consulting for consulting in distributed systems, C#, Go, and cloud."
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/messages/en.json
git commit -m "feat(i18n): populate en.json with UI chrome messages"
```

---

### Task 17: Write `src/messages/sv.json`

**Files:**
- Modify: `src/messages/sv.json`

- [ ] **Step 1: Write Swedish translations**

Same key structure as `en.json`. Programming/architectural terms and proper nouns (DDD, CQRS, Event Sourcing, C#, Azure, Kubernetes, Vänersborg, company names, `Career.EventStore.replay()`) stay in English/original.

```json
{
  "nav": {
    "home": "Hem"
  },
  "header": {
    "toggleTheme": "Växla mörkt läge",
    "toggleLanguage": "Byt språk",
    "toggleMenu": "Växla meny"
  },
  "home": {
    "sectionLabel": "Kundresan"
  },
  "pages": {
    "services": { "label": "Tjänster", "title": "Det Devbit erbjuder", "description": "Systemarkitektur, hands-on-utveckling, molninfrastruktur och strategisk rådgivning." },
    "career":   { "label": "Karriärström", "title": "Career.EventStore.replay()", "description": "20+ års mjukvaruutveckling, uppspelat som en event stream. Klicka på rollerna för att expandera projekten." },
    "projects": { "label": "Projekt", "title": "Fallstudier", "description": "Utvalda projekt inom EV-laddning, bank, sjöfart och datacenter-infrastruktur." },
    "about":    { "label": "Om mig", "title": "Michael Hultman", "description": "Systemarkitekt & Senior Utvecklare" },
    "contact":  { "label": "Kontakt", "title": "Hör av dig", "description": "Har du ett projekt i åtanke? Vi tar ett snack." }
  },
  "sticky": {
    "services": "Tjänster",
    "career": "Karriärström",
    "projects": "Projekt",
    "about": "Om mig",
    "contact": "Kontakt",
    "back": "← tillbaka"
  },
  "career": {
    "streamHeader": "Career.EventStore.replay() — {count} events",
    "projectsCollapsed": "// {count, plural, one {# projekt} other {# projekt}}",
    "fieldRole": "roll",
    "fieldDomain": "domän",
    "fieldTech": "tech",
    "fieldDegree": "examen",
    "fieldStatus": "status",
    "fieldScope": "scope"
  },
  "project": {
    "sectionChallenge": "utmaning",
    "sectionApproach": "angreppssätt",
    "sectionResult": "resultat"
  },
  "about": {
    "paragraphs": [
      "Med över 20 år i mjukvarubranschen är jag specialiserad på distribuerade system, molninfrastruktur och ren arkitektur. Min expertis ligger i .NET-plattformen, framför allt C#, med djup erfarenhet av DDD, CQRS och Event Sourcing.",
      "Jag håller mig uppdaterad med de senaste trenderna i branschen och har de senaste två och ett halvt åren arbetat hands-on med AI-assisterad utveckling, med fokus på context engineering — att strukturera sessioner och prompts för att få ut mesta möjliga av AI-verktyg.",
      "Jag driver Devbit Consulting AB från Vänersborg."
    ],
    "expertise": "Expertis",
    "viewCareerStream": "Visa interaktiv Career Event Stream →",
    "downloadCv": "Ladda ner CV",
    "downloadCvBroker": "Ladda ner CV (mäklare)",
    "downloadGenerating": "Skapar...",
    "experienceHeading": "Erfarenhet",
    "educationHeading": "Utbildning",
    "languagesHeading": "Språk"
  },
  "experience": [
    { "title": "Frilansande systemarkitekt / utvecklare", "company": "Devbit Consulting AB", "dates": "Aug 2022 — Nu", "description": "Frilanskonsult. Kunder: Worldstream (datacenter-deployer), Volvo Energy (IoT-moln-backend), Stena Line (modernisering av bokningssystem)." },
    { "title": "Konsultarkitekt / utvecklare", "company": "Evolve / Afry", "dates": "Mar 2021 — Aug 2022", "description": "Konsultuppdrag: Worldstream (Go/DDD/CQRS-system), Cuviva (migrering från Azure till Kubernetes för medtech)." },
    { "title": "Arkitekt", "company": "Collector Bank", "dates": "Feb 2017 — Mar 2021", "description": "Kreditvärdering, bedrägeriskydd, GDPR-efterlevnad och AML på Azure/Kubernetes." },
    { "title": "Mjukvaruutvecklare", "company": "Autocom Diagnostic Partner", "dates": "Aug 2007 — Feb 2017", "description": "Fordonsdiagnostiska verktyg, licenssystem och distribuerad enhetstestning." }
  ],
  "education": [
    { "title": "Datavetenskap / Informationssystem", "company": "Högskolan Väst", "dates": "2001 — 2005" },
    { "title": "Företagsekonomi", "company": "Högskolan Trollhättan/Uddevalla", "dates": "1996 — 1998" }
  ],
  "contact": {
    "labels": { "email": "E-post", "phone": "Telefon", "location": "Plats", "linkedin": "LinkedIn" },
    "linkedinName": "Michael Hultman"
  },
  "contactForm": {
    "namePlaceholder": "Ditt namn",
    "emailPlaceholder": "E-postadress",
    "subjectPlaceholder": "Ämne (valfritt)",
    "messagePlaceholder": "Berätta om ditt projekt...",
    "submit": "Skicka meddelande",
    "defaultSubject": "Förfrågan från webbplatsen",
    "errors": {
      "nameRequired": "Namn krävs",
      "emailInvalid": "Ogiltig e-postadress",
      "messageMin": "Meddelandet måste vara minst 10 tecken"
    }
  },
  "board": {
    "websiteVisited": "Besöker webbplatsen",
    "exploreServices": "Utforska tjänster",
    "interestSparked": "Intresse väckt",
    "checkBackground": "Kolla bakgrund",
    "trustPolicy": "Om erfarenheten matchar → bygg förtroende",
    "candidateEvaluated": "Kandidat utvärderad",
    "reviewCaseStudies": "Granska fallstudier",
    "doesThisPersonDeliver": "Levererar den här personen?",
    "linkedin": "LinkedIn",
    "learnAboutPerson": "Lär känna personen",
    "decisionMade": "Beslut fattat",
    "reachPolicy": "Om övertygad → hör av dig",
    "sendMessage": "Skicka meddelande",
    "messageSent": "Meddelande skickat",
    "consultantHired": "Konsult anlitad 🎉",
    "youAreHere": "← Du är här",
    "aggregates": {
      "services": "Tjänster",
      "servicesSub": "Arkitektur · Dev · Cloud",
      "career": "Karriärström",
      "careerSub": "Event-sourced tidslinje",
      "projects": "Projekt",
      "projectsSub": "Fallstudier & resultat",
      "about": "Om mig",
      "aboutSub": "CV · Kompetens · Bakgrund",
      "contact": "Kontakt",
      "contactSub": "Hör av dig"
    }
  },
  "cv": {
    "contact": "Kontakt",
    "profileSummary": "Profil",
    "summary": "Senior systemarkitekt och utvecklare med 20+ år i branschen. Specialiserad på distribuerade system, moln och ren arkitektur på .NET-plattformen (C#) med djup erfarenhet av DDD, CQRS och Event Sourcing.",
    "experience": "Erfarenhet",
    "education": "Utbildning",
    "skills": "Kompetens",
    "languages": "Språk",
    "consultingVia": "via {company}",
    "present": "Nu"
  },
  "meta": {
    "home": {
      "title": "Devbit Consulting | Michael Hultman — Systemarkitekt & Senior Utvecklare",
      "description": "Systemarkitekt och senior utvecklare specialiserad på distribuerade system, C#/.NET, molninfrastruktur och ren arkitektur. Tillgänglig för konsultuppdrag."
    },
    "services": {
      "title": "Tjänster — Devbit Consulting | Michael Hultman",
      "description": "Systemarkitektur, backend-utveckling och molnkonsultation. C#/.NET, Go, Azure, AWS, Kubernetes, DDD, CQRS, Event Sourcing. Tillgänglig för frilansuppdrag."
    },
    "career": {
      "title": "Karriärström — Devbit Consulting | Michael Hultman",
      "description": "Karriärtidslinjen för Michael Hultman — 20+ år inom mjukvaruutveckling, från fordonsdiagnostik till fintech och molninfrastruktur."
    },
    "projects": {
      "title": "Projekt — Devbit Consulting | Michael Hultman",
      "description": "Konsultfallstudier: Volvo Energy IoT-moln, Stena Line bokningsmodernisering, Worldstream datacenterautomatisering, Collector Bank fintech-plattform."
    },
    "about": {
      "title": "Om mig — Devbit Consulting | Michael Hultman",
      "description": "Michael Hultman — Frilansande systemarkitekt och senior utvecklare. 20+ år av erfarenhet inom distribuerade system, C#/.NET, Go och molninfrastruktur. Baserad i Vänersborg."
    },
    "contact": {
      "title": "Kontakt — Devbit Consulting | Michael Hultman",
      "description": "Anlita en frilansande systemarkitekt och senior utvecklare. Kontakta Michael Hultman på Devbit Consulting för konsultation inom distribuerade system, C#, Go och moln."
    }
  }
}
```

- [ ] **Step 2: Sanity check the JSON parses**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/messages/sv.json','utf8'))"`
Expected: no output (valid JSON). If it throws, fix trailing commas / quote issues.

- [ ] **Step 3: Commit**

```bash
git add src/messages/sv.json
git commit -m "feat(i18n): add Swedish translations for UI chrome"
```

---

## Phase 5 — Wire consumer components to locale

### Task 18: Update `Header` for locale + localized hrefs

**Files:**
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Rewrite**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { siteLinks } from "@/data/site-config";
import { loc, localizedHref, type Locale } from "@/lib/i18n";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";

export function Header() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <Image src="/logo-icon.svg" alt="" width={36} height={36} className="h-9 w-9" />
          <div className="flex flex-col leading-none">
            <span className="text-xl tracking-[0.12em] text-text-primary" style={{ fontFamily: "var(--font-logo), serif" }}>DEVBIT</span>
            <span className="text-[11px] font-medium tracking-[0.15em] text-crimson">consulting</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {siteLinks.map((link) => {
              const href = localizedHref(link.href, locale);
              const active = pathname === href || pathname === `${href}/`;
              return (
                <Link key={link.href} href={href}
                  className={`text-base transition-colors ${active ? "text-crimson font-medium" : "text-text-muted hover:text-text-body"}`}>
                  {loc(link.label, locale)}
                </Link>
              );
            })}
          </nav>
          <LanguageToggle />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
```

`LanguageToggle` is created in Task 25. Type-checking this file before Task 25 will fail on the import — that's OK, but make sure Task 25 lands before Task 30 (the build check).

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat(i18n): header uses locale + localizedHref"
```

---

### Task 19: Update `MobileNav`

**Files:**
- Modify: `src/components/layout/mobile-nav.tsx`

- [ ] **Step 1: Rewrite**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { siteLinks } from "@/data/site-config";
import { loc, localizedHref, type Locale } from "@/lib/i18n";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations("header");

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-text-muted hover:text-text-body" aria-label={t("toggleMenu")}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 right-0 border-b border-border bg-bg/95 backdrop-blur-md">
            <nav className="flex flex-col p-4 gap-1">
              {siteLinks.map((link) => {
                const href = localizedHref(link.href, locale);
                const active = pathname === href || pathname === `${href}/`;
                return (
                  <Link key={link.href} href={href} onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm transition-colors ${active ? "bg-surface text-crimson font-medium" : "text-text-muted hover:bg-surface hover:text-text-body"}`}>
                    {loc(link.label, locale)}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/mobile-nav.tsx
git commit -m "feat(i18n): mobile nav uses locale + localizedHref"
```

---

### Task 20: Update `PageContainer` — sticky label from messages

**Files:**
- Modify: `src/components/layout/page-container.tsx`

- [ ] **Step 1: Rewrite**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/lib/i18n";
import { FloatingSticky } from "./floating-sticky";

type StickyKey = "services" | "career" | "projects" | "about" | "contact";

const stickyByRoute: Record<string, { key: StickyKey; rotation: number }> = {
  services: { key: "services", rotation: -0.5 },
  career:   { key: "career",   rotation: 1.5 },
  projects: { key: "projects", rotation: 0.5 },
  about:    { key: "about",    rotation: -1 },
  contact:  { key: "contact",  rotation: -0.5 },
};

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations("sticky");

  // pathname is like "/en/services" or "/sv/career/"
  const segments = pathname.split("/").filter(Boolean);
  const routeKey = segments[1]; // after the locale
  const sticky = routeKey ? stickyByRoute[routeKey] : undefined;

  return (
    <>
      {sticky && (
        <FloatingSticky label={t(sticky.key)} rotation={sticky.rotation} backLabel={t("back")} homeHref={`/${locale}`} />
      )}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-5xl px-4 pt-20 md:pt-24 pb-16 overflow-x-hidden">
        {children}
      </motion.main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/page-container.tsx
git commit -m "feat(i18n): page container uses localized sticky labels"
```

---

### Task 21: Update `FloatingSticky` to accept localized labels + localized home href

**Files:**
- Modify: `src/components/layout/floating-sticky.tsx`

- [ ] **Step 1: Rewrite**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface FloatingStickyProps {
  label: string;
  rotation?: number;
  backLabel: string;
  homeHref: string;
}

export function FloatingSticky({ label, rotation = 3, backLabel, homeHref }: FloatingStickyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: rotation + 15 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ scale: 1.1, rotate: 0 }}
      className="fixed z-40
        top-20 right-4 w-[65px] h-[65px] text-[13px]
        md:top-20 md:right-8 md:w-[75px] md:h-[75px] md:text-sm
        max-[480px]:w-[48px] max-[480px]:h-[48px] max-[480px]:text-[10px] max-[480px]:top-16 max-[480px]:right-2"
    >
      <Link href={homeHref} className="block w-full h-full">
        <div
          className="w-full h-full bg-[#FFD966] text-[#3d3000] border-2 border-white/30 rounded-sm flex flex-col items-center justify-center text-center font-semibold cursor-pointer"
          style={{
            fontFamily: "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive",
            boxShadow: "3px 4px 8px rgba(0,0,0,0.18), 1px 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <span>{label}</span>
          <span className="text-[8px] md:text-[9px] opacity-50 font-sans font-normal mt-0.5">{backLabel}</span>
        </div>
      </Link>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/floating-sticky.tsx
git commit -m "feat(i18n): floating sticky takes localized label and back text"
```

---

### Task 22: Update `EventStormingBoard` (desktop) — locale-aware notes

**Files:**
- Modify: `src/components/eventstorming/board.tsx`

- [ ] **Step 1: Rewrite the note data source**

Replace the hardcoded `notes: StickyNote[]` array with one built from the `board` namespace of the current locale's messages. The geometric layout (`x`, `y`, `rotation`, `size`, `color`) stays as-is; only `text`, `subtext`, and `href` become locale-aware.

Open `src/components/eventstorming/board.tsx`, add these imports at the top:

```tsx
import { useTranslations, useLocale } from "next-intl";
import { localizedHref, type Locale } from "@/lib/i18n";
```

Inside the `EventStormingBoard` component, replace the module-level `notes` array with a locale-bound function and call it from inside the component. Replace every string literal in every `StickyNote` entry with a `t(...)` call. Below is the complete updated `notes` array to paste inside the component (after `const t = useTranslations("board");` and `const tAgg = useTranslations("board.aggregates");`):

```tsx
const locale = useLocale() as Locale;
const t = useTranslations("board");
const tAgg = useTranslations("board.aggregates");

const notes: StickyNote[] = [
  { id: "evt-visit", text: t("websiteVisited"), color: "orange", x: 9, y: 5, rotation: -1.5, size: "sm" },
  { id: "cmd-explore", text: t("exploreServices"), color: "blue", x: 19, y: 4, rotation: 1, size: "sm" },

  { id: "agg-services", text: tAgg("services"), subtext: tAgg("servicesSub"), color: "yellow", x: 31, y: 3, rotation: -0.5, href: localizedHref("/services", locale), size: "lg" },

  { id: "evt-interested", text: t("interestSparked"), color: "orange", x: 44, y: 6, rotation: 2, size: "sm" },
  { id: "cmd-check-bg", text: t("checkBackground"), color: "blue", x: 56, y: 4, rotation: -1, size: "sm" },

  { id: "agg-career", text: tAgg("career"), subtext: tAgg("careerSub"), color: "yellow", x: 68, y: 2, rotation: 1.5, href: localizedHref("/career", locale), size: "lg" },

  { id: "policy-trust", text: t("trustPolicy"), color: "purple", x: 82, y: 5, rotation: -2, size: "sm" },

  { id: "evt-evaluating", text: t("candidateEvaluated"), color: "orange", x: 7, y: 34, rotation: 1, size: "sm" },
  { id: "cmd-review", text: t("reviewCaseStudies"), color: "blue", x: 18, y: 36, rotation: -1.5, size: "sm" },

  { id: "agg-projects", text: tAgg("projects"), subtext: tAgg("projectsSub"), color: "yellow", x: 31, y: 33, rotation: 0.5, href: localizedHref("/projects", locale), size: "lg" },

  { id: "hotspot-1", text: t("doesThisPersonDeliver"), color: "pink", x: 45, y: 37, rotation: -1, size: "sm" },
  { id: "ext-linkedin", text: t("linkedin"), color: "lilac", x: 45, y: 30, rotation: 2, size: "sm" },

  { id: "cmd-who", text: t("learnAboutPerson"), color: "blue", x: 57, y: 35, rotation: 1.5, size: "sm" },

  { id: "agg-about", text: tAgg("about"), subtext: tAgg("aboutSub"), color: "yellow", x: 68, y: 32, rotation: -1, href: localizedHref("/about", locale), size: "lg" },

  { id: "evt-convinced", text: t("decisionMade"), color: "orange", x: 82, y: 35, rotation: 1, size: "sm" },

  { id: "policy-reach", text: t("reachPolicy"), color: "purple", x: 12, y: 60, rotation: -1, size: "sm" },
  { id: "cmd-contact", text: t("sendMessage"), color: "blue", x: 26, y: 62, rotation: 1.5, size: "sm" },

  { id: "agg-contact", text: tAgg("contact"), subtext: tAgg("contactSub"), color: "yellow", x: 41, y: 59, rotation: -0.5, href: localizedHref("/contact", locale), size: "lg" },

  { id: "evt-sent", text: t("messageSent"), color: "orange", x: 56, y: 61, rotation: 2, size: "sm" },
  { id: "evt-hired", text: t("consultantHired"), color: "orange", x: 70, y: 59, rotation: -1, size: "sm" },

  { id: "hotspot-legend", text: t("youAreHere"), color: "pink", x: 84, y: 60, rotation: 0, size: "sm" },
];
```

The `arrows` array below the notes stays unchanged — it references note ids.

The rest of the component (rendering, motion, colorMap) stays as-is.

- [ ] **Step 2: Commit**

```bash
git add src/components/eventstorming/board.tsx
git commit -m "feat(i18n): locale-aware Event Storming board (desktop)"
```

---

### Task 23: Update `MobileEventStormingBoard`

**Files:**
- Modify: `src/components/eventstorming/mobile-board.tsx`

- [ ] **Step 1: Rewrite the `story` array analogously**

Inside the component, add:

```tsx
import { useTranslations, useLocale } from "next-intl";
import { localizedHref, type Locale } from "@/lib/i18n";
```

and replace the module-level `story: StoryStep[]` with one built inside the component:

```tsx
const locale = useLocale() as Locale;
const t = useTranslations("board");
const tAgg = useTranslations("board.aggregates");

const story: StoryStep[] = [
  { id: "1",  text: t("websiteVisited"), color: "orange", rotation: -1.5 },
  { id: "2",  text: t("exploreServices"), color: "blue", rotation: 1 },
  { id: "3",  text: tAgg("services"), subtext: tAgg("servicesSub"), color: "yellow", href: localizedHref("/services", locale), rotation: -0.5 },
  { id: "4",  text: t("interestSparked"), color: "orange", rotation: 2 },
  { id: "5",  text: t("checkBackground"), color: "blue", rotation: -1 },
  { id: "6",  text: tAgg("career"), subtext: tAgg("careerSub"), color: "yellow", href: localizedHref("/career", locale), rotation: 1.5 },
  { id: "7",  text: t("trustPolicy"), color: "purple", rotation: -2 },
  { id: "8",  text: t("reviewCaseStudies"), color: "blue", rotation: 1 },
  { id: "9",  text: tAgg("projects"), subtext: tAgg("projectsSub"), color: "yellow", href: localizedHref("/projects", locale), rotation: -0.5 },
  { id: "10", text: t("doesThisPersonDeliver"), color: "pink", rotation: 1.5 },
  { id: "11", text: t("learnAboutPerson"), color: "blue", rotation: -1 },
  { id: "12", text: tAgg("about"), subtext: tAgg("aboutSub"), color: "yellow", href: localizedHref("/about", locale), rotation: 0.5 },
  { id: "13", text: t("decisionMade"), color: "orange", rotation: -1.5 },
  { id: "14", text: t("reachPolicy"), color: "purple", rotation: 1 },
  { id: "15", text: t("sendMessage"), color: "blue", rotation: -0.5 },
  { id: "16", text: tAgg("contact"), subtext: tAgg("contactSub"), color: "yellow", href: localizedHref("/contact", locale), rotation: 1 },
  { id: "17", text: t("messageSent"), color: "orange", rotation: -1 },
  { id: "18", text: t("consultantHired"), color: "orange", rotation: 2 },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/eventstorming/mobile-board.tsx
git commit -m "feat(i18n): locale-aware Event Storming board (mobile)"
```

---

### Task 24: Update career components

**Files:**
- Modify: `src/components/career/event-stream.tsx`
- Modify: `src/components/career/career-event.tsx`
- Modify: `src/components/career/project-event.tsx`

- [ ] **Step 1: Rewrite `event-stream.tsx`**

```tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
import { careerEvents } from "@/data/career-events";
import type { Locale } from "@/lib/i18n";
import { CareerEvent } from "./career-event";

export function EventStream() {
  const locale = useLocale() as Locale;
  const t = useTranslations("career");
  let firstExpandableFound = false;

  return (
    <div className="rounded-xl border border-border bg-bg p-3 md:p-6 font-mono overflow-x-hidden">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <div className="h-2 w-2 rounded-full bg-amber animate-pulse shrink-0" />
        <span className="text-xs md:text-sm text-text-dim">{t("streamHeader", { count: careerEvents.length })}</span>
      </div>
      <div className="space-y-2">
        {careerEvents.map((event) => {
          const isFirstExpandable = !firstExpandableFound && event.children && event.children.length > 0;
          if (isFirstExpandable) firstExpandableFound = true;
          return <CareerEvent key={event.id} event={event} locale={locale} defaultExpanded={isFirstExpandable} />;
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `career-event.tsx`**

```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CareerEvent as CareerEventType } from "@/lib/types";
import { loc, type Locale } from "@/lib/i18n";
import { ProjectEvent } from "./project-event";

const typeStyles: Record<string, { color: string; border: string; dot: string }> = {
  RoleStarted:        { color: "text-crimson", border: "border-border",   dot: "bg-crimson/20 border-crimson" },
  EducationCompleted: { color: "text-purple",  border: "border-purple/20", dot: "bg-purple/20 border-purple"  },
  CompanyFounded:     { color: "text-gold",    border: "border-gold/20",   dot: "bg-gold/20 border-gold"      },
  SkillAcquired:      { color: "text-amber",   border: "border-amber/20",  dot: "bg-amber/20 border-amber"    },
};

interface CareerEventProps {
  event: CareerEventType;
  locale: Locale;
  defaultExpanded?: boolean;
}

export function CareerEvent({ event, locale, defaultExpanded = false }: CareerEventProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const t = useTranslations("career");
  const style = typeStyles[event.type] ?? typeStyles.RoleStarted;
  const hasChildren = event.children && event.children.length > 0;

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4 }}
      className={`relative border-l-2 ${style.border} pl-5 mb-6`}>
      <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full border-2 ${style.dot}`} />
      <div className={hasChildren ? "cursor-pointer hover:bg-crimson/5 rounded-lg p-2 -m-2 transition-colors" : ""} onClick={() => hasChildren && setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          <p className={`font-mono text-xs md:text-sm font-semibold tracking-wide ${style.color}`}>{event.type}</p>
          {hasChildren && (
            <>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className={style.color} />
              </motion.div>
              {!expanded && (
                <span className="font-mono text-xs text-text-dim">{t("projectsCollapsed", { count: event.children!.length })}</span>
              )}
            </>
          )}
        </div>
        <p className="font-mono text-xs md:text-sm text-text-dim mt-0.5 break-words">
          {event.timestamp}{event.endTimestamp && ` → ${event.endTimestamp}`}{" · "}{event.source}
        </p>
        <div className="font-mono text-xs md:text-sm text-text-muted mt-1 space-y-0.5 break-words">
          {event.payload.role && <p><span className="text-text-dim">{t("fieldRole")}: </span><span className="text-text-body">&quot;{loc(event.payload.role, locale)}&quot;</span></p>}
          {event.payload.domain && <p><span className="text-text-dim">{t("fieldDomain")}: </span><span className="text-text-body">&quot;{loc(event.payload.domain, locale)}&quot;</span></p>}
          {event.payload.tech && <p><span className="text-text-dim">{t("fieldTech")}: </span><span className="text-amber">[{event.payload.tech.map((v) => `"${v}"`).join(", ")}]</span></p>}
          {event.payload.degree && <p><span className="text-text-dim">{t("fieldDegree")}: </span><span className="text-text-body">&quot;{loc(event.payload.degree, locale)}&quot;</span></p>}
          {event.payload.status && <p><span className="text-text-dim">{t("fieldStatus")}: </span><span className="text-sage">&quot;{event.payload.status}&quot;</span></p>}
        </div>
      </div>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-2 border-t border-dashed border-border">
            {event.children!.map((child) => <ProjectEvent key={child.id} event={child} locale={locale} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 3: Rewrite `project-event.tsx`**

```tsx
"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CareerEvent } from "@/lib/types";
import { loc, type Locale } from "@/lib/i18n";

interface ProjectEventProps { event: CareerEvent; locale: Locale; }

export function ProjectEvent({ event, locale }: ProjectEventProps) {
  const t = useTranslations("career");
  const color = event.type === "ProjectInProgress" ? "text-amber" : "text-sage";
  const borderColor = event.type === "ProjectInProgress" ? "border-amber/30" : "border-sage/30";
  const dotBg = event.type === "ProjectInProgress" ? "bg-amber/20 border-amber" : "bg-sage/20 border-sage";

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
      className={`relative border-l border-dashed ${borderColor} pl-5 mb-3`}>
      <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full border-2 ${dotBg}`} />
      <p className={`font-mono text-xs md:text-sm font-semibold tracking-wide ${color}`}>{event.type}</p>
      <p className="font-mono text-xs md:text-sm text-text-dim">{event.source}</p>
      <p className="font-mono text-xs md:text-sm text-text-muted mt-0.5 break-words">
        <span className="text-text-dim">{t("fieldScope")}: </span>
        <span className="text-text-body">&quot;{event.payload.scope ? loc(event.payload.scope, locale) : ""}&quot;</span>
      </p>
    </motion.div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/career
git commit -m "feat(i18n): career components render localized payload fields"
```

---

### Task 25: Build `LanguageToggle` component

**Files:**
- Create: `src/components/layout/language-toggle.tsx`

- [ ] **Step 1: Write**

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, swapLocaleInPath, type Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale() as Locale;
  const t = useTranslations("header");
  const other: Locale = current === "en" ? "sv" : "en";

  function toggle() {
    try {
      localStorage.setItem("locale", other);
    } catch {
      // localStorage unavailable — proceed anyway
    }
    const nextPath = swapLocaleInPath(pathname, other);
    router.replace(nextPath);
  }

  return (
    <button
      onClick={toggle}
      aria-label={t("toggleLanguage")}
      className="px-2 py-1 rounded-md border border-border text-xs font-mono font-medium text-text-muted hover:text-text-body hover:bg-surface transition-colors uppercase"
    >
      {LOCALES.filter((l) => l !== current).map((l) => l).join("")}
    </button>
  );
}
```

The rendered label shows the *other* locale code (e.g. `SV` while on `/en/*`, `EN` while on `/sv/*`).

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: passes (the `Header` imported it already in Task 18).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/language-toggle.tsx
git commit -m "feat(i18n): add LanguageToggle button"
```

---

### Task 26: Update `ProjectCard` for localized project fields

**Files:**
- Modify: `src/components/projects/project-card.tsx`

- [ ] **Step 1: Rewrite**

```tsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@/lib/types";
import { loc, type Locale } from "@/lib/i18n";
import { companyLogos } from "@/data/logos";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("project");
  const logoSrc = companyLogos[project.client];
  const logoHeight = logoSrc?.endsWith(".png") ? "h-6" : "h-4";

  const sections: { key: "challenge" | "approach" | "result"; label: string }[] = [
    { key: "challenge", label: t("sectionChallenge") },
    { key: "approach",  label: t("sectionApproach") },
    { key: "result",    label: t("sectionResult") },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2, borderColor: "#a31f2e" }}
      className="rounded-xl border border-border bg-surface p-4 md:p-6 transition-shadow hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)]">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-text-primary text-sm md:text-base">{loc(project.title, locale)}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            {logoSrc && (
              <Image src={logoSrc} alt={project.client} width={80} height={20}
                className={`w-auto opacity-60 dark:opacity-90 dark:invert shrink-0 ${logoHeight}`} />
            )}
            <p className="text-sm md:text-base text-crimson">{project.client}</p>
          </div>
        </div>
        <span className="rounded-md border border-border bg-bg px-2 py-0.5 text-xs md:text-sm text-text-dim shrink-0">{loc(project.domain, locale)}</span>
      </div>
      <div className="space-y-3 text-sm md:text-base">
        {sections.map(({ key, label }, i) => (
          <motion.div key={key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 + (i + 1) * 0.1 }}>
            <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-text-dim mb-1">{label}</p>
            <p className="text-text-muted">{loc(project[key], locale)}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((v, i) => (
          <motion.span key={v} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.2, delay: index * 0.1 + 0.4 + i * 0.05 }}
            className="rounded border border-crimson/20 bg-crimson/5 px-2 py-0.5 font-mono text-xs md:text-sm text-amber">{v}</motion.span>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/projects/project-card.tsx
git commit -m "feat(i18n): ProjectCard uses localized fields"
```

---

### Task 27: Update `ServiceCard` for localized service fields

**Files:**
- Modify: `src/components/services/service-card.tsx`

- [ ] **Step 1: Rewrite**

```tsx
"use client";
import { motion } from "framer-motion";
import { Cpu, Code, Cloud, MessageSquare } from "lucide-react";
import { useLocale } from "next-intl";
import type { Service } from "@/lib/types";
import { loc, type Locale } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = { Cpu, Code, Cloud, MessageSquare };

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const locale = useLocale() as Locale;
  const Icon = iconMap[service.icon] ?? Cpu;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2, borderColor: "#a31f2e" }}
      className="rounded-xl border border-border bg-bg p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10">
        <Icon size={20} className="text-crimson" />
      </div>
      <h3 className="text-sm md:text-base font-semibold text-text-body mb-1">{loc(service.title, locale)}</h3>
      <p className="text-sm md:text-base leading-relaxed text-text-dim">{loc(service.description, locale)}</p>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/services/service-card.tsx
git commit -m "feat(i18n): ServiceCard uses localized fields"
```

---

### Task 28: Update `About` page + `ContactInfo` + experience list

**Files:**
- Modify: `src/app/[locale]/about/page.tsx`
- Modify: `src/components/contact/contact-info.tsx`
- Modify: `src/components/about/skill-tags.tsx` (no change needed — skills are not localized; skip)

- [ ] **Step 1: Rewrite `src/app/[locale]/about/page.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SkillTags } from "@/components/about/skill-tags";
import { ExperienceItem } from "@/components/about/experience-item";
import { DownloadCvButton } from "@/components/cv/download-cv-button";
import { languages } from "@/data/languages";
import { loc, localizedHref, type Locale } from "@/lib/i18n";

interface ExperienceEntry {
  title: string;
  company: string;
  dates: string;
  description?: string;
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: "about" });
  const tPage = await getTranslations({ locale, namespace: "pages.about" });
  const paragraphs = t.raw("paragraphs") as string[];
  const experience = (await getTranslations({ locale, namespace: "experience" })).raw("") as ExperienceEntry[] ?? [];
  const education = (await getTranslations({ locale, namespace: "education" })).raw("") as ExperienceEntry[] ?? [];

  // next-intl's t.raw("") on an array namespace returns the array; if the version requires a key,
  // use getMessages() below instead — see the fallback note.

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <Image
          src="/michael.jpg"
          alt="Michael Hultman"
          width={160}
          height={160}
          className="rounded-xl border border-border object-cover w-28 h-28 md:w-40 md:h-40 shrink-0"
        />
        <div>
          <SectionHeading label={tPage("label")} title={tPage("title")} description={tPage("description")} />
          <div className="text-sm md:text-base text-text-muted max-w-2xl space-y-3">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3">{t("expertise")}</p>
        <SkillTags />
      </div>
      <div className="flex flex-wrap gap-3 mb-0">
        <Link href={localizedHref("/career", typedLocale)} className="mb-8 inline-block rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-crimson hover:bg-crimson/20 transition-colors">
          {t("viewCareerStream")}
        </Link>
        <DownloadCvButton />
        <DownloadCvButton variant="broker" />
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">{t("experienceHeading")}</p>
        {experience.map((e, i) => (
          <ExperienceItem key={i} title={e.title} company={e.company} dates={e.dates} description={e.description ?? ""} />
        ))}
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">{t("educationHeading")}</p>
        {education.map((e, i) => (
          <ExperienceItem key={i} title={e.title} company={e.company} dates={e.dates} description={e.description ?? ""} />
        ))}
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">{t("languagesHeading")}</p>
        <div className="flex flex-wrap gap-3 md:gap-4 text-sm md:text-base text-text-muted">
          {languages.map((lang) => (
            <span key={lang.name.en}>{loc(lang.name, typedLocale)} <span className="text-text-dim">({loc(lang.level, typedLocale)})</span></span>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
```

**Fallback for the `experience`/`education` array lookup:** if `getTranslations({ namespace: "experience" }).raw("")` does not return the array (the key argument may be required in your `next-intl` version), replace those two lines with:

```ts
import { getMessages } from "next-intl/server";
// ...
const messages = await getMessages();
const experience = (messages as { experience?: ExperienceEntry[] }).experience ?? [];
const education = (messages as { education?: ExperienceEntry[] }).education ?? [];
```

Pick whichever works with the installed `next-intl` version.

- [ ] **Step 2: Rewrite `src/components/contact/contact-info.tsx`**

```tsx
"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { contactInfo } from "@/data/site-config";
import { loc, type Locale } from "@/lib/i18n";

function LinkedinIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export function ContactInfo() {
  const locale = useLocale() as Locale;
  const t = useTranslations("contact.labels");
  const tContact = useTranslations("contact");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><Mail size={16} className="text-crimson" /></div>
        <div><p className="text-sm font-medium text-text-body">{t("email")}</p><p className="text-base text-text-muted">{contactInfo.email}</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><Phone size={16} className="text-crimson" /></div>
        <div><p className="text-sm font-medium text-text-body">{t("phone")}</p><p className="text-base text-text-muted">{contactInfo.phone}</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><MapPin size={16} className="text-crimson" /></div>
        <div><p className="text-sm font-medium text-text-body">{t("location")}</p><p className="text-base text-text-muted">{loc(contactInfo.location, locale)}</p></div>
      </div>
      <a href="https://www.linkedin.com/in/michael-hultman-28545741/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><LinkedinIcon size={16} className="text-crimson" /></div>
        <div><p className="text-sm font-medium text-text-body">{t("linkedin")}</p><p className="text-base text-text-muted group-hover:text-crimson transition-colors">{tContact("linkedinName")}</p></div>
      </a>
      <div className="mt-6 border-t border-border pt-4"><p className="text-base text-text-dim">{loc(contactInfo.availability, locale)}</p></div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/about src/components/contact/contact-info.tsx
git commit -m "feat(i18n): localize About page and ContactInfo"
```

---

### Task 29: Update `ContactForm` and remaining simple pages

**Files:**
- Modify: `src/components/contact/contact-form.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/app/[locale]/services/page.tsx`
- Modify: `src/app/[locale]/projects/page.tsx`
- Modify: `src/app/[locale]/career/page.tsx`
- Modify: `src/app/[locale]/page.tsx` (home)

- [ ] **Step 1: Rewrite `contact-form.tsx` — schema reads locale via a factory**

Zod error messages must resolve at schema-build time. Build the schema inside the component from translated strings:

```tsx
"use client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contactForm");
  const tErr = useTranslations("contactForm.errors");

  const schema = useMemo(() => z.object({
    name: z.string().min(1, tErr("nameRequired")),
    email: z.string().email(tErr("emailInvalid")),
    subject: z.string().optional(),
    message: z.string().min(10, tErr("messageMin")),
  }), [tErr]);

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    const subject = encodeURIComponent(data.subject || t("defaultSubject"));
    const body = encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`);
    window.location.href = `mailto:michael@devbit.se?subject=${subject}&body=${body}`;
  }

  const inputClass = "w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-body placeholder:text-text-dim focus:border-crimson focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div><input {...register("name")} placeholder={t("namePlaceholder")} className={inputClass} />{errors.name && <p className="mt-1 text-sm text-crimson">{errors.name.message}</p>}</div>
      <div><input {...register("email")} placeholder={t("emailPlaceholder")} className={inputClass} />{errors.email && <p className="mt-1 text-sm text-crimson">{errors.email.message}</p>}</div>
      <div><input {...register("subject")} placeholder={t("subjectPlaceholder")} className={inputClass} /></div>
      <div><textarea {...register("message")} placeholder={t("messagePlaceholder")} rows={5} className={`${inputClass} resize-vertical`} />{errors.message && <p className="mt-1 text-sm text-crimson">{errors.message.message}</p>}</div>
      <button type="submit" className="rounded-lg bg-crimson px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-crimson-hover">
        {t("submit")}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/[locale]/contact/page.tsx`**

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.contact" });

  return (
    <PageContainer>
      <SectionHeading label={t("label")} title={t("title")} description={t("description")} />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 3: Rewrite `src/app/[locale]/services/page.tsx`**

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { services } from "@/data/services";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.services" });

  return (
    <PageContainer>
      <SectionHeading label={t("label")} title={t("title")} description={t("description")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((service, i) => <ServiceCard key={service.id} service={service} index={i} />)}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 4: Rewrite `src/app/[locale]/projects/page.tsx`**

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/projects";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.projects" });

  return (
    <PageContainer>
      <SectionHeading label={t("label")} title={t("title")} description={t("description")} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {projects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 5: Rewrite `src/app/[locale]/career/page.tsx`**

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventStream } from "@/components/career/event-stream";

export default async function CareerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.career" });

  return (
    <PageContainer>
      <SectionHeading label={t("label")} title={t("title")} description={t("description")} />
      <EventStream />
    </PageContainer>
  );
}
```

- [ ] **Step 6: Rewrite `src/app/[locale]/page.tsx` (home)**

```tsx
import { setRequestLocale } from "next-intl/server";
import { EventStormingBoard } from "@/components/eventstorming/board";
import { MobileEventStormingBoard } from "@/components/eventstorming/mobile-board";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="hidden md:block">
        <EventStormingBoard />
      </div>
      <div className="md:hidden">
        <MobileEventStormingBoard />
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Type check**

Run: `npx tsc --noEmit`
Expected: passes. If there's an error about `getTranslations` missing `setRequestLocale`, the order matters — `setRequestLocale` before `getTranslations`.

- [ ] **Step 8: Commit**

```bash
git add src/components/contact/contact-form.tsx src/app/[locale]
git commit -m "feat(i18n): localize all [locale] pages and contact form"
```

---

## Phase 6 — CV PDF localization

### Task 30: Update `CvDocument` to accept a `labels` prop

**Files:**
- Modify: `src/components/cv/cv-document.tsx`

- [ ] **Step 1: Define a `CvLabels` interface**

Open `src/components/cv/cv-document.tsx`. Near the top of the file, just after the `Font.register` block and before the styles, add:

```tsx
export interface CvLabels {
  contact: string;
  profileSummary: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  consultingVia: (company: string) => string; // e.g. "via Devbit Consulting AB"
  present: string;
}
```

Update the `CvDocumentProps` interface (replace the current one) to:

```tsx
interface CvDocumentProps {
  data: CvData;
  labels: CvLabels;
  omitContact?: boolean;
}
```

Import `CvData` explicitly:

```tsx
import type { CvData } from "@/data/cv-data";
```

- [ ] **Step 2: Replace every hard-coded English label inside the `<Text>`/`<View>` tree**

Scan the file for every literal English string (section headings, the `"via ..."` consulting hint, `"Present"` in `fmtDates`, etc.) and replace with `labels.*`.

Specifically:
- Section heading texts: `labels.contact`, `labels.profileSummary`, `labels.experience`, `labels.education`, `labels.skills`, `labels.languages`.
- The consulting via hint (if present in the current implementation as `via {company}`): `labels.consultingVia(entry.via)`.
- The `fmtDates` function's `"Present"` fallback: pass `labels.present` down, e.g. change `function fmtDates(start: string, end?: string): string` to `function fmtDates(start: string, end: string | undefined, presentLabel: string): string` and use `presentLabel` where `"Present"` appears. Update every call site in the same file.
- The summary paragraph text (currently a hard-coded English blurb about 20+ years): use `labels.summary`.

- [ ] **Step 3: Update the default export signature**

Change:
```tsx
export function CvDocument({ data, omitContact = false }: CvDocumentProps) {
```
to:
```tsx
export function CvDocument({ data, labels, omitContact = false }: CvDocumentProps) {
```

- [ ] **Step 4: Type check**

Run: `npx tsc --noEmit`
Expected: `DownloadCvButton` errors because it passes no `labels`. Next task fixes it.

- [ ] **Step 5: Commit**

```bash
git add src/components/cv/cv-document.tsx
git commit -m "feat(i18n): CvDocument renders from injected labels"
```

---

### Task 31: Update `DownloadCvButton` to pass locale + labels + filename

**Files:**
- Modify: `src/components/cv/download-cv-button.tsx`

- [ ] **Step 1: Rewrite**

```tsx
"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/lib/i18n";

interface DownloadCvButtonProps {
  variant?: "full" | "broker";
}

export function DownloadCvButton({ variant = "full" }: DownloadCvButtonProps) {
  const [loading, setLoading] = useState(false);
  const locale = useLocale() as Locale;
  const tAbout = useTranslations("about");
  const tCv = useTranslations("cv");
  const isBroker = variant === "broker";

  async function handleDownload() {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CvDocument } = await import("./cv-document");
      const { buildCvData } = await import("@/data/cv-data");

      const data = buildCvData(locale);
      const labels = {
        contact: tCv("contact"),
        profileSummary: tCv("profileSummary"),
        summary: tCv("summary"),
        experience: tCv("experience"),
        education: tCv("education"),
        skills: tCv("skills"),
        languages: tCv("languages"),
        consultingVia: (company: string) => tCv("consultingVia", { company }),
        present: tCv("present"),
      };

      const blob = await pdf(
        <CvDocument data={data} labels={labels} omitContact={isBroker} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = isBroker
        ? `michael-hultman-cv-broker-${locale}.pdf`
        : `michael-hultman-cv-${locale}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const label = isBroker ? tAbout("downloadCvBroker") : tAbout("downloadCv");

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="mb-8 inline-flex items-center gap-2 rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-crimson hover:bg-crimson/20 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {loading ? tAbout("downloadGenerating") : label}
    </button>
  );
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/cv/download-cv-button.tsx
git commit -m "feat(i18n): DownloadCvButton passes locale, labels, and filename suffix"
```

---

## Phase 7 — Metadata, hreflang, JSON-LD

### Task 32: Per-page `generateMetadata` with `hreflang` alternates

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: each `src/app/[locale]/*/page.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Add `generateMetadata` to the locale layout for defaults**

Inside `src/app/[locale]/layout.tsx`, replace the `metadata` export with:

```tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return {
    metadataBase: new URL("https://devbit.se"),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://devbit.se/${locale}`,
      languages: { en: "/en", sv: "/sv" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://devbit.se/${locale}`,
      siteName: "Devbit Consulting",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Devbit Consulting — Michael Hultman" }],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description"), images: ["/og-image.png"] },
  };
}
```

Delete the old `export const metadata = ...` from the same file.

- [ ] **Step 2: Add `generateMetadata` per sub-page**

For each of `services`, `career`, `projects`, `about`, `contact` pages, add:

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.career" }); // ← change namespace per page
  const path = "/career"; // ← change per page: /services, /career, /projects, /about, /contact
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://devbit.se/${locale}${path}`,
      languages: { en: `/en${path}`, sv: `/sv${path}` },
    },
  };
}
```

Apply this shape to each of:
- `services/page.tsx` → namespace `meta.services`, path `/services`
- `career/page.tsx` → namespace `meta.career`, path `/career`
- `projects/page.tsx` → namespace `meta.projects`, path `/projects`
- `about/page.tsx` → namespace `meta.about`, path `/about`
- `contact/page.tsx` → namespace `meta.contact`, path `/contact`

Delete the old `export const metadata = {...}` from each. The locale-layout default covers the home page (`meta.home`), so `[locale]/page.tsx` does not need its own `generateMetadata` unless you want to override; if you do, use namespace `meta.home` and path `""`.

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]
git commit -m "feat(i18n): per-page localized metadata with hreflang alternates"
```

---

## Phase 8 — Final validation

### Task 33: Build + lint + manual smoke

- [ ] **Step 1: Type check the whole project**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: zero errors. Warnings that existed before the refactor can stay; new ones should be fixed.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build completes. Verify the output tree:

```bash
ls out/en out/sv
ls out/en/about out/sv/about out/en/career out/sv/career out/en/contact out/sv/contact out/en/projects out/sv/projects out/en/services out/sv/services
ls out/index.html out/404.html 2>/dev/null || echo "check"
```

Every locale folder must contain `about/index.html`, `career/index.html`, `contact/index.html`, `projects/index.html`, `services/index.html`, plus an `index.html` for the locale home. The root `out/index.html` (the redirect shim) must exist.

- [ ] **Step 4: Manual browser smoke test**

Start: `npm run dev`

Check each of these in the browser (both locales):
- `http://localhost:3000/` — Swedish browser redirects to `/sv/`, others to `/en/`. Verify by changing browser language.
- `http://localhost:3000/career` (no prefix) — redirects to `/en/career/` or `/sv/career/`.
- `http://localhost:3000/en/` and `http://localhost:3000/sv/` — Event Storming board renders in the right language; sticky notes translated; architectural terms stay English; clicking a yellow aggregate navigates to the correct locale-prefixed page.
- Header language toggle — clicking swaps locale in URL and keeps the same sub-page; `localStorage.locale` updates.
- Dark-mode toggle still works in both locales (regression check).
- `/en/career/` and `/sv/career/` — career stream renders with localized scope/role/domain text.
- `/en/projects/` and `/sv/projects/` — project cards show localized sections.
- `/en/services/` and `/sv/services/` — service cards localized.
- `/en/contact/` and `/sv/contact/` — contact form placeholders, validation errors, and submit button translate; `mailto:` includes a translated default subject.
- `/en/about/` and `/sv/about/` — paragraphs, experience list, education list, language labels localized. "Download CV" button renders in current locale.
- Click "Download CV" on `/sv/about/` — downloads `michael-hultman-cv-sv.pdf`; section headings in PDF are Swedish; role/scope strings are Swedish.
- Click "Download CV (Broker)" on `/sv/about/` — downloads `michael-hultman-cv-broker-sv.pdf`, same Swedish content, contact section omitted.
- View page source on `/en/career/` — check for `<link rel="alternate" hreflang="sv" href="/sv/career">` and `<link rel="alternate" hreflang="en" href="/en/career">`.

Ctrl-C to stop.

- [ ] **Step 5: Fix issues found during smoke**

Any bug discovered gets a small, targeted fix + its own commit. Do not roll large fixes into a single "fix everything" commit.

- [ ] **Step 6: Final commit if any fixes were made**

```bash
git status
git commit -am "fix(i18n): smoke-test fixes"
```

---

## Self-Review Checklist (done before handing the plan off)

**1. Spec coverage:**
- [x] URL-prefixed routes (`/sv/…`, `/en/…`) — Tasks 4–6.
- [x] `next-intl` library — Task 1.
- [x] Hybrid string model (UI messages + inline localized data) — Tasks 9–17.
- [x] Root redirect shim with `localStorage` + `navigator.language`, English default — Task 7.
- [x] Deep-link recovery — Task 7.
- [x] Language toggle next to theme toggle, persists choice — Tasks 25 + 18/19.
- [x] CV PDF follows site locale; locale-suffixed filename — Tasks 30–31.
- [x] Localized metadata + `hreflang` alternates — Task 32.
- [x] `<html lang={locale}>` correctly placed — Tasks 4 + 5.
- [x] Localized JSON-LD — Task 4.
- [x] Architectural terms (Domain Event, Aggregate, Command, Policy, Event Sourcing, CQRS, type enum values) stay English — preserved in all data tasks.
- [x] Trailing slash + static export — Task 1.

**2. Placeholder scan:** no "TBD"/"TODO"/"similar to Task N" left; every code change shows actual code.

**3. Type consistency:** `Locale`, `LocalizedString`, `loc`, `localizedHref`, `swapLocaleInPath`, `detectBrowserLocale`, `isLocale`, `buildCvData`, `CvData`, `CvLabels`, `LanguageEntry` — all defined once, referenced consistently downstream.

**4. Ambiguity check:** the only judgment call left is the `next-intl` array-lookup API shape (Task 28, Step 1 — `t.raw("")` vs `getMessages()`), which is called out with an explicit fallback.
