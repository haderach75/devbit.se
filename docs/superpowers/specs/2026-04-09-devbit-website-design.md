# Devbit Consulting Website — Design Spec

## Overview

A personal/company website for Michael Hultman and Devbit Consulting AB. The site's creative concept is a **living system architecture diagram** — the homepage presents an interactive diagram where each node represents a section. Clicking a node zooms smoothly into that section's content.

The standout feature is the **Career Event Stream** — Michael's career rendered as an event sourcing log, with nested project events that expand on click.

**URL:** devbit.se
**Target audience:** Mix of technical decision-makers (CTOs, tech leads) and non-technical stakeholders (business owners, PMs)
**Tone:** Creative & playful, technically credible, approachable

---

## Tech Stack

### Framework
- **Next.js** (App Router) — React framework with SSR/SSG for SEO, file-based routing, optimized builds
- **TypeScript** — Type safety throughout

### UI & Animation
- **Tailwind CSS** — Utility-first styling, easy to maintain the custom warm dark theme
- **Framer Motion** — Page transitions (zoom-in/out from diagram to section), scroll animations, event stream reveals, hover effects, animated signal pulses
- **React Flow** — Interactive node-based diagram on the homepage. Handles the system diagram with custom node components, bezier-curve edges, zoom/pan, and animated edge particles

### Additional Libraries
- **Lucide React** — Clean icon set for service cards, contact info, navigation
- **React Hook Form + Zod** — Contact form with validation
- **Resend** (or Nodemailer) — Server-side email sending for contact form via Next.js API route

### Deployment
- **Vercel** — Natural fit for Next.js, handles SSR, edge functions, and custom domains (devbit.se)

---

## Color Palette — Warm Dark Theme

| Role | Color | Usage |
|------|-------|-------|
| Background | `#141210` | Page background, canvas |
| Surface | `#1a1714` | Cards, panels, elevated elements |
| Border | `#2a2520` | Card borders, dividers |
| Brand Crimson | `#a31f2e` | Primary accent, logo, CTAs, node highlights, connection lines |
| Warm Amber | `#c4956a` | Secondary accent, tech tags, skill highlights |
| Sage Green | `#7a9e7e` | Project events, success states |
| Gold | `#d4a55a` | Milestone events (CompanyFounded), special highlights |
| Purple | `#8b7ec8` | Education events |
| Text Primary | `#f5f0ea` | Headings |
| Text Body | `#e0dbd4` | Body text |
| Text Muted | `#8a8078` | Descriptions, meta |
| Text Dim | `#6b6158` | Timestamps, labels |

### Typography
- **Headings & body:** Inter (variable weight, 300-700)
- **Code/event stream:** JetBrains Mono (300-500)
- Both loaded via `next/font/google` for optimal performance

---

## Site Structure

### Page Architecture
Single-page application feel with route-based sections. The homepage diagram is the entry point; clicking nodes triggers animated route transitions.

```
/                  → Homepage (system diagram)
/services          → Services section
/career            → Career Event Stream
/projects          → Case studies
/about             → Traditional CV
/contact           → Contact form
```

Each route renders within a shared layout. Navigating from the homepage diagram triggers a zoom-in animation (Framer Motion `layoutId` + scale transform). A "back to diagram" button on each section triggers the reverse animation.

### Navigation
- **Primary:** The diagram itself is the main navigation on the homepage
- **Secondary:** A minimal fixed header with the Devbit logo (links to /) and a compact nav bar for direct access to sections when not on the homepage. Appears after the user first navigates away from the diagram.
- **Mobile:** Hamburger menu with the same section links. The diagram adapts to a vertical layout on mobile.

---

## Section Specs

### 1. Homepage — System Diagram

**Component:** Custom React Flow diagram

**Layout:**
- Full viewport height dark canvas with subtle dot-grid background (CSS radial-gradient)
- Devbit logo centered as the hub node (use SVG logo from brand assets)
- 5 section nodes arranged around the hub in a balanced layout
- Smooth bezier-curve edges connecting hub to each node
- Subtle parallax shift on mouse movement (Framer Motion `useMotionValue`)

**Node design:**
- Hexagonal shape (matching the Devbit logo's hexagon) built as a custom React Flow node component
- Each node has: icon, label, short description
- Hover state: crimson border glow, slight lift
- Click triggers route navigation with zoom animation

**Animations:**
- Animated "data packets" (small crimson dots) pulse along the edge paths using React Flow's edge animation API or SVG `animateMotion`
- Nodes fade in sequentially on initial load
- Subtle floating/breathing animation on idle

**Mobile adaptation:**
- Nodes stack vertically in a scrollable list
- Connections become simple vertical lines
- Hub remains at top

### 2. Career Event Stream

**Component:** Custom scrollable event timeline

**Data structure:**
```typescript
type EventType = 'EducationCompleted' | 'RoleStarted' | 'SkillAcquired' |
                 'ProjectDelivered' | 'ProjectInProgress' | 'CompanyFounded';

interface CareerEvent {
  id: string;
  type: EventType;
  timestamp: string;        // "2023-12" or "2005"
  endTimestamp?: string;     // "2023-12" or "present"
  source: string;            // Company/institution name
  payload: {
    role?: string;
    domain?: string;
    tech?: string[];
    degree?: string;
    scope?: string;
    skills?: string[];
    status?: string;
  };
  children?: CareerEvent[];  // Nested ProjectDelivered events
}
```

**Layout:**
- Monospace font (JetBrains Mono) styled like a log viewer / event store replay
- Left border timeline with colored dots per event type
- Comment-style header: `// Career.EventStore.replay()`
- Live indicator dot with pulse animation at the top

**Event types and colors:**
- `RoleStarted` — Crimson (#a31f2e) — parent events, expandable
- `ProjectDelivered` / `ProjectInProgress` — Sage (#7a9e7e) — nested under roles
- `SkillAcquired` — Amber (#c4956a)
- `EducationCompleted` — Purple (#8b7ec8)
- `CompanyFounded` — Gold (#d4a55a)

**Interaction:**
- Role events show collapsed by default (role, company, dates, tech stack visible)
- Click/tap a role to expand and reveal nested ProjectDelivered children with slide-down animation (Framer Motion `AnimatePresence` + `layout`)
- Events animate in on scroll (Framer Motion `whileInView`)
- Most recent events at top, scrolling down goes back in time

**Career data (from CV):**
1. Volvo Energy (Dec 2023–present) — Architect/Dev, IoT/Energy
   - Project: Energy Service Cloud (MQTT, OCPP, Orleans, AWS, gRPC, GraphQL)
2. Stena Line (Jan 2023–Dec 2023) — Architect/Dev, Shipping
   - Project: Booking System Modernization (monolith → distributed)
3. Worldstream (Sep 2021–Jan 2023) — Architect/Dev, Infrastructure
   - Project: VXLAN Automation (Go, DDD, CQRS, Event Sourcing)
4. Cuviva (Mar 2021–Sep 2021) — Dev/DevOps, Medtech
   - Project: Azure to Hybrid Cloud Migration (Kubernetes)
5. Collector Bank (Feb 2017–Mar 2021) — Architect, Banking
   - Projects: Credit Evaluation System, Anti-Fraud System, GDPR Compliance, AML Integration
6. Autocom Diagnostic Partner (Aug 2007–Feb 2017) — Developer, Automotive
   - Projects: Reverse Engineering Tools, Licensing Solution, Device Testing System
7. Education: University West (2001-2005), Högskolan Trollhättan/Uddevalla (1996-1998)
8. CompanyFounded: Devbit Consulting AB

### 3. Services

**Layout:** Grid of 4 service cards within a page container

**Services:**
1. **System Architecture** — Distributed systems design, DDD, CQRS, event sourcing. Monolith decomposition to greenfield design.
2. **Senior Development** — Hands-on C#/.NET development. Clean code, test-driven, production-ready.
3. **Cloud & DevOps** — Azure, AWS, Kubernetes. Migrations, infrastructure automation, CI/CD.
4. **Technical Consulting** — Architecture reviews, tech strategy, team mentoring.

**Card design:**
- Warm surface background with subtle border
- Icon (Lucide), title, description
- Hover: crimson border accent, slight lift

### 4. About — Traditional CV

**Layout:** Clean, scannable resume format within a page container

**Sections:**
- **Intro paragraph** — 2-3 sentences summarizing Michael's profile
- **Skill tags** — Horizontal wrap of tech skill pills (C#, .NET, Go, Azure, AWS, K8s, DDD, CQRS, ES, gRPC, GraphQL, Orleans, MQTT)
- **Experience** — Chronological list (most recent first): role title, company, dates, 1-line description
- **Education** — Degree, institution, dates
- **Languages** — Swedish, English (fluent), German (basic)

**Note:** Links to the Career Event Stream for the "full interactive version" of the resume.

### 5. Projects — Case Studies

**Layout:** 3-4 featured project cards

**Card structure:**
- Project title + client (where appropriate)
- Domain tag (Banking, IoT, Shipping, etc.)
- **Challenge** — 1-2 sentences on the problem
- **Approach** — Architecture/tech decisions made
- **Result** — What was delivered
- Tech stack tags

**Initial featured projects (to be refined with Michael):**
1. Volvo Energy Service Cloud
2. Collector Bank platform (credit eval + anti-fraud)
3. Stena Line booking system modernization
4. Worldstream VXLAN automation

### 6. Contact

**Layout:** Two-column — form on left, contact info on right

**Form fields:**
- Name (required)
- Email (required, validated)
- Subject (optional)
- Message (required, textarea)
- Submit button ("Send Message")

**Contact info:**
- Email: michael@devbit.se
- Phone: +46 73-712 05 58
- Location: Vänersborg, Sweden
- Availability note: "Available for contracts across Sweden and remote internationally."

**Backend:** Next.js API route (`/api/contact`) sends email via Resend to michael@devbit.se. Rate limiting on the endpoint. Success/error toast feedback.

---

## Brand Assets

**Logo files located at** `/Users/michaelhultman/Documents/Premiepaket/`:
- SVG (vector, for web use): `Logotyper\u00a0(vektorformat)/Transparent.svg` (note: folder names contain non-breaking spaces `\xa0`)
- PNG variants: Original (white bg), Colored (crimson bg), Transparent
- Logo icon: Hexagonal shape with circuit-node connectors and horizontal lines inside
- Brand colors from logo: Crimson `#a31f2e`, Dark charcoal `#292929`

The hexagonal logo icon should be used as:
- The hub node on the homepage diagram
- Favicon (cropped to icon only)
- Loading indicator shape

---

## Animations Summary

| Element | Library | Trigger |
|---------|---------|---------|
| Diagram node entrance | Framer Motion | Page load (staggered) |
| Edge data pulses | SVG animateMotion | Continuous loop |
| Diagram → section zoom | Framer Motion layoutId | Route change |
| Section → diagram zoom out | Framer Motion layoutId | Back navigation |
| Event stream items | Framer Motion whileInView | Scroll |
| Event children expand | Framer Motion AnimatePresence | Click |
| Service card hover | Framer Motion whileHover | Hover |
| Contact form feedback | Framer Motion | Submit |
| Dot-grid parallax | Framer Motion useMotionValue | Mouse move |

---

## Responsive Breakpoints

- **Desktop:** >= 1024px — Full diagram layout, side-by-side contact
- **Tablet:** 768-1023px — Diagram scales, 2-col services grid, stacked contact
- **Mobile:** < 768px — Vertical node list, single column, hamburger nav

---

## Performance Considerations

- Next.js static generation for all pages (no dynamic data)
- SVG logo inlined, PNGs optimized via `next/image`
- Font subsetting via `next/font`
- React Flow lazy-loaded (only on homepage)
- Framer Motion tree-shaking (import only used features)
- Lighthouse target: 95+ on all metrics

---

## SEO & Meta

- Open Graph tags on all pages (title, description, image)
- Structured data (JSON-LD) for Person + Organization
- Sitemap.xml generated by Next.js
- Meta description per page for search results
- Page title format: "Section — Devbit Consulting | Michael Hultman"

---

## Out of Scope (for now)

- Blog/articles section
- CMS integration
- Analytics dashboard
- Multi-language support (English only initially)
- Dark/light mode toggle (dark only)
- Cookie consent (no tracking cookies planned initially)
