# Story: Contact Form with Resend

## Status
Done

## Context
User wants a working contact form on the homepage footer that sends emails to their Gmail.
Selected Technology: Resend (Option B).

## Requirements
- Use `resend` SDK.
- Use `react-hook-form` and `zod` for validation.
- Server Action for secure sending.
- Email layout: Simple text or basic HTML.
- Success/Error feedback (using `sonner` toast which is already installed).

## Tasks
- [x] 1. Install Resend and Configure
    - [x] Install `resend` package.
    - [x] Create/Update `.env` (User must provide RESEND_API_KEY).
- [x] 2. Create Email Template & Server Action
    - [x] Define Zod schema for contact form (name, email, message).
    - [x] Create `src/actions/contact-action.ts`. (Implemented in `src/features/contact/actions/send-contact-email.ts`)
    - [x] Implement `sendEmail` function using Resend.
- [x] 3. Create Contact Form Component
    - [x] `src/components/contact-form.tsx`. (Implemented in `src/features/contact/components/ContactForm.tsx`)
    - [x] Use `useForm`, `zodResolver`.
    - [x] Handle loading state and toast notifications.
- [x] 4. Integrate into Footer/Home
    - [x] Locate Footer component.
    - [x] Replace/Hook "Contactez-nous" button/link to open this form (Dialog or Scroll to section).

## Dev Agent Record
### Implementation Notes
- **Architecture Alignment**: Moved actions and components to `src/features/contact` to comply with project's Feature-Based Architecture patterns (`project-context.md`), deviating slightly from the strict file paths in the story Tasks 2 & 3.
- **UX**: Implemented `ContactModal` using Shadcn Dialog for a seamless footer interaction without navigation.
- **Testing**: Added unit tests for the Server Action mocking the Resend SDK.

## File List
- src/features/contact/schemas.ts
- src/features/contact/actions/send-contact-email.ts
- src/features/contact/components/ContactForm.tsx
- src/features/contact/components/ContactModal.tsx
- src/features/contact/tests/contact.test.ts
- src/components/shared/Footer.tsx
- .env.example
- package.json
- package-lock.json

## Change Log
- 2026-01-22: Initial implementation of Contact Feature with Resend integration.
- 2026-01-22: [AI-Review] UX improvement: Modal closes on success.
- 2026-01-22: [AI-Review] Config: Added env vars for email addresses.
- 2026-01-22: [AI-Review] Documentation: Updated File List.