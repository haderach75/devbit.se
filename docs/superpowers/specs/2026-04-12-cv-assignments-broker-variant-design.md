# CV: Assignments Timeline + Broker Variant

## Summary

Two enhancements to the PDF CV:

1. **Assignments section** — a dedicated timeline of consulting assignments (clients, scopes, dates) shown after the Experience section
2. **Broker variant** — a downloadable CV version with contact details (email, phone, LinkedIn) omitted, for contract brokers who don't want clients to bypass them

## Current State

- `CvDocument` renders: header (photo, name, title, contact, LinkedIn), expertise pills, experience (roles with bullet-point scopes), education, languages
- `DownloadCvButton` is a single button that generates the full CV
- Career data in `career-events.ts` already has `timestamp`/`endTimestamp` on child projects
- Projects data in `projects.ts` exists but is separate from career events

## Design

### 1. Assignments Section in CvDocument

**What:** New "Assignments" section rendered between "Experience" and "Education".

**Data source:** Flatten children from two consulting-era roles in `careerEvents`:
- `devbit-freelance` (Devbit Consulting AB, 2022–present)
- `evolve-afry` (Evolve / Afry, 2021–2022)

This yields 6 assignments: Worldstream Deployer, Volvo Energy, Stena Line, Worldstream (freelance continuation), Worldstream VXLAN, Cuviva.

**Layout per assignment:**
- Client name (bold, crimson) + date range (right-aligned, dim)
- Scope text below (muted, same style as current bullets)

**Sort:** By start date descending (most recent first).

### 2. CvDocumentProps Changes

Add to the `data` shape:
```typescript
assignments: CareerEvent[]
```

Add to the component props:
```typescript
omitContact?: boolean
```

### 3. Contact Omission (Broker Variant)

When `omitContact` is `true`:
- **Hide:** email, phone, LinkedIn link
- **Keep:** photo, location, name, title

The location (Vänersborg, Sweden) stays because it indicates availability zone without enabling direct contact.

### 4. cv-data.ts Changes

Add `assignments` field that:
1. Filters `careerEvents` for roles with ids `devbit-freelance` and `evolve-afry`
2. Flatmaps their `children` arrays
3. Sorts by `timestamp` descending

### 5. Download Buttons

Replace single `DownloadCvButton` with two buttons side by side:

| Button | Label | omitContact | Filename |
|--------|-------|-------------|----------|
| Full | "Download CV" | `false` | `michael-hultman-cv.pdf` |
| Broker | "Download CV (Broker)" | `true` | `michael-hultman-cv-broker.pdf` |

Both buttons share the same component logic, parameterized by a `variant` prop.

## Files Changed

| File | Change |
|------|--------|
| `src/components/cv/cv-document.tsx` | Add Assignments section, add `omitContact` conditional rendering in header |
| `src/data/cv-data.ts` | Add `assignments` field extracting consulting project children |
| `src/components/cv/download-cv-button.tsx` | Refactor to accept variant prop, export two button instances |
| `src/app/about/page.tsx` | Render both download buttons |

## Out of Scope

- No changes to the website's project page or career event stream
- No dark mode variant for the PDF
- No changes to Autocom or Collector Bank data (those stay as Experience bullets only)
- No server-side generation — remains fully client-side with `@react-pdf/renderer`
