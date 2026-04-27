# CareFlow MVP Frontend

## Zweck

Dieses Frontend ist ein kleiner MVP-Demo-Prototyp fuer CareFlow.

Es zeigt die Leadership-Day-Demo auf Basis der bestehenden Backend-MVP-Endpunkte. Es ist nicht das finale SaaS-Produktfrontend.

## Voraussetzungen

- Backend laeuft lokal
- Demo-Daten wurden im Backend-Root erzeugt mit:

```bash
npm run seed:mvp
```

- Backend laeuft typischerweise unter:

```text
http://localhost:3001
```

## Installation

Im Frontend-Ordner:

```bash
npm install
```

## Lokale Entwicklung

Im Frontend-Ordner:

```bash
npm run dev
```

Standard-Vite-URL:

```text
http://localhost:5173
```

## API-Konfiguration

`.env.example` enthaelt:

```env
VITE_CAREFLOW_API_BASE_URL=http://localhost:3001
```

Falls noetig, lokale `.env` anlegen.

## Build

```bash
npm run build
```

## Aktueller Scope

Enthalten:

- Scenario Switcher
- Leadership Day Fetch
- Tagesheadline
- Shift Cards
- Fuehrungssprache fuer severity und primaryCause
- technische Codes nur sekundaer

Nicht enthalten:

- Planning Comparison UI
- Import
- ReferencePlan-Freeze
- Rolling View
- DecisionOptions
- PersonGapContext
- PeriodClosing
- Auth
- Routing
- UI-Library
- produktives SaaS-Frontend

## Demo-Szenarien

- 2088-05-12 Stabiler Tag
- 2088-05-13 Aufmerksamkeit
- 2088-05-05 Operative Unterdeckung
- 2088-05-06 Qualifikationsluecke
- 2088-05-16 Abwesenheitswirkung
- 2088-05-07 Gemischte Ursache

## Governance-Hinweis

Relevante Governance-Dokumente:

- `docs/governance/mvp-frontend-prototype-scope-v0.1.md`
- `docs/governance/mvp-frontend-wireframe-copy-v0.1.md`
- `docs/governance/mvp-frontend-tooling-decision-v0.1.md`
- `docs/governance/mvp-demo-runbook-v0.1.md`
