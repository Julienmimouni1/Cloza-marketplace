# Story 2.1: Smart Drawer & Cart State (Zustand)

Status: done

## Story

As a **Retailer (Sophie)**,
I want to **manage my cart items in a side drawer without leaving the product catalog**,
so that **I can continue shopping while seeing my current selection**.

## Acceptance Criteria

1. **Drawer Interaction:**
   - **Given** I am on any product page (PLP or PDP).
   - **When** I click the "Add to Cart" button.
   - **Then** the Smart Drawer opens from the right side (Shadcn Sheet).
   - **And** the background is dimmed (overlay).

2. **State Management (Zustand):**
   - **When** an item is added.
   - **Then** the item is added to the local Zustand store (`useCart`).
   - **And** duplicate items (same ID) increment quantity, new items are appended.
   - **And** the cart state persists on page reload (LocalStorage via Zustand persist middleware).

3. **Cart Content Display:**
   - **Given** items are in the cart.
   - **Then** I see the list of items with:
     - Thumbnail image.
     - Product Title.
     - Price **HT** (Hors Taxe) per unit.
     - Quantity selector (+/- inputs).
     - Remove button (trash icon).
   - **And** a summary at the bottom showing Total HT (simple sum for now, pricing engine comes in Story 2.2).

4. **Navigation Continuity:**
   - **When** I click outside the drawer or click the close button.
   - **Then** the drawer closes.
   - **And** I remain on the exact same scroll position on the product page.
   - **And** a "Cart" indicator (icon + badge count) in the header updates to reflect the new total item count.

## Tasks / Subtasks

- [x] **Setup Cart Store (Zustand)**
  - [x] Create `src/features/cart/hooks/useCart.ts`.
  - [x] Define `CartItem` interface (id, title, priceHT, quantity, image, etc.).
  - [x] Implement `addItem`, `removeItem`, `updateQuantity`, `clearCart` actions.
  - [x] Add `persist` middleware for LocalStorage.

- [x] **Implement Smart Drawer UI**
  - [x] Create `src/features/cart/components/CartDrawer.tsx` using Shadcn `Sheet`.
  - [x] Create `CartItemRow.tsx` component for individual items.
  - [x] Integrate `useCart` hook to drive the UI.

- [x] **Integrate with "Add to Cart" Button**
  - [x] Update `ProductCard.tsx` (or equivalent) to call `addItem` and open the drawer.
  - [x] Update Header Cart Icon to open the drawer on click.

## Dev Notes

### Architecture & Tech Stack
- **State:** Use **Zustand** v5.x. This is the *Client State* for the session.
- **UI:** Use **Shadcn UI Sheet** component. Ensure `side="right"`.
- **Persistence:** Use `persist` middleware from Zustand. Key: `cloza-cart-storage`.
- **Typing:** Strict TypeScript. Share types in `src/features/cart/types.ts` if reusable.

### Critical UX Details
- **"No-Leave" Policy:** The drawer must overlay the content. Do NOT navigate to a separate `/cart` page.
- **Optimistic UI:** The UI must update *instantly*. No loading spinners for local cart actions.
- **Mobile:** On mobile, the drawer might need to take 100% width or be a bottom sheet (check UX specs - "Drawer-First architecture"). *Correction:* UX Spec says "Drawer-First", typically side on desktop, bottom or full on mobile. Default Shadcn Sheet behavior (side) is acceptable for MVP but ensure responsive width.

### File Structure
- `src/features/cart/`
  - `hooks/useCart.ts`
  - `components/CartDrawer.tsx`
  - `components/CartItemRow.tsx`
  - `types.ts`

### References
- **UX Spec:** `(_bmad-output)/planning-artifacts/ux-design-specification.md` (Section: Journey 1, Smart Drawer).
- **Architecture:** `(_bmad-output)/planning-artifacts/architecture.md` (Section: Frontend State - Zustand).

## Dev Agent Record

### Agent Model Used
Gemini-2.0-Flash (Simulated)

### Debug Log References
- Verified `useCart` logic with unit tests (Red-Green-Refactor).
- Verified `CartDrawer` UI behavior with component tests (Red-Green-Refactor).
- Verified Integration in `Header` and `ProductCard` via regression tests.

### Completion Notes List
- Confirmed use of Shadcn Sheet.
- Confirmed Zustand with persistence.
- Implemented `CartIndicator` for Header integration.
- Implemented `AddToCartButton` for ProductCard integration (overlay on hover).
- Added `CartDrawer` to global `RootLayout`.
- 100% Test pass rate for new features.

### File List
- src/features/cart/hooks/useCart.ts
- src/features/cart/types.ts
- src/features/cart/components/CartDrawer.tsx
- src/features/cart/components/CartItemRow.tsx
- src/features/cart/components/CartIndicator.tsx
- src/features/cart/components/AddToCartButton.tsx
- src/features/cart/tests/useCart.test.ts
- src/features/cart/tests/CartDrawer.test.tsx
- src/components/shared/Header.tsx
- src/features/catalog/components/ProductCard.tsx
- src/app/layout.tsx
- src/components/ui/sheet.tsx
- src/features/cart/constants.ts
- src/features/cart/utils.ts
