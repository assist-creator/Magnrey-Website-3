# Magnrey Consulting — Product Requirements

## Original Problem Statement
> "update this website, make it look professional and fully functional"

User uploaded Stitch design artifacts for **Magnrey Consulting**, a boutique AI & Digital People (HCM) consulting firm targeting CHROs, CPOs and enterprise transformation executives. Founding partner: Rinnieta Chrestien (former VP HR at Salesforce).

## User Choices (Jan 2026)
- **Backend**: Contact form + newsletter signup with DB storage only (no email sending)
- **Pages**: All (Home, Why Us, Services, Framework, Case Studies, Insights, About, Contact)
- **Design**: Modernize further — design agent pushed distinctive editorial executive direction (Cormorant Garamond serif + Plus Jakarta Sans + JetBrains Mono; obsidian ink + bronze gold + warm porcelain palette; hairline architectural depth)
- **Integrations**: None

## Architecture
- Frontend: React 19 + React Router 7 + Tailwind + custom editorial CSS (Sonner toasts, Lucide icons)
- Backend: FastAPI + Motor (MongoDB) with `/api` prefix
- No auth. Public marketing site with lead capture.

## Implemented (Jan 2026)
- 8 fully routed pages: `/`, `/why-us`, `/services`, `/framework`, `/case-studies`, `/insights`, `/about`, `/contact`
- Editorial system: cinematic serif hero, kinetic performance-telemetry pod, stat monoliths, hairline-rule sections, ink-block dark inversions with bronze accents, paper grain, micro-animations (rise, pulse-dot, marquee)
- Interactive framework stage explorer (5 stages: Immersion / Blueprint / Sequence / Build & Deploy / Evolve & Pulse) with prev/next navigation
- Case Studies grid + side-drawer detail view (4 anonymised dossiers)
- Insights grid + drawer reader + category filters + inline newsletter (4 essays)
- Contact page with 45-min diagnostic form (lead capture) + success state
- Footer newsletter form + direct email link
- Backend endpoints:
  - `GET /api/`, `GET /api/health`
  - `GET /api/insights`, `GET /api/case-studies` (curated static content)
  - `POST /api/leads`, `GET /api/leads`
  - `POST /api/newsletter` (idempotent), `GET /api/newsletter`
- Comprehensive data-testid coverage on all interactive elements (nav, CTAs, forms, drawers, filters, framework stages)

## Testing Status
- Backend: 100% pass (all endpoints, validation, idempotency)
- Frontend: ~95% pass (all core flows, navigation, form submission, drawers, framework)

## User Personas
- **CHRO / Chief People Officer** at 10k+ employee enterprise evaluating AI-native HCM transformation partners
- **VP People / HR Transformation Director** researching Workday/Dayforce implementation partners
- **Executive Committee member** vetting boutique consulting firms vs tier-one alternatives

## Backlog (P1 / P2)
- P1: Convert diagnostic booking form into a calendar-integrated flow (Cal.com / Google Calendar)
- P1: Add admin dashboard for reviewing leads and newsletter signups
- P2: Add rich thought-leadership CMS backing `/insights` (currently curated in-code)
- P2: Add case-study filtering by sector / engagement type
- P2: Introduce a light/dark theme toggle
- P2: Add resend/email integration for lead notification and newsletter confirmation
