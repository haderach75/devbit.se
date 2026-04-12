# SEO Improvements: Google Discoverability

## Summary

Make the Devbit Consulting site discoverable on Google by enriching metadata with targeted keywords, adding robots.txt, OG image for social sharing, Twitter card metadata, and sitemap improvements. Targets both Swedish brokers and international clients, all in English.

## Current State

- Root layout has basic metadata and OG tags (title, description, URL, siteName, locale)
- JSON-LD structured data exists (Person + Organization schemas)
- Static `sitemap.xml` exists with 6 URLs (no `lastmod` dates)
- Per-page metadata has titles and descriptions but not keyword-optimized
- **Missing:** robots.txt, OG image, Twitter cards, `metadataBase`, canonical URLs

## Target Keywords

**Primary (broker/client searches):**
- freelance system architect, senior backend developer, C# consultant, .NET consultant
- Go developer consultant, distributed systems architect

**Technical differentiators:**
- DDD CQRS Event Sourcing, microservices architect, Kubernetes cloud architect
- Orleans, gRPC, GraphQL

**Domain experience:**
- fintech developer, IoT cloud backend, datacenter automation

**Long-tail:**
- freelance system architect Sweden, senior Go developer Europe remote

## Design

### 1. robots.txt

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://devbit.se/sitemap.xml
```

### 2. Root Layout Metadata (`src/app/layout.tsx`)

Update the `metadata` export:

- Add `metadataBase: new URL("https://devbit.se")` — resolves relative OG image paths
- Enrich `description` with keywords: add "Freelance", "Go", "DDD, CQRS, Event Sourcing", "Azure, AWS, Kubernetes"
- Add `alternates.canonical: "https://devbit.se"`
- Add `openGraph.images` pointing to `/og-image.png` (1200x630)
- Add `twitter` metadata block with `summary_large_image` card type

Full description:
> "Freelance System Architect and Senior Developer specializing in distributed systems, C#/.NET, Go, DDD, CQRS, Event Sourcing, and cloud infrastructure (Azure, AWS, Kubernetes). Available for consulting in Sweden and remote internationally."

### 3. Per-Page Metadata

All descriptions in English only. Each page gets `alternates.canonical` pointing to its URL.

**Services** (`src/app/services/page.tsx`):
> "System architecture, backend development, and cloud consulting services. C#/.NET, Go, Azure, AWS, Kubernetes, DDD, CQRS, Event Sourcing. Available for freelance consulting."

**Career** (`src/app/career/page.tsx`):
> "Career timeline of Michael Hultman — 20+ years in software development, from automotive diagnostics to fintech and cloud infrastructure consulting."

**Projects** (`src/app/projects/page.tsx`):
> "Consulting case studies: Volvo Energy IoT cloud, Stena Line booking modernization, Worldstream datacenter automation, Collector Bank fintech platform."

**About** (`src/app/about/page.tsx`):
> "Michael Hultman — Freelance System Architect and Senior Developer. 20+ years experience in distributed systems, C#/.NET, Go, and cloud infrastructure. Based in Vänersborg, Sweden."

**Contact** (`src/app/contact/page.tsx`):
> "Hire a freelance system architect and senior developer. Contact Michael Hultman at Devbit Consulting for consulting in distributed systems, C#, Go, and cloud."

### 4. OG Image

Generate a static `public/og-image.png` (1200x630px) matching the site's design:
- Background: `#faf7f3` (site surface color)
- Crimson accent elements
- Content: "Devbit Consulting", "Michael Hultman", "System Architect & Senior Developer"
- Inter font family
- Rendered via browser and saved as static PNG

### 5. Sitemap Enhancement

Update `public/sitemap.xml`:
- Add `<lastmod>2026-04-12</lastmod>` to all URL entries

## Files Changed

| File | Change |
|------|--------|
| `public/robots.txt` | Create — crawler rules + sitemap pointer |
| `src/app/layout.tsx` | Modify — metadataBase, enriched description, OG image, Twitter card, canonical |
| `src/app/services/page.tsx` | Modify — keyword-rich description |
| `src/app/career/page.tsx` | Modify — keyword-rich description |
| `src/app/projects/page.tsx` | Modify — keyword-rich description |
| `src/app/about/page.tsx` | Modify — keyword-rich description |
| `src/app/contact/page.tsx` | Modify — keyword-rich description |
| `public/og-image.png` | Create — static OG image for social sharing |
| `public/sitemap.xml` | Modify — add lastmod dates |

## Out of Scope

- No Swedish translations or bilingual content
- No dynamic sitemap generation (static is sufficient)
- No new npm dependencies
- No structural page changes
- No Google Search Console submission (manual step after deploy)
