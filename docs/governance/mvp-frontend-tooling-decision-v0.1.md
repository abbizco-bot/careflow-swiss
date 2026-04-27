# CareFlow MVP Frontend Tooling Decision v0.1

## Grundentscheidung

Fuer den MVP-Frontend-Prototyp wird ein kleines Vite/React/TypeScript-Projekt bevorzugt.

Gruende:

- Vite wegen schneller, einfacher lokaler Entwicklung.
- React wegen Komponentenstruktur fuer Scenario Switcher, Leadership Day, Shift Cards und spaeter Planning Comparison.
- TypeScript wegen stabilerer API-Feldverwendung.

Das Frontend bleibt MVP-Demo-Prototyp, nicht finales SaaS-Produktfrontend.

API-only reicht fuer technische Pruefung, aber nicht fuer eine verstaendliche Entscheider-Demo.

Eine statische HTML/JS-Seite waere schneller, aber weniger ausbaufaehig.

## Ausgangslage

`docs/governance/mvp-frontend-prototype-scope-v0.1.md` definiert den Frontend-Scope.

`docs/governance/mvp-frontend-wireframe-copy-v0.1.md` definiert Wireframe und Fuehrungssprache.

Die Backend-MVP-Demo ist ueber `npm run seed:mvp` reproduzierbar.

Es gibt im Root-Projekt kein aktives Frontend-Setup.

Der lokale Ordner `careflow-frontend` ist nicht git-getrackt und wirkt wie ein lokales oder aelteres Build-Artefakt.

Dieser Ordner wird nicht als Basis uebernommen.

ADR-078 haelt fest: SaaS-ready, aber pilot-first.

## Projektort

Bevorzugter Ort:

```text
apps/careflow-mvp-frontend/
```

Grundsaetze:

- separates Frontend innerhalb des Repos
- keine Vermischung mit Backend-`src`
- kein Uebernehmen des alten `careflow-frontend`-Ordners
- keine Stash-Integration
- kein Monorepo-Tooling im ersten Schritt

## Root package.json

Im ersten Frontend-Baseline-Commit sollen noch keine Root-Scripts ergaenzt werden.

Das Frontend laeuft zunaechst eigenstaendig:

```bash
cd apps/careflow-mvp-frontend
npm run dev
npm run build
```

Root-Scripts wie `frontend:dev` oder `frontend:build` koennen spaeter ergaenzt werden, wenn die Struktur stabil ist.

## Scope des ersten Frontends

Das erste Frontend soll nur zeigen:

- Demo Scenario Switcher
- Leadership Day Detail
- Headline
- Shift Cards
- Fuehrungssprache fuer `severity` und `primaryCause`
- technische Codes hoechstens sekundaer/klein

Noch nicht im ersten Frontend-Schritt:

- Planning Comparison, ausser spaeter als eigener zweiter Frontend-Schritt
- Import
- ReferencePlan-Freeze
- Rolling 28-Day View
- DecisionOption-Engine
- PersonGapContext
- PeriodClosing
- SpecialNeed / SpecialCompetence
- Architekturreserve-Type-Sketches

Planning Comparison wird auf Frontend-Seite bewusst als zweiter Schritt behandelt.

Grund:

- `PlanningMonth.id` wird dynamisch aus dem Seed ausgegeben
- die Ansicht braucht zusaetzliche UI-Logik
- der erste Frontend-Schritt soll eng auf Leadership Day fokussiert bleiben

## Technische Minimalitaet

Der erste Frontend-Schritt soll technisch klein bleiben.

Nicht im ersten Schritt:

- kein Redux
- keine komplexe State-Management-Loesung
- keine Authentifizierung
- keine Routing-Bibliothek
- keine UI-Library
- kein Tailwind, sofern nicht spaeter separat entschieden
- kein Produktdesignsystem

Im ersten Schritt:

- API-Zugriff zunaechst ueber `fetch`
- einfache Komponentenstruktur
- klare Demo-Szenario-Daten
- Fuehrungssprache statt technischer Hauptsprache

## Dependencies

Spaetere erste Frontend-Dependencies:

- `vite`
- `react`
- `react-dom`
- `typescript`
- `@vitejs/plugin-react`
- React/DOM Type Packages

Diese Dependencies werden erst im Frontend-Baseline-Schritt installiert oder angelegt, nicht in diesem Dokumentationsschritt.

## API-Konfiguration

Das Frontend nutzt:

```text
VITE_CAREFLOW_API_BASE_URL
```

`.env.example` soll spaeter im Frontend enthalten:

```text
VITE_CAREFLOW_API_BASE_URL=http://localhost:3001
```

Code darf einen lokalen Fallback auf `http://localhost:3001` haben.

Kein harter Produktiv-Endpoint.

Keine Auth im ersten Prototyp.

Backend-CORS ist aktuell grundsaetzlich aktiv.

## Beziehung zum Backend

Das Frontend konsumiert nur bestehende MVP-Endpunkte.

Keine API-Erweiterung fuer den ersten Prototyp.

Backend bleibt separate Express/TypeScript-App.

MVP-Demo-Daten werden ueber `npm run seed:mvp` erzeugt.

Der erste Frontend-Schritt fokussiert Leadership Day.

Planning Comparison wird spaeter separat ergaenzt.

## Fuehrungssprache

Die UI soll technische Codes in Fuehrungssprache uebersetzen.

Severity:

- `none` -> Stabil
- `attention` -> Beobachten
- `critical` -> Kritisch

Primary Cause:

- `none` -> keine erkennbare Luecke
- `operational` -> operative Unterdeckung
- `absence` -> Abwesenheit wirkt auf Besetzung
- `request_context` -> unsichere oder angefragte Besetzung
- `mixed` -> mehrere Ursachen kombiniert

## Datenschutz- und Governance-Grenzen

Nicht anzeigen:

- keine Namen
- keine `employeeIds`
- keine Abwesenheitsgruende
- keine personenbezogene Bewertung
- keine Schuldlogik
- keine Recommendation-/Approval-/Execution-Felder
- keine Architekturreserve im UI sichtbar machen

## Risiken

Die wichtigsten Risiken sind:

- Frontend waechst zu schnell zum Produktfrontend.
- UI zeigt zu viele technische Codes.
- Fehlender Import wirkt wie Produktluecke.
- Planning Comparison wird als ReferencePlan-Freeze verstanden.
- Alter `careflow-frontend`-Ordner wird unkontrolliert uebernommen.
- Frontend-Tooling blaeht das Repo zu frueh auf.
- Demo-Szenarien wirken kuenstlich ohne Fuehrungserzaehlung.
- `PlanningMonth.id` erschwert Planning Comparison im ersten UI-Schritt.

## Konsequenz

Dieses Dokument ist Tooling-Entscheidung, keine Implementierung.

Naechster technischer Schritt darf das Anlegen eines kleinen Vite/React-Projekts unter `apps/careflow-mvp-frontend` sein.

Noch kein finales Produktfrontend.

Noch kein Deployment.

Noch keine Authentifizierung.

Noch keine neuen Backend-Endpunkte.

Noch keine Root-Scripts im ersten Schritt.

Keine Stash-Integration.

`careflow-frontend` wird nicht uebernommen.
