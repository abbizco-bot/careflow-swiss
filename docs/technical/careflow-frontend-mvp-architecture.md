# CareFlow MVP Frontend Architecture

## Purpose

This document describes the active MVP frontend under `apps/careflow-mvp-frontend`.

The frontend is a small demo prototype for the Leadership Day view. It is not the final SaaS frontend.

## Current Implementation Status

Active frontend folder:

- `apps/careflow-mvp-frontend`

Framework and tooling:

- React 18
- TypeScript
- Vite
- `@vitejs/plugin-react`

Build command:

```bash
cd apps/careflow-mvp-frontend
npm run build
```

The build script runs:

```bash
tsc --noEmit && vite build
```

## Main Files

- `index.html`: Vite HTML entry
- `src/main.tsx`: React root mounting
- `src/App.tsx`: main application shell and scenario selection state
- `src/api.ts`: API client
- `src/demoScenarios.ts`: scenario data
- `src/translations.ts`: frontend labels and explanatory wording
- `src/styles.css`: frontend styling

Components:

- `src/components/ScenarioSwitcher.tsx`
- `src/components/LeadershipDayView.tsx`
- `src/components/ShiftCard.tsx`

## Application Flow

1. `src/main.tsx` finds the `root` element and renders `<App />`.
2. `src/App.tsx` initializes `activeScenarioId` from the first demo scenario.
3. `src/App.tsx` derives the active scenario from `demoScenarios`.
4. `ScenarioSwitcher` renders scenario buttons and calls `onSelect`.
5. `LeadershipDayView` receives the active scenario and calls `fetchLeadershipDay(scenario.date)`.
6. `api.ts` fetches `/leadership/day?date=...` from `VITE_CAREFLOW_API_BASE_URL` or `http://localhost:3001`.
7. `LeadershipDayView` renders loading, error, or success state.
8. On success, `ShiftCard` renders shift-level planned/effective counts, gap metrics, primary cause, severity, qualification status, and technical signal codes.

## Scenario Selection Logic

Scenario selection is local React state in `App.tsx`.

There is no router library. The MVP navigation is a scenario switcher, not URL-based routing.

Scenario data is defined in `src/demoScenarios.ts`.

Current scenario dates:

- `2088-05-12`: stable day
- `2088-05-13`: attention/request context
- `2088-05-05`: operational gap
- `2088-05-06`: qualification gap
- `2088-05-16`: absence effect
- `2088-05-07`: mixed cause

## API Client

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

- No routing library.
- No authentication.
- No UI component library.
- No Planning Comparison UI.
- No Rolling View UI in this active MVP frontend.
- No import, ReferencePlan freeze, decision options, period closing, or full SaaS frontend behavior.

## Next Likely Extensions

- Add additional read-only leadership views only after the backend contract is stable.
- Keep frontend wording grounded in backend response fields.
- Add frontend contract tests or mocked response fixtures if UI usage expands.

## Update Triggers

Update this document when the active frontend folder, build command, component structure, API client, scenario data, or routing/navigation logic changes.

