# CareFlow Local Development and Build

## Purpose

This document records the active local build and development commands for the current CareFlow MVP implementation.

## Current Implementation Status

There are three build contexts:

- backend/API from repository root
- active demo frontend from `frontend`
- earlier Leadership Day MVP frontend from `apps/careflow-mvp-frontend`

## Backend Commands

Working directory:

```bash
C:\Projects\careflow
```

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start compiled backend:

```bash
npm run start
```

Seed MVP demo data:

```bash
npm run seed:mvp
```

Test:

```bash
npm run test
```

Root build script:

```bash
tsc
```

Runtime server:

- `src/server.ts`
- default port: `3001`

## Active Demo Frontend Commands

Working directory:

```bash
C:\Projects\careflow\frontend
```

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Preview:

```bash
npm run preview
```

Frontend build script:

```bash
tsc -b && vite build
```

Default Vite development URL is expected to be:

```text
http://localhost:5173
```

This default is based on Vite behavior; actual port can change if occupied.

## Earlier Leadership Day MVP Frontend Commands

Working directory:

```bash
C:\Projects\careflow\apps\careflow-mvp-frontend
```

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

Frontend build script:

```bash
tsc --noEmit && vite build
```

This frontend is retained as a backend-integrated reference and possible migration source. It is not the active demo frontend.

## Environment

Backend:

- `DATABASE_URL` is required by `src/lib/prisma.ts`.

Earlier Leadership Day MVP frontend:

- `VITE_CAREFLOW_API_BASE_URL` can be set to point at the backend.
- fallback API URL is `http://localhost:3001`.
- `.env.example` exists in `apps/careflow-mvp-frontend`.

## Build Outputs

Backend:

- `dist` is generated build output and should not be treated as source.

Active demo frontend:

- `frontend/dist` is generated build output.
- `frontend/dist` is currently used as the build source for the manually deployed demo at `demo.careflow-swiss.ch`.
- Do not edit generated files in `frontend/dist` manually.

Earlier Leadership Day MVP frontend:

- `apps/careflow-mvp-frontend/dist` is generated build output.
- Do not edit generated files in `apps/careflow-mvp-frontend/dist` manually.

Generated Prisma client:

- `src/generated/prisma`
- generated code, not manual source

## Deployment

Deployment is currently manual.

No CI/CD workflow or deployment script exists in the repository.

## Known Limitations

- This document records commands, not database provisioning.
- Local PostgreSQL setup details are to be verified.
- Prisma generation workflow outside the existing build/dev commands is to be verified.
- Technical frontend consolidation is deferred.

## Next Likely Extensions

- Add local database setup and seed verification instructions.
- Add command order for a full local demo run.
- Add troubleshooting for common `DATABASE_URL` and CORS issues.
- Add deployment documentation only after a deployment process exists.

## Update Triggers

Update this document when scripts, ports, working directories, environment variables, output paths, deployment process, or frontend consolidation decisions change.
