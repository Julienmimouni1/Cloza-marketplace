# Story 1.1: Project Setup & Showroom Foundation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Visitor,
I want to access a fast and visually appealing homepage that reflects the "Smart Luxury" brand,
so that I trust the platform enough to explore the catalog.

## Acceptance Criteria

1. **Next.js 16 Project Initialization:** The project must be initialized with Next.js 16.1.1 (App Router), React 19, TypeScript 5.x, and Tailwind CSS 3.4.
2. **UI Framework Setup:** Shadcn UI must be initialized and configured with the project's design tokens.
3. **Performance (FCP):** The root URL "/" must achieve a First Contentful Paint (FCP) of less than 1.5s on a simulated 4G network.
4. **"Smart Luxury" Header:** A header component must be visible with the Cloza logo and a functional navigation menu.
5. **Typography:** Fonts must be correctly loaded and applied: **Playfair Display** for headings and **Instrument Sans** for body text/data.
6. **Responsive Design:** The layout must be fully responsive and adapt seamlessly to mobile, tablet, and desktop screens.
7. **Brand Identity:** The UI must reflect the "Smart Luxury" aesthetic (Mix of High-End Showroom and Strategic Trader data density) using the defined color palette: Noir Absolu (#000), Blanc Pur (#FFF), and Gold Accent (#C5A028).

## Tasks / Subtasks

- [x] **Infrastructure & Framework Setup** (AC: 1, 2)
  - [x] Initialize Next.js 16.1.1 project (if not already done).
  - [x] Configure Tailwind CSS 3.4 and Shadcn UI.
  - [x] Setup Lucide React for icons.
- [x] **Design System Implementation** (AC: 4, 5, 7)
  - [x] Configure `tailwind.config.ts` with brand colors (#000, #FFF, #C5A028).
  - [x] Import and configure Playfair Display and Instrument Sans fonts (Next.js Google Fonts).
- [x] **Core Components & Layout** (AC: 4, 6)
  - [x] Create `src/components/shared/Header.tsx` with logo and navigation.
  - [x] Implement responsive Root Layout in `src/app/layout.tsx`.
- [x] **Homepage (Showroom) Implementation** (AC: 3, 7)
  - [x] Implement `src/app/page.tsx` with a premium hero section.
  - [x] Ensure heavy assets are optimized for FCP < 1.5s.
- [x] **Verification** (AC: 3, 6)
  - [x] Run Lighthouse or similar tool to verify FCP on mobile.
  - [x] Manual responsive check across breakpoints.

## Dev Notes

- **Next.js 16 Patterns:** All components in `src/app` are Server Components by default. Use `"use client"` only when strictly necessary.
- **Styling:** Use `cn()` from `@/lib/utils` for conditional classes.
- **Performance:** Prioritize `next/font` and `next/image` for performance.
- **Architecture:** Follow the Feature-First structure. This story sets up the foundation for `src/features/catalog`.

### Project Structure Notes

- `src/app/`: App Router routes.
- `src/components/ui/`: Shadcn UI components.
- `src/components/shared/`: Cross-cutting components like Header/Footer.
- `src/features/`: Business modules (future stories).
- `src/lib/`: Utilities and singletons.

### References

- [Source: (_bmad-output)/planning-artifacts/architecture.md#Starter Template Evaluation]
- [Source: (_bmad-output)/planning-artifacts/prd.md#Functional Requirements]
- [Source: (_bmad-output)/project-context.md#Technology Stack & Versions]

## Dev Agent Record

### Agent Model Used

Amelia (Senior Software Engineer) powered by Gemini 2.0 Flash

### Debug Log References

- Project initialized with Next.js 16.1.1 and Tailwind 3.4.
- Fonts configured: Playfair Display (Headings) and Instrument Sans (Body).
- Layout and Header implemented with "Smart Luxury" aesthetic.
- Homepage implemented with responsive Hero section.
- Build validated successfully.

### Completion Notes List

- All tasks for Story 1.1 completed.
- Project foundation established following "High-End Showroom" + "Strategic Trader" direction.
- Performance considered with Next.js 16 App Router patterns.

### File List

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/lib/utils.ts`
- `src/components/shared/Header.tsx`

### Change Log

- **2026-01-12**: Addressed code review findings. Added `components.json` and unit tests (`Header.test.tsx`, `HomePage.test.tsx`). Verified all tests pass.

