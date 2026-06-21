# Superpowers Section — Design Spec

## Overview

Add a new "Superpowers" section to the existing AI vs Traditional Development courseware site. The section introduces students to the Superpowers skill ecosystem as part of the AI development toolchain, placed logically after the VibeCodingIntro section to reinforce the message: "Claude Code + Superpowers = a complete AI-assisted workflow."

**New component:** `src/app/components/SuperpowersSection.tsx`
**Data layer:** `src/app/components/superpowers/workflowData.ts`
**Insertion point:** `App.tsx`, between `<VibeCodingIntro />` and `<ProjectBrief />`

## Layout: Interactive Workflow

The section uses an **interactive accordion workflow** pattern:

- **5 phases** displayed horizontally (desktop) / vertically (mobile)
- **Default state:** Phase 1 expanded, others collapsed
- **On click:** the clicked phase expands, the previously expanded phase collapses (single-expand accordion)
- Each phase, when expanded, reveals **skill cards** — detailing the Superpowers skills relevant to that phase

### Phase-to-Skill Mapping

| # | Phase | Key | Skills |
|---|-------|-----|--------|
| 1 | Brainstorm | `brainstorm` | brainstorming |
| 2 | Plan | `plan` | writing-plans |
| 3 | Develop | `develop` | tdd, subagent-driven-development, using-git-worktrees, dispatching-parallel-agents |
| 4 | Review | `review` | requesting-code-review, receiving-code-review, verification-before-completion |
| 5 | Ship | `ship` | finishing-a-development-branch |

### Skill Card Content

Each card shows:
- **Skill name** (via `Badge` component)
- **One-line description** of what the skill does
- **"When to use"** hint in muted text

## Data Model

```ts
interface Skill {
  name: string;        // e.g. "brainstorming"
  title: string;       // e.g. "Brainstorming"
  description: string; // one-line summary
  whenToUse: string;   // typical trigger scenario
  phase: 'brainstorm' | 'plan' | 'develop' | 'review' | 'ship';
}

interface Phase {
  key: string;   // "brainstorm"
  label: string; // "1. Brainstorm"
  icon: string;  // lucide icon name — "Lightbulb", "ClipboardList", "Code", "SearchCheck", "Rocket"
}
```

Skills and phases are defined as plain arrays in `workflowData.ts`. The component reads from these arrays — no data in JSX.

## Visual Design

### Phase Header (collapsed)
- Muted text, no left border
- Shows phase number + label + skill-count badge

### Phase Header (expanded)
- `text-primary` color
- Left colored vertical bar (3px, `bg-primary`)
- Badge still visible

### Skill Cards
- `bg-card` background, rounded, padding
- Top: `Badge` with skill name
- Middle: description text
- Bottom: `text-muted-foreground text-sm` with "When to use" hint
- Cards wrap via flexbox; no fixed width — they fill available space

### Phase Connectors
- Between phases: a horizontal dashed line (desktop) or vertical dashed line (mobile)
- Shows flow direction without arrows

### Responsive
- **Desktop (≥768px):** phases in a horizontal row, connectors horizontal
- **Mobile (<768px):** phases stack vertically, connectors vertical

## Navigation

Add one entry to the existing `navLinks` array in `App.tsx`:

```ts
{ href: "#superpowers", label: "Superpowers" }
```

Add an `id="superpowers"` on the section wrapper element.

## Components & Imports

**Reused from kit / project:**
- `Card` from `./ui/card`
- `Badge` from `./ui/badge`
- Lucide icons (already in dependencies)

**No new dependencies required.**

## Out of Scope

- Animations beyond what CSS transitions on accordion naturally provide
- Hyperlinks to actual Superpowers documentation (can be added later)
- i18n
- Any backend or data fetching

## Verification

1. Section renders between VibeCodingIntro and ProjectBrief in the scroll order
2. Nav link scrolls to the section
3. Clicking a collapsed phase expands it and collapses the previously expanded one
4. Skill cards render with correct name, description, and when-to-use text
5. Responsive: horizontal layout on desktop, vertical on mobile
6. No TypeScript or console errors
7. Existing sections render unchanged
