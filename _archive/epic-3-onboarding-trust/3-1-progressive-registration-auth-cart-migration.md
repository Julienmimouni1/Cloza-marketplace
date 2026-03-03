# Story 3.1: Progressive Registration (Auth & Cart Migration)

Status: done

## Story

As a Visitor (with a cart),
I want to create an account easily and keep my selected items,
So that I don't lose the shopping I've already done.

## Acceptance Criteria

1.  **Registration Form (Secure & B2B Ready):**
    *   Users can register with Email/Password.
    *   **Password Policy:** strict B2B standard (Min 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol) validated via Zod.
    *   Form provides real-time inline validation feedback.
    *   On success, user is automatically signed in.

2.  **Cart Persistence & Migration (Smart Merge):**
    *   **Trigger:** Occurs immediately after successful Registration or Login.
    *   **Source of Truth:** Database Cart becomes the master.
    *   **Conflict Resolution:**
        *   *Scenario A (Item in Guest, not in DB):* Add to DB.
        *   *Scenario B (Item in Guest AND DB):* Sum quantities (`Guest.qty + DB.qty`).
        *   *Scenario C (Item in DB, not in Guest):* Preserve DB item.
    *   **Local State:** Zustand store invalidates local persistence and hydrates freshly from the DB (via `useCart` hook).

3.  **Session & Context Management:**
    *   `SessionProvider` wraps the application (in `providers.tsx`) to expose auth state globally.
    *   Middleware protects `/checkout` and `/dashboard` routes, redirecting unauthenticated users to `/login` with a `callbackUrl`.
    *   User is redirected back to their previous context (Checkout or Catalog) after auth.

## Tasks / Subtasks

- [x] **Database Schema Update (Prisma)**
    - [x] Add `User` model (Role: GUEST, RETAILER, ADMIN).
    - [x] Add NextAuth models: `Account`, `Session`, `VerificationToken`.
    - [x] Add `Cart` and `CartItem` models (One-to-One with User).
    - [x] Run `prisma migrate dev`.

- [x] **Authentication Infrastructure (NextAuth v5 Split)**
    - [x] Create `src/auth.config.ts`: Edge-compatible config (routes, providers basics) for Middleware.
    - [x] Create `src/lib/auth.ts`: Node-compatible config (Prisma Adapter) for Server Actions/Components.
    - [x] Implement `src/middleware.ts` using `auth.config.ts` to protect `PROTECTED_ROUTES`.
    - [x] Update `src/app/providers.tsx` to include `SessionProvider`.

- [x] **Registration Feature**
    - [x] Define Zod Schema in `src/features/identity/schemas.ts` with strict password regex.
    - [x] Create `RegisterForm` component (React Hook Form).
    - [x] Implement Server Action `registerUser` in `src/features/identity/actions.ts` (hashing with `bcryptjs`).

- [x] **Cart Migration Logic (The "Sync")**
    - [x] Create Server Action `syncCart(guestItems: CartItem[])` in `src/features/cart/actions.ts`.
    - [x] Implement "Smart Merge" logic (Sum quantities on conflict).
    - [x] Update `useCart` hook:
        *   [x] Add `hasHydrated` flag to prevent premature sync.
        *   [x] Trigger `syncCart` in `useEffect` when `status === 'authenticated'`.
        *   [x] Switch internal storage from `localStorage` to `DB` (via Server Actions) when authenticated.

## Dev Notes

### ⚠️ Critical Architecture: Edge Compatibility
Next.js Middleware runs on the Edge. **You cannot use Prisma inside Middleware.**
*   **Split your Auth config:**
    *   `auth.config.ts`: Contains logic safe for Edge (route matching, JWT callbacks). Use this in `middleware.ts`.
    *   `auth.ts`: Extends `auth.config.ts` and adds the `PrismaAdapter`. Use this in `app/**` and Server Actions.

### Cart Sync Strategy
The migration is a critical moment.
1.  **Guest** adds items (Local Storage).
2.  **Guest** registers (Server Action `registerUser`).
3.  **Client** detects change to `authenticated`.
4.  **Client** calls `syncCart(localItems)`.
5.  **Server** merges items -> Clears Guest ID -> Returns new DB Cart.
6.  **Client** clears Local Storage -> Sets `items` from Server response.

### Security Standards
*   **Password Regex:** `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$`
*   **Route Protection:**
    *   `AUTH_ROUTES`: `['/login', '/register']` (Redirect to dashboard if already logged in).
    *   `PROTECTED_ROUTES`: `['/checkout', '/dashboard', '/profile']` (Redirect to login if guest).

### Reference Schema (Prisma)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?   // Hashed
  role          String    @default("RETAILER")
  cart          Cart?
  // ... NextAuth fields (Account, Session)
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id])
  items     CartItem[]
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  cart      Cart    @relation(fields: [cartId], references: [id])
  productId String
  // Add relation to Product model
  quantity  Int
  updatedAt DateTime @updatedAt

  @@unique([cartId, productId]) // Prevent duplicates at DB level
}
```

## Dev Agent Record

### Agent Model Used
Gemini-2.0-Flash (Bmm/Sm Agent) - **Optimized via Competition Mode**

### File List
-   `prisma/schema.prisma`
-   `src/auth.config.ts` (New)
-   `src/lib/auth.ts` (New)
-   `src/middleware.ts`
-   `src/app/providers.tsx`
-   `src/features/identity/schemas.ts`
-   `src/features/identity/actions.ts`
-   `src/features/cart/actions.ts`
-   `src/features/cart/hooks/useCart.ts`