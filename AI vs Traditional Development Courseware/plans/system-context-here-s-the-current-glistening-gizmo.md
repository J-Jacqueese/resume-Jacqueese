# Courseware: AI-Assisted Development vs Traditional Development (with Claude Code Vibe Coding)

## Context

The user wants a complete courseware website (built as a Figma Make React app) that teaches university students the differences between traditional development and AI-assisted "Vibe Coding" with Claude Code, including a hands-on full-stack Three.js project using Harness + Superpowers, with database-backed backend. Deliverables are presented as interactive HTML handouts plus step-by-step manuals from init to deployment.

This is a content-heavy single-page React app — no real backend will be wired (per Make environment); the "backend + DB" portion lives inside the *taught content* (the example project), not the courseware app itself.

## Scope & Approach

Build a multi-section courseware site in `src/app/App.tsx` composed of modular section components. Use the existing design system (`@figma/astraui-kit` per Guidelines.md) and CSS variables from `styles/globals.css` for all colors/typography/spacing. Read setup.md and Guidelines.md from the kit before coding.

## Suggested Project Theme (for the taught Three.js project)

**"Campus 3D Explorer"** — a web app where students browse an interactive 3D model of a university campus, click buildings to see info, and leave/read reviews.
- Frontend: React + Three.js (react-three-fiber) for the 3D scene.
- Backend: Node/Express REST API.
- Database: PostgreSQL (or SQLite for local) storing buildings, reviews, users.
- Scope is moderate: one 3D scene, CRUD on reviews, simple auth.

Alternative themes listed briefly in the courseware (Solar System Quiz, 3D Portfolio Gallery) so instructors can swap.

## Courseware Site Structure

Single-page app with sticky top nav and the following sections (each its own component under `src/app/components/`):

1. **Hero** — title, subtitle, CTA to download handout / start lab.
2. **CourseOverview** — learning objectives, audience, duration, prerequisites.
3. **ComparisonSection** — side-by-side table + cards comparing Traditional vs Vibe Coding across: workflow, efficiency, code quality, debugging, learning curve, collaboration. Include a quick metrics chart (recharts) showing illustrative time-to-prototype.
4. **VibeCodingIntro** — what Claude Code is, what Vibe Coding means, role of Harness + Superpowers tools.
5. **ProjectBrief** — Campus 3D Explorer description, architecture diagram (rendered as styled cards), tech stack badges, deliverables.
6. **StepByStepManual** — accordion / stepper with phases:
   - Phase 0: Environment setup (Node, pnpm, Claude Code install, Harness, Superpowers).
   - Phase 1: Project init via Vibe Coding prompt.
   - Phase 2: Frontend scaffolding (React + react-three-fiber scene).
   - Phase 3: Backend scaffolding (Express + Prisma + Postgres).
   - Phase 4: Database schema & migrations.
   - Phase 5: Wiring API to 3D UI.
   - Phase 6: Iterative refinement with Claude Code (prompts to copy).
   - Phase 7: Testing & debugging with AI assistance.
   - Phase 8: Deployment (Vercel frontend, Railway/Render backend + DB).
   Each step shows: traditional approach vs Claude Code prompt to use.
7. **HandoutsSection** — "Download as HTML" buttons that trigger client-side generation of standalone HTML handout files (Blob + anchor download). Two handouts: *Concept Handout* and *Lab Manual*.
8. **AssessmentSection** — suggested rubric + reflection prompts.
9. **Footer** — credits, references.

## Critical Files

- `src/app/App.tsx` — composes sections, top nav, scroll behavior.
- `src/app/components/Hero.tsx`
- `src/app/components/CourseOverview.tsx`
- `src/app/components/ComparisonSection.tsx` (table + recharts bar chart)
- `src/app/components/VibeCodingIntro.tsx`
- `src/app/components/ProjectBrief.tsx`
- `src/app/components/StepByStepManual.tsx` (stepper/accordion using kit components)
- `src/app/components/HandoutsSection.tsx` (owns HTML export logic)
- `src/app/components/AssessmentSection.tsx`
- `src/app/components/Footer.tsx`
- `src/app/components/handouts/conceptHandoutHtml.ts` — exports a string of full standalone HTML for the concept handout (inline CSS, printable).
- `src/app/components/handouts/labManualHtml.ts` — same, for the step-by-step lab manual covering init → deployment.

## Design System Adherence

- Before coding, read `node_modules/@figma/astraui-kit/guidelines/setup.md` and `Guidelines.md`, run any required setup, and confirm dependencies are in `package.json`.
- Use kit components for Button, Card, Tabs, Accordion, Badge, Table where available; fall back to Tailwind primitives only if a component is missing.
- All colors/spacing/radii/typography must reference CSS variables in `styles/globals.css`. Use only font faces declared there. Do not set font-size/weight/line-height via Tailwind utilities unless overriding.
- Include the attached image (`src/imports/image.png`) via `ImageWithFallback` in the Hero or ProjectBrief section as a visual anchor.

## Handout HTML Export

The two downloadable handouts are full standalone HTML documents (with inline `<style>` using the same CSS variable palette) generated as template-literal strings, packaged via `new Blob([...], { type: 'text/html' })` and triggered with a temporary `<a download>`. Content covers:
- **Concept Handout**: comparison tables, key terminology, when-to-use-AI guidance, ethics/limits.
- **Lab Manual**: full Campus 3D Explorer walkthrough — install commands, Claude Code prompts to copy/paste, file structure, schema SQL, deployment steps.

## Verification

- Run the app in the Make preview; visually inspect each section on desktop and mobile widths.
- Click both "Download Handout" buttons; open the resulting `.html` files in a browser and confirm they render standalone (no missing styles/assets).
- Expand every step in the manual; confirm copy-paste prompts are complete (no truncation).
- Confirm all colors/fonts come from `styles/globals.css` variables (spot-check inspector).
- Confirm design-system components render correctly (no missing imports from `@figma/astraui-kit`).

## Out of Scope

- Actually running the Three.js example project or wiring a real backend inside the courseware app — the taught project lives in the handouts, not in this app.
- Authentication, analytics, i18n.
