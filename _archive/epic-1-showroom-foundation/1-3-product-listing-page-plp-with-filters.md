# Story 1.3: Product Listing Page (PLP) & Catalog Seeding

Status: done

## Bridge to Story 1.4
Navigation is implemented from `ProductCard` to `/products/[id]`. Story 1.4 will finalize the detailed view and SEO optimization.


## Story

As a **Retailer (Sophie)**,
I want to **view a realistic catalog of products with images and prices**,
so that **I can browse, filter, and add items to my cart without seeing 404 errors or empty states**.

## Acceptance Criteria

1.  **Catalog Page Implementation (PLP):**
    *   **Given** I navigate to `/catalog` (or click "Catalog" in navigation).
    *   **Then** I see a grid of products.
    *   **And** the page loads without 404 errors.
    *   **And** standard layout wrapper (Header/Footer) is present.

2.  **Realistic Mock Data (Seeding):**
    *   **Given** the application is running in development mode.
    *   **When** I view the catalog.
    *   **Then** I see at least 12 distinct products.
    *   **And** each product has:
        *   High-quality placeholder image (e.g., Unsplash/Picsum).
        *   Realistic title (e.g., "Silk Blouse", "Leather Tote").
        *   Realistic price (HT).
        *   Brand/Vendor name.
    *   **And** data is seeded in the database (Prisma Seed) if not present.

3.  **Navigation Links:**
    *   **Given** I am on the home page or header.
    *   **When** I click "Catalog", "New Arrivals", or "Brands".
    *   **Then** I am routed to the PLP (filtered or general).
    *   **And** "Brands" link might route to a specific brand list or filtered PLP (MVP: Route to PLP).

4.  **Product Card Interactions:**
    *   **When** I click a product card.
    *   **Then** I am taken to the Product Detail Page (PDP) `/products/[id]`.
    *   **And** the PDP displays the correct mock data for that product.

## Tasks / Subtasks

- [x] **Database Seeding Enhancement**
    - [x] Update `prisma/seed.ts` to generate realistic mock data (using `faker` or static list).
    - [x] Ensure images use reliable external placeholder services (e.g., `images.unsplash.com` or local assets if preferred).
    - [x] Run seed script to populate DB.

- [x] **Catalog Page (PLP) Implementation**
    - [x] Create/Update `src/app/catalog/page.tsx`.
    - [x] Fetch products from DB (Server Component).
    - [x] Render `ProductGrid` component (create if missing).
    - [x] Map DB products to `ProductCard` components.

- [x] **Fix Navigation Routes**
    - [x] Ensure `src/app/new-arrivals/page.tsx` exists (can reuse Catalog logic with sort).
    - [x] Ensure `src/app/brands/page.tsx` exists or redirects.
    - [x] Verify Header links match routes.

## Dev Notes

### Architecture & Tech Stack
-   **Data Fetching:** Server Components (`src/app/catalog/page.tsx`) calling `src/lib/prisma.ts`.
-   **Mock Data:** Use `faker` in `prisma/seed.ts` for diverse data.
-   **Images:** Use Unsplash source URLs for realistic fashion placeholders (e.g., `https://images.unsplash.com/photo-...?auto=format&fit=crop&w=500&q=60`).
-   **Components:** Reuse `ProductCard` from Story 1.1/2.1.
-   **Routing:** Next.js App Router standard conventions.

### Critical UX Details
-   **No Empty States:** If DB is empty, auto-seed or show a helpful "Run seed" message (Dev mode only).
-   **Performance:** Optimize image loading with `next/image` (add domains to `next.config.ts`).
-   **404 Fix:** Ensure all links in Header actually lead to a valid page.

### References
-   **Prisma Seed:** `prisma/seed.ts`
-   **Architecture:** `(_bmad-output)/planning-artifacts/architecture.md` (Data Model).

## Dev Agent Record

### Agent Model Used
Gemini-2.0-Flash (Simulated)

### Debug Log References

### Completion Notes List

### File List
- `prisma/seed.ts`
- `src/app/catalog/page.tsx`
- `src/app/new-arrivals/page.tsx`
- `src/app/brands/page.tsx`
- `src/tests/ProductGrid.test.tsx`
