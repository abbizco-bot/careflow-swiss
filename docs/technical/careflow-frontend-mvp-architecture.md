# CareFlow Frontend Architecture

## Purpose

This document describes the two current CareFlow frontend lines:

1. Active extended demo frontend under `frontend/`
2. Earlier backend-integrated Leadership Day MVP frontend under `apps/careflow-mvp-frontend/`

The active extended demo is not the final SaaS frontend. It may contain presentation-oriented or locally modelled functionality that is not yet backed by production-ready backend APIs.

## Current Implementation Status

Active demo and presentation frontend:

- `frontend/`

Earlier backend-integrated Leadership Day MVP frontend:

- `apps/careflow-mvp-frontend/`

Generated frontend build outputs:

- `frontend/dist/`: current active demo build source used for the manual deployment at `demo.careflow-swiss.ch`
- `apps/careflow-mvp-frontend/dist/`: generated build output for the earlier Leadership Day MVP frontend

Frontend consolidation is deferred until after the pilot presentation. The two frontend lines must not be merged, deleted, or renamed as part of this documentation correction.

## Active Extended Demo Frontend

### Folder

```text
frontend/
```

### Framework and Tooling

- React 19
- TypeScript 6
- Vite 8
- ESLint
- `@vitejs/plugin-react`

### Commands

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

The build script runs:

```bash
tsc -b && vite build
```

### Main Files

- `frontend/index.html`: Vite HTML entry
- `frontend/src/main.tsx`: React root mounting
- `frontend/src/App.tsx`: active demo application shell and view composition
- `frontend/src/App.css`: active demo application styling
- `frontend/src/index.css`: global frontend styling
- `frontend/src/simulationModel.ts`: local simulation model used by the demo
- `frontend/src/assessmentContext.ts`: assessment and care-complexity context used by the demo
- `frontend/src/rollingLeadership.copy.ts`: rolling leadership copy and presentation text
- `frontend/src/demo/demoScenarios.ts`: active demo scenario data

Relevant assets:

- `frontend/src/assets/APP Logo.png`
- `frontend/src/assets/careflow-CF V2.png`
- `frontend/src/assets/careflow-Signet.png`
- `frontend/src/assets/hero.png`
- `frontend/src/assets/react.svg`
- `frontend/src/assets/vite.svg`

### Demo Coverage

The active extended demo currently includes:

- rolling overview
- day and week views
- deviations
- interventions
- staff and employee views
- QM situation
- simulation
- sensitivity analysis
- assessment context
- BESA/interRAI context

### Boundaries

The active extended demo is a pilot and presentation frontend. It should not be treated as the final SaaS frontend architecture.

The active demo may show locally modelled or presentation-oriented functionality. Documentation must not imply that every demo function is already backed by a production-ready backend API.

Until consolidation is decided, new demo-facing frontend development takes place in `frontend/`.

## Earlier Backend-Integrated Leadership Day MVP

### Folder

```text
apps/careflow-mvp-frontend/
```

This frontend is retained as an earlier, reduced Leadership Day MVP reference and possible migration source. No new feature should be added here unless explicitly approved.

### Framework and Tooling

- React 18
- TypeScript 5.7
- Vite 6
- `@vitejs/plugin-react`

### Commands

```bash
cd apps/careflow-mvp-frontend
npm run dev
npm run build
```

The build script runs:

```bash
tsc --noEmit && vite build
```

### Main Files

- `apps/careflow-mvp-frontend/index.html`: Vite HTML entry
- `apps/careflow-mvp-frontend/src/main.tsx`: React root mounting
- `apps/careflow-mvp-frontend/src/App.tsx`: main application shell and scenario selection state
- `apps/careflow-mvp-frontend/src/api.ts`: API client
- `apps/careflow-mvp-frontend/src/demoScenarios.ts`: scenario data
- `apps/careflow-mvp-frontend/src/translations.ts`: frontend labels and explanatory wording
- `apps/careflow-mvp-frontend/src/styles.css`: frontend styling

Components:

- `apps/careflow-mvp-frontend/src/components/ScenarioSwitcher.tsx`
- `apps/careflow-mvp-frontend/src/components/LeadershipDayView.tsx`
- `apps/careflow-mvp-frontend/src/components/ShiftCard.tsx`

### Application Flow

1. `src/main.tsx` finds the `root` element and renders `<App />`.
2. `src/App.tsx` initializes `activeScenarioId` from the first demo scenario.
3. `src/App.tsx` derives the active scenario from `demoScenarios`.
4. `ScenarioSwitcher` renders scenario buttons and calls `onSelect`.
5. `LeadershipDayView` receives the active scenario and calls `fetchLeadershipDay(scenario.date)`.
6. `api.ts` fetches `/leadership/day?date=...` from `VITE_CAREFLOW_API_BASE_URL` or `http://localhost:3001`.
7. `LeadershipDayView` renders loading, error, or success state.
8. On success, `ShiftCard` renders shift-level planned/effective counts, gap metrics, primary cause, severity, qualification status, and technical signal codes.

### Scenario Selection Logic

Scenario selection is local React state in `App.tsx`.

There is no router library. The earlier MVP navigation is a scenario switcher, not URL-based routing.

Scenario data is defined in `src/demoScenarios.ts`.

Current scenario dates:

- `2088-05-12`: stable day
- `2088-05-13`: attention/request context
- `2088-05-05`: operational gap
- `2088-05-06`: qualification gap
- `2088-05-16`: absence effect
- `2088-05-07`: mixed cause

### API Client

`src/api.ts` defines:

- `API_BASE_URL`
- `GapSeverity`
- `GapPrimaryCause`
- `LeadershipDayResponse`
- `LeadershipDayShift`
- `fetchLeadershipDay(date)`

The API base URL comes from:

```text
VITE_CAREFLOW_API_BASE_URL
```

Fallback:

```text
http://localhost:3001
```

## Known Limitations

- The active extended demo is not the final SaaS frontend.
- The active extended demo may contain presentation-oriented or locally modelled functionality.
- The earlier Leadership Day MVP frontend is no longer the active demo frontend.
- The earlier MVP frontend has no routing library.
- Technical frontend consolidation is deferred.
- Deployment is currently manual; no CI/CD or deployment script exists in the repository.

## Next Likely Extensions

- Evaluate technical consolidation of the two frontend lines after the pilot presentation.
- Keep new demo-facing frontend work in `frontend/` until a consolidation decision exists.
- Preserve `apps/careflow-mvp-frontend/` as a backend-integrated reference unless explicitly retired.
- Keep frontend wording grounded in backend response fields when backend-integrated views are implemented.

## Update Triggers

Update this document when the active frontend folder, build command, component structure, API consumption, demo deployment source, or consolidation decision changes.
