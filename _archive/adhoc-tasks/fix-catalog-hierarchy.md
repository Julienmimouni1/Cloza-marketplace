# Story: Fix Catalog Navigation & Filtering Hierarchy

**Goal:** Fix the navigation logic where selecting a sub-category (e.g., "Alcoholic") incorrectly redirects to the parent category ("Food") or loses context. Ensure a robust, architectural approach to handling Category vs. Sub-Category filtering.

**Context:**
- Current URL structure: `/catalog?category=X` handles both Main Categories (Textile, Food, Beauty) and Sub-Categories.
- Issue: Ambiguity in `resolveCategoryEnum` caused "Alcoholic" (or aliases) to map to "Food".
- Requirement: "Consumer-Grade" UX where selecting a sub-category maintains the parent context in the sidebar and filters correctly.

---

## 1. Architectural Definition (Winston)

**Constraint:** We are using `searchParams` for filtering.
- Main Category: `category=Food` (Enum matches)
- Sub-Category: `category=Alcoholic` (No Enum match, fallback to string match) -> **Problem:** Sidebar doesn't know "Alcoholic" belongs to "Food".

**Solution:**
1.  **Strict Hierarchy in Code:** Use `MENU_DATA` (or a new shared constant `CATEGORY_HIERARCHY`) as the Source of Truth for parent-child relationships.
2.  **Smart Resolver:**
    - If `category` param matches a Main Category -> Show products in Category + Show Sub-Cats in Sidebar.
    - If `category` param matches a Sub-Category -> Find its Parent -> Show products in Sub-Category + Show Parent's Sub-Cats in Sidebar (pre-selected).
3.  **Navigation vs Filtering:**
    - **UX Decision:** Moved from "Checkbox Filtering" to "Hierarchical Navigation" for Categories.
    - Categories are now navigable Links within an Accordion sidebar.
    - Other filters (Price, Brand, Stock) remain as actionable widgets.

---

## 2. Implementation Tasks (Amelia) - ✅ COMPLETED

### Task 1: Centralize Category Logic
- [x] Create `src/lib/category-utils.ts`.
- [x] Move `resolveCategoryEnum` logic there.
- [x] Add function `getParentCategory(subCategory: string): Category | null` using `MENU_DATA`.
- [x] Add function `getAllSubCategories(category: Category): string[]`.
- [x] **New:** Add `getCategoryDisplayName(categoryParam: string): string` to resolve full names (e.g., "Food & Beverages" instead of "Food").

### Task 2: Refactor Catalog Page Logic (`src/app/catalog/page.tsx`)
- [x] Import `category-utils`.
- [x] **Scenario A (Main Category):** If `category` param is "Food":
    - Filter: `where: { category: 'Food' }`
    - Sidebar: Show all sub-categories of Food.
- [x] **Scenario B (Sub-Category):** If `category` param is "Alcoholic":
    - Detect Parent is "Food" (via `getParentCategory`).
    - Filter: `where: { category: 'Food', subCategory: 'Alcoholic' }` (Safety check) OR just `subCategory: 'Alcoholic'`.
    - Sidebar: Pass "Food" sub-categories to Sidebar.
- [x] **UI Update:** Use `getCategoryDisplayName` for the main Page Title to ensure professional headers.

### Task 3: Update Sidebar Component (`CatalogSidebar.tsx`)
- [x] **Major Refactor:** Replaced Checkbox list with `Accordion` + `Link` navigation based on `MENU_DATA`.
- [x] Implemented "Smart Open": Accordion automatically expands the active category (Main or Parent of current Sub).
- [x] Implemented Indentation: Clear visual hierarchy for Sub-Categories and Sub-Sub-Categories.
- [x] Preserved other filters (Brands, Price, Availability) below the navigation.

### Task 4: Fix Breadcrumbs/UI (Sally)
- [x] **MegaMenu Fix:** Aligned "All [Category]" link card to the top (`justify-start`) and removed excess margin for perfect alignment with list columns.
- [x] Page Title now reflects the proper hierarchical name.

---

## 3. Verification
- [x] **Test:** Click "Textile" -> Shows all Textile products. Accordion opens "Textile".
- [x] **Test:** Click "Alcoholic" -> Shows Alcoholic products. Page Title shows "Alcoholic". Sidebar keeps "Food & Beverages" open.
- [x] **Test:** MegaMenu hover -> "All [Category]" block is top-aligned and aesthetically pleasing.
- [x] **Test:** Click "Browse Collection" in MegaMenu -> Correctly navigates to the main category page with the full title.