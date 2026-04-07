# MOPH PHR API Tester — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Vite + React + Tailwind SPA that tests all MOPH PHR API endpoints with login simulation, JSON payload editing, and response viewing.

**Architecture:** Two-panel layout (sidebar + request/response) with persistent auth bar. Vite dev proxy handles CORS/SSL for UAT and Production endpoints. Monaco editor for JSON editing. All endpoint templates extracted from SPEC.md.

**Tech Stack:** Vite, React 18, Tailwind CSS 4, @monaco-editor/react, Vitest, React Testing Library, MSW, browser fetch API

**Development Constitution (from CLAUDE.md):**
- TDD: Write failing tests before implementation
- Reusable components: Extract shared UI into `src/components/shared/`
- Centralized logic: API logic in `src/utils/`, config in `src/config/`, state in `src/context/`
- Commit after every meaningful step
- Professional, informative UI with loading states, error feedback, status indicators
- Test pyramid: unit → component → integration → API tests
- Lazy load Monaco, debounce editor, memoize lookups

---

### Task 1: Project Scaffolding + Test Infrastructure

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`
- Create: `tailwind.config.js` (if needed by Tailwind v4)
- Create: `.gitignore`

**Step 1: Initialize Vite + React project**

Run:
```bash
cd /c/AIProject/moph-phr-payload-test
npm create vite@latest . -- --template react
```

If prompted about existing files, choose to overwrite/ignore as needed.

**Step 2: Install dependencies**

Run:
```bash
npm install
npm install @monaco-editor/react
npm install -D tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
```

**Step 3: Configure Tailwind CSS**

Replace `src/index.css` with:
```css
@import "tailwindcss";
```

Add Tailwind plugin to `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/proxy/uat': {
        target: 'https://203.150.143.180',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/uat/, ''),
      },
      '/proxy/prod': {
        target: 'https://phr1.moph.go.th',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/prod/, ''),
      },
      '/proxy/auth': {
        target: 'https://cvp1.moph.go.th',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/auth/, ''),
      },
    },
  },
})
```

**Step 4: Create minimal App.jsx to verify setup**

```jsx
export default function App() {
  return <div className="h-screen bg-gray-900 text-white flex items-center justify-center text-2xl">MOPH PHR API Tester</div>
}
```

**Step 5: Configure test infrastructure**

Add to `vite.config.js`:
```js
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
  css: true,
}
```

Create `src/test/setup.js`:
```js
import '@testing-library/jest-dom'
```

Add scripts to `package.json`:
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"
```

Create test directory structure:
```
src/__tests__/unit/
src/__tests__/components/
src/__tests__/integration/
src/__tests__/api/
```

Create shared test utilities in `src/test/test-utils.jsx` that wraps render with all providers (AuthProvider, EndpointProvider, HistoryProvider) for component/integration tests.

**Step 6: Create shared UI components directory**

Create `src/components/shared/` with initial reusable components:
- `Badge.jsx` — method badge (POST=green, GET=blue), status badge
- `StatusDot.jsx` — green/red/yellow indicator dot
- `Modal.jsx` — base modal with backdrop, Escape key, close button
- `Spinner.jsx` — loading spinner
- `Toast.jsx` — success/error notification toast

**Step 7: Write a smoke test to verify test setup**

Create `src/__tests__/unit/smoke.test.js`:
```js
import { describe, it, expect } from 'vitest'

describe('Test setup', () => {
  it('should run tests', () => {
    expect(true).toBe(true)
  })
})
```

Run: `npm run test -- --run`
Expected: 1 test passes.

**Step 8: Verify dev server runs**

Run: `npm run dev`
Expected: App loads at localhost:5173 with dark background and title text.

**Step 9: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind project with proxy, test infra, and shared components"
```

---

### Task 2: Endpoint Registry and Templates

**Files:**
- Create: `src/config/endpoints.js` — all endpoint definitions (name, path, method, group, description)
- Create: `src/config/templates.js` — sample JSON payloads per endpoint

**Step 1: Create endpoint registry**

Create `src/config/endpoints.js` with a single exported array. Each entry:
```js
{
  id: 'update-phr-v1',
  name: 'UpdatePHRv1',
  group: 'upload',        // 'upload' | 'retrieval' | 'utility'
  method: 'POST',
  path: '/api/UpdatePHRv1',
  description: 'Upload full patient health record',
  authRequired: true,     // needs Bearer token
}
```

Include ALL endpoints from the design doc:
- **Upload group (10):** UpdatePHRv1, AllergyIntolerancev1, PatientChronicRegisterv1, ImmunizationRegisterv1, ReferralRequest, SelfObservation, CareGiver, MedicationRequest, OrgEncounterSummary, DrugRelatedProblem
- **Retrieval group (18):** All WebApp?Action= endpoints (PatientSummary, Encounter, VitalSign, Condition, Observation, Medication, Coverage, Appointment, Immunization, Allergy, NCD, Referral, SelfObservation, CareGiver, Pregnancy, ProfileImage, DiagnosticReport, ReportEncounter)
- **Utility group (11):** UpdateAgentStatus, GetAgentComputerName, OrganizationSummary, RemoveEncounter, PasteJSON POST, PasteJSON GET, MaskEncounter set, MaskEncounter get, PHRSetting set, PHRSetting get, RequestTokenv1, ValidateOTP, GetPHROTP, check_ekyc

For GET endpoints (OrganizationSummary, RemoveEncounter, PasteJSON GET), set `method: 'GET'` and include `queryParams` array describing the URL params.

**Step 2: Create templates file**

Create `src/config/templates.js` with sample JSON payloads extracted from SPEC.md. Clean all comments (// ...) from the JSON. Each template is keyed by endpoint id.

Key templates to include (from SPEC.md):
- `update-phr-v1`: Full payload with managingOrganization, Patient, AllergyIntolerance, CarePlan, Encounter (with vital_signs, Observation, Condition, Medication, Claim, Appointment, Immunization, DiagnosticReport)
- `allergy-v1`: managingOrganization + Patient + AllergyIntolerance array
- `chronic-register-v1`: managingOrganization + Patient + ChronicDiseaseRegister array
- `immunization-v1`: managingOrganization + Patient + Immunization array
- `referral-request`: managingOrganization + Patient + ReferralRequest array
- `self-observation`: Full SelfObservation payload (system_name, location_gis, person, observation)
- `caregiver`: managingOrganization + Patient + CareGiver array
- `medication-request`: managingOrganization + Patient + MedicationRequest array
- `encounter-summary`: managingOrganization + EncounterSummary array
- `drug-related-problem`: managingOrganization + Patient + DrugRelatedProblem array
- Retrieval endpoints: `{"cid": "0000000000000", "otp": "AA999999"}`
- Utility endpoints: respective payloads from SPEC.md

**Step 3: Write unit tests for endpoint registry**

Create `src/__tests__/unit/endpoints.test.js`:
- Test that every endpoint has required fields (id, name, group, method, path)
- Test that all groups are valid ('upload' | 'retrieval' | 'utility')
- Test that all methods are valid ('GET' | 'POST')
- Test endpoint count matches expected (upload: 10, retrieval: 18, utility: 11+)
- Test helper functions: `getEndpointsByGroup()`, `getEndpointById()`

Create `src/__tests__/unit/templates.test.js`:
- Test that every endpoint with method POST has a template
- Test that all templates are valid JSON (can be parsed)
- Test that upload templates have `managingOrganization` and `Patient` keys

**Step 4: Create helper functions in endpoints.js**

Add and export: `getEndpointsByGroup(group)`, `getEndpointById(id)`, `getGroupLabel(group)`

Run: `npm run test -- --run`
Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/config/ src/__tests__/unit/
git commit -m "feat: add endpoint registry, templates, and unit tests"
```

---

### Task 3: Auth State Management and AuthBar Component

**Files:**
- Create: `src/context/AuthContext.jsx` — React context for auth state
- Create: `src/components/AuthBar.jsx` — persistent top bar
- Modify: `src/App.jsx` — wrap with AuthProvider, render AuthBar

**Step 1: Create AuthContext**

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const ENVIRONMENTS = {
  uat: { label: 'UAT', proxyBase: '/proxy/uat' },
  prod: { label: 'Production', proxyBase: '/proxy/prod' },
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('phr_token') || '')
  const [authMethod, setAuthMethod] = useState(() => localStorage.getItem('phr_auth_method') || 'none')
  const [env, setEnv] = useState(() => localStorage.getItem('phr_env') || 'uat')

  useEffect(() => {
    localStorage.setItem('phr_token', token)
    localStorage.setItem('phr_auth_method', authMethod)
    localStorage.setItem('phr_env', env)
  }, [token, authMethod, env])

  const proxyBase = ENVIRONMENTS[env].proxyBase
  const envLabel = ENVIRONMENTS[env].label
  const isAuthenticated = token.length > 0

  const login = (newToken, method) => {
    setToken(newToken)
    setAuthMethod(method)
  }

  const logout = () => {
    setToken('')
    setAuthMethod('none')
  }

  return (
    <AuthContext.Provider value={{ token, authMethod, env, setEnv, proxyBase, envLabel, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

**Step 2: Create AuthBar component**

Display: environment toggle (UAT/Prod), auth status (method + truncated token), login/logout button.
- Green dot when authenticated, red when not
- Clicking "Login" opens AuthModal (built in Task 4)
- Environment toggle is a simple button that switches between uat/prod

**Step 3: Wire into App.jsx**

```jsx
import { AuthProvider } from './context/AuthContext'
import AuthBar from './components/AuthBar'

export default function App() {
  return (
    <AuthProvider>
      <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
        <AuthBar />
        <div className="flex-1 flex">
          {/* Sidebar + Main panels go here */}
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an endpoint from the sidebar
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
```

**Step 4: Verify**

Run: `npm run dev`
Expected: Dark UI with auth bar at top showing "Not authenticated" and UAT/Prod toggle.

**Step 5: Write tests for AuthContext and AuthBar**

Create `src/__tests__/unit/AuthContext.test.jsx`:
- Test initial state (no token, env=uat, isAuthenticated=false)
- Test login() sets token and authMethod
- Test logout() clears token
- Test setEnv() switches environment
- Test proxyBase changes with env
- Test localStorage persistence

Create `src/__tests__/components/AuthBar.test.jsx`:
- Test renders "Not authenticated" when no token
- Test renders auth method and truncated token when authenticated
- Test environment toggle switches UAT/Prod
- Test "Login" button opens modal (via callback)
- Test "Logout" button clears auth

Run: `npm run test -- --run`
Expected: All tests pass.

**Step 6: Commit**

```bash
git add src/context/ src/components/AuthBar.jsx src/App.jsx src/__tests__/
git commit -m "feat: add auth context and AuthBar component with environment toggle and tests"
```

---

### Task 4: AuthModal Component

**Files:**
- Create: `src/components/AuthModal.jsx`
- Modify: `src/components/AuthBar.jsx` — add modal trigger state

**Step 1: Build AuthModal with three tabs**

Three tabs:
1. **Login** — form with `user`, `password_hash`, `hospital_code` fields. On submit, POST to `/proxy/auth/token?Action=get_moph_access_token` with JSON body `{user, password_hash, hospital_code}`. On success, call `login(jwt, 'login')`.
2. **Paste JWT** — single textarea. On submit, call `login(pastedToken, 'jwt')`.
3. **Fixed Token** — two fields: `hospital_code` (5-digit) and `token`. On submit, format as `HCODE:TOKEN` (e.g. `99999:{AAAA-BBBB-CCCC}`), call `login(formatted, 'fixed')`.

Modal should:
- Have a dark overlay backdrop
- Close on backdrop click or Escape key
- Show loading state during login request
- Show error message if login fails

**Step 2: Connect to AuthBar**

Add `showModal` state in AuthBar. "Login" button opens modal, successful auth closes it.

**Step 3: Verify**

Run: `npm run dev`
Expected: Click Login → modal opens with 3 tabs. Can switch tabs. Paste JWT tab works (paste any string, auth bar updates). Login tab shows form fields. Fixed Token tab shows hcode + token fields.

**Step 4: Write tests for AuthModal**

Create `src/__tests__/components/AuthModal.test.jsx`:
- Test renders three tabs (Login, Paste JWT, Fixed Token)
- Test tab switching works
- Test Login form has user, password_hash, hospital_code fields
- Test Paste JWT tab has textarea and submit button
- Test Fixed Token tab has hcode and token fields, formats as HCODE:TOKEN
- Test modal closes on Escape key
- Test modal closes on backdrop click
- Test submit disabled when fields are empty

Create `src/__tests__/api/auth.test.js`:
- Test login request sends correct payload to `/proxy/auth/token?Action=get_moph_access_token`
- Test HCODE:TOKEN formatting: `formatFixedToken('99999', '{AAA-BBB}')` returns `'99999:{AAA-BBB}'`
- Test error handling when login request fails

Run: `npm run test -- --run`
Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/components/AuthModal.jsx src/components/AuthBar.jsx src/__tests__/
git commit -m "feat: add AuthModal with login form, paste JWT, fixed HCODE:TOKEN tabs, and tests"
```

---

### Task 5: EndpointSidebar Component

**Files:**
- Create: `src/components/EndpointSidebar.jsx`
- Create: `src/context/EndpointContext.jsx` — selected endpoint state
- Modify: `src/App.jsx` — add EndpointProvider, render sidebar

**Step 1: Create EndpointContext**

```jsx
import { createContext, useContext, useState } from 'react'
import { endpoints } from '../config/endpoints'
import { templates } from '../config/templates'

const EndpointContext = createContext(null)

export function EndpointProvider({ children }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [requestBody, setRequestBody] = useState('')

  const selectEndpoint = (endpointId) => {
    const ep = endpoints.find(e => e.id === endpointId)
    setSelectedEndpoint(ep)
    setRequestBody(JSON.stringify(templates[endpointId] || {}, null, 2))
  }

  return (
    <EndpointContext.Provider value={{ selectedEndpoint, requestBody, setRequestBody, selectEndpoint }}>
      {children}
    </EndpointContext.Provider>
  )
}

export const useEndpoint = () => useContext(EndpointContext)
```

**Step 2: Create EndpointSidebar**

- Three collapsible groups: Upload APIs, Retrieval APIs, Utility APIs
- Each endpoint shows: name + method badge (POST=green, GET=blue)
- Clicking an endpoint calls `selectEndpoint(id)`
- Selected endpoint highlighted
- Scrollable if list is long
- Width: ~260px fixed

**Step 3: Wire into App.jsx**

Wrap with `EndpointProvider`, render sidebar in the flex layout.

**Step 4: Verify**

Run: `npm run dev`
Expected: Left sidebar shows all endpoints grouped. Clicking one highlights it. Main area still placeholder.

**Step 5: Write tests for EndpointSidebar and EndpointContext**

Create `src/__tests__/unit/EndpointContext.test.jsx`:
- Test initial state (no endpoint selected, empty requestBody)
- Test selectEndpoint() loads correct template
- Test setRequestBody() updates body

Create `src/__tests__/components/EndpointSidebar.test.jsx`:
- Test renders three groups (Upload, Retrieval, Utility)
- Test groups are collapsible
- Test all endpoints render with correct method badges
- Test clicking endpoint highlights it and fires selectEndpoint
- Test selected endpoint has active styling

Run: `npm run test -- --run`
Expected: All tests pass.

**Step 6: Commit**

```bash
git add src/components/EndpointSidebar.jsx src/context/EndpointContext.jsx src/App.jsx src/__tests__/
git commit -m "feat: add endpoint sidebar with grouped navigation and tests"
```

---

### Task 6: RequestPanel with Monaco Editor

**Files:**
- Create: `src/components/RequestPanel.jsx`
- Modify: `src/App.jsx` — render RequestPanel

**Step 1: Build RequestPanel**

Layout (top to bottom):
1. **URL bar**: Shows resolved URL (e.g. `/api/UpdatePHRv1`), method badge, "Send" button (right-aligned), "Reset Template" button
2. **Monaco editor**: Takes remaining space, JSON language mode, dark theme (`vs-dark`), minimap off, word wrap on

When no endpoint selected, show "Select an endpoint" placeholder.

```jsx
import Editor from '@monaco-editor/react'
import { useEndpoint } from '../context/EndpointContext'
import { useAuth } from '../context/AuthContext'

export default function RequestPanel() {
  const { selectedEndpoint, requestBody, setRequestBody } = useEndpoint()
  const { token, proxyBase, isAuthenticated } = useAuth()

  // handleSend defined in Task 7

  if (!selectedEndpoint) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">Select an endpoint</div>
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* URL bar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-700 bg-gray-800">
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedEndpoint.method === 'GET' ? 'bg-blue-600' : 'bg-green-600'}`}>
          {selectedEndpoint.method}
        </span>
        <span className="font-mono text-sm flex-1 truncate">{selectedEndpoint.path}</span>
        <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium">
          Send
        </button>
      </div>
      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          value={requestBody}
          onChange={(v) => setRequestBody(v || '')}
          options={{ minimap: { enabled: false }, wordWrap: 'on', fontSize: 13 }}
        />
      </div>
    </div>
  )
}
```

**Step 2: Wire into App.jsx**

Replace the main area placeholder with `<RequestPanel />`.

**Step 3: Verify**

Run: `npm run dev`
Expected: Select endpoint → Monaco editor loads with sample JSON. Can edit. URL bar shows path and method.

**Step 4: Commit**

```bash
git add src/components/RequestPanel.jsx src/App.jsx
git commit -m "feat: add RequestPanel with Monaco JSON editor and URL bar"
```

---

### Task 7: API Request Execution and ResponsePanel

**Files:**
- Create: `src/components/ResponsePanel.jsx`
- Create: `src/utils/apiClient.js` — fetch wrapper
- Modify: `src/components/RequestPanel.jsx` — wire Send button
- Modify: `src/App.jsx` — render ResponsePanel

**Step 1: Create apiClient.js**

```js
export async function sendRequest({ method, path, body, token, proxyBase }) {
  const url = `${proxyBase}${path}`
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const options = { method, headers }
  if (method === 'POST' && body) {
    options.body = body
  }

  const startTime = performance.now()
  const response = await fetch(url, options)
  const elapsed = Math.round(performance.now() - startTime)

  let data
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  return {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    data,
    elapsed,
  }
}
```

**Step 2: Create ResponsePanel**

- Shows HTTP status (color-coded: 2xx green, 4xx yellow, 5xx red)
- Response time in ms
- Read-only Monaco editor with response JSON
- Empty state when no response yet

**Step 3: Wire Send button in RequestPanel**

On click:
1. Validate JSON (try JSON.parse, show error if invalid)
2. Call `sendRequest` with current endpoint, body, token, proxyBase
3. Store response in state (lift to App-level or use a ResponseContext)
4. Show loading spinner on Send button during request

**Step 4: Update App.jsx layout**

Main panel split vertically: RequestPanel (top half) and ResponsePanel (bottom half), using a flex column with `h-1/2` each (or a resizable splitter).

**Step 5: Verify**

Run: `npm run dev`
Expected: Select an endpoint, click Send. If no real server, see network error in ResponsePanel. Status/time still displays. If connected to UAT with valid token, should see real response.

**Step 6: Write tests for apiClient and ResponsePanel**

Create `src/__tests__/api/apiClient.test.js`:
- Test sendRequest() builds correct URL from proxyBase + path
- Test Authorization header is set when token provided
- Test POST request includes body
- Test GET request does not include body
- Test response parsing (JSON response, text response)
- Test elapsed time is calculated
- Test error handling (network error, non-JSON response)

Create `src/__tests__/components/ResponsePanel.test.jsx`:
- Test empty state when no response
- Test renders status code with correct color (200=green, 400=yellow, 500=red)
- Test renders elapsed time
- Test renders response body

Create `src/__tests__/integration/send-request.test.jsx`:
- Test full flow: select endpoint → edit payload → send → response displayed (using MSW mock)

Run: `npm run test -- --run`
Expected: All tests pass.

**Step 7: Commit**

```bash
git add src/utils/apiClient.js src/components/ResponsePanel.jsx src/components/RequestPanel.jsx src/App.jsx src/__tests__/
git commit -m "feat: add API request execution, response viewer, and comprehensive tests"
```

---

### Task 8: Request History Bar

**Files:**
- Create: `src/components/HistoryBar.jsx`
- Create: `src/context/HistoryContext.jsx`
- Modify: `src/App.jsx` — add HistoryProvider, render HistoryBar

**Step 1: Create HistoryContext**

Store array of `{ id, timestamp, endpointName, method, path, status, elapsed, requestBody, responseData }`. Max 50 entries. Persist to localStorage.

**Step 2: Create HistoryBar**

- Collapsible bar at the bottom (toggle with a small "History" tab/button)
- When expanded, shows a scrollable horizontal list or table of recent requests
- Each entry: timestamp, endpoint name, method badge, status code (color-coded), elapsed ms
- Click on entry: loads that endpoint + request body into the editor, and response into the ResponsePanel

**Step 3: Log requests on send**

After each API call, add entry to history via context.

**Step 4: Wire into App.jsx**

Add HistoryProvider wrapping the app. Render HistoryBar at the bottom of the layout.

**Step 5: Verify**

Run: `npm run dev`
Expected: Send a request → appears in history bar. Click it → reloads into editor.

**Step 6: Write tests for HistoryBar and HistoryContext**

Create `src/__tests__/unit/HistoryContext.test.jsx`:
- Test initial state (empty history)
- Test addEntry() adds to history
- Test max 50 entries (oldest removed)
- Test localStorage persistence
- Test clearHistory() empties array

Create `src/__tests__/components/HistoryBar.test.jsx`:
- Test renders collapsed by default
- Test toggle expands/collapses
- Test renders history entries with timestamp, name, status
- Test click on entry fires replay callback

Create `src/__tests__/integration/history-replay.test.jsx`:
- Test full flow: send request → appears in history → click → reloads into editor + response

Run: `npm run test -- --run`
Expected: All tests pass.

**Step 7: Commit**

```bash
git add src/components/HistoryBar.jsx src/context/HistoryContext.jsx src/App.jsx src/__tests__/
git commit -m "feat: add request history bar with persistence, replay, and tests"
```

---

### Task 9: Polish, Edge Cases, and Final Verification

**Files:**
- Modify: `src/components/RequestPanel.jsx` — add "Reset Template" button
- Modify: `src/components/AuthModal.jsx` — add loading/error states
- Modify: `src/App.jsx` — responsive tweaks
- Modify: `index.html` — set title and favicon

**Step 1: Add Reset Template button**

In RequestPanel URL bar, add a "Reset" button that reloads the default template for the current endpoint.

**Step 2: Improve AuthModal UX**

- Disable Send button when not authenticated (for auth-required endpoints)
- Show warning badge on Send if no token but endpoint needs auth
- Add "Logout" button to AuthBar when authenticated

**Step 3: Set page title**

In `index.html`, set `<title>MOPH PHR API Tester</title>`.

**Step 4: Add GET endpoint query param handling**

For GET endpoints (OrganizationSummary, RemoveEncounter, PasteJSON GET), show URL query params as editable fields instead of a JSON body editor. Build the URL from the fields.

**Step 5: Final verification**

Run: `npm run dev`
Verify full flow:
1. Open app → dark two-panel UI
2. Toggle environment UAT/Prod
3. Login via each auth method (paste JWT for quick test)
4. Browse sidebar endpoints by group
5. Select UpdatePHRv1 → see sample template in editor
6. Edit payload → click Send → see response
7. Check history bar logs the request
8. Click history entry → replays
9. Reset template → original payload restored
10. Logout → token cleared

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: polish UI, add reset template, GET param handling, final verification"
```

---

## File Tree (Final)

```
moph-phr-payload-test/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── CLAUDE.md
├── SPEC.md
├── docs/plans/
│   ├── 2026-04-07-moph-phr-tester-design.md
│   └── 2026-04-07-moph-phr-tester-implementation.md
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── test/
    │   ├── setup.js
    │   └── test-utils.jsx
    ├── __tests__/
    │   ├── unit/
    │   │   ├── smoke.test.js
    │   │   ├── endpoints.test.js
    │   │   ├── templates.test.js
    │   │   ├── AuthContext.test.jsx
    │   │   ├── EndpointContext.test.jsx
    │   │   └── HistoryContext.test.jsx
    │   ├── components/
    │   │   ├── AuthBar.test.jsx
    │   │   ├── AuthModal.test.jsx
    │   │   ├── EndpointSidebar.test.jsx
    │   │   └── HistoryBar.test.jsx
    │   ├── integration/
    │   │   ├── send-request.test.jsx
    │   │   └── history-replay.test.jsx
    │   └── api/
    │       ├── auth.test.js
    │       └── apiClient.test.js
    ├── config/
    │   ├── endpoints.js
    │   └── templates.js
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── EndpointContext.jsx
    │   └── HistoryContext.jsx
    ├── components/
    │   ├── shared/
    │   │   ├── Badge.jsx
    │   │   ├── StatusDot.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Spinner.jsx
    │   │   └── Toast.jsx
    │   ├── AuthBar.jsx
    │   ├── AuthModal.jsx
    │   ├── EndpointSidebar.jsx
    │   ├── RequestPanel.jsx
    │   ├── ResponsePanel.jsx
    │   └── HistoryBar.jsx
    └── utils/
        └── apiClient.js
```
