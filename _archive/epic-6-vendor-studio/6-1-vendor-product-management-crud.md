# Story 6.1: Professional Vendor Product Management

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Professional Vendor (L'Artisan),
I want a comprehensive and professional product creation interface,
so that I can accurately represent my high-end inventory with multiple images, precise shipping data, and detailed attributes.

## Acceptance Criteria

1.  **Given** I am on the "Add Product" page
    **Then** I see a professional, multi-section form (e.g., Tabs or Steps) covering:
    - **Basic Info:** Name, Description, Brand/Label.
    - **Pricing & Inventory:** Price HT, Tax Rate (optional), Discounted Price (optional), Stock, SKU.
    - **Media:** Multi-image upload zone (Drag & Drop) with "Cover Image" selection.
    - **Shipping:** Package Weight (g/kg), Dimensions (L x W x H).
    - **Attributes:** Category, Material/Composition, Country of Origin, Tags.

2.  **Given** I am in the "Media" section
    **When** I drag and drop multiple images
    **Then** they are uploaded (or staged) and displayed as a grid of previews.
    **And** I can reorder them or select one as the "Main" image.

3.  **Given** I am in the "Shipping" section
    **When** I enter the weight and dimensions
    **Then** the system validates they are positive numbers (required for shipping calculations).

4.  **Given** I have filled out the complex form
    **When** I click "Save Product"
    **Then** all data, including the multiple images and shipping details, is persisted to the database.
    **And** I am redirected to the Product List with a success message.

## Tasks / Subtasks

- [x] **Database Schema Updates**
  - [x] Update `Product` model in `schema.prisma`:
    - Add `ProductImage` model (relation 1:N).
    - Add fields: `weight`, `height`, `width`, `length` (Int/Float).
    - Add fields: `material`, `origin` (String), `tags` (String[] or relation).
    - Add fields: `discountPrice` (Int?), `taxRate` (Float?).
  - [x] Run migration.

- [x] **Backend Logic (Server Actions)**
  - [x] Update `createProduct` schema (Zod) to accept new fields and array of image URLs.
  - [x] Implement `uploadProductImage` Server Action (or reuse general upload logic) to handle file storage (S3/Local) and return URL.
  - [x] Update `createProduct` to create `Product` and linked `ProductImage` records in a transaction.
  - [x] Update `updateProduct` to handle adding/removing images and updating new fields.

- [x] **Frontend - Enhanced Product Form**
  - [x] Refactor `src/features/vendor/components/ProductForm.tsx` to use a **Tabbed Layout** (shadcn `Tabs`):
    - Tab 1: **Details** (Name, Desc, Category, Brand, Material, Origin).
    - Tab 2: **Media** (New `MultiImageUpload` component).
    - Tab 3: **Pricing & Stock** (Price, Discount, Tax, Stock, SKU).
    - Tab 4: **Shipping** (Weight, Dimensions).
  - [x] Create `src/components/shared/MultiImageUpload.tsx`:
    - Support Drag & Drop (react-dropzone).
    - Show preview grid.
    - Allow deletion of staged images.
  - [x] Integrate Zod validation for all new fields (especially numeric constraints for weight/price).

- [x] **Frontend - Product List Update**
  - [x] Update `src/app/(dashboard)/vendor/products/page.tsx` columns if necessary (e.g., show main image thumbnail).

## Dev Notes

- **Architecture Compliance:**
  - **Images:** Use a dedicated `ProductImage` table. Do not just store an array of strings in the `Product` table if you want metadata (like `isMain`, `order`).
  - **Uploads:** Use the existing upload pattern (from Story 3.3 KYB) but adapted for public product images. If `uploadthing` or S3 is available, use it. If not, local storage is fine for dev but mark for refactor.
  - **UX:** The form is now large. Use `react-hook-form` with `zodResolver`. Consider `form.trigger()` for per-tab validation if needed.

- **Source Tree:**
  - `src/features/vendor/components/ProductForm.tsx` (Major Refactor)
  - `src/components/shared/MultiImageUpload.tsx` (New)
  - `prisma/schema.prisma`

- **Testing:**
  - Test the "happy path" of creating a product with all fields.
  - Test validation (negative weights, missing required fields).
  - Verify images are correctly linked to the product.

### References

- **Design:** "Professional & Complete" - think Shopify/Magento admin style.
- **Data:** `Product` model needs significant expansion.

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash Experimental (Spec Update)

### Completion Notes List

- Updated story to reflect "Professional" requirements.
- Added comprehensive fields for Shipping, Media, and Attributes.
- reset status to `ready-for-dev`.