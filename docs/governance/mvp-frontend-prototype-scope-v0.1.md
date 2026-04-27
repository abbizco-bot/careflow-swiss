# CareFlow MVP Frontend Prototype Scope v0.1

## Zweck des MVP-Frontend-Prototyps

Der Prototyp soll CareFlow als Fuehrungs- und Decision-Layer verstaendlich machen.

Er soll zeigen:

- Tageslage
- stabile / attention / critical Lage
- betroffene Schichten
- Ursache in Fuehrungssprache
- Severity in Fuehrungssprache
- `effectiveCoverageGap`
- `effectiveQualificationGap`
- Planning Comparison als zweite Analyseebene

Er soll nicht zeigen:

- produktiven Import
- ReferencePlan-Freeze
- Rolling 28-Day View
- `DecisionOptionPreview` / Empfehlungen
- `PersonGapContext`
- PeriodClosing
- SpecialNeed / SpecialCompetence
- Architekturreserve-Type-Sketches

## Ausgangslage

Der aktuelle MVP ist Backend/API-basiert.

Die lokale MVP-Demo ist ueber `npm run seed:mvp` reproduzierbar.

Das MVP-Demo-Runbook ist dokumentiert.

Die MVP-relevanten API-Endpunkte sind:

- `GET /leadership/day?date=...`
- `GET /leadership/week?start=...&end=...`
- `GET /leadership/month?date=...`
- `GET /planning-months/:id/comparison`

Im Root-Projekt gibt es kein aktives Frontend-Setup.

Der lokale Ordner `careflow-frontend` ist nicht git-getrackt und wirkt wie ein lokales oder aelteres Build-Artefakt.

Stash-Frontend soll nicht uebernommen werden.

## Empfohlene erste View

Bevorzugter MVP-Frontend-Scope:

- Demo Scenario Switcher
- Leadership Day Detail als Hauptflaeche
- Planning Comparison als zweiter Tab oder separater Demo-Button

Ein reines Datumsfeld ist moeglich, aber fuer die Demo weniger stark.

Feste Demo-Buttons erzaehlen die geprueften Szenarien besser.

Die erste View soll die Demo-Story tragen, nicht das ganze Produkt.

## Demo-Szenario-Navigation

Empfohlene Demo-Buttons:

- Stabiler Tag
- Aufmerksamkeit
- Operative Unterdeckung
- Qualifikationsluecke
- Abwesenheitswirkung
- Gemischte Ursache
- Planning Comparison

Diese Buttons nutzen die Demo-Dates aus dem Seed-Script.

Planning Comparison nutzt die dynamisch ausgegebene `PlanningMonth.id`.

Die Navigation ist Demo-orientiert, nicht vollstaendige Produktnavigation.

## Fuehrungssprache

### Severity

- `none` -> Stabil
- `attention` -> Beobachten
- `critical` -> Kritisch

### Primary Cause

- `none` -> keine erkennbare Luecke
- `operational` -> operative Unterdeckung
- `absence` -> Abwesenheit wirkt auf Besetzung
- `request_context` -> unsichere oder angefragte Besetzung
- `mixed` -> mehrere Ursachen kombiniert

Fuehrungssprache dominiert.

Technische Codes koennen klein als Debug- oder API-Hinweis sichtbar sein, aber nicht als Hauptsprache.

Ein spaeteres Frontend sollte Codes in verstaendliche Fuehrungssprache uebersetzen.

## Sichtbare Felder

Sichtbar sinnvoll sind:

- Schichtlabel
- Schichttyp
- `plannedCount`
- `actualCount`
- `effectiveCoverageGap`
- `effectiveQualificationGap`
- Severity in Fuehrungssprache
- Primary Cause in Fuehrungssprache
- optional technische Codes klein/sekundaer
- Planning Comparison Zusammenfassung
- Planning Comparison Gap-Signale als erklaerte Codes oder sekundaere Details

## Nicht sichtbare Felder / bewusste Grenzen

Nicht sichtbar sein sollen:

- keine Namen
- keine `employeeIds`
- keine Abwesenheitsgruende
- keine `PersonGapContext`-Anzeige
- keine Schuld- oder Verursacherlogik
- keine Recommendation-Felder
- keine Approval-Felder
- keine Execution-Felder
- keine Import-Navigation
- keine ReferencePlan-Freeze-Navigation
- keine PeriodClosing-Navigation
- keine SpecialNeed- oder SpecialCompetence-Navigation
- keine Architekturreserve-Felder

## Technische Optionen

### Option A: Statische HTML/JS-Demo

Statische HTML/JS-Demo gegen bestehende API.

Vorteile:

- schnell
- wenig Tooling

Nachteile:

- begrenzt ausbaufaehig

### Option B: Kleines Vite/React-Projekt

Kleines Vite/React-Projekt.

Vorteile:

- besser ausbaufaehig

Nachteile:

- bringt bewusst neues Frontend-Tooling ins Repo

### Option C: API-Demo ohne Frontend

API-Demo ohne Frontend bleibt vorerst ausreichend.

Vorteile:

- schnellster Weg fuer technische Demonstration

Nachteile:

- weniger verstaendlich fuer nicht-technische Entscheider

Der bestehende lokale `careflow-frontend`-Ordner wird nicht als Basis uebernommen.

Die Entscheidung ueber Tooling erfolgt in einem spaeteren Schritt.

Dieses Dokument erzeugt keinen Frontend-Code.

## Risiken

Die wichtigsten Risiken sind:

- UI zeigt zu viele technische Codes.
- Fuehrungssprache fehlt.
- Architekturreserve wirkt wie fertige Produktfunktion.
- Planning Comparison wird als ReferencePlan-Freeze missverstanden.
- Fehlender Import wirkt wie Produktluecke.
- Feste Demo-Szenarien wirken kuenstlich ohne Fuehrungserzaehlung.
- Altes lokales Frontend-Artefakt wird unkontrolliert uebernommen.
- Frontend-Tooling blaeht den MVP zu frueh auf.

## Konsequenz

Dieses Dokument ist Scope und Governance, keine Implementierung.

Der naechste sinnvolle Schritt ist ein Wireframe- oder Textkonzept.

Noch kein Frontend-Code.

Noch keine Tooling-Entscheidung.

Noch keine neuen Dependencies.

Noch keine API-Erweiterung.

Keine Stash-Integration.

`careflow-frontend` wird nicht uebernommen.
