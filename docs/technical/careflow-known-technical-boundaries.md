# CareFlow Known Technical Boundaries

## Purpose

This document records technical boundaries that are easy to confuse in the current repository.

## Current Implementation Status

The active implementation is:

- backend/API: `src`
- Prisma schema: `prisma/schema.prisma`
- active demo frontend: `frontend`
- earlier backend-integrated Leadership Day MVP frontend: `apps/careflow-mvp-frontend`

## Explicit Boundaries

### Root README Frontend Status

The root `README.md` has been corrected to distinguish the active demo frontend from the earlier Leadership Day MVP frontend.

Treat ADR-110 as the binding repository-state decision for current frontend classification.

### Active Demo Frontend

`frontend` is the active demo and presentation frontend.

It contains the extended demo surface for rolling leadership views, deviations, interventions, QM situation, simulation, sensitivity analysis, assessment context and BESA/interRAI references.

`frontend/dist` is generated build output and is currently used as the build source for the manually deployed demo at `demo.careflow-swiss.ch`.

The active demo is not the final SaaS frontend. It may contain presentation-oriented or locally modelled functionality that is not yet backed by production-ready backend APIs.

### Earlier Leadership Day MVP Frontend

`apps/careflow-mvp-frontend` is the earlier backend-integrated Leadership Day MVP frontend.

It is retained as a reference and possible migration source. It should not receive new features unless explicitly approved.

### Deferred Frontend Consolidation

Technical consolidation of `frontend/` and `apps/careflow-mvp-frontend/` is deferred until after the pilot presentation.

Do not merge, delete, rename, upgrade, or refactor either frontend line as part of documentation correction.

### Old Generated/Unused Frontend Folder

`careflow-frontend` should not be adopted.

It contains generated/dependency material and no active source files outside ignored output/dependency folders in the inspected state.

Governance docs also indicate that the old `careflow-frontend` folder should not be taken over.

### Generated Backend Output

`dist` is generated backend build output.

Do not treat `dist` as source code and do not base architecture documentation on it.

### Generated Frontend Outputs

`frontend/dist` and `apps/careflow-mvp-frontend/dist` are generated frontend build outputs.

Do not manually edit generated frontend build files.

### Generated Prisma Client

`src/generated` should be treated as generated code.

The Prisma schema generator writes the client to `src/generated/prisma`.

Do not edit generated Prisma client files manually.

### Dependencies

`node_modules` is a dependency folder.

Do not inspect it in detail for application structure.

### Deployment

Deployment is currently manual.

No CI/CD workflow or deployment script exists in the repository.

## Known Limitations

- Some backend modules are active source but may be preparatory or not consumed by the active demo frontend.
- Some active demo frontend functions may be presentation-oriented or locally modelled.
- This document does not decide final product architecture. It only records repository-level technical boundaries.

## Next Likely Extensions

- Update this document after a frontend consolidation decision.
- Add deployment boundaries if a deployment process or CI/CD workflow is introduced.
- Add an explicit archival note for `careflow-frontend` if the project owner confirms it will remain inactive.

## Update Triggers

Update this document when any folder is reactivated, removed, renamed, or becomes part of the active build/development/deployment flow.
