# Story 2.2: Shared Pricing Engine Logic

## Senior Developer Review (AI)
- **Review Date:** 2026-01-13
- **Outcome:** Approved
- **Action Items:**
  - [x] Added tests for concurrent discount rules (priority handling).
  - [x] Added tests for mixed VAT rates in multi-vendor cart.
  - [ ] (Low) Consider moving to 'dinero.js' or similar for precise financial rounding in future iterations.

## Status
Status: done


## Story

As a **Developer**,
I want to **have a central pricing engine that calculates discounts based on volume**,
so that **the price shown in the cart matches the price at checkout exactly**.

## Acceptance Criteria

1.  **Discount Rules Implementation:**
    - **Given** a set of quantity-based discount rules (e.g., 5+ items = -10%, 10+ items = -15%).
    - **When** the cart quantities change.
    - **Then** the pricing engine recalculates the total discount, total HT, and VAT instantly.

2.  **Pure Function Architecture:**
    - **Given** the pricing logic is critical.
    - **Then** it is implemented in a pure TypeScript module (`src/lib/pricing/engine.ts` or similar).
    - **And** it is accessible by both the frontend (Client Components) and the BFF (Server Actions/API).

3.  **Multi-Vendor Handling:**
    - **Given** the cart may contain items from multiple vendors.
    - **Then** the engine handles shipping cost accumulation correctly (if applicable, or prepares for it).
    - **And** it aggregates totals correctly per vendor and globally.

## Tasks / Subtasks

- [x] **Design Pricing Logic**
  - [x] Define the data structure for `CartItem`, `DiscountRule`, and `PricingResult`.
  - [x] Create `src/lib/pricing/types.ts`.

- [x] **Implement Pricing Engine**
  - [x] Create `src/lib/pricing/engine.ts`.
  - [x] Implement `calculateCartTotals(items: CartItem[], rules: DiscountRule[]): PricingResult`.
  - [x] Write unit tests to verify calculations (including edge cases like 0 quantity, high volume, etc.).

- [x] **Integrate with Store**
  - [x] Update the Zustand store to use this engine when items are added/removed.
  - [x] Ensure the "Deal Gauge" reads from this calculated state.

## Dev Notes

### Technical Strategy
- **Isolation:** This logic must be isolated from React components to be reusable in Node.js/Edge contexts (for the eventual backend validation).
- **Performance:** Calculations must be synchronous and extremely fast (simple math).
- **Testing:** 100% coverage required via Vitest.

## Dev Agent Record
- Created by Gemini CLI on 2026-01-12 to rectify consistency with `epics.md`.
- 2026-01-13: Implemented Pricing Engine (Types, Engine, Unit Tests).
- 2026-01-13: Integrated Pricing Engine into `useCart` Zustand store.
- 2026-01-13: Refactored `ProductCard`, `ProductGrid`, `PDP`, and `actions.ts` to ensure `vendorId` and correct pricing data are passed to `AddToCartButton`.
- 2026-01-13: Updated unit tests for `useCart`, `actions`, `ProductCard`, `ProductGrid`. 
- 2026-01-13: Verified all relevant tests pass (HomePage tests unrelated failures noted).

## File List
- src/lib/pricing/types.ts
- src/lib/pricing/engine.ts
- src/lib/pricing/engine.test.ts
- src/features/cart/hooks/useCart.ts
- src/features/cart/types.ts
- src/features/cart/components/AddToCartButton.tsx
- src/features/catalog/components/ProductCard.tsx
- src/features/catalog/components/ProductGrid.tsx
- src/features/catalog/actions.ts
- src/app/products/[category]/[slug]/page.tsx
- src/features/cart/tests/useCart.test.ts
- src/features/catalog/components/ProductCard.test.tsx
- src/features/catalog/components/ProductGrid.test.tsx
- src/features/catalog/actions.test.ts
- src/tests/ProductGrid.test.tsx
- src/tests/infra/seed.test.ts