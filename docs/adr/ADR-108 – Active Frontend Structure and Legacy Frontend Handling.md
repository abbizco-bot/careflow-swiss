# ADR-108 - Active Frontend Structure and Legacy Frontend Handling

**Status:** Superseded by ADR-110
**Date:** 2026-06-08
**Project:** CareFlow-Swiss
**Decision Area:** Frontend structure, repository boundaries, MVP demo handling

---

## Supersession Notice

This ADR is retained as a historical repository-state decision, but it is superseded by `ADR-110 - Active Demo Frontend and Frontend Consolidation Boundary`.

Repository and deployment verification on 12 June 2026 showed that `frontend/`, not `apps/careflow-mvp-frontend/`, is the currently active demo and presentation frontend. The earlier decision below no longer describes the active repository and deployment state.

ADR-110 is the binding decision for current frontend classification, generated build output currently used as the deployment source, and frontend consolidation boundaries.

---

## Historical Decision Content

`apps/careflow-mvp-frontend` ist das aktive MVP-Frontend.

`frontend` bleibt vorlaeufig als Legacy Reference Prototype erhalten.

`careflow-frontend` ist obsolete/generated und kann nach Pruefung der `.env`-Datei entfernt werden.

Neue Frontend-Entwicklung erfolgt ausschliesslich in `apps/careflow-mvp-frontend`.

---

## Historical Status

This content reflected the repository understanding at the time of ADR-108. It must not be used as the current frontend implementation decision after ADR-110.
