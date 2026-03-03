# Story: Markdown-Based Legal Policies

## Status
Review

## Context
Convert static PDF policies to editable Markdown files to allow real-time updates and easier maintenance.
Policies: Privacy Policy, Refund Policy, Shipping Policy, Terms of Service.
Target: `src/app/[locale]/legal/[slug]`

## Requirements
- Content must be stored as `.md` files in `src/content/legal/{locale}/{slug}.md`.
- Support French (fr) and English (en) versions.
- High-performance rendering using `react-markdown`.
- Styling must match the "High-End Showroom" aesthetic (Typography: Playfair/Instrument).
- Real-time updates in development mode.
- Accessible via existing routes: `/legal/privacy`, `/legal/refund`, `/legal/shipping`, `/legal/terms`.

## Tasks
- [x] 1. Infrastructure Setup
    - [x] Install `react-markdown` and `gray-matter`.
    - [x] Create directory structure: `src/content/legal/fr/` and `src/content/legal/en/`.
- [x] 2. Content Preparation
    - [x] Create initial Markdown files in French for all 4 policies based on current JSX content or PDFs.
    - [x] Create placeholder English versions.
- [x] 3. Data Fetching & Utility
    - [x] Create `src/lib/markdown.ts` to read and parse `.md` files using `fs` and `gray-matter`.
    - [x] Handle error states (e.g., file not found).
- [x] 4. Policy Rendering Component
    - [x] Create a reusable `PolicyRenderer` component in `src/features/legal/components/`.
    - [x] Apply Tailwind typography styles (matching "High-End Showroom" theme).
- [x] 5. Route Integration
    - [x] Update `src/app/[locale]/legal/privacy/page.tsx` to use the dynamic loader.
    - [x] Update `src/app/[locale]/legal/refund/page.tsx`.
    - [x] Update `src/app/[locale]/legal/shipping/page.tsx`.
    - [x] Update `src/app/[locale]/legal/terms/page.tsx`.
- [x] 6. Verification
    - [x] Verify rendering for both `fr` and `en`.
    - [x] Ensure font pairings (Playfair/Instrument) are respected.

## Dev Agent Record
### Implementation Notes
- **Technology**: Implemented a robust Markdown rendering system using `react-markdown`, `gray-matter`, and `@tailwindcss/typography`.
- **Infrastructure**: Content is centralized in `src/content/legal/` allowing instant updates without code changes.
- **Styling**: Customized the `prose` classes to match Cloza's "High-End Showroom" aesthetic (Playfair Display for headings, Instrument Sans for body, Gold accents for bold text).
- **Multilingual**: Full support for French and English versions via `next-intl` locale parameters.
- **Quality**: Added unit tests in `src/features/legal/tests/markdown.test.ts` to verify file loading logic.

## File List
- src/content/legal/fr/privacy.md
- src/content/legal/fr/refund.md
- src/content/legal/fr/shipping.md
- src/content/legal/fr/terms.md
- src/content/legal/en/privacy.md
- src/content/legal/en/refund.md
- src/content/legal/en/shipping.md
- src/content/legal/en/terms.md
- src/lib/markdown.ts
- src/features/legal/components/PolicyRenderer.tsx
- src/features/legal/tests/markdown.test.ts
- src/app/[locale]/legal/privacy/page.tsx
- src/app/[locale]/legal/refund/page.tsx
- src/app/[locale]/legal/shipping/page.tsx
- src/app/[locale]/legal/terms/page.tsx
- tailwind.config.ts
- package.json
- package-lock.json

## Change Log
- 2026-02-08: Initial implementation of Markdown-based legal policies system.