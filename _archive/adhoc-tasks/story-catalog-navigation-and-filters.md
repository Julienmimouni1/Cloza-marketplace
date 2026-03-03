# Story: Product Filtering & Navigation UX

**Status:** Implementation Complete / Reference
**Epics:** Core Experience / Catalog

## 1. Goal
Provide a "Consumer-Grade" browsing experience that allows users to seamlessly navigate deep catalog hierarchies while retaining the ability to filter by specific attributes (Brand, Price, Stock). The experience must feel "magic" — intuitive, fast, and context-aware.

## 2. Architecture & Components

### A. Navigation Strategy (The "Sidebar")
Moved from a flat "Checkbox" model to a **Hierarchical Accordion Navigation** model.
- **Source of Truth:** `src/lib/menu-data.ts` (MENU_DATA). The Sidebar mirrors the MegaMenu structure.
- **Component:** `src/features/catalog/components/CatalogSidebar.tsx`.
- **Behavior:**
  - **Auto-Expansion:** If a user lands on a sub-category (e.g., via SEO link or search), the sidebar automatically finds the parent category and expands that section.
  - **Deep Linking:** Clicking a category is a navigation event (`Link`), not a filter event. This improves SEO and browser history management.
  - **Visual Hierarchy:** Indentation and font weights distinguish Main Categories vs. Sub-Categories vs. Leaf Categories.

### B. Attribute Filtering
Retained as "Additive Filters" below the navigation.
- **State Management:** URL Search Params (`?brands=X&minPrice=Y`).
- **Components:** Checkboxes (Brands, Stock), Range Slider (Price).
- **Behavior:** These filters apply *on top* of the current category context.

### C. Logic Layer (`src/lib/category-utils.ts`)
Central utility to bridge the gap between "Business Names" (Menu) and "Database Enums" (Prisma).
- `resolveMainCategory(slug)`: Maps "food", "groceries" -> `Category.Food`.
- `getParentCategory(subCat)`: Reverse lookup in MENU_DATA to find where a sub-cat belongs.
- `getCategoryDisplayName(slug)`: Returns "Food & Beverages" instead of "Food".

## 3. Implemented Features

### 3.1 Smart Sidebar
- **Input:** `MENU_DATA`, `searchParams`.
- **Logic:** Recursively searches `MENU_DATA` to determine which AccordionItem to set as `defaultValue` (open).
- **UI:** Custom styled Accordion with removed borders for a clean "SaaS/E-tailer" look.

### 3.2 Dynamic Page Titles
- **Problem:** `searchParams.category` is often a slug ("Alcoholic") or a short enum ("Food").
- **Solution:** `getCategoryDisplayName` scans the Menu tree to find the human-readable title.
- **Result:** Page headers match the marketing language exactly.

### 3.3 MegaMenu Refinement
- **Enhancement:** The "Hero Card" (leftmost column in dropdown) is now top-aligned with other columns.
- **Interaction:** "Browse Collection" link clearly signals navigation to the broad category view.

## 4. Future Scalability
- **Facets:** The current setup supports adding new facets (e.g., "Size", "Color") easily by adding new sections to `CatalogSidebar`.
- **Mobile:** The Sidebar is currently hidden on mobile (`lg:hidden`). Future work should implement a "Sheet" (Slide-over) version of this sidebar for mobile users.
