# CV Unified Timeline Design

## Problem

The CV PDF has two sections — **Experience** and **Consulting Assignments** — that duplicate the same information. Consulting roles (Devbit, Evolve/Afry) appear in Experience with child projects as bullets, then those same child projects appear again as standalone entries in Assignments. This is redundant and wastes space.

## Solution

Replace both sections with a single **unified chronological timeline** that distinguishes employment from consulting via visual markers.

## Design Decisions

### Timeline Layout (Approach A — Vertical Timeline with "via" Tags)

- Single reverse-chronological list replacing both Experience and Assignments sections
- Each entry leads with the **company/client name** and role
- Consulting entries include a small "via [consulting firm]" tag below the headline
- A vertical line runs down the left side connecting all entries
- **Filled dot** (crimson `#a31f2e`) = direct employment
- **Ring dot** (amber `#c4956a` outline, surface fill) = consulting assignment
- A small legend at the top of the section explains the two dot types

### Entry Detail (Approach A — Bullets Under Entry)

**Consulting entries** (children of Devbit/Evolve roles): Each child project becomes a top-level timeline entry with:
- Client name (bold) + role
- Date range
- "via [Devbit Consulting / Evolve/Afry]" tag
- Scope description (one line)

**Employment entries** (Collector Bank, Autocom): One timeline entry per employer with:
- Company name (bold) + role
- Date range
- Child projects rendered as bullet points underneath

**Education**: Remains a separate section below the timeline (unchanged).

### Data Layer (Approach A — Transform in cv-data.ts Only)

- `career-events.ts` and `CareerEvent` type remain unchanged — the parent/child structure is still used by the career page
- `cv-data.ts` builds a new `timeline` array that:
  1. Identifies consulting roles by `consultingRoleIds` (already exists)
  2. Flattens consulting role children into top-level entries, annotating each with the parent firm name and inheriting the parent's `payload.role` (since children don't have their own role)
  3. Keeps employment roles as-is with their children (for bullet rendering)
  4. Sorts everything reverse-chronologically
- The `experience` and `assignments` fields on `cvData` are replaced by a single `timeline` field
- A new `TimelineEntry` type is introduced in `cv-data.ts` (not in `types.ts`) to represent the unified shape

### TimelineEntry Shape

```typescript
interface TimelineEntry {
  id: string;
  company: string;        // Client name (consulting) or employer name
  role: string;           // Role title
  startDate: string;      // e.g. "2023-12"
  endDate?: string;       // e.g. "2025-06" or "present"
  type: "employment" | "consulting";
  via?: string;           // Consulting firm name (only for type: "consulting")
  description?: string;   // Scope text (consulting entries)
  highlights?: string[];  // Bullet points (employment entries with children)
}
```

### CV Document Changes

- Remove the Experience section renderer
- Remove the Assignments section renderer
- Add a single Timeline section renderer that:
  - Draws a vertical line (left border on a container)
  - For each entry, renders a dot (filled or ring based on `type`)
  - Shows company, role, dates on the header line
  - Shows "via" tag for consulting entries
  - Shows description for consulting entries, bullet list for employment entries
- Add a small legend below the section title showing the two dot types

### CvDocumentProps Changes

Replace:
```typescript
experience: (CareerEvent & { type: "RoleStarted" })[];
assignments: CareerEvent[];
```

With:
```typescript
timeline: TimelineEntry[];
```

### PDF Styles

New styles needed:
- `timeline` — container with left border (vertical line)
- `timelineDotEmployment` — 8-10pt filled circle, crimson, absolute positioned left of the line
- `timelineDotConsulting` — 8-10pt ring (border only), amber, absolute positioned left of the line
- `timelineEntry` — entry container with left padding for the dot
- `viaTag` — small pill/badge with bg background and border
- `legend` — horizontal flex row with dot samples and labels

Reuse existing styles: `entryHead`, `entryTitles`, `role`, `company`, `dates`, `bullets`, `bullet`.

### Color Usage

- Crimson (`#a31f2e`) — employment dot, company name
- Amber (`#c4956a`) — consulting dot ring, section title (already used)
- Surface (`#faf7f3`) — consulting dot fill (transparent look)
- Bg (`#f0eae2`) — "via" tag background
- Border (`#ddd5cb`) — timeline line, "via" tag border

## Files Changed

1. **`src/data/cv-data.ts`** — Replace `experience` + `assignments` with `timeline` builder. Add `TimelineEntry` interface.
2. **`src/components/cv/cv-document.tsx`** — Update `CvDocumentProps`, remove Experience/Assignments renderers, add Timeline renderer with dot styles and legend.

## Files NOT Changed

- `src/data/career-events.ts` — data structure unchanged
- `src/lib/types.ts` — `CareerEvent` type unchanged
- Career page and other pages — unaffected

## Scope

- PDF CV only (the `@react-pdf/renderer` document)
- No changes to the website career page or event stream model
- No new dependencies
