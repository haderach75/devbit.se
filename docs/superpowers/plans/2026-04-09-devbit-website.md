# Devbit Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a creative personal/company website for Devbit Consulting AB themed as an interactive system architecture diagram, with a career event stream, services, projects, about, and contact sections.

**Architecture:** Next.js App Router with TypeScript. Homepage is a React Flow interactive diagram where nodes link to route-based sections. Framer Motion handles all animations (page transitions, scroll reveals, expand/collapse). Tailwind CSS with a custom warm dark theme. Static site generation for performance.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, React Flow, Lucide React, React Hook Form, Zod, Resend

**Design spec:** `docs/superpowers/specs/2026-04-09-devbit-website-design.md`

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, nav wrapper
│   ├── page.tsx                # Homepage: system diagram
│   ├── services/page.tsx       # Services section
│   ├── career/page.tsx         # Career event stream
│   ├── projects/page.tsx       # Case studies
│   ├── about/page.tsx          # Traditional CV
│   ├── contact/page.tsx        # Contact form
│   └── api/contact/route.ts    # Contact form API endpoint
├── components/
│   ├── layout/
│   │   ├── header.tsx          # Fixed nav header with logo
│   │   ├── mobile-nav.tsx      # Hamburger menu for mobile
│   │   └── page-container.tsx  # Shared section page wrapper with back button
│   ├── diagram/
│   │   ├── system-diagram.tsx  # React Flow diagram wrapper
│   │   ├── hub-node.tsx        # Central Devbit logo node
│   │   ├── section-node.tsx    # Section nodes (hexagonal)
│   │   ├── animated-edge.tsx   # Custom edge with data packet animation
│   │   └── dot-grid.tsx        # Background dot grid with parallax
│   ├── career/
│   │   ├── event-stream.tsx    # Event stream container with header
│   │   ├── career-event.tsx    # Single event (role/education/milestone)
│   │   └── project-event.tsx   # Nested project child event
│   ├── services/
│   │   └── service-card.tsx    # Individual service card
│   ├── projects/
│   │   └── project-card.tsx    # Case study card
│   ├── about/
│   │   ├── skill-tags.tsx      # Skill tag pills
│   │   └── experience-item.tsx # CV experience entry
│   ├── contact/
│   │   ├── contact-form.tsx    # Form with validation
│   │   └── contact-info.tsx    # Contact details sidebar
│   └── ui/
│       └── section-heading.tsx # Reusable section heading component
├── data/
│   ├── career-events.ts        # All career event data
│   ├── services.ts             # Services data
│   ├── projects.ts             # Project case study data
│   └── site-config.ts          # Site metadata, nav links, contact info
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   └── fonts.ts                # Font configuration (Inter, JetBrains Mono)
└── styles/
    └── globals.css             # Tailwind imports + custom CSS (dot-grid, hexagon clip-path)

public/
├── logo.svg                    # Devbit logo (full)
├── logo-icon.svg               # Devbit hexagon icon only
└── favicon.ico                 # Favicon from logo icon
```

---

### Task 1: Project Scaffolding & Theme Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `postcss.config.mjs`
- Create: `src/styles/globals.css`
- Create: `src/lib/fonts.ts`
- Create: `src/lib/types.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx` (placeholder)
- Create: `public/logo.svg`, `public/logo-icon.svg`

- [ ] **Step 1: Create Next.js project with TypeScript and Tailwind**

```bash
cd /Users/michaelhultman/Work/devbit-website
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted. This creates the base Next.js project with App Router, TypeScript, and Tailwind CSS.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion @xyflow/react lucide-react react-hook-form @hookform/resolvers zod resend
```

- [ ] **Step 3: Copy logo SVG into public directory**

Copy the Devbit SVG logo from the brand assets folder into `public/logo.svg`. The source path has non-breaking spaces in folder names:

```bash
python3 -c "
import shutil
src = '/Users/michaelhultman/Documents/Premiepaket/Logotyper\xa0(vektorformat)/Transparent.svg'
shutil.copy(src, '/Users/michaelhultman/Work/devbit-website/public/logo.svg')
print('Copied logo.svg')
"
```

Also extract just the hexagon icon from the SVG (the first `<g>` path group with `fill="#a31f2e"`) and save as `public/logo-icon.svg` for use as favicon and hub node. The icon is the hexagonal shape — crop the viewBox to just the icon portion.

- [ ] **Step 4: Configure fonts**

Write `src/lib/fonts.ts`:

```typescript
import { Inter, JetBrains_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
```

- [ ] **Step 5: Configure Tailwind theme with warm dark palette**

Update `src/styles/globals.css` to include the Tailwind imports and custom CSS properties:

```css
@import "tailwindcss";

@theme {
  --color-bg: #141210;
  --color-surface: #1a1714;
  --color-border: #2a2520;
  --color-crimson: #a31f2e;
  --color-crimson-hover: #8a1a27;
  --color-amber: #c4956a;
  --color-sage: #7a9e7e;
  --color-gold: #d4a55a;
  --color-purple: #8b7ec8;
  --color-text-primary: #f5f0ea;
  --color-text-body: #e0dbd4;
  --color-text-muted: #8a8078;
  --color-text-dim: #6b6158;

  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-body);
}

/* Dot grid background for diagram canvas */
.dot-grid {
  background-image: radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0);
  background-size: 32px 32px;
}

/* Hexagonal clip path for node icons */
.clip-hexagon {
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
}
```

- [ ] **Step 6: Configure shared types**

Write `src/lib/types.ts`:

```typescript
export type EventType =
  | "EducationCompleted"
  | "RoleStarted"
  | "SkillAcquired"
  | "ProjectDelivered"
  | "ProjectInProgress"
  | "CompanyFounded";

export interface CareerEvent {
  id: string;
  type: EventType;
  timestamp: string;
  endTimestamp?: string;
  source: string;
  payload: {
    role?: string;
    domain?: string;
    tech?: string[];
    degree?: string;
    scope?: string;
    skills?: string[];
    status?: string;
  };
  children?: CareerEvent[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface Project {
  id: string;
  title: string;
  client: string;
  domain: string;
  challenge: string;
  approach: string;
  result: string;
  tech: string[];
}

export interface SiteLink {
  label: string;
  href: string;
  description: string;
  icon: string;
}
```

- [ ] **Step 7: Set up root layout with fonts and metadata**

Write `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "@/styles/globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder homepage**

Write `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-text-primary">
        Devbit Consulting
      </h1>
    </main>
  );
}
```

- [ ] **Step 9: Verify dev server runs**

```bash
cd /Users/michaelhultman/Work/devbit-website
npm run dev
```

Open http://localhost:3000 and verify the warm dark background with "Devbit Consulting" heading renders correctly. Check that fonts load (Inter for the heading).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with warm dark theme and fonts"
```

---

### Task 2: Site Data & Configuration

**Files:**
- Create: `src/data/site-config.ts`
- Create: `src/data/career-events.ts`
- Create: `src/data/services.ts`
- Create: `src/data/projects.ts`

- [ ] **Step 1: Create site config with nav links and contact info**

Write `src/data/site-config.ts`:

```typescript
import type { SiteLink } from "@/lib/types";

export const siteLinks: SiteLink[] = [
  {
    label: "Services",
    href: "/services",
    description: "Architecture, Development, Cloud",
    icon: "Settings",
  },
  {
    label: "Career",
    href: "/career",
    description: "Event-sourced timeline",
    icon: "ScrollText",
  },
  {
    label: "Projects",
    href: "/projects",
    description: "Case studies",
    icon: "Star",
  },
  {
    label: "About",
    href: "/about",
    description: "CV & personal",
    icon: "User",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch",
    icon: "Mail",
  },
];

export const contactInfo = {
  email: "michael@devbit.se",
  phone: "+46 73-712 05 58",
  location: "Vänersborg, Sweden",
  availability: "Available for contracts across Sweden and remote internationally.",
};
```

- [ ] **Step 2: Create career events data**

Write `src/data/career-events.ts`:

```typescript
import type { CareerEvent } from "@/lib/types";

export const careerEvents: CareerEvent[] = [
  {
    id: "volvo-energy",
    type: "RoleStarted",
    timestamp: "2023-12",
    endTimestamp: "present",
    source: "Volvo Energy",
    payload: {
      role: "Architect / Developer",
      domain: "IoT / Energy",
      tech: ["C#", "Orleans", "AWS", "MQTT", "OCPP", "gRPC", "GraphQL"],
    },
    children: [
      {
        id: "volvo-energy-cloud",
        type: "ProjectInProgress",
        timestamp: "2023-12",
        source: "Volvo Energy",
        payload: {
          scope: "Cloud backend for wallboxes & IoT energy devices",
        },
      },
    ],
  },
  {
    id: "stena-line",
    type: "RoleStarted",
    timestamp: "2023-01",
    endTimestamp: "2023-12",
    source: "Stena Line",
    payload: {
      role: "Architect / Developer",
      domain: "Shipping / Logistics",
      tech: ["C#", "ASP.NET Core"],
    },
    children: [
      {
        id: "stena-booking",
        type: "ProjectDelivered",
        timestamp: "2023-01",
        source: "Stena Line",
        payload: {
          scope: "Monolithic booking system transformation into distributed architecture",
        },
      },
    ],
  },
  {
    id: "worldstream",
    type: "RoleStarted",
    timestamp: "2021-09",
    endTimestamp: "2023-01",
    source: "Worldstream Netherlands",
    payload: {
      role: "Architect / Developer",
      domain: "Infrastructure / Cloud Provider",
      tech: ["Go", "DDD", "CQRS", "Event Sourcing"],
    },
    children: [
      {
        id: "worldstream-vxlan",
        type: "ProjectDelivered",
        timestamp: "2021-09",
        source: "Worldstream",
        payload: {
          scope: "Remodeled and developed systems for automating VXLAN setup",
        },
      },
    ],
  },
  {
    id: "cuviva",
    type: "RoleStarted",
    timestamp: "2021-03",
    endTimestamp: "2021-09",
    source: "Cuviva",
    payload: {
      role: "Developer / DevOps",
      domain: "Medtech",
      tech: ["C#", "Azure", "Kubernetes"],
    },
    children: [
      {
        id: "cuviva-migration",
        type: "ProjectDelivered",
        timestamp: "2021-03",
        source: "Cuviva",
        payload: {
          scope: "Migration from Azure to hybrid cloud infrastructure in Kubernetes",
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
      role: "Architect",
      domain: "Banking / FinTech",
      tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing"],
    },
    children: [
      {
        id: "collector-credit",
        type: "ProjectDelivered",
        timestamp: "2017-02",
        source: "Collector Bank",
        payload: {
          scope: "Credit evaluation system on Kubernetes and Azure",
        },
      },
      {
        id: "collector-antifraud",
        type: "ProjectDelivered",
        timestamp: "2018-01",
        source: "Collector Bank",
        payload: {
          scope: "Modernized and scaled Anti-Fraud system",
        },
      },
      {
        id: "collector-gdpr",
        type: "ProjectDelivered",
        timestamp: "2019-01",
        source: "Collector Bank",
        payload: {
          scope: "GDPR compliance through data purging procedures and reports",
        },
      },
      {
        id: "collector-aml",
        type: "ProjectDelivered",
        timestamp: "2020-01",
        source: "Collector Bank",
        payload: {
          scope: "Anti-Money Laundering solution integrated with existing systems",
        },
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
      role: "Software Developer",
      domain: "Automotive Diagnostics",
      tech: ["C#", ".NET"],
    },
    children: [
      {
        id: "autocom-reverse",
        type: "ProjectDelivered",
        timestamp: "2007-08",
        source: "Autocom",
        payload: {
          scope: "Reverse engineering tools for vehicle diagnostic protocols",
        },
      },
      {
        id: "autocom-licensing",
        type: "ProjectDelivered",
        timestamp: "2010-01",
        source: "Autocom",
        payload: {
          scope: "Architected and developed distributed licensing solution",
        },
      },
      {
        id: "autocom-testing",
        type: "ProjectDelivered",
        timestamp: "2013-01",
        source: "Autocom",
        payload: {
          scope: "Distributed system for device testing and preparation",
        },
      },
    ],
  },
  {
    id: "edu-west",
    type: "EducationCompleted",
    timestamp: "2001",
    endTimestamp: "2005",
    source: "University West",
    payload: {
      degree: "Computer Science / System Development",
    },
  },
  {
    id: "edu-thu",
    type: "EducationCompleted",
    timestamp: "1996",
    endTimestamp: "1998",
    source: "Högskolan Trollhättan/Uddevalla",
    payload: {
      degree: "Business Economics",
    },
  },
  {
    id: "devbit-founded",
    type: "CompanyFounded",
    timestamp: "present",
    source: "Devbit Consulting AB",
    payload: {
      status: "available_for_hire",
    },
  },
];
```

- [ ] **Step 3: Create services data**

Write `src/data/services.ts`:

```typescript
import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    id: "architecture",
    title: "System Architecture",
    description:
      "Distributed systems design, DDD, CQRS, event sourcing. From monolith decomposition to greenfield design.",
    icon: "Cpu",
  },
  {
    id: "development",
    title: "Senior Development",
    description:
      "Hands-on C#/.NET development. Clean code, test-driven, production-ready systems.",
    icon: "Code",
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description:
      "Azure, AWS, Kubernetes. Cloud migrations, infrastructure automation, CI/CD pipelines.",
    icon: "Cloud",
  },
  {
    id: "consulting",
    title: "Technical Consulting",
    description:
      "Architecture reviews, tech strategy, team mentoring. Helping teams level up.",
    icon: "MessageSquare",
  },
];
```

- [ ] **Step 4: Create projects data**

Write `src/data/projects.ts`:

```typescript
import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "volvo-energy",
    title: "Energy Service Cloud",
    client: "Volvo Energy",
    domain: "IoT / Energy",
    challenge:
      "Build a scalable cloud backend for wallboxes and other IoT energy devices requiring real-time communication via MQTT and OCPP protocols.",
    approach:
      "Designed an actor-based architecture using Microsoft Orleans on AWS. Implemented gRPC for internal service communication and GraphQL for client APIs.",
    result:
      "Production cloud platform managing IoT energy devices with real-time monitoring and control capabilities.",
    tech: ["C#", "Orleans", "AWS", "MQTT", "OCPP", "gRPC", "GraphQL"],
  },
  {
    id: "collector-bank",
    title: "Banking Platform Modernization",
    client: "Collector Bank",
    domain: "Banking / FinTech",
    challenge:
      "Modernize critical banking infrastructure including credit evaluation, fraud detection, and regulatory compliance on a legacy platform.",
    approach:
      "Architected microservices on Azure/Kubernetes using C#, CQRS, and Event Sourcing. Built dedicated systems for credit evaluation, anti-fraud, GDPR compliance, and AML.",
    result:
      "Four major systems delivered: credit evaluation, modernized anti-fraud, GDPR data purging, and AML integration — all running on Kubernetes.",
    tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing"],
  },
  {
    id: "stena-line",
    title: "Booking System Transformation",
    client: "Stena Line",
    domain: "Shipping / Logistics",
    challenge:
      "Transform a monolithic booking system into a distributed architecture to improve scalability and team autonomy.",
    approach:
      "Applied bounded context decomposition using C# and ASP.NET Core. Defined clear service boundaries and communication patterns.",
    result:
      "Successfully decomposed the monolith into distributed services with well-defined bounded contexts.",
    tech: ["C#", "ASP.NET Core", "Distributed Systems"],
  },
  {
    id: "worldstream",
    title: "VXLAN Automation Platform",
    client: "Worldstream Netherlands",
    domain: "Infrastructure",
    challenge:
      "Automate VXLAN network setup for a cloud/infrastructure provider to reduce manual configuration and errors.",
    approach:
      "Built from scratch in Go using Domain-Driven Design, CQRS, and Event Sourcing patterns for a clean, maintainable architecture.",
    result:
      "Automated VXLAN provisioning system reducing setup time and eliminating manual configuration errors.",
    tech: ["Go", "DDD", "CQRS", "Event Sourcing"],
  },
];
```

- [ ] **Step 5: Commit**

```bash
git add src/data/ src/lib/types.ts
git commit -m "feat: add site data — career events, services, projects, config"
```

---

### Task 3: Layout Components — Header, Navigation, Page Container

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/mobile-nav.tsx`
- Create: `src/components/layout/page-container.tsx`
- Create: `src/components/ui/section-heading.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create the section heading component**

Write `src/components/ui/section-heading.tsx`:

```tsx
interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      <p className="text-xs font-medium uppercase tracking-widest text-crimson mb-2">
        {label}
      </p>
      <h1 className="text-3xl font-bold text-text-primary mb-2">{title}</h1>
      {description && (
        <p className="text-text-muted text-lg">{description}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the header component**

Write `src/components/layout/header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteLinks } from "@/data/site-config";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="h-7 w-7" viewBox="0 0 48 48">
            <polygon
              points="24,2 44,14 44,34 24,46 4,34 4,14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-crimson"
            />
          </svg>
          <span className="text-sm font-semibold text-text-primary tracking-wide">
            DEVBIT
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-crimson font-medium"
                  : "text-text-muted hover:text-text-body"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create the mobile nav component**

Write `src/components/layout/mobile-nav.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { siteLinks } from "@/data/site-config";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-muted hover:text-text-body"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 right-0 border-b border-border bg-bg/95 backdrop-blur-md"
          >
            <nav className="flex flex-col p-4 gap-1">
              {siteLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm transition-colors ${
                    pathname === link.href
                      ? "bg-surface text-crimson font-medium"
                      : "text-text-muted hover:bg-surface hover:text-text-body"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Create the page container**

Write `src/components/layout/page-container.tsx`:

```tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-5xl px-4 pt-24 pb-16"
    >
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-mono text-crimson hover:text-crimson-hover transition-colors"
      >
        <ArrowLeft size={14} />
        back to diagram
      </Link>
      {children}
    </motion.main>
  );
}
```

- [ ] **Step 5: Update root layout to include the header**

Modify `src/app/layout.tsx` — add the Header import and render it inside `<body>`:

```tsx
import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import "@/styles/globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verify header renders on a test route**

Create a temporary test: visit `/services` (will 404 for now, but the header should appear since `pathname !== "/"`). Verify at http://localhost:3000 that the homepage has no header and confirm layout structure is correct.

- [ ] **Step 7: Commit**

```bash
git add src/components/ src/app/layout.tsx
git commit -m "feat: add layout components — header, mobile nav, page container"
```

---

### Task 4: Homepage — Interactive System Diagram

**Files:**
- Create: `src/components/diagram/system-diagram.tsx`
- Create: `src/components/diagram/hub-node.tsx`
- Create: `src/components/diagram/section-node.tsx`
- Create: `src/components/diagram/animated-edge.tsx`
- Create: `src/components/diagram/dot-grid.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create the dot grid background**

Write `src/components/diagram/dot-grid.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function DotGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, 1], [-5, 5]);
  const bgY = useTransform(mouseY, [0, 1], [-5, 5]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  if (!mounted) return <div className="absolute inset-0 dot-grid opacity-50" />;

  return (
    <motion.div
      className="absolute inset-0 dot-grid opacity-50"
      style={{ x: bgX, y: bgY }}
    />
  );
}
```

- [ ] **Step 2: Create the hub node component**

Write `src/components/diagram/hub-node.tsx`:

```tsx
"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";

export function HubNode() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-3 rounded-xl border-2 border-crimson bg-gradient-to-br from-[#1e120f] to-bg px-6 py-4 shadow-[0_0_40px_rgba(163,31,46,0.12)]"
    >
      <div className="clip-hexagon flex h-12 w-12 items-center justify-center bg-crimson">
        <div className="clip-hexagon flex h-10 w-10 items-center justify-center bg-[#1e120f]">
          <span className="font-mono text-xs font-semibold text-crimson">&lt;/&gt;</span>
        </div>
      </div>
      <div>
        <div className="text-xl font-bold tracking-wider text-text-primary">DEVBIT</div>
        <div className="text-xs font-medium tracking-widest text-crimson">consulting</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-crimson !border-none !w-2 !h-2" />
    </motion.div>
  );
}
```

- [ ] **Step 3: Create the section node component**

Write `src/components/diagram/section-node.tsx`:

```tsx
"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Settings, ScrollText, Star, User, Mail,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Settings, ScrollText, Star, User, Mail,
};

interface SectionNodeData {
  label: string;
  description: string;
  icon: string;
  href: string;
  index: number;
}

export function SectionNode({ data }: { data: SectionNodeData }) {
  const router = useRouter();
  const Icon = iconMap[data.icon] ?? Settings;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 + data.index * 0.1, ease: "easeOut" }}
      onClick={() => router.push(data.href)}
      className="group cursor-pointer rounded-xl border border-border bg-surface p-5 text-center transition-all duration-300 hover:border-crimson hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)] w-[155px]"
    >
      <div className="clip-hexagon mx-auto mb-3 flex h-9 w-9 items-center justify-center bg-crimson/10 border border-crimson/25">
        <Icon size={16} className="text-crimson" />
      </div>
      <div className="text-sm font-semibold text-text-body">{data.label}</div>
      <div className="mt-1 text-[11px] leading-snug text-text-dim">
        {data.description}
      </div>
      <Handle type="target" position={Position.Top} className="!bg-crimson !border-none !w-2 !h-2" />
    </motion.div>
  );
}
```

- [ ] **Step 4: Create the animated edge component**

Write `src/components/diagram/animated-edge.tsx`:

```tsx
"use client";

import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 20,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: "#2a2520", strokeWidth: 1.5 }} />
      <circle r="3" fill="#a31f2e">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="3" fill="#a31f2e" opacity="0.4">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} begin="1.5s" />
      </circle>
    </>
  );
}
```

- [ ] **Step 5: Create the system diagram wrapper**

Write `src/components/diagram/system-diagram.tsx`:

```tsx
"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  Position,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { HubNode } from "./hub-node";
import { SectionNode } from "./section-node";
import { AnimatedEdge } from "./animated-edge";
import { siteLinks } from "@/data/site-config";

const nodeTypes = {
  hub: HubNode,
  section: SectionNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

function buildNodes(): Node[] {
  const hub: Node = {
    id: "hub",
    type: "hub",
    position: { x: 350, y: 50 },
    data: {},
    draggable: false,
  };

  const positions = [
    { x: 0, y: 250 },
    { x: 190, y: 250 },
    { x: 380, y: 250 },
    { x: 570, y: 250 },
    { x: 760, y: 250 },
  ];

  const sections: Node[] = siteLinks.map((link, i) => ({
    id: link.href,
    type: "section",
    position: positions[i],
    data: {
      label: link.label,
      description: link.description,
      icon: link.icon,
      href: link.href,
      index: i,
    },
    draggable: false,
  }));

  return [hub, ...sections];
}

function buildEdges(): Edge[] {
  return siteLinks.map((link) => ({
    id: `hub-${link.href}`,
    source: "hub",
    target: link.href,
    type: "animated",
    sourceHandle: undefined,
    targetHandle: undefined,
  }));
}

export function SystemDiagram() {
  const initialNodes = useMemo(() => buildNodes(), []);
  const initialEdges = useMemo(() => buildEdges(), []);
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
      </ReactFlow>
    </div>
  );
}
```

- [ ] **Step 6: Update homepage to render the diagram**

Write `src/app/page.tsx`:

```tsx
import dynamic from "next/dynamic";
import { DotGrid } from "@/components/diagram/dot-grid";

const SystemDiagram = dynamic(
  () => import("@/components/diagram/system-diagram").then((m) => m.SystemDiagram),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <DotGrid />
      <SystemDiagram />
    </main>
  );
}
```

- [ ] **Step 7: Verify diagram renders**

Run the dev server and visit http://localhost:3000. Verify:
- Dark background with dot grid
- Hub node centered with "DEVBIT consulting"
- 5 section nodes arranged below
- Animated crimson dots pulsing along the edges
- Clicking a node navigates to that route

Adjust node positions in `system-diagram.tsx` if the layout needs tuning.

- [ ] **Step 8: Commit**

```bash
git add src/components/diagram/ src/app/page.tsx
git commit -m "feat: add interactive system diagram homepage with React Flow"
```

---

### Task 5: Career Event Stream Page

**Files:**
- Create: `src/components/career/event-stream.tsx`
- Create: `src/components/career/career-event.tsx`
- Create: `src/components/career/project-event.tsx`
- Create: `src/app/career/page.tsx`

- [ ] **Step 1: Create the project event component**

Write `src/components/career/project-event.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { CareerEvent } from "@/lib/types";

interface ProjectEventProps {
  event: CareerEvent;
}

export function ProjectEvent({ event }: ProjectEventProps) {
  const color = event.type === "ProjectInProgress" ? "text-amber" : "text-sage";
  const borderColor = event.type === "ProjectInProgress" ? "border-amber/30" : "border-sage/30";
  const dotBg = event.type === "ProjectInProgress" ? "bg-amber/20 border-amber" : "bg-sage/20 border-sage";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative border-l border-dashed ${borderColor} pl-5 mb-3`}
    >
      <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full border-2 ${dotBg}`} />
      <p className={`font-mono text-xs font-semibold tracking-wide ${color}`}>
        {event.type}
      </p>
      <p className="font-mono text-xs text-text-dim">{event.source}</p>
      <p className="font-mono text-xs text-text-muted mt-0.5">
        <span className="text-text-dim">scope: </span>
        <span className="text-text-body">&quot;{event.payload.scope}&quot;</span>
      </p>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create the career event component**

Write `src/components/career/career-event.tsx`:

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { CareerEvent as CareerEventType } from "@/lib/types";
import { ProjectEvent } from "./project-event";

const typeStyles: Record<string, { color: string; border: string; dot: string }> = {
  RoleStarted: {
    color: "text-crimson",
    border: "border-border",
    dot: "bg-crimson/20 border-crimson",
  },
  EducationCompleted: {
    color: "text-purple",
    border: "border-purple/20",
    dot: "bg-purple/20 border-purple",
  },
  CompanyFounded: {
    color: "text-gold",
    border: "border-gold/20",
    dot: "bg-gold/20 border-gold",
  },
  SkillAcquired: {
    color: "text-amber",
    border: "border-amber/20",
    dot: "bg-amber/20 border-amber",
  },
};

interface CareerEventProps {
  event: CareerEventType;
}

export function CareerEvent({ event }: CareerEventProps) {
  const [expanded, setExpanded] = useState(false);
  const style = typeStyles[event.type] ?? typeStyles.RoleStarted;
  const hasChildren = event.children && event.children.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={`relative border-l-2 ${style.border} pl-5 mb-6`}
    >
      <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full border-2 ${style.dot}`} />

      <div
        className={hasChildren ? "cursor-pointer" : ""}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <p className={`font-mono text-xs font-semibold tracking-wide ${style.color}`}>
            {event.type}
          </p>
          {hasChildren && (
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={12} className="text-text-dim" />
            </motion.div>
          )}
        </div>

        <p className="font-mono text-xs text-text-dim mt-0.5">
          {event.timestamp}
          {event.endTimestamp && ` → ${event.endTimestamp}`}
          {" · "}
          {event.source}
        </p>

        <div className="font-mono text-xs text-text-muted mt-1 space-y-0.5">
          {event.payload.role && (
            <p>
              <span className="text-text-dim">role: </span>
              <span className="text-text-body">&quot;{event.payload.role}&quot;</span>
            </p>
          )}
          {event.payload.domain && (
            <p>
              <span className="text-text-dim">domain: </span>
              <span className="text-text-body">&quot;{event.payload.domain}&quot;</span>
            </p>
          )}
          {event.payload.tech && (
            <p>
              <span className="text-text-dim">tech: </span>
              <span className="text-amber">
                [{event.payload.tech.map((t) => `"${t}"`).join(", ")}]
              </span>
            </p>
          )}
          {event.payload.degree && (
            <p>
              <span className="text-text-dim">degree: </span>
              <span className="text-text-body">&quot;{event.payload.degree}&quot;</span>
            </p>
          )}
          {event.payload.status && (
            <p>
              <span className="text-text-dim">status: </span>
              <span className="text-sage">&quot;{event.payload.status}&quot;</span>
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-2 border-t border-dashed border-border"
          >
            {event.children!.map((child) => (
              <ProjectEvent key={child.id} event={child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create the event stream container**

Write `src/components/career/event-stream.tsx`:

```tsx
"use client";

import { careerEvents } from "@/data/career-events";
import { CareerEvent } from "./career-event";

export function EventStream() {
  return (
    <div className="rounded-xl border border-border bg-bg p-6 font-mono">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <div className="h-2 w-2 rounded-full bg-amber animate-pulse" />
        <span className="text-xs text-text-dim">
          Career.EventStore.replay() — {careerEvents.length} events
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-text-dim mb-4">
          {"// click a role to expand project details"}
        </p>
        {careerEvents.map((event) => (
          <CareerEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create the career page**

Write `src/app/career/page.tsx`:

```tsx
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventStream } from "@/components/career/event-stream";

export const metadata: Metadata = {
  title: "Career Stream — Devbit Consulting | Michael Hultman",
  description:
    "20+ years of software engineering experience as an event-sourced timeline. System architecture, distributed systems, cloud development.",
};

export default function CareerPage() {
  return (
    <PageContainer>
      <SectionHeading
        label="Career Stream"
        title="Career.EventStore.replay()"
        description="20+ years of software engineering, replayed as an event stream. Click roles to expand project details."
      />
      <EventStream />
    </PageContainer>
  );
}
```

- [ ] **Step 5: Verify career page**

Visit http://localhost:3000/career. Verify:
- Back to diagram link works
- Header shows with navigation
- Event stream renders with all career events
- Clicking a role event expands nested project events with animation
- Color coding matches spec (crimson for roles, sage for projects, purple for education, gold for company)
- Monospace font (JetBrains Mono) renders correctly

- [ ] **Step 6: Commit**

```bash
git add src/components/career/ src/app/career/
git commit -m "feat: add career event stream page with nested expandable events"
```

---

### Task 6: Services Page

**Files:**
- Create: `src/components/services/service-card.tsx`
- Create: `src/app/services/page.tsx`

- [ ] **Step 1: Create the service card component**

Write `src/components/services/service-card.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Cpu, Code, Cloud, MessageSquare } from "lucide-react";
import type { Service } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  Cpu, Code, Cloud, MessageSquare,
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = iconMap[service.icon] ?? Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2, borderColor: "#a31f2e" }}
      className="rounded-xl border border-border bg-bg p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)]"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10">
        <Icon size={20} className="text-crimson" />
      </div>
      <h3 className="text-sm font-semibold text-text-body mb-1">
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed text-text-dim">
        {service.description}
      </p>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create the services page**

Write `src/app/services/page.tsx`:

```tsx
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — Devbit Consulting | Michael Hultman",
  description:
    "System architecture, senior C#/.NET development, cloud & DevOps, and technical consulting services.",
};

export default function ServicesPage() {
  return (
    <PageContainer>
      <SectionHeading
        label="Services"
        title="What Devbit Brings"
        description="System architecture, hands-on development, cloud infrastructure, and strategic consulting."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} />
        ))}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 3: Verify and commit**

Visit http://localhost:3000/services. Verify 4 cards render in a 2-column grid with icons, hover animations work.

```bash
git add src/components/services/ src/app/services/
git commit -m "feat: add services page with animated service cards"
```

---

### Task 7: About Page — Traditional CV

**Files:**
- Create: `src/components/about/skill-tags.tsx`
- Create: `src/components/about/experience-item.tsx`
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Create skill tags component**

Write `src/components/about/skill-tags.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

const skills = [
  "C#", ".NET", "Go", "Azure", "AWS", "Kubernetes",
  "DDD", "CQRS", "Event Sourcing", "gRPC", "GraphQL",
  "Orleans", "MQTT", "Docker", "ASP.NET Core",
];

export function SkillTags() {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <motion.span
          key={skill}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          className="rounded-md border border-crimson/30 bg-crimson/10 px-2.5 py-1 font-mono text-xs text-amber"
        >
          {skill}
        </motion.span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create experience item component**

Write `src/components/about/experience-item.tsx`:

```tsx
interface ExperienceItemProps {
  title: string;
  company: string;
  dates: string;
  description: string;
}

export function ExperienceItem({ title, company, dates, description }: ExperienceItemProps) {
  return (
    <div className="mb-4">
      <p className="font-semibold text-sm text-text-body">{title}</p>
      <p className="text-sm text-crimson">{company}</p>
      <p className="font-mono text-xs text-text-dim">{dates}</p>
      <p className="text-sm text-text-muted mt-0.5">{description}</p>
    </div>
  );
}
```

- [ ] **Step 3: Create the about page**

Write `src/app/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SkillTags } from "@/components/about/skill-tags";
import { ExperienceItem } from "@/components/about/experience-item";

export const metadata: Metadata = {
  title: "About — Devbit Consulting | Michael Hultman",
  description:
    "Michael Hultman — System Architect and Senior Developer with 20+ years of experience in distributed systems, C#/.NET, and cloud infrastructure.",
};

export default function AboutPage() {
  return (
    <PageContainer>
      <SectionHeading
        label="About"
        title="Michael Hultman"
        description="System Architect & Senior Developer"
      />

      <p className="text-text-muted mb-6 max-w-2xl">
        With over 20 years in the software industry, I specialize in distributed systems,
        cloud infrastructure, and clean architecture. My expertise lies in the .NET platform,
        especially C#, with deep experience in DDD, CQRS, and Event Sourcing. I run Devbit
        Consulting AB from Vänersborg, Sweden.
      </p>

      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-amber mb-3">
          Expertise
        </p>
        <SkillTags />
      </div>

      <Link
        href="/career"
        className="mb-8 inline-block rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-2 text-sm text-crimson hover:bg-crimson/20 transition-colors"
      >
        View interactive Career Event Stream →
      </Link>

      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">
          Experience
        </p>
        <ExperienceItem
          title="Architect / Developer"
          company="Volvo Energy — Freelancer via Devbit"
          dates="Dec 2023 — Present"
          description="IoT energy cloud backend with MQTT, OCPP, Orleans, AWS, gRPC, GraphQL."
        />
        <ExperienceItem
          title="Architect / Developer"
          company="Stena Line — Consultant via Devbit"
          dates="Jan 2023 — Dec 2023"
          description="Monolith to distributed booking system transformation."
        />
        <ExperienceItem
          title="Architect / Developer"
          company="Worldstream — Consultant via Devbit"
          dates="Sep 2021 — Jan 2023"
          description="Go-based DDD/CQRS/ES systems for VXLAN automation."
        />
        <ExperienceItem
          title="Developer / DevOps"
          company="Cuviva — Consultant"
          dates="Mar 2021 — Sep 2021"
          description="Azure to hybrid cloud migration in Kubernetes for medtech."
        />
        <ExperienceItem
          title="Architect"
          company="Collector Bank"
          dates="Feb 2017 — Mar 2021"
          description="Credit evaluation, anti-fraud, GDPR compliance, and AML on Azure/Kubernetes."
        />
        <ExperienceItem
          title="Software Developer"
          company="Autocom Diagnostic Partner"
          dates="Aug 2007 — Feb 2017"
          description="Vehicle diagnostic tools, licensing systems, and distributed device testing."
        />
      </div>

      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">
          Education
        </p>
        <ExperienceItem
          title="Computer Science / System Development"
          company="University West"
          dates="2001 — 2005"
          description=""
        />
        <ExperienceItem
          title="Business Economics"
          company="Högskolan Trollhättan/Uddevalla"
          dates="1996 — 1998"
          description=""
        />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">
          Languages
        </p>
        <div className="flex gap-4 text-sm text-text-muted">
          <span>Swedish <span className="text-text-dim">(native)</span></span>
          <span>English <span className="text-text-dim">(fluent)</span></span>
          <span>German <span className="text-text-dim">(basic)</span></span>
        </div>
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 4: Verify and commit**

Visit http://localhost:3000/about. Verify all sections render, skill tags animate in, link to career stream works.

```bash
git add src/components/about/ src/app/about/
git commit -m "feat: add about page with traditional CV layout and skill tags"
```

---

### Task 8: Projects Page — Case Studies

**Files:**
- Create: `src/components/projects/project-card.tsx`
- Create: `src/app/projects/page.tsx`

- [ ] **Step 1: Create the project card component**

Write `src/components/projects/project-card.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border border-border bg-surface p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text-primary">{project.title}</h3>
          <p className="text-sm text-crimson">{project.client}</p>
        </div>
        <span className="rounded-md border border-border bg-bg px-2 py-0.5 text-xs text-text-dim">
          {project.domain}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-text-dim mb-1">
            Challenge
          </p>
          <p className="text-text-muted">{project.challenge}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-text-dim mb-1">
            Approach
          </p>
          <p className="text-text-muted">{project.approach}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-text-dim mb-1">
            Result
          </p>
          <p className="text-text-muted">{project.result}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded border border-crimson/20 bg-crimson/5 px-2 py-0.5 font-mono text-xs text-amber"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create the projects page**

Write `src/app/projects/page.tsx`:

```tsx
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Devbit Consulting | Michael Hultman",
  description:
    "Featured case studies: IoT cloud platforms, banking modernization, booking systems, and network automation.",
};

export default function ProjectsPage() {
  return (
    <PageContainer>
      <SectionHeading
        label="Projects"
        title="Case Studies"
        description="Featured engagements across IoT, banking, shipping, and infrastructure."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 3: Verify and commit**

Visit http://localhost:3000/projects. Verify 4 project cards with Challenge/Approach/Result sections, tech tags, and domain labels.

```bash
git add src/components/projects/ src/app/projects/
git commit -m "feat: add projects page with case study cards"
```

---

### Task 9: Contact Page with Form

**Files:**
- Create: `src/components/contact/contact-form.tsx`
- Create: `src/components/contact/contact-info.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/api/contact/route.ts`

- [ ] **Step 1: Create the contact info sidebar**

Write `src/components/contact/contact-info.tsx`:

```tsx
import { Mail, Phone, MapPin } from "lucide-react";
import { contactInfo } from "@/data/site-config";

export function ContactInfo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10">
          <Mail size={16} className="text-crimson" />
        </div>
        <div>
          <p className="text-xs font-medium text-text-body">Email</p>
          <p className="text-sm text-text-muted">{contactInfo.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10">
          <Phone size={16} className="text-crimson" />
        </div>
        <div>
          <p className="text-xs font-medium text-text-body">Phone</p>
          <p className="text-sm text-text-muted">{contactInfo.phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10">
          <MapPin size={16} className="text-crimson" />
        </div>
        <div>
          <p className="text-xs font-medium text-text-body">Location</p>
          <p className="text-sm text-text-muted">{contactInfo.location}</p>
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <p className="text-sm text-text-dim">{contactInfo.availability}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the contact form component**

Write `src/components/contact/contact-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
      reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-body placeholder:text-text-dim focus:border-crimson focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input {...register("name")} placeholder="Your name" className={inputClass} />
        {errors.name && <p className="mt-1 text-xs text-crimson">{errors.name.message}</p>}
      </div>
      <div>
        <input {...register("email")} placeholder="Email address" className={inputClass} />
        {errors.email && <p className="mt-1 text-xs text-crimson">{errors.email.message}</p>}
      </div>
      <div>
        <input {...register("subject")} placeholder="Subject (optional)" className={inputClass} />
      </div>
      <div>
        <textarea
          {...register("message")}
          placeholder="Tell me about your project..."
          rows={5}
          className={`${inputClass} resize-vertical`}
        />
        {errors.message && <p className="mt-1 text-xs text-crimson">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-hover disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      <AnimatePresence>
        {status === "sent" && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-sage"
          >
            Message sent! I&apos;ll get back to you soon.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-crimson"
          >
            Failed to send. Please email me directly at michael@devbit.se.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
```

- [ ] **Step 3: Create the contact API route**

Write `src/app/api/contact/route.ts`:

```typescript
import { NextResponse } from "next/server";

const RATE_LIMIT_MAP = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

export async function POST(req: Request) {
  // Basic rate limiting by IP
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const lastRequest = RATE_LIMIT_MAP.get(ip);
  const now = Date.now();
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }
  RATE_LIMIT_MAP.set(ip, now);

  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: Replace with Resend integration once API key is configured
    // For now, log the contact submission
    console.log("Contact form submission:", { name, email, subject, message });

    // When ready, uncomment and configure:
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "contact@devbit.se",
    //   to: "michael@devbit.se",
    //   subject: `[devbit.se] ${subject || "New contact"}`,
    //   text: `From: ${name} (${email})\n\n${message}`,
    // });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Create the contact page**

Write `src/app/contact/page.tsx`:

```tsx
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "Contact — Devbit Consulting | Michael Hultman",
  description:
    "Get in touch with Michael Hultman at Devbit Consulting. Available for system architecture and senior development contracts.",
};

export default function ContactPage() {
  return (
    <PageContainer>
      <SectionHeading
        label="Contact"
        title="Get In Touch"
        description="Have a project in mind? Let's talk."
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 5: Verify and commit**

Visit http://localhost:3000/contact. Verify form renders, validation works (submit empty to see errors), contact info displays. Submit a test message and check console for the log output.

```bash
git add src/components/contact/ src/app/contact/ src/app/api/
git commit -m "feat: add contact page with validated form and API route"
```

---

### Task 10: SEO, Favicon & Final Polish

**Files:**
- Create: `src/app/sitemap.ts`
- Modify: `src/app/layout.tsx` (add JSON-LD structured data)
- Create: `src/app/favicon.ico` (from logo icon)

- [ ] **Step 1: Generate favicon from logo icon**

Use the logo SVG to create a favicon. Since we can't easily convert SVG to ICO in the CLI, create a simple SVG favicon instead:

Write `src/app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="#a31f2e"/>
  <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" fill="#141210"/>
  <text x="24" y="30" text-anchor="middle" fill="#a31f2e" font-size="14" font-family="monospace" font-weight="bold">&lt;/&gt;</text>
</svg>
```

- [ ] **Step 2: Create sitemap**

Write `src/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://devbit.se";
  const routes = ["", "/services", "/career", "/projects", "/about", "/contact"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
```

- [ ] **Step 3: Add JSON-LD structured data to root layout**

Modify `src/app/layout.tsx` — add a `<script>` tag with JSON-LD in the `<head>` section. Add this inside the `<html>` tag before `<body>`:

```tsx
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
            jobTitle: "System Architect & Senior Developer",
            url: "https://devbit.se",
            email: "michael@devbit.se",
            telephone: "+46737120558",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Vänersborg",
              addressCountry: "SE",
            },
            worksFor: {
              "@type": "Organization",
              name: "Devbit Consulting AB",
            },
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
```

- [ ] **Step 4: Verify build succeeds**

```bash
cd /Users/michaelhultman/Work/devbit-website
npm run build
```

Should complete with no errors. All pages should be statically generated.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/icon.svg src/app/layout.tsx
git commit -m "feat: add SEO — sitemap, JSON-LD structured data, favicon"
```

---

### Task 11: Responsive & Mobile Polish

**Files:**
- Modify: `src/components/diagram/system-diagram.tsx`
- Modify: various components for responsive tweaks

- [ ] **Step 1: Add mobile layout for the diagram**

The React Flow diagram doesn't work well on small screens. Add a mobile fallback that renders the nodes as a vertical list. Modify `src/app/page.tsx`:

```tsx
import dynamic from "next/dynamic";
import { DotGrid } from "@/components/diagram/dot-grid";
import { MobileDiagram } from "@/components/diagram/mobile-diagram";

const SystemDiagram = dynamic(
  () => import("@/components/diagram/system-diagram").then((m) => m.SystemDiagram),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DotGrid />
      <div className="hidden md:block h-screen">
        <SystemDiagram />
      </div>
      <div className="md:hidden">
        <MobileDiagram />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create mobile diagram component**

Write `src/components/diagram/mobile-diagram.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, ScrollText, Star, User, Mail } from "lucide-react";
import { siteLinks } from "@/data/site-config";

const iconMap: Record<string, React.ElementType> = {
  Settings, ScrollText, Star, User, Mail,
};

export function MobileDiagram() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      {/* Hub */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 flex items-center gap-3 rounded-xl border-2 border-crimson bg-gradient-to-br from-[#1e120f] to-bg px-6 py-4 shadow-[0_0_40px_rgba(163,31,46,0.12)]"
      >
        <div className="clip-hexagon flex h-12 w-12 items-center justify-center bg-crimson">
          <div className="clip-hexagon flex h-10 w-10 items-center justify-center bg-[#1e120f]">
            <span className="font-mono text-xs font-semibold text-crimson">&lt;/&gt;</span>
          </div>
        </div>
        <div>
          <div className="text-xl font-bold tracking-wider text-text-primary">DEVBIT</div>
          <div className="text-xs font-medium tracking-widest text-crimson">consulting</div>
        </div>
      </motion.div>

      {/* Connection line */}
      <div className="mb-4 h-8 w-px bg-gradient-to-b from-crimson to-crimson/20" />

      {/* Nodes */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        {siteLinks.map((link, i) => {
          const Icon = iconMap[link.icon] ?? Settings;
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link
                href={link.href}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-all hover:border-crimson hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)]"
              >
                <div className="clip-hexagon flex h-9 w-9 shrink-0 items-center justify-center bg-crimson/10 border border-crimson/25">
                  <Icon size={16} className="text-crimson" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-body">{link.label}</p>
                  <p className="text-xs text-text-dim">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Test responsive behavior**

Resize the browser window and verify:
- Desktop (>= 768px): React Flow diagram shows
- Mobile (< 768px): Vertical node list shows
- All section pages stack properly on mobile
- Contact form goes single-column on mobile
- Header hamburger menu works

- [ ] **Step 4: Commit**

```bash
git add src/components/diagram/mobile-diagram.tsx src/app/page.tsx
git commit -m "feat: add mobile-responsive diagram and layout polish"
```

---

### Task 12: Final Build Verification

- [ ] **Step 1: Run production build**

```bash
cd /Users/michaelhultman/Work/devbit-website
npm run build
```

Verify no build errors. All pages should be listed as static.

- [ ] **Step 2: Test production server**

```bash
npm run start
```

Visit http://localhost:3000 and test:
- Homepage diagram loads with animations
- All 5 section links work from diagram
- Career event stream expands/collapses
- Contact form validates and submits
- Mobile nav works
- Back-to-diagram links work from all pages

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final build verification — all pages working"
```
