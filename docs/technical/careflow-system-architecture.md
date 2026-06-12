# CareFlow System Architecture

## Purpose

This document describes the current high-level architecture of the CareFlow MVP implementation.

## Current Implementation Status

The system is currently split into:

- Backend/API in `src`
- Prisma data model in `prisma/schema.prisma`
- Active extended demo frontend in `frontend`
- Earlier backend-integrated Leadership Day MVP frontend in `apps/careflow-mvp-frontend`

The backend contains deterministic domain logic and read models. The active extended demo frontend presents the current pilot/demo surface. The earlier MVP frontend remains a smaller backend-integrated reference for the Leadership Day contract.

## Architecture Shape

```text
frontend
  React/Vite active extended demo frontend
  includes rolling views, deviations, interventions, QM situation,
  simulation, sensitivity analysis, assessment context and BESA/interRAI context

apps/careflow-mvp-frontend
  React/Vite earlier Leadership Day MVP frontend
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

## Active Demo Frontend Shape

The active extended demo frontend includes:

- `frontend/src/main.tsx`: React root mounting
- `frontend/src/App.tsx`: active demo application shell and view composition
- `frontend/src/App.css`: application styling
- `frontend/src/index.css`: global styling
- `frontend/src/simulationModel.ts`: local simulation model
- `frontend/src/assessmentContext.ts`: assessment and care-complexity context
- `frontend/src/rollingLeadership.copy.ts`: rolling leadership copy and presentation wording
- `frontend/src/demo/demoScenarios.ts`: active demo scenarios
- `frontend/src/assets/**`: active demo visual assets

The active extended demo is not the final SaaS frontend. Some demo functionality may be presentation-oriented or locally modelled rather than backed by production-ready backend APIs.

## Earlier Leadership Day MVP Frontend Shape

The earlier backend-integrated MVP frontend has a shallow component structure:

- `apps/careflow-mvp-frontend/src/main.tsx`: React root mounting
- `apps/careflow-mvp-frontend/src/App.tsx`: main shell and scenario selection state
- `apps/careflow-mvp-frontend/src/demoScenarios.ts`: available demo scenarios and dates
- `apps/careflow-mvp-frontend/src/api.ts`: API client
- `apps/careflow-mvp-frontend/src/components/ScenarioSwitcher.tsx`: scenario navigation
- `apps/careflow-mvp-frontend/src/components/LeadershipDayView.tsx`: fetches and renders day response
- `apps/careflow-mvp-frontend/src/components/ShiftCard.tsx`: renders shift-level status
- `apps/careflow-mvp-frontend/src/translations.ts`: frontend wording for severity and primary cause
- `apps/careflow-mvp-frontend/src/styles.css`: MVP frontend styling

There is no routing library in the earlier MVP frontend. Scenario selection is implemented with React state in `App.tsx`.

## Known Limitations

- The active extended demo frontend is not the final SaaS frontend.
- The active demo may contain locally modelled or presentation-oriented functionality.
- The backend contains route families and modules beyond what any current frontend consumes.
- Some backend modules may be preparatory or not exposed through a frontend yet; exact production activation status is to be verified per feature.
- Technical frontend consolidation is deferred until after the pilot presentation.
- Deployment is manual; no CI/CD or deployment script exists in the repository.

## Next Likely Extensions

- Evaluate frontend consolidation after the pilot presentation.
- Expand backend-integrated frontend contracts only from implemented backend read models.
- Keep read-only leadership views separated from write-side planning changes.

## Update Triggers

Update this document when route mounts, module layering, frontend entry structure, frontend/backend interaction, deployment-source status, or frontend consolidation decisions change.
