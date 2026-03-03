# Story 6.2: Vendor Order Fulfillment Workflow

Status: ready-for-dev

## Story

As a **Vendor**,
I want to **process my incoming orders efficiently**,
so that **I can ship products quickly and get paid on time**.

## Acceptance Criteria

1.  **Order Dashboard Integration:**
    - **Given** I am on `/vendor/orders`.
    - **Then** I see a list of `SubOrders` assigned to me.
    - **And** I can filter by status: "Pending Confirmation", "To Ship", "Shipped", "Completed".

2.  **Order Acceptance/Rejection:**
    - **Given** a new order arrives ("Pending Confirmation").
    - **When** I view the details.
    - **Then** I have two primary actions: "Accept Order" (Moves to "To Ship") or "Reject Order" (Triggers refund flow).

3.  **Shipping Workflow:**
    - **Given** an order is "To Ship".
    - **When** I click "Mark as Shipped".
    - **Then** a modal appears requesting the **Carrier** and **Tracking Number**.
    - **When** I submit.
    - **Then** the status updates to "Shipped".
    - **And** the Buyer receives a notification (Email/In-App).

4.  **Packing Slip:**
    - **Then** I can download a PDF Packing Slip for each order to include in the box.

## Tasks / Subtasks

- [ ] **Backend Logic (Server Actions)**
    - [ ] Create `src/features/vendor/actions/orders.ts`.
    - [ ] Implement `updateSubOrderStatus(subOrderId, status, trackingData)`.
    - [ ] **Validation:** Ensure transitions are valid (e.g., cannot go from "Pending" to "Shipped" without "Accepting" first, unless simplified). *Decision: Simplified flow for MVP: Pending -> Shipped is okay if tracking provided.*

- [ ] **UI Implementation**
    - [ ] Enhance `/vendor/orders/[id]/page.tsx` (created in 4.6) with Action Buttons.
    - [ ] Create `OrderActionModal` (Dialog) for entering Tracking Info.
    - [ ] Add visual status timeline (stepper).

- [ ] **Email Notification (Stub)**
    - [ ] Create a placeholder service `sendShippingNotification(email, tracking)` that logs to console (for now).

## Dev Notes

### Data Model
- `SubOrder` model already exists (Story 4.5).
- Status Enum: `PENDING_CONFIRMATION`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
- Need to ensure `trackingNumber` and `carrier` fields exist on `SubOrder` (might need schema migration if not present).

### Architecture
- Reuse `src/features/vendor/` structure.
- Ensure strict separation: A vendor MUST NOT be able to see or edit another vendor's SubOrder.

## References
- [Epic 6 Details]((_bmad-output)/planning-artifacts/epics.md#epic-6-the-makers-studio-vendor-back-office)
- [Story 4.6 (Dashboard)]((_bmad-output)/implementation-artifacts/4-6-vendor-dashboard.md)
