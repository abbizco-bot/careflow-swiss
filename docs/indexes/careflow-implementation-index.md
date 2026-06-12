# CareFlow Implementation Index

## Purpose

This index points to the current active implementation areas and the technical documents that describe them.

## Active Implementation Areas

Backend/API:

- `src/server.ts`
- `src/app.ts`
- `src/lib/prisma.ts`
- `src/modules`
- `src/scripts/seed-mvp-demo-data.ts`

Prisma:

- `prisma/schema.prisma`

## Active Demo Frontend

- `frontend`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/App.css`
- `frontend/src/index.css`
- `frontend/src/simulationModel.ts`
- `frontend/src/assessmentContext.ts`
- `frontend/src/rollingLeadership.copy.ts`
- `frontend/src/demo/demoScenarios.ts`
- `frontend/src/assets`

## Earlier Leadership Day MVP Frontend

- `apps/careflow-mvp-frontend`
- `apps/careflow-mvp-frontend/src/main.tsx`
- `apps/careflow-mvp-frontend/src/App.tsx`
- `apps/careflow-mvp-frontend/src/api.ts`
- `apps/careflow-mvp-frontend/src/demoScenarios.ts`
- `apps/careflow-mvp-frontend/src/components`

This frontend is retained as a backend-integrated reference and possible migration source. It is not the active demo frontend.

## Generated Build Outputs

- `dist`: generated backend build output
- `frontend/dist`: generated active demo build output and current manual deployment build source
- `apps/careflow-mvp-frontend/dist`: generated build output for the earlier Leadership Day MVP frontend
- `src/generated`: generated Prisma client output

## Deferred Frontend Consolidation

Technical consolidation of `frontend/` and `apps/careflow-mvp-frontend/` is deferred until after the pilot presentation.

No directory merge, deletion, rename, React upgrade, dependency change, or source-code refactoring is part of the documentation correction recorded by ADR-110.

## Documentation Map

Technical entrypoint:

- `docs/technical/README.md`

System and architecture:

- `docs/technical/careflow-technical-overview.md`
- `docs/technical/careflow-system-architecture.md`

Backend/API:

- `docs/technical/careflow-backend-api-overview.md`

Frontend:

- `docs/technical/careflow-frontend-mvp-architecture.md`

Data model:

- `docs/technical/careflow-prisma-data-model.md`

Frontend/backend contract:

- `docs/technical/careflow-api-frontend-contract.md`

Local development and build:

- `docs/technical/careflow-local-development-and-build.md`

Boundaries:

- `docs/technical/careflow-known-technical-boundaries.md`

ADRs:

- `docs/adr/ADR-108 – Active Frontend Structure and Legacy Frontend Handling.md`
- `docs/adr/ADR-110 – Active Demo Frontend and Frontend Consolidation Boundary.md`

## Folders To Ignore For Active Source Documentation

- `node_modules`
- `dist`
- `frontend/dist`
- `apps/careflow-mvp-frontend/dist`
- `src/generated`
- `careflow-frontend`

## Current Build Commands

Backend:

```bash
cd C:\Projects\careflow
npm run build
```

Active demo frontend:

```bash
cd C:\Projects\careflow\frontend
npm run build
```

Earlier Leadership Day MVP frontend:

```bash
cd C:\Projects\careflow\apps\careflow-mvp-frontend
npm run build
```

## Update Triggers

Update this index whenever active implementation folders, key files, technical documentation files, or frontend classification decisions change.

## Documentation Owner Logic

Technical Markdown docs are repo-near and should be maintained alongside source changes that affect architecture, build flow, API contracts, active folder status, or deployment-source status.
