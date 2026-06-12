# CareFlow Technical Documentation

## Purpose

This folder contains the repo-near technical documentation for the current CareFlow MVP implementation.

The documentation is meant to describe the code that is currently active in this repository. It is not a product roadmap, governance replacement, or domain source of truth.

## Current Implementation Status

The active implementation consists of:

- Backend/API source under `src`
- Prisma schema under `prisma/schema.prisma`
- Active demo and presentation frontend under `frontend`
- Earlier backend-integrated Leadership Day MVP frontend under `apps/careflow-mvp-frontend`

Generated output and dependency folders are not treated as source:

- `dist`
- `frontend/dist`
- `apps/careflow-mvp-frontend/dist`
- `node_modules`
- `src/generated`

Legacy or unused frontend folders are documented only as boundaries:

- `careflow-frontend`

## Documents

- `careflow-technical-overview.md`
- `careflow-system-architecture.md`
- `careflow-backend-api-overview.md`
- `careflow-frontend-mvp-architecture.md`
- `careflow-prisma-data-model.md`
- `careflow-api-frontend-contract.md`
- `careflow-local-development-and-build.md`
- `careflow-known-technical-boundaries.md`

The implementation index lives at:

- `docs/indexes/careflow-implementation-index.md`

The current frontend classification decision is recorded in:

- `docs/adr/ADR-110 – Active Demo Frontend and Frontend Consolidation Boundary.md`

## Update Triggers

Update these documents when:

- backend entry files, route mounts, or endpoint contracts change
- frontend app structure, component structure, or API consumption changes
- active demo deployment source changes
- Prisma schema models, enums, or generated client output path changes
- build commands or working directories change
- legacy/generated folder status changes
- frontend consolidation decisions change

## Documentation Owner Logic

Technical Markdown docs are repo-near. They should be updated as part of the same development sequence when code changes make the current technical understanding misleading.
