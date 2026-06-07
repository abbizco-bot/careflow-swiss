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

Active MVP frontend:

- `apps/careflow-mvp-frontend`
- `apps/careflow-mvp-frontend/src/main.tsx`
- `apps/careflow-mvp-frontend/src/App.tsx`
- `apps/careflow-mvp-frontend/src/api.ts`
- `apps/careflow-mvp-frontend/src/demoScenarios.ts`
- `apps/careflow-mvp-frontend/src/components`

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

## Folders To Ignore For Active Implementation Documentation

- `node_modules`
- `dist`
- `src/generated`
- `careflow-frontend`
- `frontend`, unless explicitly documenting legacy/exploratory prototype history

## Current Build Commands

Backend:

```bash
cd C:\Projects\careflow
npm run build
```

MVP frontend:

```bash
cd C:\Projects\careflow\apps\careflow-mvp-frontend
npm run build
```

## Update Triggers

Update this index whenever active implementation folders, key files, or technical documentation files change.

## Documentation Owner Logic

Technical Markdown docs are repo-near and should be maintained alongside source changes that affect architecture, build flow, API contracts, or active folder status.

