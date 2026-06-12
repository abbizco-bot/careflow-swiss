# ADR-110 - Active Demo Frontend and Frontend Consolidation Boundary

**Status:** Accepted
**Date:** 2026-06-12
**Project:** CareFlow-Swiss
**Decision Area:** Frontend structure, demo deployment, repository boundaries, consolidation planning
**Related ADRs:** ADR-078, ADR-084, ADR-108, ADR-109

---

## Context

CareFlow currently contains two frontend lines with different histories and purposes.

Earlier documentation identified `apps/careflow-mvp-frontend/` as the active MVP frontend and treated `frontend/` as legacy or exploratory. Repository and deployment verification on 12 June 2026 showed that this classification is no longer correct.

The repository documentation must distinguish the currently active extended demo and presentation frontend from the earlier backend-integrated Leadership Day MVP frontend. This correction is an interim but binding repository-state decision. It is not the final SaaS frontend architecture.

---

## Verified Current State

- `src/` is the active backend source.
- Root `dist/` is generated backend build output.
- `frontend/` is the active CareFlow demo and presentation frontend.
- `frontend/dist/` is generated build output currently used as the deployment source for the deployed demo at `demo.careflow-swiss.ch`.
- The active demo includes rolling leadership views, deviations, interventions, QM situation, simulation, sensitivity analysis, assessment context, and BESA/interRAI references.
- `apps/careflow-mvp-frontend/` is an earlier, reduced Leadership Day MVP frontend.
- `apps/careflow-mvp-frontend/` is retained for now as a reference and possible migration source.
- Deployment is currently manual.
- No CI/CD or deployment script exists in the repository.

---

## Decision

`frontend/` is the active demo and presentation frontend.

`frontend/dist/` is generated build output currently used as the deployment source.

`apps/careflow-mvp-frontend/` is retained as an earlier Leadership Day MVP reference.

No new feature should be added to `apps/careflow-mvp-frontend/` unless explicitly approved.

Until consolidation is decided, new demo-facing frontend development takes place in `frontend/`.

Backend development remains under `src/`.

The two frontends must not be merged, deleted, or renamed as part of this documentation correction.

Technical frontend consolidation is a separate future work package.

---

## Consequences

Documentation must no longer describe `apps/careflow-mvp-frontend/` as the active demo frontend.

Documentation must distinguish:

- active backend source: `src/`
- active demo frontend source code: `frontend/src/`
- active demo frontend project: `frontend/`
- active demo generated build output currently used as the deployment source: `frontend/dist/`
- earlier Leadership Day MVP frontend: `apps/careflow-mvp-frontend/`
- earlier MVP build output: `apps/careflow-mvp-frontend/dist/`
- backend build output: root `dist/`

The active demo may contain presentation-oriented or locally modelled functionality. Documentation must not imply that all active demo functions are backed by production-ready backend APIs.

The earlier MVP frontend remains useful because it demonstrates the backend-integrated Leadership Day contract and can serve as a migration reference.

---

## Boundaries

This ADR does not introduce source-code changes.

This ADR does not change dependencies, package versions, build tooling, routes, API contracts, database schema, deployment process, or CI/CD setup.

This ADR does not approve deletion, renaming, or merging of frontend directories.

This ADR does not define the final SaaS frontend architecture.

This ADR does not turn presentation-oriented demo behaviour into backend domain truth.

---

## Deferred Decisions

- Whether and how the two frontend lines should be consolidated.
- Which active demo features should migrate into a backend-integrated production frontend.
- Whether React, TypeScript, Vite, or linting versions should be aligned.
- Whether root frontend scripts should be introduced.
- Whether deployment automation or CI/CD should be added.
- Which frontend architecture will become the final SaaS frontend.

---

## Verification Basis

This decision is based on repository and deployment-state verification as of 12 June 2026:

- `frontend/` exists as the active extended demo frontend.
- `frontend/package.json` defines React 19, TypeScript 6, Vite 8, and ESLint-based tooling.
- `frontend/src/` contains the active demo application files, simulation model, assessment context, rolling leadership copy, demo scenarios, and visual assets.
- `frontend/dist/` exists as generated frontend build output currently used as the deployment source for the deployed demo.
- `apps/careflow-mvp-frontend/package.json` defines the earlier React 18, TypeScript 5.7, Vite 6 Leadership Day MVP frontend.
- No repository deployment script or CI/CD workflow was identified for the current manual deployment.

---

## Accepted Decision

CareFlow records `frontend/` as the active demo and presentation frontend and `frontend/dist/` as generated build output currently used as the deployment source. `apps/careflow-mvp-frontend/` remains an earlier backend-integrated Leadership Day MVP reference and possible migration source. Frontend consolidation is deferred and must be handled as a separate future work package.
