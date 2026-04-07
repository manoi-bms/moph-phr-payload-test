# MOPH PHR API Tester — Design Document

**Date:** 2026-04-07
**Status:** Approved

## Purpose

SPA for testing MOPH PHR API endpoints. Simulates login flow and payload submission against UAT/Production environments, helping developers verify API integration before connecting production HIS systems.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Environment | UAT + Production, switchable | Devs test on UAT first, verify on prod |
| Auth | Login form + Paste JWT + Fixed HCODE:TOKEN | Covers all 3 auth methods from spec |
| Endpoints | All (Upload + Retrieval + Utility) | Maximize testing tool value |
| Payload editor | Monaco JSON editor with sample templates | Flexible, fast, doesn't go stale |
| Layout | Two-panel (sidebar + request/response) | Postman-like productivity |
| Tech stack | Vite + React + Tailwind CSS | Component model suits the state complexity |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Header: Auth Status Bar (token type, expiry, env)  │
├────────────────┬────────────────────────────────────┤
│                │  Request Editor (Monaco JSON)       │
│  Left Sidebar  │  [Endpoint URL] [Method] [Send]    │
│  - Upload APIs │────────────────────────────────────│
│  - Retrieval   │  Response Viewer (JSON + status)    │
│  - Utility     │                                     │
│                │                                     │
├────────────────┴────────────────────────────────────┤
│  Footer: Request history log                         │
└─────────────────────────────────────────────────────┘
```

## Components

- **AuthBar** — persistent top bar: auth method, token preview, environment toggle (UAT/Production)
- **AuthModal** — three tabs: Login Form (user/password_hash/hospital_code), Paste JWT, Fixed HCODE:TOKEN
- **EndpointSidebar** — grouped: Upload (10), Retrieval (15+), Utility (6). Click loads template + sets URL/method.
- **RequestPanel** — Monaco editor, JSON validation, endpoint URL, method badge, Send button, template reset
- **ResponsePanel** — read-only Monaco viewer, HTTP status, response time, headers
- **HistoryBar** — collapsible bottom bar, recent requests, click to reload

## Data Flow

1. Auth via AuthModal → token in React state + localStorage
2. Select endpoint → load sample template, set URL/method
3. Edit payload → Send
4. Request through Vite dev proxy (bypasses CORS/self-signed cert)
5. Response displayed + logged to history

## Proxy Strategy (vite.config.js)

```
/proxy/uat/*  → https://203.150.143.180/*   (secure: false)
/proxy/prod/* → https://phr1.moph.go.th/*   (secure: false)
/proxy/auth/* → https://cvp1.moph.go.th/*   (secure: false)
```

## Endpoints Covered

### Upload APIs (POST, Bearer JWT)
- /api/UpdatePHRv1
- /api/AllergyIntolerancev1
- /api/PatientChronicRegisterv1
- /api/ImmunizationRegisterv1
- /api/ReferralRequest
- /api/SelfObservation
- /api/CareGiver
- /api/MedicationRequest
- /api/OrgEncounterSummary
- /api/DrugRelatedProblem

### Retrieval APIs (POST with cid+otp or Bearer)
- /api/WebApp?Action=PatientSummary
- /api/WebApp?Action=Encounter
- /api/WebApp?Action=VitalSign
- /api/WebApp?Action=Condition
- /api/WebApp?Action=Observation
- /api/WebApp?Action=Medication
- /api/WebApp?Action=Coverage
- /api/WebApp?Action=Appointment
- /api/WebApp?Action=Immunization&mode=Detail
- /api/WebApp?Action=Allergy
- /api/WebApp?Action=NCD
- /api/WebApp?Action=Referral
- /api/WebApp?Action=SelfObservation
- /api/WebApp?Action=CareGiver&mode=2
- /api/WebApp?Action=Pregnancy
- /api/WebApp?Action=ProfileImage
- /api/WebApp?Action=DiagnosticReport
- /api/WebApp?Action=ReportEncounter

### Utility APIs
- /api/UpdateAgentStatus
- /api/GetAgentComputerName
- /api/OrganizationSummary (GET)
- /api/RemoveEncounter (GET)
- /api/PasteJSON?Action=POST / GET
- /api/MaskEncounter?mode=set / get
- /api/PHRSetting?mode=set / get
- /api/RequestTokenv1
- /api/WebApp?Action=ValidateOTP
- /api/GetPHROTP
- /idp/api/check_ekyc

## Dependencies

- react, react-dom
- @monaco-editor/react
- tailwindcss
- vite (dev server + proxy)

## Sample Templates

Stored in `src/templates/` as JSON files, one per endpoint. Extracted from SPEC.md with comments removed to produce valid JSON.
