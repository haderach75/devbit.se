# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- **Dev server**: `npm run dev` (Next.js dev server on port 3000)
- **Build**: `npm run build` (static export to `out/`)
- **Lint**: `npm run lint` (ESLint with Next.js core-web-vitals + TypeScript rules)
- No test framework is configured.

## Architecture

This is the **Devbit Consulting** personal/portfolio website for Michael Hultman. It is a **statically exported** Next.js 16 site (`output: "export"` in `next.config.ts`) — there are no API routes, no server-side rendering at request time, and no server actions. The contact form opens a `mailto:` link.

### Key Concepts

**Event Storming homepage**: The landing page (`src/app/page.tsx`) is a custom Event Storming board built with Framer Motion — colored sticky notes (domain events, commands, aggregates, policies) representing a customer journey. Yellow "aggregate" notes are clickable and navigate to site pages. There is a separate mobile layout (`mobile-board.tsx`). This is not a standard component library — it's bespoke.

**Career Event Stream**: Career history is modeled as domain events (`CareerEvent` type in `src/lib/types.ts`) with `RoleStarted`, `ProjectDelivered`, `EducationCompleted`, etc. Events have parent-child relationships (roles contain project children). Data lives in `src/data/career-events.ts`.

**PDF CV generation**: The About page includes a client-side PDF download button using `@react-pdf/renderer`. The CV document (`src/components/cv/cv-document.tsx`) renders career data into a styled A4 PDF. CV data is assembled in `src/data/cv-data.ts`.

**System Diagram** (legacy): `src/components/diagram/` contains a React Flow-based navigation diagram (`@xyflow/react`). The current homepage uses the Event Storming board instead, but this code remains.

### Data Layer

All site content is in typed static data files under `src/data/`:
- `career-events.ts` — career timeline (event-sourced structure)
- `services.ts` — consulting services
- `projects.ts` — case study data
- `site-config.ts` — navigation links, contact info
- `skills.ts` / `languages.ts` — about page data
- `cv-data.ts` — assembles other data files into the PDF CV shape

### Styling

- **Tailwind CSS v4** with `@tailwindcss/postcss` — config is in `src/styles/globals.css` via `@theme` (no `tailwind.config.js`)
- Custom color tokens: `bg`, `surface`, `border`, `crimson`, `amber`, `sage`, `text-primary`, `text-body`, `text-muted`, `text-dim`
- Dark mode via `.dark` class with CSS variable overrides
- Three fonts via `next/font/google`: Inter (sans), JetBrains Mono (mono), DM Serif Display (logo)

### Layout Patterns

- `src/app/layout.tsx` — root layout with Header, JSON-LD structured data, font variables on `<html>`
- `PageContainer` — shared wrapper for all sub-pages (back-to-diagram link, max-width, entrance animation)
- `SectionHeading` — reusable page header with label/title/description
- All sub-pages are server components; interactive parts are `"use client"` leaf components

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
