# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page application (SPA) for testing MOPH PHR (Ministry of Public Health - Personal Health Record) API endpoints. The app simulates the login flow and payload submission against the UAT environment, helping developers verify API integration before connecting production HIS systems.

## Key API Context

- **UAT Base URL:** `https://203.150.143.180/api`
- **Production Base URL:** `https://phr1.moph.go.th/api`
- **Auth token source:** MOPH Account Center JWT via `https://cvp1.moph.go.th/token?Action=get_moph_access_token`
- **Alternative auth:** HCODE:TOKEN format for `/api/UpdatePHRv1` (see SPEC.md Appendix จ.)
- All data uploads require `Authorization: Bearer <JWT>` header
- UAT endpoint uses self-signed SSL certificates (requests need `rejectUnauthorized: false` or equivalent)
- API spec is in `SPEC.md` (Thai language, HL7 FHIR-derived structure)

## API Endpoints Covered

### Data Upload (POST, requires MOPH Account Center JWT with MOPH_PHR_HIE permission)
- `/api/UpdatePHRv1` - Full patient health record upload
- `/api/AllergyIntolerancev1` - Allergy data
- `/api/PatientChronicRegisterv1` - Chronic disease registration
- `/api/ImmunizationRegisterv1` - Vaccination records
- `/api/ReferralRequest` - Patient referral
- `/api/SelfObservation` - Vital signs from home monitoring
- `/api/CareGiver` - Caregiver registration
- `/api/MedicationRequest` - Prescription data
- `/api/OrgEncounterSummary` - Encounter count summary
- `/api/DrugRelatedProblem` - Drug-related problems

### Data Retrieval (POST with cid+otp, or HealthID Bearer token)
- `/api/WebApp?Action=PatientSummary` - Patient overview
- `/api/WebApp?Action=Encounter` - Visit history
- `/api/WebApp?Action=VitalSign` - Vital signs
- `/api/WebApp?Action=Condition` - Diagnoses
- `/api/WebApp?Action=Observation` - Lab results
- `/api/WebApp?Action=Medication` - Medication history
- `/api/WebApp?Action=Allergy` - Allergy records
- `/api/WebApp?Action=Coverage` - Insurance coverage
- `/api/WebApp?Action=Appointment` - Appointments
- `/api/WebApp?Action=Immunization&mode=Detail` - Vaccination history

### Authentication Flow
1. POST to `https://cvp1.moph.go.th/token?Action=get_moph_access_token` with `{user, password_hash, hospital_code}`
2. Receive JWT token
3. Use JWT as Bearer token for upload APIs

## Common Payload Structure

Every upload payload follows this pattern:
```json
{
  "managingOrganization": { "type": "Organization", "identifier": {...}, "display": "..." },
  "Patient": { "identifier": [...], "name": [...], ... },
  "<ResourceArray>": [...]
}
```

The `managingOrganization.identifier.system` is always `https://bps.moph.go.th/hcode/5` with 5-digit hospital code as value.

## Build & Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run all tests (Vitest)
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage report
```

## Architecture Notes

- This is a client-side SPA — all API calls go through a CORS proxy or the browser directly to the UAT endpoint
- The UAT server at `203.150.143.180` uses HTTPS with a self-signed cert, so a proxy may be needed for local dev
- Payload structures in SPEC.md contain Thai language field descriptions and some JSON with comments (not valid JSON) — sample payloads in the app must be cleaned

## Development Constitution

### Code Quality Standards
- **DRY / Reusable components:** Always extract shared UI patterns into reusable components (buttons, badges, modals, form fields, status indicators). Never duplicate component logic — create shared components in `src/components/shared/`.
- **Centralized business logic:** All API logic lives in `src/utils/apiClient.js`. All endpoint config in `src/config/endpoints.js`. All auth logic in `src/context/AuthContext.jsx`. Never scatter business logic across UI components.
- **YAGNI:** Do not add features, abstractions, or configurability beyond what the current task requires.

### Test-Driven Development (TDD)
- **Write tests first.** Every new function, component, and integration point must have a failing test before implementation.
- **Test pyramid:**
  - **Unit tests** (`src/__tests__/unit/`): Pure functions — apiClient, endpoint config helpers, URL builders, JSON validators, auth token formatters
  - **Component tests** (`src/__tests__/components/`): React components render correctly, handle user interactions, display correct states (loading, error, empty, success)
  - **Integration tests** (`src/__tests__/integration/`): Auth flow (login → token stored → sent with requests), endpoint selection → template loaded → editor populated, send request → response displayed → history logged
  - **API tests** (`src/__tests__/api/`): Mock fetch to verify correct URL construction, headers, body serialization, error handling for each endpoint type
- **Test tooling:** Vitest + React Testing Library + MSW (Mock Service Worker) for API mocking
- **Coverage target:** Aim for meaningful coverage on all business logic and user-facing interactions. Do not write tests for trivial getters/setters.

### Commit Discipline
- **Commit after every meaningful change** — each completed step, each passing test suite, each component wired up. Small, frequent commits prevent losing work.
- **Never batch large changes** into a single commit. If something breaks, small commits make rollback trivial.
- **Commit message format:** `feat:`, `fix:`, `test:`, `refactor:`, `chore:` prefixes. Concise description of what changed and why.

### User Experience Standards
- **Professional UI:** Clean, consistent dark theme. Proper spacing, alignment, and typography. No raw unstyled elements.
- **User-friendly:** Every action should have clear visual feedback — loading spinners on async operations, success/error toasts, disabled states on buttons when action is unavailable.
- **Informative progress:** Show request elapsed time, HTTP status codes with color coding (2xx=green, 4xx=yellow, 5xx=red), JSON validation errors inline, auth status always visible.
- **Consistent patterns:** All modals behave the same (close on Escape, close on backdrop click). All forms validate before submit. All async operations show loading state.
- **Accessibility:** Proper focus management in modals, keyboard navigation support, sufficient color contrast.

### Performance
- **Lazy load Monaco editor** — it's large; don't block initial render.
- **Debounce editor onChange** — avoid excessive re-renders while typing.
- **Memoize expensive computations** — endpoint filtering, template lookups.
- **Keep localStorage sync efficient** — batch writes, don't write on every keystroke.

### Development Workflow
- **Use available skills:** Always use brainstorming, writing-plans, TDD, code-review, and other superpowers skills when applicable.
- **Review after each task:** Spec compliance review + code quality review before moving to next task.
- **Reusable over custom:** Before creating a new component, check if an existing shared component can be extended.
