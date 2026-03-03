# Story 8.1: Super Admin Dashboard & Access Control

Status: ready-for-dev

## Story

As a **Super Admin (Ops)**,
I want a **secure dashboard providing a high-level view of the marketplace activity**,
so that I can monitor KPIs and quickly access pending validations (KYB, Disputes).

## Acceptance Criteria

1.  **Secure Access:**
    - **Given** a user navigates to `/admin`.
    - **Then** access is strictly denied (403 or Redirect) unless `session.user.role === 'ADMIN'`.
    - **And** the layout is distinct (Side Navigation tailored for Ops).

2.  **KPI Overview (God Mode):**
    - **Then** I see the following real-time metrics:
        - **Total Volume (GMV):** Total sales (historical).
        - **Pending KYB:** Count of users with status `IN_REVIEW`.
        - **Open Disputes:** Count of active disputes.
        - **Active Users:** Total count of Retailers & Vendors.

3.  **Quick Action Center:**
    - **Then** I see a "Tasks" list highlighting urgent items (e.g., "5 KYB requests waiting", "2 New Disputes").

## Tasks / Subtasks

- [ ] **Infrastructure**
    - [ ] Create `src/app/(admin)/layout.tsx` (Admin Shell with Sidebar).
    - [ ] Implement `src/app/(admin)/admin/page.tsx`.
    - [ ] Middleware/Layout protection: Verify Role = ADMIN.

- [ ] **Data Fetching**
    - [ ] Create `src/features/admin/actions/dashboard.ts`.
    - [ ] Implement `getAdminStats()`: Aggregation queries on `Order`, `User`, `Dispute`.

- [ ] **UI Implementation**
    - [ ] Use `shadcn/ui` Cards for KPIs.
    - [ ] Implement Admin Sidebar (Dashboard, Users, KYB, CMS, Disputes).

## Dev Notes
- **Security:** This is the most sensitive part of the app. Ensure no IDOR vulnerabilities.
- **Performance:** Use `count()` queries, not `findMany()`.

## References
- [Epic 8 Details]((_bmad-output)/planning-artifacts/epics.md#epic-8-admin-operations)
