# CareFlow System Architecture

## Purpose

This document describes the current high-level architecture of the CareFlow MVP implementation.

## Current Implementation Status

The system is currently split into:

- Backend/API in `src`
- Prisma data model in `prisma/schema.prisma`
- Focused MVP frontend in `apps/careflow-mvp-frontend`

The backend contains the deterministic domain logic and read models. The frontend presents a small leadership-facing demo view based on backend facts.

## Architecture Shape

```text
apps/careflow-mvp-frontend
  React/Vite MVP frontend
  fetches /leadership/day?date=...

src
  Express API
  module routes, controllers, services, repositories
  deterministic validations and leadership read models

prisma/schema.prisma
  database schema
  generates Prisma client into src/generated/prisma

PostgreSQL
  runtime database, configured through DATABASE_URL
```

## Backend Layers

The backend follows a module-oriented structure:

- `*.routes.ts`: Express route definitions
- `*.controller.ts`: request parsing and response handling
- `*.service.ts`: domain and application logic
- `*.repository.ts`: database access
- `*.types.ts`: module type contracts
- `*.test.ts` and `*.integration.test.ts`: behavioral verification

This structure is visible across modules such as:

- `src/modules/leadership-view`
- `src/modules/validations`
- `src/modules/shifts`
- `src/modules/assignments`
- `src/modules/employees`
- `src/modules/absences`
- `src/modules/planning-months`
- `src/modules/rolling-planning-view`

## Route Mounting

The central route mounting file is `src/app.ts`.

Mounted route families:

- `/shifts`
- `/assignments`
- `/employees`
- `/validations`
- `/leadership`
- `/rolling-planning`
- `/absences`
- `/availability-requests`
- `/planning-months`
- `/ui`

The runtime server entry is `src/server.ts`, which creates the app and listens on port `3001`.

## Frontend Shape

The active MVP frontend has a shallow component structure:

- `src/main.tsx`: React root mounting
- `src/App.tsx`: main shell and scenario selection state
- `src/demoScenarios.ts`: available demo scenarios and dates
- `src/api.ts`: API client
- `src/components/ScenarioSwitcher.tsx`: scenario navigation
- `src/components/LeadershipDayView.tsx`: fetches and renders day response
- `src/components/ShiftCard.tsx`: renders shift-level status
- `src/translations.ts`: frontend wording for severity and primary cause
- `src/styles.css`: MVP frontend styling

There is no routing library in the active MVP frontend. Scenario selection is implemented with React state in `App.tsx`.

## Known Limitations

- The active frontend is limited to the Leadership Day demo.
- The backend contains route families and modules beyond what the current frontend consumes.
- Some backend modules may be preparatory or not exposed through the MVP frontend yet; exact production activation status is to be verified per feature.

## Next Likely Extensions

- Expand the MVP frontend contract only from implemented backend read models.
- Add frontend documentation for additional views once they are active.
- Keep read-only leadership views separated from write-side planning changes.

## Update Triggers

Update this document when route mounts, module layering, frontend entry structure, or frontend/backend interaction changes.

