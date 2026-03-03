# Story 8.2: KYB Validation Workflow

Status: ready-for-dev

## Story

As a **Compliance Officer (Admin)**,
I want to **review uploaded legal documents and approve/reject retailer applications**,
so that we ensure only legitimate businesses trade on the platform.

## Acceptance Criteria

1.  **Pending Queue:**
    - **Given** I am on `/admin/kyb`.
    - **Then** I see a list of Users with `kybStatus === 'IN_REVIEW'`.
    - **Columns:** Company Name, SIRET, Submission Date.

2.  **Detail & Review:**
    - **When** I click a request.
    - **Then** I see the Company Details (from Story 3.2) and the Document List (from Story 3.3).
    - **Action:** I can download/view the encrypted documents (Server decrypts on-the-fly for Admin).

3.  **Decision Making:**
    - **When** I click "Approve".
    - **Then** User `kybStatus` -> `APPROVED`. User receives an email.
    - **When** I click "Reject".
    - **Then** I must provide a reason. User `kybStatus` -> `REJECTED`. User receives an email with the reason.

## Tasks / Subtasks

- [ ] **Backend Logic**
    - [ ] Create `src/features/admin/actions/kyb.ts`.
    - [ ] Implement `getPendingKybRequests()`.
    - [ ] Implement `reviewKybRequest(userId, status, reason?)`.
    - [ ] Implement `getDecryptedDocumentUrl(docId)` (Secure temporary link or blob stream).

- [ ] **UI Implementation**
    - [ ] Create `/admin/kyb/page.tsx` (Table).
    - [ ] Create `/admin/kyb/[userId]/page.tsx` (Detail View).
    - [ ] Document Viewer: Ensure browser can display the PDF/Image after decryption.

- [ ] **Notification**
    - [ ] Mock Email service integration for Status Change notification.

## Dev Notes
- **Security:** The decryption action MUST check `session.user.role === 'ADMIN'`. A regular user cannot decrypt their own docs via this endpoint (they only upload).
- **Encryption:** Reuse `decryptFile` from Story 3.3 utilities.

## References
- [Story 3.3 (Secure Upload)]((_bmad-output)/implementation-artifacts/epic-3-onboarding-trust/3-3-secure-document-upload-kyb.md)
