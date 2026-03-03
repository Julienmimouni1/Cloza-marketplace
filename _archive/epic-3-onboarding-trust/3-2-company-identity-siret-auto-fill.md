# Story 3.2: Company Identity & SIRET Auto-fill

**Status:** ready-for-dev
**Epic:** 3 - Frictionless Onboarding (Identity & Trust)
**ID:** 3.2

## Story

As a Retailer,
I want my company details to be filled automatically using my SIRET,
So that I save time and avoid typos during registration.

## Acceptance Criteria

1.  **SIRET Input & Validation:**
    *   The KYB/Onboarding form includes a dedicated SIRET input field.
    *   Input is validated for exactly 14 numeric digits (Zod).
    *   A "Lookup" or auto-trigger mechanism fires when 14 digits are reached.

2.  **External API Integration (BFF Pattern):**
    *   Call an external B2B API (e.g., Pappers, Insee/Sirene) via a Server Action (BFF).
    *   **API Keys must NEVER be exposed to the client.**
    *   Use standard `fetch` API for external calls.
    *   Handle rate limiting and "Not Found" errors gracefully with user-friendly messages.
    *   **Edge Case:** If the company status is "Closed" (cessation d'activité), prompt a warning to the user.

3.  **Form Auto-population & Feedback:**
    *   Automatically populate:
        *   `companyName` (Dénomination sociale)
        *   `address` (Siège social)
        *   `zipCode`
        *   `city`
        *   `vatNumber` (Intracommunautaire - often derivable from SIREN if not returned).
    *   **UX Gold State:** Display a subtle success animation (green check or gold flash) when fields are successfully populated.
    *   Populated fields remain editable by the user for manual correction/review.

4.  **Data Persistence:**
    *   The lookup data is saved to the `User` or `Company` profile in the database upon form submission.
    *   Ensure database schema is updated via `npx prisma migrate dev`.

5.  **Security & Access Control:**
    *   This feature is strictly for **Authenticated Users** (Role: RETAILER/GUEST migrated).
    *   Ensure the Server Action verifies the session before processing.

## Tasks/Subtasks

- [x] **Task 1: Database Schema Update**
    - [x] Add `companyName`, `siret`, `vatNumber`, `address`, `city`, `zipCode`, `kybStatus` to `User` model in `prisma/schema.prisma`.
    - [x] Run `npx prisma migrate dev --name add_company_fields`.
    - [x] Verify `User` type is updated in `node_modules/@prisma/client`.
- [x] **Task 2: Core Logic & Validation**
    - [x] Create `src/features/identity/schemas.ts` with Zod schema for SIRET (14 digits).
    - [x] Create `src/features/identity/utils/vat-utils.ts` for VAT calculation from SIRET.
    - [x] Add unit tests for VAT calculation.
- [x] **Task 3: Server Action (BFF) Implementation**
    - [x] Create `src/features/identity/actions.ts`.
    - [x] Implement `lookupSiret` action using `fetch` to Pappers/Sirene (or mock).
    - [x] Handle API errors and return structured `ActionResponse`.
    - [x] Ensure API keys are used server-side only.
- [x] **Task 4: UI Component Implementation**
    - [x] Create/Update `src/features/identity/components/CompanyInfoForm.tsx`.
    - [x] Add SIRET input field with validation feedback.
    - [x] Implement `useTransition` for loading state during lookup.
    - [x] Auto-fill fields (`companyName`, `address`, etc.) on successful lookup.
    - [x] Show success animation/feedback.
- [x] **Task 5: Integration & Verification**
    - [x] Ensure form submission saves data to `User` profile.
    - [x] Verify end-to-end flow manually (mock data).
    - [x] Add integration test for the form population logic.
- [x] **Review Follow-ups (AI)**
    - [x] [AI-Review][Critical] Implement AC2 Edge Case (Closed Company Warning)
    - [x] [AI-Review][Medium] Fix strict type safety violations (next-auth types)
    - [x] [AI-Review][Medium] Refactor mock implementation into service layer

## Developer Context

### 🏗️ Architecture Guardrails
*   **Pattern:** Use Server Actions for the API lookup to respect the **BFF (Backend-for-Frontend)** proxy decision (ADR-002).
*   **Location:** 
    *   Logic: `src/features/identity/actions.ts`
    *   UI: `src/features/identity/components/CompanyInfoForm.tsx`
    *   Schema: `src/features/identity/schemas.ts`
*   **Style:** Use Shadcn UI `Form`, `Input`, and `Button` components.

### 🛠️ Technical Requirements
*   **External API:** Use [Pappers API](https://www.pappers.fr/api/documentation) (Search/Enterprise) or a similar service. For development/test, you can implement a mock handler if an API key is not provided, but the structure must be ready for a real fetch.
*   **Database Update:** Add company-related fields to the `User` model in `prisma/schema.prisma` if they don't exist yet:
    ```prisma
    model User {
      // ... existing fields
      companyName String?
      siret       String?
      vatNumber   String?
      address     String?
      city        String?
      zipCode     String?
      kybStatus   String @default("PENDING") // PENDING, IN_REVIEW, APPROVED, REJECTED
    }
    ```
    *   **Command:** Run `npx prisma migrate dev --name add_company_fields` to apply changes.
*   **VAT Logic:** If the API doesn't provide the VAT number, calculate it from the SIREN (first 9 digits of SIRET) using the French formula: `FR + [ (12 + 3 * (SIREN mod 97)) mod 97 ] + SIREN`.

### 🔗 Dependencies
*   Story 3.1 (Auth initialized) must be functional.
*   `zod` for strict SIRET validation.

### 🧪 Testing Requirements
*   **Unit:** Test the VAT calculation utility.
*   **Integration:** Mock the external API response to test form population.
    *   **Mock Data Example:**
        ```json
        {
          "nom_entreprise": "CLOZA SAS",
          "siege": {
            "adresse_ligne_1": "10 Rue de la Mode",
            "code_postal": "75001",
            "ville": "Paris"
          },
          "statut_rcs": "inscrit"
        }
        ```
*   **E2E:** Verify that entering a SIRET triggers the population of the Address and Company Name.

## Project Context Reference
*   **PRD:** FR-14 (Création de compte entreprise avec validation SIRET/TVA automatisée).
*   **Architecture:** ADR-002 (BFF Proxy) & ADR-003 (Auth/Identity).

---
**Note for Dev:** This is the first step of the KYB process. Ensure the UI feels "Premium B2B" (Gold accents, clean spacing). Use `loading` states for the API call to provide immediate feedback.

## Senior Developer Review (AI)

**Review Outcome:** Approve
**Review Date:** 2026-01-14

### Action Items
- [x] [Critical] Implement AC2 Edge Case: If company is "Closed", show warning. (Evidence: `src/features/identity/services/pappers.ts` logic + `CompanyInfoForm.tsx` UI check).
- [x] [Medium] Fix Type Safety: Remove `as any` in `dashboard/page.tsx` and `auth.ts`. (Evidence: `src/types/next-auth.d.ts` created and used).
- [x] [Medium] Refactor Mock: Move logic to `src/features/identity/services/pappers.ts`. (Done).

### Summary
The code now respects all Acceptance Criteria, including the edge case for closed companies. The architecture is cleaner with the separation of the Pappers service (mocked), making future API integration easier. Type safety has been significantly improved by augmenting NextAuth types.

## File List
- prisma/schema.prisma
- src/types/next-auth.d.ts
- src/features/identity/schemas.ts
- src/features/identity/utils/vat-utils.ts
- src/features/identity/tests/vat-utils.test.ts
- src/features/identity/services/pappers.ts
- src/features/identity/actions.ts
- src/features/identity/components/CompanyInfoForm.tsx
- src/features/identity/tests/actions.test.ts

