# 6-1 Dispute Management System

## Context
Per SRS (Sections 3.1.6, 3.2.7), Buyers must be able to open disputes on specific orders (or items), and Admins must arbitrate. This is critical for trust in a B2B marketplace.

## Features
1.  **Dispute Creation**: Buyer selects a `SubOrder` (or specific items) and chooses a reason (Damaged, Missing, Not as Described).
2.  **Evidence Upload**: Support photo/document uploads (S3/Blob).
3.  **Status Workflow**: `OPEN` -> `VENDOR_REPLY` -> `ADMIN_REVIEW` -> `RESOLVED` (Refund/Dismiss).
4.  **Financial Lock**: (Future) Trigger Stripe Connect payout freeze on the associated `SubOrder`.

## Proposed Data Model (Prisma)

```prisma
enum DisputeReason {
  ITEM_MISSING
  ITEM_DAMAGED
  NOT_AS_DESCRIBED
  LATE_DELIVERY
  OTHER
}

enum DisputeStatus {
  OPEN                // Created by Buyer
  UNDER_NEGOTIATION   // Vendor replied
  ESCALATED           // Admin intervention requested
  RESOLVED_REFUND     // Refund issued
  RESOLVED_DISMISSED  // Dispute rejected
}

model Dispute {
  id            String        @id @default(cuid())
  subOrderId    String
  subOrder      SubOrder      @relation(fields: [subOrderId], references: [id])
  initiatorId   String
  initiator     User          @relation(fields: [initiatorId], references: [id])
  
  reason        DisputeReason
  status        DisputeStatus @default(OPEN)
  description   String
  adminNotes    String?
  resolution    String?       // Text explaining the outcome
  
  evidence      DisputeEvidence[]
  messages      DisputeMessage[]
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model DisputeEvidence {
  id          String   @id @default(cuid())
  disputeId   String
  dispute     Dispute  @relation(fields: [disputeId], references: [id])
  url         String
  fileType    String   // "IMAGE", "PDF"
  uploadedAt  DateTime @default(now())
}

model DisputeMessage {
  id          String   @id @default(cuid())
  disputeId   String
  dispute     Dispute  @relation(fields: [disputeId], references: [id])
  senderId    String
  sender      User     @relation(fields: [senderId], references: [id])
  content     String
  sentAt      DateTime @default(now())
}
```

## Implementation Roadmap
1.  **Schema Update**: Add `Dispute` related models.
2.  **Buyer UI**: "Report a Problem" button on Order History -> Dispute Form.
3.  **Admin UI**: Dashboard to view Open Disputes and act (Refund/Reject).
4.  **Vendor UI**: Notification of dispute + Ability to reply/upload counter-evidence.
