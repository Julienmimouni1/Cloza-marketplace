# 4-6 Vendor Dashboard & Order Management

## Context
The Vendor Dashboard is the command center for suppliers. It provides visibility into their specific slice of multi-vendor orders, revenue, and fulfillment status. This implementation follows the SRS requirement for a "Standalone custom web platform" feel, distinct from a generic plugin.

## Features Implemented
1.  **Vendor Dashboard Home (`/vendor`)**
    *   **KPI Cards**: Real-time stats for Total Revenue, Pending Orders, Shipped Orders, and Dispute Count.
    *   **Recent Orders Table**: List of the 5 most recent `SubOrders` linked to the vendor.
    *   **Status Badges**: Visual indicators for `PENDING_CONFIRMATION`, `SHIPPED`, etc.
    *   **Navigation**: Direct link to order details.

2.  **Order Detail View (`/vendor/orders/[id]`)**
    *   **Order Info**: ID, Date, Status.
    *   **Line Items**: Product details (Image, Name, SKU), Quantity, Price at Purchase.
    *   **Financial Breakdown**: Subtotal, Platform Commission (15%), Net Payout.
    *   **Customer Details**: Buyer Name, Company, Email, Phone.
    *   **Shipping Address**: Formatted address for label printing.
    *   **Actions**: "Mark as Shipped" (Visual button), "Print Packing Slip".

## Technical Implementation
*   **Route**: `src/app/(dashboard)/vendor` (Protected Layout).
*   **Data Access**: Direct Prisma calls in Server Components for performance.
*   **Components**: Shadcn UI (Card, Table, Badge, Button) for consistent "Showroom" aesthetic.
*   **Order Splitting Logic**: Leverages the `SubOrder` model to ensure vendors ONLY see their own items/revenue, not the full parent order.

## Testing Data
*   **Seeding**: The `prisma/seed-orders.ts` script generates 50 realistic orders with varied statuses and mixed vendors.
*   **Demo Mode**: Currently hardcoded to vendor slug `l-artisan-parisien` for demonstration purposes until full Auth integration.

## Next Steps
1.  **Auth Integration**: Replace hardcoded vendor ID with `session.user.vendorId`.
2.  **Interactive Actions**: Wire up the "Mark as Shipped" button to a Server Action.
3.  **Dispute UI**: Add the tab for managing active disputes.
