# CareFlow MVP Scope v0.2

## Zweck des MVP

Der MVP soll CareFlow als Fuehrungs- und Decision-Layer demonstrieren.

CareFlow ist kein ERP.

CareFlow ist kein klassisches Dienstplanungssystem.

CareFlow erzeugt keine automatische Dienstplanung.

CareFlow bewertet keine Mitarbeitenden.

CareFlow erklaert operative Risiken, Ursachen und Dringlichkeit.

Der MVP fokussiert auf nachvollziehbare Fuehrungssicht, nicht auf vollstaendige Systemintegration.

## MVP Core

Die folgenden Bereiche gelten aktuell als MVP-reif oder produktiv/API-wirksam:

- Employee / Shift / Assignment Basics
- Absences und AvailabilityRequests als operative Kontextdaten
- Validations fuer Coverage, Qualification und Qualification-Function-Warnings
- PlanningMonth / PlanningDay / PlanningShiftTemplate
- Planning Comparison ueber `GET /planning-months/:id/comparison`
- Leadership Day/Week/Month View ueber:
  - `/leadership/day`
  - `/leadership/week`
  - `/leadership/month`
- Leadership Day View mit `day.shifts[].gap`:
  - `primaryCause`
  - `signals`
  - `effectiveCoverageGap`
  - `effectiveQualificationGap`
  - `severity`
- `gap.severity` als produktive Dringlichkeit:
  - `none`
  - `attention`
  - `critical`
- Gap Interpretation Helper produktiv genutzt in Leadership View und Planning Comparison

Die MVP-Erzaehlung ist:

- operative Schichten und Assignments auswerten
- Coverage- und Qualification-Gaps zeigen
- Ursachenklasse sichtbar machen
- Severity sichtbar machen
- Leadership Day View als Hauptsicht
- Planning Comparison als zweite Analyseansicht

## MVP Missing

Fuer eine ueberzeugende MVP-Demo fehlen noch:

- stabile Demo- oder Seed-Daten mit klaren Szenarien
- README/API-Dokumentation fuer tatsaechlich nutzbare Endpoints
- schlanker API-Contract-Ueberblick fuer Leadership Day und Planning Comparison
- klare Smoke- oder Demo-Testfaelle fuer:
  - stable / none
  - attention
  - critical
  - absence-driven gap
  - operational gap
  - mixed gap
- Entscheidung, ob der MVP lokal bleibt oder ein kleines Demo-Deployment braucht
- minimale Dashboard- oder Frontend-Anzeige nur falls der MVP nicht rein API-basiert demonstriert werden soll

## Import im MVP

Produktiver Import ist nicht Teil des ersten MVP.

Es gibt im MVP:

- keinen Parser
- keine Import-Route
- keinen Mapping-Service
- keine produktive Importintegration

Seed- oder Demo-Daten sind fuer den MVP zulaessig und wahrscheinlich sinnvoller.

Import-Dry-Run bleibt Architekturreserve.

## Post-MVP / Architekturreserve

Die folgenden Bereiche sollen ausdruecklich nicht in den ersten MVP gezogen werden:

- produktiver Import
- Parser
- Import-Route
- Mapping-Service
- DraftPlanCandidate-Builder
- ReferencePlan-Freeze / Freeze-Service
- Rolling Snapshot
- Rolling-View-Service
- DecisionOption-Engine
- Human-in-the-Loop-Workflow
- personenbezogene Gap-Ausgabe
- SpecialNeed / SpecialCompetence-Implementierung
- PeriodClosing / ClosedPeriod-Persistenz
- DB-Persistenz fuer neue Type-Sketches
- Frontend-Integration fuer Architekturreserve-Felder

ADR-075 gilt als Governance-Regel: Type-Sketches und ADR-Zielbilder sind keine API-Kontrakte, DB-Modelle oder fertigen Features.

## Risiken

Die wichtigsten Risiken sind:

- Zu viele vorbereitete Straenge wandern in den MVP und verwaessern die Demo.
- Architekturreserve wirkt unfertig, wenn sie sichtbar wird.
- Nutzer verwechseln CareFlow mit Dienstplanung statt Decision Layer.
- Fehlender Import wird als Produktluecke gelesen, wenn die MVP-Grenze nicht erklaert wird.
- Fehlender ReferencePlan-Freeze wird als Logikfehler gelesen, wenn die Abgrenzung nicht erklaert wird.
- Frontend zeigt zu viele technische Felder.
- Ohne gute Demo-Daten ist der Nutzen schwer erklaerbar.

## Naechste Arbeitsprioritaet

### Prioritaet 1

Stabile MVP-Demo- oder Seed-Daten definieren.

### Prioritaet 2

API-Contract-Dokumentation fuer Leadership Day und Planning Comparison erstellen.

### Prioritaet 3

README/API-Dokumentation aktualisieren.

### Prioritaet 4

Entscheiden, ob der MVP als lokale API-Demo oder als kleines Demo-Deployment gezeigt wird.

### Prioritaet 5

Minimalen Frontend- oder Dashboard-Prototyp erst nach stabiler API- und Demo-Datenbasis beginnen.

## Zusammenfassung

Der erste CareFlow-MVP soll die operative Fuehrungssicht demonstrieren: Schichten, Assignments, Abwesenheits- und Request-Kontext, Gap-Interpretation, Severity und Planning Comparison.

Die vorbereiteten Roadmap-Straenge bleiben bewusst Post-MVP, bis API-Vertrag, Datenmodell, Governance und Demo-Nutzen gesondert entschieden sind.
