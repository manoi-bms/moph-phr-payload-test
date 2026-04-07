# MOPH PHR API Payload Tester

A single-page application for testing **MOPH PHR (Ministry of Public Health - Personal Health Record)** API endpoints. Simulates the login flow and payload submission against UAT and Production environments.

## Features

- **Three authentication methods:** MOPH Account Center login, paste JWT, or fixed HCODE:TOKEN (1-year token)
- **Environment toggle:** Switch between UAT (`203.150.143.180`) and Production (`phr1.moph.go.th`)
- **50+ API endpoints** organized in three groups: Upload, Retrieval, and Utility
- **Monaco JSON editor** with syntax highlighting, validation indicator, and sample payload templates
- **Response viewer** with HTTP status color coding, elapsed time, response size, and copy-to-clipboard
- **Request history** with localStorage persistence and click-to-replay
- **Keyboard shortcut:** Ctrl+Enter to send requests

## API Endpoints Covered

### Upload APIs (8 endpoints)
UpdatePHRv1, AllergyIntolerancev1, PatientChronicRegisterv1, ImmunizationRegisterv1, ReferralRequest, SelfObservation, CareGiver, OrgEncounterSummary

### Retrieval APIs (23 endpoints)
PatientSummary, Encounter, VitalSign, Condition, Observation, Medication, Coverage, Appointment, Immunization, Allergy, NCD, Referral, and more via `/api/WebApp?Action=`

### Utility APIs (19 endpoints)
UpdateAgentStatus, OrganizationSummary, RemoveEncounter, PasteJSON, MaskEncounter, PHRSetting, RequestTokenv1, ValidateOTP, GetPHROTP, check_ekyc, and more

## Quick Start

### Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Docker

```bash
docker build -t moph-phr-tester .
docker run -p 8080:80 moph-phr-tester
```

Open http://localhost:8080

### Testing

```bash
npm run test         # Watch mode
npm run test:run     # Single run
npm run test:coverage # With coverage
```

## Usage

1. Click **Login** in the top bar
2. Select the **Fixed Token** tab (pre-filled with test credentials)
3. Click **Set Fixed Token**
4. Select an endpoint from the left sidebar
5. Edit the JSON payload if needed
6. Click **Send** (or press Ctrl+Enter)
7. View the response in the bottom panel

## Tech Stack

- **Vite** - Build tool with dev server proxy
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **Monaco Editor** - JSON editing (lazy-loaded)
- **Vitest + React Testing Library** - 92 tests
- **nginx** - Production reverse proxy (Docker)

## Project Structure

```
src/
  config/
    endpoints.js     # All endpoint definitions
    templates.js     # Sample JSON payloads per endpoint
  context/
    AuthContext.jsx   # Auth state (token, env, login/logout)
    EndpointContext.jsx # Selected endpoint + request body
    HistoryContext.jsx  # Request history with persistence
  components/
    shared/          # Reusable: Badge, Modal, Spinner, StatusDot, Toast
    AuthBar.jsx      # Top bar: auth status + environment toggle
    AuthModal.jsx    # Three-tab auth modal
    EndpointSidebar.jsx # Left sidebar with grouped endpoints
    RequestPanel.jsx # Monaco editor + URL bar + Send
    ResponsePanel.jsx # Response viewer
    HistoryBar.jsx   # Collapsible history bar
  utils/
    apiClient.js     # fetch wrapper with timing
    auth.js          # Login + token formatting helpers
```

## Proxy Configuration

All API requests go through a reverse proxy to bypass CORS and self-signed SSL certificates:

| Route | Target |
|-------|--------|
| `/proxy/uat/*` | `https://203.150.143.180/*` |
| `/proxy/prod/*` | `https://phr1.moph.go.th/*` |
| `/proxy/auth/*` | `https://cvp1.moph.go.th/*` |

In development, this is handled by Vite's dev server. In production (Docker), nginx serves as the reverse proxy.

## API Specification

The full API specification is in [SPEC.md](SPEC.md) (Thai language, based on HL7 FHIR).
