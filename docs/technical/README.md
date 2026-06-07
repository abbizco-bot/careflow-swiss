# CareFlow Technical Documentation

## Purpose

This folder contains the repo-near technical documentation for the current CareFlow MVP implementation.

The documentation is meant to describe the code that is currently active in this repository. It is not a product roadmap, governance replacement, or domain source of truth.

## Current Implementation Status

The active implementation consists of:

- Backend/API source under `src`
- Prisma schema under `prisma/schema.prisma`
- MVP frontend under `apps/careflow-mvp-frontend`

Generated output and dependency folders are not treated as source:

- `dist`
- `node_modules`
- `src/generated`

Legacy or exploratory frontend folders are documented only as boundaries:

- `frontend`
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

## Update Triggers

Update these documents when:

- backend entry files, route mounts, or endpoint contracts change
- frontend app structure, component structure, or API consumption changes
- Prisma schema models, enums, or generated client output path changes
- build commands or working directories change
- legacy/generated folder status changes

## Documentation Owner Logic

Technical Markdown docs are repo-near. They should be updated as part of the same development sequence when code changes make the current technical understanding misleading.

