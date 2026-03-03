# 4-5 Multi-Vendor Order Splitting Logic

## Context
As defined in the SRS (Section 3.1.3), CLOZA requires a "Unified Checkout, Split Order" architecture. A buyer pays once, but the system must generate distinct order records for each vendor to facilitate separate shipping tracking, invoicing, and potential disputes.

## Technical Goals
1. **Schema Definition**: Create `Order` (Parent) and `SubOrder` (Child per Vendor) models.
2. **Transition Logic**: Migrate `Cart` + `CartItems` -> `Order` + `SubOrders` + `OrderItems` upon successful payment.
3. **Reference Integrity**: Ensure the Payment Intent ID (Stripe) is linked to the Parent Order.

## Proposed Data Model (Prisma)

```prisma
model Order {
  id              String      @id @default(cuid())
  buyerId         String
  buyer           User        @relation(fields: [buyerId], references: [id])
  totalAmount     Int         // Grand total in cents
  currency        String      @default("EUR")
  status          String      @default("PENDING") // PENDING, PAID, PARTIALLY_FULFILLED, COMPLETED
  paymentIntentId String?     // Stripe Payment Intent
  paymentMethod   String      // "CARD", "KLARNA_BNPL"
  createdAt       DateTime    @default(now())
  
  subOrders       SubOrder[]
}

model SubOrder {
  id              String      @id @default(cuid())
  parentOrderId   String
  parentOrder     Order       @relation(fields: [parentOrderId], references: [id])
  vendorId        String
  vendor          Vendor      @relation(fields: [vendorId], references: [id])
  status          String      @default("PENDING_CONFIRMATION") // WAITING_VENDOR, CONFIRMED, SHIPPED, DELIVERED
  totalAmount     Int         // Subtotal for this vendor
  commissionAmount Int        // Calculated platform fee
  
  items           OrderItem[]
  disputes        Dispute[]
}

model OrderItem {
  id              String      @id @default(cuid())
  subOrderId      String
  subOrder        SubOrder    @relation(fields: [subOrderId], references: [id])
  productId       String
  product         Product     @relation(fields: [productId], references: [id])
  quantity        Int
  priceAtPurchase Int         // Snapshot of price
}
```

## Implementation Steps
1.  **Update Schema**: Apply the above models to `schema.prisma`.
2.  **Checkout Action**: Implement `createOrderFromCart(cartId)` action.
    -   Validate Stock (again).
    -   Group CartItems by `vendorId`.
    -   Create Parent Order.
    -   Iterate groups to create SubOrders.
    -   Clear Cart.
3.  **Testing**: Unit test the splitting logic with a cart containing items from Vendor A and Vendor B.
