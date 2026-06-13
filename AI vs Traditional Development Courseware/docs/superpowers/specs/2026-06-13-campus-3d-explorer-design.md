# Campus 3D Explorer — Design Spec

## Overview

Build a full-stack interactive 3D campus explorer. Users browse a 3D model of a university campus in the browser, click buildings to view details and leave comments. The project serves as a teaching example for AI-assisted full-stack development using the Superpowers skill workflow.

**Project type:** Standalone full-stack app (separate from the courseware site)
**Tech stack:** React + react-three-fiber + Express + Prisma + SQLite

## Architecture

Single project, Vite middleware mode. Express routes are mounted into Vite's dev server via `configureServer`, so `pnpm dev` starts both frontend and backend on one port. No deployment configuration.

```
campus-3d-explorer/
├── package.json
├── vite.config.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── client/
│   │   ├── components/
│   │   │   ├── CampusScene.tsx
│   │   │   ├── Building.tsx
│   │   │   ├── BuildingLabel.tsx
│   │   │   ├── CameraPresets.tsx
│   │   │   ├── DetailPanel.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── ReviewList.tsx
│   │   ├── hooks/
│   │   │   └── useBuildings.ts
│   │   └── types.ts
│   ├── server/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   ├── buildings.ts
│   │   │   └── reviews.ts
│   │   └── validation.ts
│   └── shared/
│       └── types.ts
```

## Data Model

### Prisma Schema

```prisma
model Building {
  id          Int       @id @default(autoincrement())
  name        String
  description String
  positionX   Float
  positionZ   Float
  color       String    @default("#4A90D9")
  width       Float     @default(2)
  depth       Float     @default(2)
  height      Float     @default(3)
  reviews     Review[]
  createdAt   DateTime  @default(now())
}

model Review {
  id         Int       @id @default(autoincrement())
  buildingId Int
  building   Building  @relation(fields: [buildingId], references: [id], onDelete: Cascade)
  nickname   String
  content    String
  createdAt  DateTime  @default(now())
}
```

### Seed Data

6 buildings arranged in a ring around origin:

| Name | Position (x, z) | Color |
|------|-----------------|-------|
| 图书馆 | (0, 0) | #4A90D9 |
| 教学楼 A | (-4, -3) | #E85D75 |
| 教学楼 B | (4, -3) | #F5A623 |
| 食堂 | (-3, 4) | #7ED321 |
| 体育馆 | (4, 3) | #9B59B6 |
| 行政楼 | (0, -6) | #50E3C2 |

## API Design

All responses use `{ success: boolean, data?: T, error?: string }` wrapper.

| Method | Path | Description | Validation |
|--------|------|-------------|------------|
| GET | `/api/buildings` | All buildings (with review count) | - |
| GET | `/api/buildings/:id` | Single building + all reviews | id must be integer |
| POST | `/api/buildings/:id/reviews` | Submit a review | nickname 1-20 chars, content 1-500 chars |

## 3D Scene

### Scene Setup
- `@react-three/fiber` Canvas with `<ambientLight>`, `<directionalLight>` (shadows), `<OrbitControls>` (damping enabled), `<gridHelper>` for ground reference
- Camera defaults to overhead panoramic view (`position: [0, 12, 12]`, `lookAt: [0, 0, 0]`)

### Building Rendering
- Each building rendered as `<BoxGeometry>` with `meshStandardMaterial` using the building's color
- Dimensions driven by database fields: `width`, `height`, `depth`
- Position on XZ plane from database: `positionX`, `positionZ`
- Selected building: material color brightened + a glowing ring at the base (scaled Torus or Ring)

### Floating Labels
- Using drei `<Html>` positioned 1.5 units above each building
- Shows building name in a styled pill badge
- Turns primary color when building is selected
- Only visible when camera distance < 20 units

### Preset Camera Views
- HTML overlay buttons at the bottom-left of the 3D viewport
- 4 presets: 全景 (overhead), 图书馆, 教学区, 生活区
- Smooth camera transition using lerp or GSAP when clicked

### Click Interaction
1. Raycasting on building click → set selected building ID
2. Fetch building detail from `/api/buildings/:id`
3. Building highlights (color brighten + ring)
4. Label highlights (primary color)
5. Right panel slides in with detail data
6. Click empty space (miss raycast) → deselect all

## Right Detail Panel

### States
- **Hidden** — no building selected; panel invisible or shows placeholder "点击建筑查看详情"
- **Loading** — skeleton card while fetching data
- **Loaded** — building info + review list + review form

### Layout (top to bottom)
- Close button (✕)
- Building name (big heading)
- Description paragraph
- Divider
- "💬 评论 (N)" heading
- Review list (scrollable, newest first, relative timestamps)
- Divider
- Review form: nickname input + content textarea + submit button

### Responsive
- **Desktop (≥1024px):** 3D canvas left, panel right (380px fixed width). Flex row.
- **Mobile (<1024px):** 3D canvas top, panel slides up from bottom (60vh). Flex column.

## Review System

- No authentication required — nickname-based comments
- Frontend validation before submit: nickname 1-20 chars, content 1-500 chars (Chinese)
- Server-side validation with same rules, returns error messages in Chinese
- Optimistic update: new review inserted at top of list on success, toast notification
- On validation error: error message shown, form preserved

## Out of Scope

- Authentication / user accounts
- Deployment configuration (Docker, CI/CD, hosting)
- Image uploads or file storage
- Star ratings (text-only comments)
- Admin panel or moderation
- Mobile 3D touch optimization beyond basic responsiveness
- i18n (Chinese only)

## Verification

1. `pnpm install && pnpm dev` starts both frontend and backend on one port
2. 3D scene renders 6 buildings from seed data at correct positions
3. OrbitControls: rotate, zoom, pan work smoothly
4. Clicking a building highlights it, shows label, fetches and displays detail panel
5. Clicking empty space deselects the building
6. Preset camera buttons smoothly transition to correct views
7. Submitting a review: valid → appears in list + toast; invalid → error message shown
8. Database persists reviews across server restarts
9. Responsive: desktop panel on right, mobile panel slides from bottom
10. `npx prisma db seed` populates the 6 seed buildings
