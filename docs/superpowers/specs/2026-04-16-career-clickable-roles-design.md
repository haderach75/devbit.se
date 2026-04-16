# Career Page: Make Expandable Roles Clearly Clickable

## Problem

Visitors don't realize that `RoleStarted` events on the career page are expandable to show project details. The only cues are a tiny 12px dim chevron and a comment line that's easy to miss. All event types look visually identical regardless of interactivity.

## Solution: Auto-Expand First + Hover States

### Changes

#### 1. Auto-expand first role

- `EventStream` passes a `defaultExpanded` prop to the first `CareerEvent` that has children
- That event renders with `expanded = true` on mount
- Visitors immediately see the expand mechanic demonstrated

#### 2. Bigger, colored chevron

- `ChevronDown` size increases from 12px to 16px
- Color matches the event type color (e.g. crimson for `RoleStarted`) instead of `text-text-dim`

#### 3. Hover state on expandable roles

- The clickable div gets `hover:bg-crimson/5 rounded-lg transition-colors` plus small padding
- Provides immediate interactive feedback on hover

#### 4. Project count hint on collapsed roles

- Show `// {N} projects` in dim text next to the chevron when collapsed
- Communicates hidden content exists
- Hidden when expanded

#### 5. Remove comment line

- Delete `// click a role to expand project details` from `EventStream`
- Redundant once the first role auto-expands

### Files changed

| File | Change |
|------|--------|
| `src/components/career/event-stream.tsx` | Pass `defaultExpanded` to first expandable event, remove comment line |
| `src/components/career/career-event.tsx` | Accept `defaultExpanded` prop, bigger/colored chevron, hover styles, project count badge |

### No new files or dependencies
