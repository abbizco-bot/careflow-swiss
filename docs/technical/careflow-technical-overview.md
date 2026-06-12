# CareFlow Technical Overview

## Purpose

This document summarizes the active technical shape of the current CareFlow MVP implementation.

CareFlow is implemented as a backend/API with an active extended demo frontend and an earlier backend-integrated Leadership Day MVP frontend kept as reference.

## Current Implementation Status

Active source areas:

- `src`: backend/API source
- `prisma/schema.prisma`: Prisma data model
- `frontend`: active demo and presentation frontend

Reference source areas:

- `apps/careflow-mvp-frontend`: earlier backend-integrated Leadership Day MVP frontend, retained as reference and possible migration source

Generated or non-source areas:

- `dist`: generated backend build output
- `frontend/dist`: generated active demo build output and current manual deployment build source
- `apps/careflow-mvp-frontend/dist`: generated build output for the earlier MVP frontend
- `node_modules`: dependencies
- `src/generated`: generated Prisma client output
- `careflow-frontend`: legacy/unused generated frontend folder; should not be adopted

## Main Backend Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- Vitest for tests

Root `package.json` defines:

- `npm run dev`: starts `src/server.ts` through `ts-node-dev`
- `npm run build`: runs `tsc`
- `npm run start`: starts `dist/server.js`
- `npm run seed:mvp`: builds and runs the MVP demo seed script
- `npm run test`: runs Vitest

## Active Demo Frontend Stack

The active demo and presentation frontend is under `frontend`.

- React 19
- TypeScript 6
- Vite 8
- ESLint
- `@vitejs/plugin-react`

`frontend/package.json` defines:

- `npm run dev`: starts Vite
- `npm run build`: runs `tsc -b && vite build`
- `npm run lint`: runs ESLint
- `npm run preview`: starts Vite preview

## Earlier MVP Frontend Stack

The earlier backend-integrated Leadership Day MVP frontend is under `apps/careflow-mvp-frontend`.

- React 18
- TypeScript 5.7
- Vite 6
- `@vitejs/plugin-react`

`apps/careflow-mvp-frontend/package.json` defines:

- `npm run dev`: starts Vite
- `npm run build`: runs `tsc --noEmit && vite build`
- `npm run preview`: starts Vite preview

## Relevant Source Files

Backend:

- `src/server.ts`
- `src/app.ts`
- `src/lib/prisma.ts`
- `src/modules/**`
- `src/scripts/seed-mvp-demo-data.ts`

Active demo frontend:

- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/App.css`
- `frontend/src/index.css`
- `frontend/src/simulationModel.ts`
- `frontend/src/assessmentContext.ts`
- `frontend/src/rollingLeadership.copy.ts`
- `frontend/src/demo/demoScenarios.ts`
- `frontend/src/assets/**`

Earlier Leadership Day MVP frontend:

- `apps/careflow-mvp-frontend/src/main.tsx`
- `apps/careflow-mvp-frontend/src/App.tsx`
- `apps/careflow-mvp-frontend/src/api.ts`
- `apps/careflow-mvp-frontend/src/demoScenarios.ts`
- `apps/careflow-mvp-frontend/src/components/ScenarioSwitcher.tsx`
- `apps/careflow-mvp-frontend/src/components/LeadershipDayView.tsx`
- `apps/careflow-mvp-frontend/src/components/ShiftCard.tsx`
- `apps/careflow-mvp-frontend/src/translations.ts`
- `apps/careflow-mvp-frontend/src/styles.css`

Data model:

- `prisma/schema.prisma`
- `src/generated/prisma` is generated and should not be edited manually

## Deployment Status

Deployment is currently manual.

`frontend/dist` is the build source currently used for the deployed demo at `demo.careflow-swiss.ch`.

No CI/CD workflow or deployment script exists in the repository.

## Known Limitations

- The active extended demo frontend is not the final SaaS frontend.
- The active demo may contain presentation-oriented or locally modelled functionality.
- Not every active demo function is necessarily backed by a production-ready backend API.
- The earlier MVP frontend consumes the backend-integrated Leadership Day endpoint.
- Technical consolidation of the two frontend lines is deferred until after the pilot presentation.

## Next Likely Extensions

- Keep backend API contract documentation aligned with backend-integrated frontend usage.
- Evaluate frontend consolidation after the pilot presentation.
- Document additional frontend/backend integration only after it is implemented.

## Update Triggers

Update this overview when active folders, stack choices, build commands, deployment source, or frontend consolidation decisions change.
