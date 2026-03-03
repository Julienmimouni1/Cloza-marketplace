# Story 2.4: Stock Conflict Handling

Status: done

## Story

**As a** Retailer (Sophie),
**I want** to be notified immediately if I try to add more items than available in stock,
**So that** I don't have bad surprises during the final checkout.

## Acceptance Criteria

1.  **Immediate Validation:** When increasing quantity in the cart (or adding from PLP), the system checks against the known available stock.
2.  **Optimistic UI with Rollback:** The UI updates immediately to the requested quantity. If the server response indicates insufficient stock, the quantity reverts to the maximum available.
3.  **User Feedback:** If a conflict occurs (requested > available), a clear error message (Toast) is displayed: "Only [X] items remaining in stock".
4.  **Auto-Correction:** The input field automatically corrects to the maximum available stock value.
5.  **Concurrency Safety:** If the stock changes on the server (e.g., another user buys the last item) while the user is browsing, the next cart interaction triggers a validation that corrects the local cart state.

## Tasks / Subtasks

- [x] **Backend: Stock Validation Logic**
    - [x] Extend the Shared Pricing Engine or create a `StockValidator` service to handle stock checks.
    - [x] Ensure the `addToCart` / `updateQuantity` Server Actions verify stock against the DB (`Product.stock`).
    - [x] Return specific error codes for `INSUFFICIENT_STOCK` including the `availableQuantity`.

- [x] **Frontend: Cart Store Logic (Zustand)**
    - [x] Update `useCart` hook actions (`addItem`, `updateQuantity`).
    - [x] Implement `maxQuantity` enforcement in the `addItem` logic based on currently loaded product data.
    - [x] Handle server-side validation failures: if the Server Action returns `INSUFFICIENT_STOCK`, trigger a rollback of the local state.

- [x] **Frontend: UI & Feedback**
    - [x] Update `CartItem` component to disable the "+" button if `quantity >= product.stock` (if stock is known locally).
    - [x] Implement `sonner` toast notification for stock errors.
    - [x] Add visual indicator (red text or border) on the quantity input when max stock is reached/exceeded.

- [x] **Testing**
    - [x] Unit Test: `StockValidator` logic with various stock levels.
    - [x] Integration Test: "Add to Cart" flow with insufficient stock.
    - [x] E2E Test (Playwright): Simulate user adding more items than available and verifying the rollback/toast.

- [ ] **Bonus / Polish (Optional)**
    - [ ] **Real-time Sync (Pusher):** Listen for `stock.updated` events from Pusher to update local stock levels in the cart without requiring user interaction.

## Dev Notes

### Architecture Patterns & Constraints
-   **State Management:** Use **Zustand** for the optimistic client update. 
-   **Data Types:** Update `CartItem` in `src/features/cart/types.ts` to include `stock: number`.
-   **Optimistic UI:** Update `useCart.ts` to check `item.stock` before allowing quantity increases.
-   **Server Truth:** The final source of truth for stock is the Database (PostgreSQL via Prisma). Server Actions must perform a hard check before returning success.
-   **Error Handling:** Use a standardized error response from Server Actions (e.g., `{ success: false, error: 'INSUFFICIENT_STOCK', available: 5 }`).

### Source Tree Components to Touch
-   `src/features/cart/types.ts`: Add `stock` to `CartItem`.
-   `src/features/cart/hooks/useCart.ts`: Implement stock-aware `addItem` and `updateQuantity`.
-   `src/features/cart/components/CartItem.tsx`: UI for quantity inputs and stock alerts.
-   `src/features/catalog/actions.ts` (or cart actions): Server-side validation.
-   `src/lib/pricing/engine.ts`: While engine is pure, ensure types support passing stock if needed for validation wrappers.

### Libraries
-   **Sonner:** Use `sonner` (already in Shadcn setup) for the toast notifications.
-   **Framer Motion:** (Optional) for smooth rollback animations or alert visibility.

## Reference Materials

-   [Epics: Story 2.4]((_bmad-output)/planning-artifacts/epics.md#story-24-stock-conflict-handling) - Source Requirements.
-   [Architecture: Frontend State]((_bmad-output)/planning-artifacts/architecture.md#frontend-state--communication) - Guidelines on Zustand/Server Actions.
-   [UX Specification: Journey 1]((_bmad-output)/planning-artifacts/ux-design-specification.md#journey-1-smart-procurement-optimized) - Optimistic UI patterns.

## Dev Agent Record

### Agent Model Used
Gemini-2.0-Flash (Bmm/Bob/Yolo-Mode)

### Completion Notes
-   Implémentation de la validation de stock côté serveur via une nouvelle Server Action `validateStockAction`.
-   Mise à jour du store Zustand `useCart` pour intégrer des mises à jour optimistes avec rollback automatique en cas d'insuffisance de stock détectée par le serveur.
-   Intégration de la bibliothèque `sonner` pour les notifications utilisateur (toasts).
-   Mise à jour des composants UI (`CartItemRow`, `AddToCartButton`, `ProductCard`, `ProductGrid`) pour afficher le stock et désactiver les actions invalides.
-   Couverture de tests : Tests unitaires pour la logique de validation et tests d'intégration pour le hook `useCart`.
-   Correction globale des types TypeScript suite à l'ajout du champ `stock` dans le modèle de données.
-   **Code Review Fixes (2026-01-13):**
    -   Correction d'un bug où un article ajouté avec stock épuisé (0) restait dans le panier avec une quantité de 0. Il est maintenant correctement retiré.
    -   Amélioration de la gestion des données : le stock local est maintenant mis à jour avec les données fraîches du serveur même en cas de succès de l'action.
    -   Suppression des notifications "Toast" redondantes.

### File List
- `prisma/schema.prisma`
- `src/features/cart/types.ts`
- `src/features/cart/hooks/useCart.ts`
- `src/features/cart/actions.ts`
- `src/features/cart/schemas.ts`
- `src/features/cart/logic/stock-validator.ts`
- `src/features/cart/components/CartItemRow.tsx`
- `src/features/cart/components/AddToCartButton.tsx`
- `src/features/catalog/actions.ts`
- `src/features/catalog/components/ProductCard.tsx`
- `src/features/catalog/components/ProductGrid.tsx`
- `src/app/products/[category]/[slug]/page.tsx`
- `src/app/brands/page.tsx`
- `src/app/catalog/page.tsx`
- `src/app/new-arrivals/page.tsx`
- `src/features/cart/tests/stock-validator.test.ts`
- `src/features/cart/tests/useCart-integration.test.ts`
- `src/features/catalog/components/ProductCard.test.tsx`
- `src/features/catalog/components/ProductGrid.test.tsx`
- `src/tests/ProductGrid.test.tsx`
