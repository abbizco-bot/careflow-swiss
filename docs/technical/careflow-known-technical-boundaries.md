# CareFlow Known Technical Boundaries

## Purpose

This document records technical boundaries that are easy to confuse in the current repository.

## Current Implementation Status

The active implementation is:

- backend/API: `src`
- Prisma schema: `prisma/schema.prisma`
- MVP frontend: `apps/careflow-mvp-frontend`

## Explicit Boundaries

### Root README Frontend Status

The root `README.md` appears stale regarding frontend integration.

It still states that there is no frontend demo integrated, while the repository now contains and documents the active MVP frontend under `apps/careflow-mvp-frontend`.

Treat this as a documentation mismatch, not as evidence that the MVP frontend is inactive.

### Active MVP Frontend

`apps/careflow-mvp-frontend` is the active MVP frontend.

It is a focused Vite/React prototype for the Leadership Day demo. It is not the final SaaS frontend.

### Legacy or Exploratory Frontend

`frontend` is legacy or exploratory unless explicitly reactivated.

It contains a separate Vite/React app with a large standalone demo surface, but it is not the documented active MVP frontend.

Do not document `frontend` as active implementation without a new explicit decision.

### Old Generated/Unused Frontend Folder

`careflow-frontend` should not be adopted.

It contains generated/dependency material and no active source files outside ignored output/dependency folders in the inspected state.

Governance docs also indicate that the old `careflow-frontend` folder should not be taken over.

### Generated Backend Output

`dist` is generated backend build output.

Do not treat `dist` as source code and do not base architecture documentation on it.

### Generated Prisma Client

`src/generated` should be treated as generated code.

The Prisma schema generator writes the client to `src/generated/prisma`.

Do not edit generated Prisma client files manually.

### Dependencies

`node_modules` is a dependency folder.

Do not inspect it in detail for application structure.

## Known Limitations

- Some backend modules are active source but may be preparatory or not consumed by the MVP frontend.
- This document does not decide product scope. It only records repository-level technical boundaries.

## Next Likely Extensions

- Update the root README to match active frontend reality when a documentation pass includes root README changes.
- Add an explicit archival note for `frontend` if the project owner confirms it will remain inactive.
- Add ignore guidance to future docs tooling if needed.

## Update Triggers

Update this document when any folder is reactivated, removed, renamed, or becomes part of the active build/development flow.

