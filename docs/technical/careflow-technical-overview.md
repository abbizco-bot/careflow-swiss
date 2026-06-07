# CareFlow Technical Overview

## Purpose

This document summarizes the active technical shape of the current CareFlow MVP implementation.

CareFlow is implemented as a backend/API with a small MVP frontend prototype. The current frontend is a focused leadership-day demo, not the final SaaS frontend.

## Current Implementation Status

Active source areas:

- `src`: backend/API source
- `prisma/schema.prisma`: Prisma data model
- `apps/careflow-mvp-frontend`: active MVP frontend

Non-source or non-active areas:

- `dist`: generated backend build output
- `node_modules`: dependencies
- `src/generated`: generated Prisma client output
- `frontend`: legacy or exploratory standalone prototype unless explicitly reactivated
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

## Main Frontend Stack

The active MVP frontend is under `apps/careflow-mvp-frontend`.

- React 18
- TypeScript
- Vite
- `@vitejs/plugin-react`

Frontend `package.json` defines:

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

Frontend:

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

## Known Limitations

- The MVP frontend currently consumes only the Leadership Day endpoint.
- There is no frontend routing library in the active MVP frontend.
- The root README appears stale where it says no frontend demo is integrated.
- The active frontend is a prototype, not the final product frontend.

## Next Likely Extensions

- Keep backend API contract documentation aligned with active frontend usage.
- Document additional frontend consumption only after it is implemented.
- Add a specific endpoint contract doc for Planning Comparison if the frontend starts consuming it.

## Update Triggers

Update this overview when active folders, stack choices, build commands, or entry points change.

