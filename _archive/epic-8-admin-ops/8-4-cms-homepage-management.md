# Story 8.4: CMS - Homepage Management

Status: ready-for-dev

## Story

As a **Marketing Manager (Admin)**,
I want to **control the "Featured Brands" and "Active Deals" on the homepage**,
so that I can highlight strategic partners without deploying code.

## Acceptance Criteria

1.  **Featured Brands Management:**
    - **Given** I am on `/admin/cms`.
    - **Then** I see a list of currently featured brands.
    - **Action:** I can "Add Brand" (Search Vendor by name) or "Remove/Reorder".

2.  **Deals Management:**
    - **Given** the "Active Deals" section.
    - **Then** I can create a new Deal Card:
        - Title ("Flash Sale").
        - Description ("-20% on Silk").
        - Link URL (Catalog filter).
        - Background Color/Image.
    - **And** updates reflect immediately on the Homepage (Story 1.5/1.6).

## Tasks / Subtasks

- [ ] **Schema Update**
    - [ ] Create `FeaturedCollection` or `CmsContent` model in Prisma.
    - [ ] Alternatively, add `isFeatured` boolean to `Vendor` model.

- [ ] **Backend Logic**
    - [ ] Actions to toggle `isFeatured` on Vendors.
    - [ ] Actions to CRUD `Promotion` objects.

- [ ] **UI Implementation**
    - [ ] Create `/admin/cms/page.tsx`.
    - [ ] Drag-and-drop list for ordering (optional MVP: simple list).

- [ ] **Homepage Integration**
    - [ ] Update `src/app/page.tsx` (Homepage) to fetch from this dynamic source instead of hardcoded/seed data.

## Dev Notes
- **Caching:** Homepage is likely cached. Implement `revalidatePath('/')` on CMS updates.

## References
- [Story 1.6 (High Fidelity Branding)](../epic-1-showroom-foundation/1-6-high-fidelity-branding-deals-seeding.md)
