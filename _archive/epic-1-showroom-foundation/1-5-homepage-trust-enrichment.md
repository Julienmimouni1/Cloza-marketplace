# Story 1.5: Homepage Trust & Enrichment

Status: review

## Story

As a **Prospective Retailer (Visitor)**,
I want to **see clear explanations of how the platform works and read success stories**,
so that **I trust Cloza enough to apply for an account**.

## Acceptance Criteria

1.  **"How it Works" Section:** [x]
    - **Given** I am on the Homepage.
    - **When** I scroll below the Hero section.
    - **Then** I see a 3-step process clearly illustrated:
        1.  **Discover:** Curated brands & high margins.
        2.  **Order:** Low minimums & mixed carts.
        3.  **Sell:** Net-60 payment terms (Buy Now, Pay Later).
    - **And** the design uses high-quality icons/illustrations consistent with the "Showroom" aesthetic.

2.  **"Social Proof" Section (Testimonials):** [x]
    - **Given** I scroll further down.
    - **Then** I see a "Trusted by Retailers" section.
    - **And** it displays at least 3 testimonials in a carousel or grid.
    - **And** each testimonial includes:
        - Quote text.
        - Retailer Name & Boutique Name.
        - Photo/Avatar or Boutique Logo for authenticity.

3.  **Enhanced Trust Bar:** [x]
    - **Given** the existing brand logo bar.
    - **Then** it is updated to be an infinite auto-scrolling marquee (like Qogita/Faire).
    - **And** logos are grayscale/monochrome for visual harmony.

4.  **Professional Footer:** [x]
    - **Then** a rich footer is present on all pages.
    - **And** it contains columns for: "About", "Support", "Legal" (T&C, Privacy), "Socials".
    - **And** a Newsletter subscription input is visible.

5.  **Design Benchmarks (NFR):** [x]
    - **Constraint:** Must align with the premium aesthetic of Ankorstore/Faire (Clean, lots of whitespace, serif typography for headings).
    - **Constraint:** Fully responsive (Stack vertically on mobile).

## Tasks / Subtasks

- [x] **Implement "How it Works" Section**
  - [x] Create `src/components/marketing/HowItWorks.tsx`.
  - [x] Source/Generate 3 vector icons (Lucide or custom SVG).
  - [x] Implement responsive 3-column layout.

- [x] **Implement Testimonials Section**
  - [x] Create `src/components/marketing/Testimonials.tsx`.
  - [x] Define mock data for 3 retailers (Sophie, Marc, etc.).
  - [x] Implement Grid layout for testimonials.

- [x] **Enhance Trust Bar & Footer**
  - [x] Update `src/components/shared/TrustBar.tsx` with marquee animation (CSS).
  - [x] Create `src/components/shared/Footer.tsx`.
  - [x] Integrate Footer into `src/app/layout.tsx`.
  - [x] Assemble components in `src/app/page.tsx`.

## Dev Notes

### References
- **Benchmarks:** Qogita.com, Faire.com, Ankorstore.com.
- **Assets:** Use `lucide-react` for icons initially.
- **Tech:** Pure CSS animation used for the marquee for maximum performance.

## Dev Agent Record
- Created by Party Mode (Mary & John) on 2026-01-12 based on user feedback.
- Implemented by Amelia (Dev Agent) on 2026-01-12.
- Verified with 100% test pass rate.
