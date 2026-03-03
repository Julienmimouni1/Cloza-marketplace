---
title: 'fix-cart-layout-and-add-checkout'
slug: 'fix-cart-layout-and-add-checkout'
created: '2026-01-17 21:05:00'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js 16 (App Router)', 'Tailwind CSS', 'Shadcn UI (Sheet)']
files_to_modify: ['src/features/cart/components/CartDrawer.tsx', 'src/app/[locale]/checkout/page.tsx', 'src/app/[locale]/checkout/layout.tsx']
code_patterns: ['Feature-based architecture', 'Client-side component for interactivity', 'Shadcn Sheet for Cart']
test_patterns: ['Manual visual testing']
---

# Overview

## Problem Statement
The current Cart Sidebar (`CartDrawer`) has layout issues where pricing details (Subtotal, HT, Discount) overflow the container, overlapping with the background content (product page). Additionally, the "Validate Order" button is non-functional, lacking a destination page.

## Solution
1.  **Fix Cart CSS**: Refactor the `CartDrawer` footer layout to ensure pricing details are contained within the sidebar, likely by fixing width constraints and z-index contexts.
2.  **Add Checkout Page**: Implement a dedicated `/checkout` page with a recapitulative UI, payment method selection placeholders (Card, Wire/BNPL), and a final "Pay" action, purely for visual testing purposes.

## Scope
-   **In Scope**:
    -   CSS fixes for `CartDrawer.tsx` (Footer section).
    -   Creation of `src/app/[locale]/checkout/page.tsx`.
    -   Routing from Cart to Checkout.
    -   Basic UI for Checkout (Order Summary, Payment Methods).
-   **Out of Scope**:
    -   Real payment processing (Stripe/Mangopay integration).
    -   KYB validation logic.
    -   Backend order creation (Server Actions for order persistence).

# Context for Development

## Codebase Patterns
-   **Sheet Component**: Used for the Cart Drawer. The `SheetContent` has `z-50`, but the footer overflow suggests a lack of explicit width containment or `overflow-hidden` on the footer container vs `overflow-y-auto` on the list.
-   **Routing**: New page should be under `src/app/[locale]/checkout/page.tsx` to respect localization.
-   **Styling**: Use standard Tailwind spacing/sizing classes.

## Files to Reference
| File | Relevance |
| :--- | :--- |
| `src/features/cart/components/CartDrawer.tsx` | Target for CSS fixes and Button link update. |
| `src/components/ui/sheet.tsx` | Base component definition (good for checking Z-index defaults). |
| `src/app/[locale]/layout.tsx` | Check layout constraints if necessary. |

## Technical Decisions
-   **Checkout Layout**: Will create a minimal layout for checkout to remove distractions (header/footer) if possible, or keep standard layout. Given the "Quick Flow", standard layout is safer for now.
-   **Navigation**: Use `Link` from `next/link` or `useRouter` for the "Validate Order" button transition.

# Implementation Plan

## Task 1: Fix Cart Drawer CSS Overflow
-   [ ] **Refactor SheetFooter layout**
    -   File: `src/features/cart/components/CartDrawer.tsx`
    -   Action: Add `bg-white` (or neutral-50) and `z-10` relative positioning to the `SheetFooter`. Ensure it sits *above* the scrollable content area if they overlap, or strictly follows it in the flex column flow.
    -   Action: Force `SheetContent` flex behavior via className override: `flex flex-col h-full`. Ensure the list container has `flex-1 overflow-y-auto`.
    -   Action: Add padding adjustments to ensure text doesn't touch edges.

## Task 2: Implement Basic Checkout Page
-   [ ] **Create Checkout Page Structure**
    -   File: `src/app/[locale]/checkout/page.tsx`
    -   Action: Create a new page component marked with `"use client"`.
    -   Action: Implement a 2-column layout (Left: Forms/Methods, Right: Order Summary).
    -   Action: Import `useCart` hook to hydrate the Order Summary with real cart data.
    -   Action: Add "Payment Method" radio group (Card vs Wire).
    -   Action: Add a "Back to Shop" link pointing to `/`.

## Task 3: Link Cart to Checkout
-   [ ] **Connect "Validate Order" Button**
    -   File: `src/features/cart/components/CartDrawer.tsx`
    -   Action: Import `useRouter` from `next/navigation` (or localized router if available in `@/navigation`).
    -   Action: On button click, `closeDrawer()` then navigate to `/checkout`. Note: Since this is inside `[locale]`, ensure the route is relative or correctly localized (e.g. use `Link` component wrapping the button or `router.push('/checkout')` which Next.js usually handles relative to base, but verify locale persistence). *Correction:* Use `useRouter` from `next/navigation` which handles app directory routing, but constructing the URL might need the current locale.
    -   *Better approach:* Import `useParams` to get the current `locale`, then `router.push(/${locale}/checkout)`.

# Acceptance Criteria
-   [ ] **AC 1**: Given the Cart Drawer is open, when I scroll the product list, then the pricing footer stays fixed at the bottom (or scrolls naturally) without overflowing text onto the background.
-   [ ] **AC 2**: Given the Cart Drawer is open, when I click "Valider la commande", then the drawer closes and I am navigated to the correct `/checkout` URL preserving the current language (e.g., `/fr/checkout`).
-   [ ] **AC 3**: Given I am on `/checkout`, when I view the page, then I see the real items from my cart in the summary and can select payment options.