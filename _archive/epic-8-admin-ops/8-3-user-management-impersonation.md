# Story 8.3: User Management & Impersonation

Status: ready-for-dev

## Story

As a **Support Agent (Admin)**,
I want to **view user profiles and temporarily "Log in as" them**,
so that I can debug issues exactly as they see them (Ghost Login).

## Acceptance Criteria

1.  **User List:**
    - **Given** I am on `/admin/users`.
    - **Then** I can search/filter all users by Email, Name, Company, Role, or ID.
    - **And** I can edit basic info or Ban a user.

2.  **Impersonation (Ghost Login):**
    - **Given** I am viewing a User Detail.
    - **When** I click "Impersonate User".
    - **Then** my session context switches to that User.
    - **And** a visible "Stop Impersonating" banner appears at the top of the screen.
    - **When** I click "Stop", I revert to my Admin session.

## Tasks / Subtasks

- [ ] **Auth Logic (NextAuth)**
    - [ ] Research NextAuth v5 Impersonation patterns.
    - [ ] Option A (Token Swap): Create a custom `signIn` flow that issues a token for the target user if caller is Admin.
    - [ ] Option B (Session Property): Add `impersonatorId` to the session.

- [ ] **UI Implementation**
    - [ ] Create `/admin/users/page.tsx` (Data Table with Filters).
    - [ ] Create Global Banner component (`ImpersonationBanner`) in `RootLayout`, visible only if `session.isImpersonating`.

## Dev Notes
- **Audit Log:** CRITICAL. Log every impersonation event (`Admin X logged in as User Y`).
- **Security:** Ensure Admin cannot impersonate another Admin (optional, but good practice).

## References
- [NextAuth Documentation](https://authjs.dev/)
