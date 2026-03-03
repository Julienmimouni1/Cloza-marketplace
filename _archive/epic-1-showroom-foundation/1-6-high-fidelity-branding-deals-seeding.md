# Story 1.6: High-Fidelity Branding & Deals (Seeding)

Status: done

## Story

As an **Admin (Julien)**,
I want to **populate the database with high-fidelity brand data and promotional "Deals"**,
so that **the homepage and discovery sections look premium and professional with persistent real-world examples**.

## Acceptance Criteria

1.  **Premium Brands Seeding:**
    *   **Given** I run the seed script.
    *   **Then** at least 8 premium-looking brands (Vendors) are created.
    *   **And** each brand has a professional description and a logo URL.
    *   **And** brands are categorized (e.g., Luxury, Streetwear, Accessories).

2.  **Promotional Deals Data:**
    *   **Given** the database schema support (or JSON field).
    *   **When** I view the homepage.
    *   **Then** I see "Active Deals" (e.g., "Flash Sale: -20% on Silk", "New Vendor: 10% Welcome Discount").
    *   **And** these deals are persistent in the database.

3.  **Data Consistency & Persistence:**
    *   **Given** the application restarts.
    *   **Then** the data remains identical (no random regeneration of primary keys).
    *   **And** the relationships between Products and Vendors remain stable.

## Tasks / Subtasks

- [x] **Schema Enrichment**
    - [x] Evaluate if `Vendor` model needs additional fields (bio, website, featured status).
    - [x] Create a `Promotion` or `Deal` model in `schema.prisma`.
    - [x] Run `npx prisma db push`.

- [x] **Premium Seed Content**
    - [x] Update `prisma/seed.ts` with a static list of "Premium" brands (e.g., "L'Artisan", "Soie Dorée").
    - [x] Add specific high-quality descriptions instead of pure Lorem Ipsum.
    - [x] Seed the `Promotion` table with at least 3 active deals.

- [x] **Homepage Integration Hook**
    - [x] Create a Server Action or helper to fetch "Featured Brands" and "Active Deals".
    - [x] Integrate components in Homepage.

## Dev Notes

### Architecture
- **Static vs Random:** While `faker` is great for volume, use a static array for the "Featured" items to ensure Julien sees the same high-quality data every time.
- **Images:** Use specific Unsplash collections for fashion logos/brands.

## Dev Agent Record
- Created by Scrum Master (Bob) on 2026-01-13.
