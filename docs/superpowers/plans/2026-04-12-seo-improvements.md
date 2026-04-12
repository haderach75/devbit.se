# SEO Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Devbit Consulting site discoverable on Google with keyword-rich metadata, robots.txt, OG image, and Twitter cards.

**Architecture:** All changes are metadata/config — no structural page changes. Root layout gets enriched metadata (metadataBase, OG image, Twitter cards). Each page gets a keyword-optimized description. A static OG image is generated via browser rendering. robots.txt and sitemap get standard improvements.

**Tech Stack:** Next.js Metadata API, static files (robots.txt, OG image, sitemap.xml)

---

### Task 1: Create robots.txt

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Create the file**

Create `public/robots.txt` with this content:

```
User-agent: *
Allow: /

Sitemap: https://devbit.se/sitemap.xml
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, `out/robots.txt` exists in the static export.

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat: add robots.txt for search engine crawling"
```

---

### Task 2: Enrich root layout metadata

**Files:**
- Modify: `src/app/layout.tsx:6-19`

- [ ] **Step 1: Update the metadata export**

In `src/app/layout.tsx`, replace the existing `metadata` export (lines 6-19):

```typescript
export const metadata: Metadata = {
  title: "Devbit Consulting | Michael Hultman — System Architect & Senior Developer",
  description:
    "System Architect and Senior Developer specializing in distributed systems, C#/.NET, cloud infrastructure, and clean architecture. Available for consulting.",
  openGraph: {
    title: "Devbit Consulting | Michael Hultman",
    description:
      "System Architect and Senior Developer. Distributed systems, C#/.NET, cloud, DDD/CQRS.",
    url: "https://devbit.se",
    siteName: "Devbit Consulting",
    locale: "en_US",
    type: "website",
  },
};
```

With this enriched version:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://devbit.se"),
  title: "Devbit Consulting | Michael Hultman — System Architect & Senior Developer",
  description:
    "Freelance System Architect and Senior Developer specializing in distributed systems, C#/.NET, Go, DDD, CQRS, Event Sourcing, and cloud infrastructure (Azure, AWS, Kubernetes). Available for consulting in Sweden and remote internationally.",
  alternates: {
    canonical: "https://devbit.se",
  },
  openGraph: {
    title: "Devbit Consulting | Michael Hultman",
    description:
      "Freelance System Architect & Senior Developer. Distributed systems, C#/.NET, Go, cloud, DDD/CQRS. Available for consulting.",
    url: "https://devbit.se",
    siteName: "Devbit Consulting",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Devbit Consulting — Michael Hultman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devbit Consulting | Michael Hultman",
    description:
      "Freelance System Architect & Senior Developer. Distributed systems, C#/.NET, Go, cloud.",
    images: ["/og-image.png"],
  },
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds. Check the output HTML has the new meta tags:

```bash
grep -E "og:image|twitter:card|canonical" out/index.html
```

Expected: Lines containing `og:image` with `/og-image.png`, `twitter:card` with `summary_large_image`, and a `canonical` link.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: enrich root metadata with OG image, Twitter cards, and keywords"
```

---

### Task 3: Update per-page metadata

**Files:**
- Modify: `src/app/services/page.tsx:7-10`
- Modify: `src/app/career/page.tsx:6-9`
- Modify: `src/app/projects/page.tsx:7-10`
- Modify: `src/app/about/page.tsx:11-14`
- Modify: `src/app/contact/page.tsx:7-10`

- [ ] **Step 1: Update services page metadata**

In `src/app/services/page.tsx`, replace the metadata export:

```typescript
export const metadata: Metadata = {
  title: "Services — Devbit Consulting | Michael Hultman",
  description: "System architecture, senior C#/.NET development, cloud & DevOps, and technical consulting services.",
};
```

With:

```typescript
export const metadata: Metadata = {
  title: "Services — Devbit Consulting | Michael Hultman",
  description:
    "System architecture, backend development, and cloud consulting services. C#/.NET, Go, Azure, AWS, Kubernetes, DDD, CQRS, Event Sourcing. Available for freelance consulting.",
  alternates: { canonical: "https://devbit.se/services" },
};
```

- [ ] **Step 2: Update career page metadata**

In `src/app/career/page.tsx`, replace the metadata export:

```typescript
export const metadata: Metadata = {
  title: "Career Stream — Devbit Consulting | Michael Hultman",
  description: "20+ years of software engineering experience as an event-sourced timeline. System architecture, distributed systems, cloud development.",
};
```

With:

```typescript
export const metadata: Metadata = {
  title: "Career Stream — Devbit Consulting | Michael Hultman",
  description:
    "Career timeline of Michael Hultman — 20+ years in software development, from automotive diagnostics to fintech and cloud infrastructure consulting.",
  alternates: { canonical: "https://devbit.se/career" },
};
```

- [ ] **Step 3: Update projects page metadata**

In `src/app/projects/page.tsx`, replace the metadata export:

```typescript
export const metadata: Metadata = {
  title: "Projects — Devbit Consulting | Michael Hultman",
  description: "Featured case studies: IoT cloud platforms, banking modernization, booking systems, and network automation.",
};
```

With:

```typescript
export const metadata: Metadata = {
  title: "Projects — Devbit Consulting | Michael Hultman",
  description:
    "Consulting case studies: Volvo Energy IoT cloud, Stena Line booking modernization, Worldstream datacenter automation, Collector Bank fintech platform.",
  alternates: { canonical: "https://devbit.se/projects" },
};
```

- [ ] **Step 4: Update about page metadata**

In `src/app/about/page.tsx`, replace the metadata export:

```typescript
export const metadata: Metadata = {
  title: "About — Devbit Consulting | Michael Hultman",
  description: "Michael Hultman — System Architect and Senior Developer with 20+ years of experience in distributed systems, C#/.NET, and cloud infrastructure.",
};
```

With:

```typescript
export const metadata: Metadata = {
  title: "About — Devbit Consulting | Michael Hultman",
  description:
    "Michael Hultman — Freelance System Architect and Senior Developer. 20+ years experience in distributed systems, C#/.NET, Go, and cloud infrastructure. Based in Vänersborg, Sweden.",
  alternates: { canonical: "https://devbit.se/about" },
};
```

- [ ] **Step 5: Update contact page metadata**

In `src/app/contact/page.tsx`, replace the metadata export:

```typescript
export const metadata: Metadata = {
  title: "Contact — Devbit Consulting | Michael Hultman",
  description: "Get in touch with Michael Hultman at Devbit Consulting. Available for system architecture and senior development contracts.",
};
```

With:

```typescript
export const metadata: Metadata = {
  title: "Contact — Devbit Consulting | Michael Hultman",
  description:
    "Hire a freelance system architect and senior developer. Contact Michael Hultman at Devbit Consulting for consulting in distributed systems, C#, Go, and cloud.",
  alternates: { canonical: "https://devbit.se/contact" },
};
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds, all 11 static pages generated.

- [ ] **Step 7: Commit**

```bash
git add src/app/services/page.tsx src/app/career/page.tsx src/app/projects/page.tsx src/app/about/page.tsx src/app/contact/page.tsx
git commit -m "feat: add keyword-rich descriptions and canonical URLs to all pages"
```

---

### Task 4: Generate OG image

**Files:**
- Create: `public/og-image.png`

- [ ] **Step 1: Start the dev server if not running**

Run: `npm run dev` (skip if already running on port 3000)

- [ ] **Step 2: Create a temporary HTML page for the OG image**

Create a temporary file at `public/og-temp.html` with this content:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      font-family: 'Inter', sans-serif;
      background: #faf7f3;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .card {
      text-align: center;
      padding: 60px;
    }
    .logo-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 32px;
    }
    .logo-icon {
      width: 48px;
      height: 48px;
    }
    .logo-text {
      font-size: 28px;
      font-weight: 700;
      color: #a31f2e;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .logo-sub {
      font-size: 14px;
      font-weight: 400;
      color: #8a7e72;
      letter-spacing: 3px;
      text-transform: lowercase;
      margin-left: 4px;
    }
    .name {
      font-size: 52px;
      font-weight: 700;
      color: #3d3530;
      margin-bottom: 16px;
      line-height: 1.1;
    }
    .title {
      font-size: 24px;
      color: #8a7e72;
      margin-bottom: 40px;
    }
    .divider {
      width: 80px;
      height: 3px;
      background: #a31f2e;
      margin: 0 auto 40px;
      border-radius: 2px;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }
    .pill {
      background: #f0eae2;
      border: 1px solid #ddd5cb;
      border-radius: 6px;
      padding: 6px 16px;
      font-size: 15px;
      color: #4a423b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-line">
      <span class="logo-text">DEVBIT</span>
      <span class="logo-sub">consulting</span>
    </div>
    <div class="name">Michael Hultman</div>
    <div class="title">System Architect & Senior Developer</div>
    <div class="divider"></div>
    <div class="skills">
      <span class="pill">C#/.NET</span>
      <span class="pill">Go</span>
      <span class="pill">Distributed Systems</span>
      <span class="pill">Azure</span>
      <span class="pill">AWS</span>
      <span class="pill">Kubernetes</span>
      <span class="pill">DDD/CQRS</span>
    </div>
  </div>
</body>
</html>
```

- [ ] **Step 3: Screenshot the page at 1200x630**

Using Playwright browser tools:

1. Navigate to `http://host.docker.internal:3000/og-temp.html` (or `http://localhost:3000/og-temp.html`)
2. Resize browser to 1200x630
3. Take a screenshot and save it to `public/og-image.png`

Alternatively, use the CLI:

```bash
npx playwright screenshot --viewport-size="1200,630" http://localhost:3000/og-temp.html public/og-image.png
```

- [ ] **Step 4: Clean up and verify**

```bash
rm public/og-temp.html
```

Verify the image exists and is roughly the right size:

```bash
file public/og-image.png
```

Expected: `public/og-image.png: PNG image data, 1200 x 630`

- [ ] **Step 5: Commit**

```bash
git add public/og-image.png
git commit -m "feat: add static OG image for social sharing"
```

---

### Task 5: Update sitemap with lastmod dates

**Files:**
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Update the sitemap**

Replace the entire contents of `public/sitemap.xml` with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://devbit.se</loc><lastmod>2026-04-12</lastmod><priority>1.0</priority></url>
  <url><loc>https://devbit.se/services</loc><lastmod>2026-04-12</lastmod><priority>0.8</priority></url>
  <url><loc>https://devbit.se/career</loc><lastmod>2026-04-12</lastmod><priority>0.8</priority></url>
  <url><loc>https://devbit.se/projects</loc><lastmod>2026-04-12</lastmod><priority>0.8</priority></url>
  <url><loc>https://devbit.se/about</loc><lastmod>2026-04-12</lastmod><priority>0.8</priority></url>
  <url><loc>https://devbit.se/contact</loc><lastmod>2026-04-12</lastmod><priority>0.8</priority></url>
</urlset>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, `out/sitemap.xml` has `lastmod` entries.

- [ ] **Step 3: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat: add lastmod dates to sitemap"
```
