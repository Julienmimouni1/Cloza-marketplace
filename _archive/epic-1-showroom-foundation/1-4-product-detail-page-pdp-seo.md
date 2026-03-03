# Story 1.4: Product Detail Page (PDP) & SEO

Status: done

## Story

As a **Retailer**,
I want to **view detailed information about a specific product**,
so that **I can assess its quality and specifications before considering a purchase**.

## Acceptance Criteria

1.  **Page Navigation & Routing:**
    - **Given** I am on the Product Listing Page (PLP).
    - **When** I click on a product card.
    - **Then** I am navigated to `/products/[category]/[slug]`.
    - **And** the URL is clean and SEO-friendly.
    - **Constraint:** The system must validate that the product actually belongs to the URL's `[category]` parameter to prevent SEO content mismatch.

2.  **Product Details Display:**
    - **Given** the page loads.
    - **Then** I see the high-resolution product image (left column on desktop).
    - **And** I see the Product Title, Vendor Name, and Price **Excl. VAT (HT)** (right column).
    - **And** I see the full description and specifications.
    - **And** the current stock level is displayed.

3.  **SEO Optimization:**
    - **Then** the page `<title>` includes the Product Name.
    - **And** the `<meta name="description">` contains the product summary.
    - **And** OpenGraph tags (og:image, og:title) are correctly populated.

4.  **Interaction Foundation:**
    - **Then** the "Add to Cart" button is visible and styled (Shadcn Button).
    - **Note:** Actual cart logic is handled in Story 2.1, but the button UI must be present.

## Tasks / Subtasks

- [x] **Extend Catalog Feature (Server Actions)**
    - [x] Update `src/features/catalog/actions.ts` (NOT `products/db.ts`) with `getProductBySlug(slug: string)`.
    - [x] **Critical:** Maintain existing data mapping pattern (`name` -> `title`, `priceHt` -> `price`).
    - [x] Ensure query includes `vendor` relation for displaying vendor name.

- [x] **Create PDP Layout & UI**
    - [x] Create `src/app/products/[category]/[slug]/page.tsx` (Server Component).
    - [x] Implement responsive layout (Stack on mobile, Two-column on desktop).
    - [x] Use `next/image` for optimized image rendering.
    - [x] Display Price HT clearly using the currency formatter.
    - [x] Create `loading.tsx` with a skeleton loader for instant feedback.

- [x] **Implement SEO Metadata**
    - [x] Export `generateMetadata` function in `page.tsx`.
    - [x] Map product data to Next.js Metadata object.
    - [x] Handle canonical URL generation.

- [x] **Add "Add to Cart" Placeholder**
    - [x] Create `src/features/cart/components/AddToCartButton.tsx` (Client Component).
    - [x] Implement basic visual state (disabled if out of stock).

## Dev Notes

### Technical Strategy
- **Architecture:** Consolidate product logic in `src/features/catalog/` to avoid fragmentation. Do not create a new `products` feature folder.
- **Server Components:** The main page `page.tsx` must be a Server Component to fetch data and generate metadata directly.
- **Data Integrity:** Verify `product.category === params.category`. If mismatch, redirect or return 404 to avoid duplicate content issues.
- **Image Optimization:** Use `fill` or responsive `width/height` with `sizes` prop for LCP optimization.

## Dev Agent Record
- Created by Gemini CLI (Scrum Master) on 2026-01-12.
- Updated by Validation Agent to align with `src/features/catalog` architecture and SEO best practices.
- **2026-01-12 (Dev Agent):**
  - Implemented PDP with `slug` support.
  - **Schema Update:** Added `slug` to `Product` model and updated `seed.ts`.
  - **Note:** DB Migration (`add_slug_to_product`) FAILED due to local DB environment issues. `prisma generate` was run, so Typescript is valid, but runtime will require the migration to be applied when DB is up.
  - Implemented `getProductBySlug` with unit tests.
  - Created PDP layout, `loading.tsx`, and `AddToCartButton`.
  - **2026-01-12 (Code Review Fixes):**
    - Added missing SQL migration for `slug` column (`20260112170000_add_product_slug`).
    - Implemented Canonical URL in metadata.
    - Improved description truncation for SEO.
    - Fixed Category enum case sensitivity in filtering.

## File List
- prisma/migrations/20260112170000_add_product_slug/migration.sql
- prisma/schema.prisma
- prisma/seed.ts
- src/features/catalog/actions.ts
- src/features/catalog/actions.test.ts
- src/features/cart/components/AddToCartButton.tsx
- src/app/products/[category]/[slug]/page.tsx
- src/app/products/[category]/[slug]/loading.tsx
- src/components/ui/button.tsx