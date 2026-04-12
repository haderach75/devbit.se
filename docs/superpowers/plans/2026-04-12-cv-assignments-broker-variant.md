# CV Assignments Timeline + Broker Variant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated Assignments timeline section to the PDF CV and a broker-friendly download variant that omits contact details.

**Architecture:** The existing `CvDocument` component gets an Assignments section (between Experience and Education) and an `omitContact` prop that conditionally hides email/phone/LinkedIn. Data assembly happens in `cv-data.ts`. The download button is refactored to accept a variant prop, and the About page renders two buttons.

**Tech Stack:** React, @react-pdf/renderer, TypeScript, Next.js

---

### Task 1: Add assignments data to cv-data.ts

**Files:**
- Modify: `src/data/cv-data.ts`

- [ ] **Step 1: Add assignments field to cvData**

The consulting role IDs are `devbit-freelance` and `evolve-afry`. Extract their children, flatten, and sort by timestamp descending.

```typescript
import { careerEvents } from "@/data/career-events";
import { contactInfo } from "@/data/site-config";
import { skills } from "@/data/skills";
import { languages } from "@/data/languages";
import type { CareerEvent } from "@/lib/types";

const consultingRoleIds = ["devbit-freelance", "evolve-afry"];

export const cvData = {
  name: "Michael Hultman",
  title: "Senior System Architect / Developer",
  photo: "https://devbit.se/michael.jpg",
  contact: contactInfo,
  linkedin: "https://www.linkedin.com/in/michael-hultman-28545741/",
  skills,
  languages,
  experience: careerEvents.filter(
    (e): e is CareerEvent & { type: "RoleStarted" } => e.type === "RoleStarted"
  ),
  education: careerEvents.filter(
    (e): e is CareerEvent & { type: "EducationCompleted" } => e.type === "EducationCompleted"
  ),
  assignments: careerEvents
    .filter((e) => consultingRoleIds.includes(e.id))
    .flatMap((e) => e.children ?? [])
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds (assignments is just a new data field, nothing consumes it yet)

- [ ] **Step 3: Commit**

```bash
git add src/data/cv-data.ts
git commit -m "feat: add consulting assignments data to cvData"
```

---

### Task 2: Add Assignments section and omitContact to CvDocument

**Files:**
- Modify: `src/components/cv/cv-document.tsx`

- [ ] **Step 1: Update CvDocumentProps interface**

Replace the existing interface at line 167-179:

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
    experience: (CareerEvent & { type: "RoleStarted" })[];
    education: (CareerEvent & { type: "EducationCompleted" })[];
    assignments: CareerEvent[];
  };
  omitContact?: boolean;
}
```

- [ ] **Step 2: Add assignment-specific styles**

Add these styles to the `StyleSheet.create` call, after the existing `langText` style (before the closing `});`):

```typescript
  // Assignments
  assignmentEntry: {
    marginBottom: 6,
  },
  assignmentHead: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "baseline" as const,
    marginBottom: 1,
  },
  assignmentClient: {
    fontWeight: 600,
    color: c.crimson,
    fontSize: 9.5,
  },
  assignmentScope: {
    color: c.muted,
    fontSize: 8.5,
    lineHeight: 1.4,
    paddingLeft: 6,
  },
```

- [ ] **Step 3: Add omitContact conditional to header**

Replace the contact row JSX (lines 198-210) with conditional rendering. The full header `<View style={s.header}>` block becomes:

```tsx
        <View style={s.header}>
          <Image style={s.photo} src={data.photo} />
          <View style={s.headerText}>
            <Text style={s.name}>{data.name}</Text>
            <Text style={s.title}>{data.title}</Text>
            {!omitContact ? (
              <View style={s.contactRow}>
                <Link src={`mailto:${data.contact.email}`} style={s.link}>
                  <Text>{data.contact.email}</Text>
                </Link>
                <Text style={s.sep}>·</Text>
                <Text>{data.contact.phone}</Text>
                <Text style={s.sep}>·</Text>
                <Text>{data.contact.location}</Text>
                <Text style={s.sep}>·</Text>
                <Link src={data.linkedin} style={s.link}>
                  <Text>LinkedIn Profile</Text>
                </Link>
              </View>
            ) : (
              <View style={s.contactRow}>
                <Text>{data.contact.location}</Text>
              </View>
            )}
          </View>
        </View>
```

- [ ] **Step 4: Add Assignments section between Experience and Education**

Insert this JSX block after the Experience `</View>` closing tag and before the `{/* Education */}` comment:

```tsx
        {/* Assignments */}
        {data.assignments.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Consulting Assignments</Text>
            {data.assignments.map((a) => (
              <View key={a.id} style={s.assignmentEntry} wrap={false}>
                <View style={s.assignmentHead}>
                  <Text style={s.assignmentClient}>{a.source}</Text>
                  <Text style={s.dates}>{fmtDates(a.timestamp, a.endTimestamp)}</Text>
                </View>
                {a.payload.scope && (
                  <Text style={s.assignmentScope}>{a.payload.scope}</Text>
                )}
              </View>
            ))}
          </View>
        )}
```

- [ ] **Step 5: Update function signature to destructure omitContact**

Change line 187 from:
```tsx
export function CvDocument({ data }: CvDocumentProps) {
```
to:
```tsx
export function CvDocument({ data, omitContact = false }: CvDocumentProps) {
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/components/cv/cv-document.tsx
git commit -m "feat: add Assignments section and omitContact prop to CvDocument"
```

---

### Task 3: Refactor DownloadCvButton to support variants

**Files:**
- Modify: `src/components/cv/download-cv-button.tsx`

- [ ] **Step 1: Rewrite the component to accept a variant prop**

Replace the entire file contents with:

```tsx
"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadCvButtonProps {
  variant?: "full" | "broker";
}

export function DownloadCvButton({ variant = "full" }: DownloadCvButtonProps) {
  const [loading, setLoading] = useState(false);
  const isBroker = variant === "broker";

  async function handleDownload() {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CvDocument } = await import("./cv-document");
      const { cvData } = await import("@/data/cv-data");
      const blob = await pdf(
        <CvDocument data={cvData} omitContact={isBroker} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = isBroker
        ? "michael-hultman-cv-broker.pdf"
        : "michael-hultman-cv.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const label = isBroker ? "Download CV (Broker)" : "Download CV";
  const loadingLabel = "Generating...";

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="mb-8 inline-flex items-center gap-2 rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-crimson hover:bg-crimson/20 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {loading ? loadingLabel : label}
    </button>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds. The existing `<DownloadCvButton />` in about/page.tsx still works (variant defaults to "full").

- [ ] **Step 3: Commit**

```bash
git add src/components/cv/download-cv-button.tsx
git commit -m "feat: add variant prop to DownloadCvButton for broker CV"
```

---

### Task 4: Add broker download button to About page

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Add the broker button next to the existing one**

In `src/app/about/page.tsx`, find the line (around line 50):

```tsx
        <DownloadCvButton />
```

Replace it with:

```tsx
        <DownloadCvButton />
        <DownloadCvButton variant="broker" />
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, static export completes.

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`

1. Open http://localhost:3000/about
2. Verify two buttons appear: "Download CV" and "Download CV (Broker)"
3. Click "Download CV" — PDF should have: photo, full contact info, Expertise, Experience, **Consulting Assignments** (6 entries with dates), Education, Languages
4. Click "Download CV (Broker)" — PDF should have: photo, location only (no email/phone/LinkedIn), same sections including Consulting Assignments

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add broker CV download button to About page"
```
