# Code Review: Story 6.1 Vendor Product Management (CRUD)

## Review Strategy
- **AC Validation**: Check if all 4 ACs are implemented.
- **Task Audit**: Verify all checked tasks.
- **Security**: Verify `vendorId` isolation in Server Actions.
- **Data Integrity**: Check Prisma schema updates and Enum handling.

## Findings

### 1. Git vs Story Discrepancies
- **Discrepancy**: The story file lists `src/features/vendor/components/ProductForm.tsx` and `actions.ts` etc., but they are not in the `git diff --name-only` output above.
- **Investigation**: Wait, `git diff --name-only` shows *modified* files. If they are new untracked files, they won't show up there unless I run `git status`.
- **Correction**: `git status --porcelain` showed:
  ```
  ?? src/features/vendor/
  ```
  So the files exist but are untracked. This is a **MEDIUM** issue (Uncommitted changes).

### 2. AC Validation
- **AC 1 (Product List)**: Implemented in `src/app/[locale]/(dashboard)/vendor/products/page.tsx`.
  - Filters? Yes, `ProductFilters` component used.
  - Columns? Image, Name, SKU, Price, Stock, Status. **Implemented**.
- **AC 2 (Add Product Form)**: Implemented in `src/features/vendor/components/ProductForm.tsx`.
  - Fields: Name, Description, Price, Stock, Category. **Implemented**.
  - Image Upload: Requirements say "upload Images", but implementation uses a text input for URL placeholder.
  - **Status**: **PARTIAL**. The requirement asked for upload, but dev notes say "Image Upload component (using a placeholder or standard file input for now, focusing on logic)". This is acceptable for "ready-for-dev" -> "review" transition if clearly documented, but technically a deviation from strict AC.
- **AC 3 (Save to DB)**: `createProduct` action in `actions.ts`.
  - Linked to `vendor_id`? Yes:
    ```typescript
    const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
    // ...
    data: { ...parsed.data, vendorId: vendor.id }
    ```
    **Implemented**.
- **AC 4 (Edit/Archive)**: `updateProduct` and `deleteProduct` (archive) actions.
  - Immediate reflection? `revalidatePath("/vendor/products")` is used. **Implemented**.

### 3. Code Quality & Security
- **Security**: `actions.ts` checks `session.user.id`, finds the vendor, and checks if the product belongs to the vendor before update/delete.
  ```typescript
  if (!existingProduct || existingProduct.vendorId !== vendor.id) {
    return { success: false, error: { code: "FORBIDDEN", ... } };
  }
  ```
  **PASS**.
- **Type Safety**:
  - `ProductForm.tsx`:
    ```typescript
    resolver: zodResolver(productSchema) as any,
    ```
    **HIGH ISSUE**: usage of `as any` bypasses type safety. This was done to fix a mismatch, but it hides potential bugs.
  - `schemas.ts`:
    ```typescript
    image: z.string().url("L'URL de l'image est invalide").optional().or(z.literal("")),
    ```
    This allows empty string or URL. Good.
- **Performance**:
  - `VendorProductsPage` fetches all products. No pagination implemented.
    ```typescript
    const products = await prisma.product.findMany({ ... });
    ```
    **MEDIUM ISSUE**: If a vendor has 1000 products, this page will be slow. Pagination is standard for tables.

### 4. Test Quality
- `actions.test.ts`:
  - Mocks `auth`, `prisma`, `revalidatePath`.
  - Tests `createProduct` (success, unauth, forbidden).
  - Tests `updateProduct` (success, forbidden).
  - Tests `deleteProduct`.
  - **PASS**.

## Summary of Issues

### 🔴 CRITICAL
(None)

### 🟡 MEDIUM
1. **Uncommitted Files**: New feature files are untracked in git.
2. **Type Safety**: `as any` used in `ProductForm.tsx` resolver.
3. **Performance**: No pagination on Products List page.

### 🟢 LOW
1. **Image Upload**: Placeholder used instead of real upload (Acceptable per dev plan, but worth noting).

## Recommendations
1. **Fix Types**: Remove `as any` by aligning the Zod schema output with React Hook Form's expected values (likely related to `z.coerce` returning numbers vs strings in inputs).
2. **Pagination**: Add simple pagination to `findMany`.
3. **Commit**: `git add .` to track files.