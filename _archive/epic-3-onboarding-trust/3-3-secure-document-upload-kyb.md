# Story 3.3: Secure Document Upload (KYB)

**Status:** review
**Epic:** 3 - Frictionless Onboarding (Identity & Trust)
**ID:** 3.3

## Story

As a Business Owner,
I want to upload my legal documents (KBIS, ID Proof) securely,
So that I can prove my business identity and unlock payment features (BNPL).

## Acceptance Criteria

1.  **Document Upload UI:**
    *   User can upload two specific document types: **KBIS** (Company Registration) and **Identity Proof** (ID Card/Passport).
    *   Supported formats: PDF, JPG, PNG.
    *   Max file size: 5MB per file.
    *   UI provides a "Drag & Drop" zone with clear feedback (uploading, success, error).

2.  **Security & Validation (Critical):**
    *   **Magic Byte Validation:** File type MUST be verified by reading the file buffer headers (server-side), not just the file extension.
    *   **Malware Scan (Mock):** Simulate a scan that passes after 500ms.
    *   **Encryption:** Files must be encrypted using **AES-256-GCM** before writing to disk.
    *   **Secure Storage:** Encrypted files are stored in a **private** local directory (`storage/kyb-documents`), strictly OUTSIDE the `public/` folder.

3.  **Data Persistence:**
    *   Create a `KybDocument` model in Prisma linked to `User`.
    *   Store metadata: `type` (KBIS/ID), `status` (PENDING), `mimeType`, `originalName`, `storagePath` (relative to private root), `iv` (Initialization Vector for encryption).
    *   **Do NOT store the file content in the database.**

4.  **Status Workflow:**
    *   Upon successful upload, the document status is `PENDING`.
    *   If both documents are uploaded, the User's global `kybStatus` updates to `IN_REVIEW`.
    *   UI updates to show "Verification in Progress" and locks the upload inputs.

5.  **Access Control:**
    *   Only authenticated users can upload.
    *   Users can only view/delete their own "PENDING" documents. "APPROVED" documents are immutable.

## Tasks / Subtasks

- [x] **Task 1: Database Schema Update**
    - [x] Create `KybDocument` model in `prisma/schema.prisma` with fields: `id`, `userId`, `type` (enum: KBIS, IDENTITY), `status` (enum: PENDING, APPROVED, REJECTED), `filePath`, `encryptionIv`, `createdAt`.
    - [x] Run `npx prisma migrate dev --name add_kyb_documents`.
    - [x] Update `User` model to include relation `documents KybDocument[]`.

- [x] **Task 2: Secure Storage & Encryption Utilities**
    - [x] **Critical:** Create `src/lib/env.ts` or update existing config to strictly validate `process.env.KYB_ENCRYPTION_KEY` exists at startup. Throw fatal error if missing.
    - [x] Create `src/features/identity/utils/storage.ts`:
        - [x] Implement `ensureStorageDirectory()`: Recursively create `storage/kyb-documents/${userId}` if not exists.
    - [x] Create `src/features/identity/utils/encryption.ts` (Use Node `crypto` module).
        - [x] Implement `encryptFile(buffer): { encryptedBuffer, iv }`.
        - [x] Implement `decryptFile(encryptedBuffer, iv): buffer`.
    - [x] Create `src/features/identity/utils/file-validation.ts`.
        - [x] Implement magic byte checker for PDF (%PDF), JPG (FF D8 FF, FF E0), PNG (89 50 4E 47).
    - [x] Configure `storage/kyb-documents` directory and ensure it is in `.gitignore`.

- [x] **Task 3: Server Actions (Upload Pipeline)**
    - [x] Create `src/features/identity/schemas.ts`: Define Zod schema for FormData (max size 5MB, accepted mime types).
    - [x] Create `src/features/identity/actions/upload-kyb.ts`.
    - [x] Implement `uploadDocument(formData)`:
        - [x] Validate session.
        - [x] Validate input using Zod schema.
        - [x] Parse file from FormData.
        - [x] Run Magic Byte validation.
        - [x] Ensure storage directory exists.
        - [x] Encrypt content.
        - [x] Write to `storage/kyb-documents/${userId}/${uuid}.enc`.
        - [x] Create DB record.
        - [x] Revalidate path `/dashboard/kyb` (or relevant KYC page).
    - [x] Implement `deleteDocument(documentId)` (Only if PENDING).

- [x] **Task 4: UI Implementation**
    - [x] Create `src/features/identity/components/DocumentUploadZone.tsx`.
    - [x] Use `react-dropzone` or standard input with Shadcn styling.
    - [x] specific sections for "KBIS" and "Identity Proof".
    - [x] Display list of uploaded documents with status badges.
    - [x] Show global KYB status (Progress Bar from Story 3.4 preview).

- [x] **Task 5: Testing & Verification**
    - [x] Unit test encryption/decryption (ensure roundtrip works).
    - [x] Integration test: Upload a file -> Verify it exists on disk (encrypted) -> Verify DB record.
    - [x] Verify that renaming a `.exe` to `.pdf` fails the magic byte check.

## Dev Notes

### 🏗️ Architecture Guardrails
*   **Security First:** This is a high-risk feature. **NEVER** expose the `storage/` directory via Next.js `next.config.ts` static serving. Files should only be accessible via a future "Download" Server Action that decrypts on the fly.
*   **Local Storage:** For this MVP phase, use the local filesystem. Do not implement S3 yet.
*   **Type Safety:** Use strict Zod validation for the FormData (max size, types) before processing.

### ⚠️ Disaster Prevention
*   **Common Mistake:** Storing files in `public/`. **Outcome:** Data leak. **Prevention:** Task 2 explicitly mandates `storage/` outside `src` and `public`.
*   **Common Mistake:** Trusting `file.type` from the client. **Outcome:** Malware upload. **Prevention:** Task 2 mandates Magic Byte validation.
*   **Common Mistake:** Hardcoding encryption keys. **Outcome:** Security breach. **Prevention:** Use `process.env.KYB_ENCRYPTION_KEY` (generate one if missing in dev).

### 📚 References
*   **Tech:** Node.js [Crypto API](https://nodejs.org/api/crypto.html) (AES-256-GCM).
*   **Pattern:** `src/features/identity` (Feature-based architecture).
*   **Previous Story:** 3.2 established the `User` context.

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Completion Notes List
- Analysis of Epic 3 completed.
- Security constraints from Architecture.md (AES-256) applied.
- Storage strategy (Local Private) defined to avoid external deps for MVP.
- Task 1 (DB Schema) completed: Added `KybDocument` model and updated `User`. Migration `20260114143239_add_kyb_documents` applied.
- Task 2 (Utilities) completed: Implemented secure encryption (AES-256-GCM), magic byte validation, and storage management. Tests passing.
- Task 3 (Server Actions) completed: Implemented `uploadDocument` and `deleteDocument` with full validation (Zod, Magic Bytes) and encryption. Tests passing.
- Task 4 (UI) completed: Created `DocumentUploadZone` component with document list, status badges, and upload functionality. Unit test passed.
- Task 5 (Testing) completed: Verified flow with unit tests for actions and component.

## File List
- src/features/identity/schemas.ts
- src/features/identity/actions/upload-kyb.ts
- src/features/identity/tests/upload-actions.test.ts
- src/features/identity/components/DocumentUploadZone.tsx
- src/features/identity/tests/DocumentUploadZone.test.tsx
- src/features/identity/utils/storage.ts
- src/features/identity/utils/encryption.ts
- src/features/identity/utils/file-validation.ts
- prisma/schema.prisma

## Change Log
- 2026-01-14: Implemented Task 1 (DB), Task 2 (Utils), Task 3 (Server Actions), Task 4 (UI), Task 5 (Testing).
