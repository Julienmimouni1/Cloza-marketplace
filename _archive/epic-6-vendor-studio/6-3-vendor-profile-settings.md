# Story 6.3: Vendor Profile & Branding Settings

Status: ready-for-dev

## Story

As a **Vendor**,
I want to **customize my brand profile (Logo, Description, Cover)**,
so that **retailers see a professional and attractive showroom when browsing my products**.

## Acceptance Criteria

1.  **Profile Settings Page:**
    - **Given** I am on `/vendor/settings`.
    - **Then** I see a form to edit my Brand Identity.
    - **Fields:**
        - Brand Name (Read-only or Request change).
        - Description (Bio).
        - Website URL.
        - Logo (Image Upload).
        - Cover Image (Image Upload).

2.  **Public Showroom Reflection:**
    - **When** I save my changes.
    - **Then** the "Vendor Detail Page" (Public Storefront) updates immediately.
    - **And** my products on the PLP show the new Logo (if applicable).

3.  **Onboarding Status:**
    - **Given** I am a new vendor.
    - **Then** I see a progress indicator suggesting I "Complete my Profile" to improve visibility.

## Tasks / Subtasks

- [ ] **Schema Check & Update**
    - [ ] Verify `Vendor` model in `prisma/schema.prisma` has: `description`, `logoUrl`, `coverUrl`, `website`.
    - [ ] Add fields if missing and run migration `add_vendor_profile_fields`.

- [ ] **Server Actions**
    - [ ] Create `src/features/vendor/actions/profile.ts`.
    - [ ] Implement `updateVendorProfile(data, vendorId)`.
    - [ ] Reuse Image Upload logic from Story 6.1/3.3.

- [ ] **UI Implementation**
    - [ ] Create `src/app/(dashboard)/vendor/settings/page.tsx`.
    - [ ] Build `VendorProfileForm.tsx` using `shadcn/ui`.
    - [ ] Add "Live Preview" card showing how the brand looks to retailers.

## Dev Notes

### Architecture
- **Location:** `src/features/vendor/`
- **Security:** Ensure users can only edit the Vendor linked to their `session.user.vendorId`.

### UX/UI
- **Gold State:** When the profile is 100% complete, show a celebration or "Ready to Sell" badge.

## References
- [Epic 6 Details]((_bmad-output)/planning-artifacts/epics.md#epic-6-the-makers-studio-vendor-back-office)
