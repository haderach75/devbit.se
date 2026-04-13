# CV Unified Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the duplicated Experience + Assignments sections in the PDF CV with a single unified chronological timeline that distinguishes employment from consulting via visual dot markers and "via" tags.

**Architecture:** `cv-data.ts` transforms the existing `CareerEvent` parent/child tree into a flat `TimelineEntry[]` — consulting role children become top-level entries with a `via` field, employment roles keep their children as `highlights`. `cv-document.tsx` renders this as a vertical timeline with filled dots (employment) and ring dots (consulting). No changes to `career-events.ts` or `types.ts`.

**Tech Stack:** Next.js 16, TypeScript, `@react-pdf/renderer`, Tailwind CSS v4

**Spec:** `docs/superpowers/specs/2026-04-13-cv-unified-timeline-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/data/cv-data.ts` | Modify | Add `TimelineEntry` interface, replace `experience` + `assignments` with `timeline` builder |
| `src/components/cv/cv-document.tsx` | Modify | Update `CvDocumentProps`, add timeline styles, replace Experience/Assignments renderers with Timeline renderer |

No new files. No changes to `src/data/career-events.ts`, `src/lib/types.ts`, or any page components.

---

### Task 1: Build the TimelineEntry data layer in cv-data.ts

**Files:**
- Modify: `src/data/cv-data.ts`

- [ ] **Step 1: Add the TimelineEntry interface and build the timeline array**

Replace the entire contents of `src/data/cv-data.ts` with:

```typescript
import { careerEvents } from "@/data/career-events";
import { contactInfo } from "@/data/site-config";
import { skills } from "@/data/skills";
import { languages } from "@/data/languages";

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

function buildTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const evt of careerEvents) {
    if (evt.type !== "RoleStarted") continue;

    if (consultingRoleIds.includes(evt.id)) {
      // Flatten consulting children into top-level entries
      for (const child of evt.children ?? []) {
        entries.push({
          id: child.id,
          company: child.source,
          role: evt.payload.role ?? "Consultant",
          startDate: child.timestamp,
          endDate: child.endTimestamp,
          type: "consulting",
          via: evt.source,
          description: child.payload.scope,
        });
      }
    } else {
      // Employment: keep as single entry with highlights from children
      entries.push({
        id: evt.id,
        company: evt.source,
        role: evt.payload.role ?? "",
        startDate: evt.timestamp,
        endDate: evt.endTimestamp,
        type: "employment",
        highlights: (evt.children ?? []).map((c) => c.payload.scope ?? ""),
      });
    }
  }

  return entries.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export const cvData = {
  name: "Michael Hultman",
  title: "Senior System Architect / Developer",
  photo: "https://devbit.se/michael.jpg",
  contact: contactInfo,
  linkedin: "https://www.linkedin.com/in/michael-hultman-28545741/",
  skills,
  languages,
  timeline: buildTimeline(),
  education: careerEvents.filter(
    (e) => e.type === "EducationCompleted"
  ),
};
```

Key changes from current file:
- Removed `import type { CareerEvent }` (no longer needed for type assertions)
- Added `TimelineEntry` interface (exported for use by cv-document)
- Added `buildTimeline()` that flattens consulting children and keeps employment roles with highlights
- Replaced `experience` and `assignments` fields with single `timeline` field
- Kept `education` as-is (unchanged in spec)

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`
Expected: Build succeeds with no type errors. The build will fail because `cv-document.tsx` still references the old props shape — that's expected and will be fixed in Task 2.

- [ ] **Step 3: Commit**

```bash
git add src/data/cv-data.ts
git commit -m "feat: replace experience/assignments with unified timeline in cv-data"
```

---

### Task 2: Update CvDocument props and styles

**Files:**
- Modify: `src/components/cv/cv-document.tsx`

- [ ] **Step 1: Update CvDocumentProps and add new styles**

In `src/components/cv/cv-document.tsx`, replace the `import type { CareerEvent }` line at the top:

```typescript
import { Document, Page, Text, View, Link, Image, StyleSheet, Font } from "@react-pdf/renderer";
import type { TimelineEntry } from "@/data/cv-data";
```

Replace the `CvDocumentProps` interface (lines 188–202) with:

```typescript
interface CvDocumentProps {
  data: {
    name: string;
    title: string;
    photo: string;
    contact: { email: string; phone: string; location: string };
    linkedin: string;
    skills: string[];
    languages: { name: string; level: string }[];
    timeline: TimelineEntry[];
    education: { id: string; timestamp: string; endTimestamp?: string; source: string; payload: { degree?: string } }[];
  };
  omitContact?: boolean;
}
```

Add these new styles to the `StyleSheet.create({...})` block, after the existing `assignmentScope` style (before the closing `});`):

```typescript
  // Timeline
  timeline: {
    position: "relative",
    paddingLeft: 16,
    borderLeftWidth: 1.5,
    borderLeftColor: c.border,
    marginLeft: 5,
  },
  timelineEntry: {
    marginBottom: 8,
    position: "relative",
  },
  timelineDotEmployment: {
    position: "absolute",
    left: -21.25,
    top: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.crimson,
  },
  timelineDotConsulting: {
    position: "absolute",
    left: -21.25,
    top: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.surface,
    borderWidth: 2,
    borderColor: c.amber,
  },
  viaTag: {
    backgroundColor: c.bg,
    borderWidth: 0.5,
    borderColor: c.border,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 7,
    color: c.muted,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  legendDotEmployment: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: c.crimson,
  },
  legendDotConsulting: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: c.surface,
    borderWidth: 1.5,
    borderColor: c.amber,
  },
  legendText: {
    fontSize: 7,
    color: c.dim,
  },
```

Note on dot positioning: The timeline container has `paddingLeft: 16` and `marginLeft: 5`. The border is at the left edge of the padding. The dots are `width: 10` and positioned at `left: -21.25` which centers them on the border line: `-(paddingLeft + (dotWidth / 2))` = `-(16 + 5.25)` adjusted to `-(16 + 5)` = `-21`, plus a small offset to account for border width = `-21.25`.

- [ ] **Step 2: Commit styles and props update**

```bash
git add src/components/cv/cv-document.tsx
git commit -m "feat: add timeline styles and update CvDocumentProps"
```

---

### Task 3: Replace Experience and Assignments renderers with Timeline

**Files:**
- Modify: `src/components/cv/cv-document.tsx`

- [ ] **Step 1: Replace the Experience and Assignments sections with the Timeline renderer**

In the `CvDocument` component's JSX, remove the `{/* Experience */}` section (the `<View style={s.section}>` block containing `data.experience.map`) and the `{/* Assignments */}` section (the conditional block containing `data.assignments`).

Replace both with this single Timeline section, placed after the Expertise section and before the Education section:

```tsx
        {/* Timeline */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Experience</Text>
          <View style={s.legend}>
            <View style={s.legendItem}>
              <View style={s.legendDotEmployment} />
              <Text style={s.legendText}>Employed</Text>
            </View>
            <View style={s.legendItem}>
              <View style={s.legendDotConsulting} />
              <Text style={s.legendText}>Consulting</Text>
            </View>
          </View>
          <View style={s.timeline}>
            {data.timeline.map((entry) => (
              <View key={entry.id} style={s.timelineEntry} wrap={false}>
                <View
                  style={
                    entry.type === "employment"
                      ? s.timelineDotEmployment
                      : s.timelineDotConsulting
                  }
                />
                <View style={s.entryHead}>
                  <View style={s.entryTitles}>
                    <Text style={s.company}>{entry.company}</Text>
                    <Text style={s.at}>—</Text>
                    <Text style={s.role}>{entry.role}</Text>
                  </View>
                  <Text style={s.dates}>
                    {fmtDates(entry.startDate, entry.endDate)}
                  </Text>
                </View>
                {entry.via && (
                  <View style={s.viaTag}>
                    <Text>via {entry.via}</Text>
                  </View>
                )}
                {entry.description && (
                  <View style={s.bullets}>
                    <Text style={s.bullet}>{entry.description}</Text>
                  </View>
                )}
                {entry.highlights && entry.highlights.length > 0 && (
                  <View style={s.bullets}>
                    {entry.highlights.map((h, i) => (
                      <Text key={i} style={s.bullet}>
                        • {h}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
```

- [ ] **Step 2: Clean up unused styles**

Remove these styles from the `StyleSheet.create` block that are no longer used (they were only used by the Assignments section):
- `assignmentEntry`
- `assignmentHead`
- `assignmentClient`
- `assignmentScope`

- [ ] **Step 3: Verify the build passes**

Run: `npm run build`
Expected: Clean build, no type errors, all 8 static pages generated.

- [ ] **Step 4: Commit**

```bash
git add src/components/cv/cv-document.tsx
git commit -m "feat: replace Experience/Assignments with unified timeline renderer"
```

---

### Task 4: Visual verification

**Files:** None (verification only)

- [ ] **Step 1: Start dev server and generate the PDF**

Run: `npm run dev`

Open `http://localhost:3000/about` in a browser. Click "Download CV" and open the generated PDF.

Verify:
1. Single "Experience" section with a vertical line on the left
2. Legend shows filled crimson dot = "Employed", amber ring = "Consulting"
3. Consulting entries (Worldstream deployer, Volvo Energy, Stena Line, Worldstream freelance, Worldstream VXLAN, Cuviva) each show:
   - Client name in crimson, role, dates
   - "via Devbit Consulting" or "via Evolve / Afry" tag
   - Scope description text
   - Amber ring dot
4. Employment entries (Collector Bank, Autocom) each show:
   - Company name in crimson, role, dates
   - Bullet list of project highlights
   - Filled crimson dot
5. Entries are in reverse-chronological order (newest first)
6. Education and Languages sections render unchanged at the bottom
7. No duplicate information between any entries
8. Broker variant ("Download CV (Broker)") also renders correctly with contact info hidden

- [ ] **Step 2: Fix any visual issues**

If dot alignment, spacing, or font sizes need tweaking, adjust the style values in `cv-document.tsx` and regenerate.

- [ ] **Step 3: Final commit if any tweaks were made**

```bash
git add src/components/cv/cv-document.tsx
git commit -m "fix: adjust timeline visual styling"
```
