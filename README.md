# CareFlow MVP

CareFlow ist ein Fuehrungs- und Entscheidungsinstrument fuer Pflegeheime. Es ist als Leadership- und Decision-Layer konzipiert, nicht als ERP-, Payroll- oder HR-System.

Der MVP macht operative Personallage, Qualifikationsabdeckung, Tagesfunktionen und erkennbare Risiken lesbar. CareFlow soll Fuehrungspersonen unterstuetzen, ohne automatische Disposition oder verdeckte Entscheidungslogik einzufuehren.

## Aktueller Stand

- Backend/API auf Node.js, TypeScript, Express, PostgreSQL und Prisma.
- Aktive Backend-Quelle unter `src`.
- Aktive Demo- und Praesentations-Frontend-Linie unter `frontend`.
- `frontend/dist` ist der aktuelle Build-Stand, der fuer die manuell deployte Demo unter `demo.careflow-swiss.ch` verwendet wird.
- Fruehere backend-integrierte Leadership-Day-MVP-Frontend-Linie unter `apps/careflow-mvp-frontend`.
- Integrationstests und Modul-Tests bilden den fachlichen Test-Harness.
- `Employee.baseQualification` beschreibt die stabile Grundqualifikation einer Person.
- `Assignment.assignedFunction` beschreibt die operative Tagesfunktion in einer konkreten Zuteilung.
- Die Full Validation zeigt unzulaessige Kombinationen aus Grundqualifikation und Tagesfunktion als `qualification-function` warning.
- Assignments werden durch diese Pruefung nicht automatisch blockiert.
- Die Leadership Day View zeigt Funktionshinweise fuehrungstauglich an.
- Governance-Dokumente liegen unter `docs/governance/`.
- Technische Dokumentation liegt unter `docs/technical/`.

## Aktive Repository-Struktur

- `src`: aktive Backend/API-Quelle.
- `prisma/schema.prisma`: aktive Prisma-Datenmodellierung.
- `frontend`: aktive erweiterte Demo- und Praesentations-Frontend-Linie.
- `apps/careflow-mvp-frontend`: frueheres backend-integriertes Leadership-Day-MVP-Frontend; als Referenz und moegliche Migrationsquelle behalten.
- `docs/technical/README.md`: Einstieg in die technische Dokumentation.
- `docs/indexes/careflow-implementation-index.md`: Index der aktiven Implementierungsbereiche.

## Build-Outputs und nicht als Quelle verwenden

- `dist`: generierter Backend-Build-Output.
- `frontend/dist`: generierter Build der aktiven Demo; aktuell fuer die manuelle Demo-Deployment-Quelle verwendet, aber nicht manuell editieren.
- `apps/careflow-mvp-frontend/dist`: generierter Build des frueheren Leadership-Day-MVP-Frontends.
- `node_modules`: Abhaengigkeiten.
- `src/generated`: generierter Prisma-Client.
- `careflow-frontend`: alter/generated Frontend-Ordner; nicht als aktive Basis uebernehmen.

## Build und lokale Entwicklung

Backend-Build aus dem Repository-Root:

```bash
npm.cmd run build
```

Backend lokal starten:

```bash
npm.cmd run dev
```

Demo-Daten werden lokal erzeugt mit:

```bash
npm.cmd run seed:mvp
```

`npm.cmd run seed:mvp` ist nur fuer lokale Demo- und Entwicklungsdaten gedacht. Nicht gegen Produktivdatenbanken ausfuehren.

Aktive Demo-Frontend-Befehle:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

Frueheres Leadership-Day-MVP-Frontend als Referenz lokal starten oder bauen:

```bash
cd apps/careflow-mvp-frontend
npm.cmd run dev
npm.cmd run build
```

## Fachliche Grundsaetze

CareFlow trennt bewusst zwischen Daten, expliziter Regelpruefung und fuehrungstauglicher Verdichtung.

- Die fachliche Wahrheit entsteht im Backend durch strukturierte Daten, nachvollziehbare Validierungen und explizite Regeln.
- Sprachliche oder visuelle Verdichtung darf erklaeren, aber keine neue fachliche Wahrheit erzeugen.
- Human-in-the-loop bleibt verbindlich.
- Warnungen muessen erklaerbar und auf konkrete Backend-Fakten zurueckfuehrbar sein.
- Read-only-Fuehrungssichten duerfen keine Planung, Assignments oder Validierungen veraendern.

## Qualifikation und Tagesfunktion

CareFlow unterscheidet zwischen stabiler Grundqualifikation und tagesbezogener Funktion.

`Employee.baseQualification` ist die fachlich stabilere Stammdatenlogik. Sie ist vorbereitet und wird in der Qualification-Function-Regelbasis verwendet.

`Assignment.assignedFunction` beschreibt die operative Rolle fuer eine konkrete Schicht oder Zuteilung, zum Beispiel Pflegeleitung, Hausverantwortung, Tagesverantwortung, Pflegedienst, Springer, Lernende, Externe oder Andere.

`Employee.qualified` und `Employee.qualificationLevel` bleiben vorerst aus Kompatibilitaetsgruenden erhalten. `Employee.qualified` bleibt aktuell die operative Zaehlgrundlage fuer `requiredQualifiedCount`. Eine spaetere Migration auf `baseQualification` wird separat entschieden.

## Wichtige API-Bereiche

- `GET /leadership/day?date=...` wird vom frueheren backend-integrierten Leadership-Day-MVP-Frontend genutzt.
- `GET /validations/shifts/overview?date=...` beantwortet die taegliche Versorgungslage.
- `GET /validations/employees/overview?date=...` beantwortet die taegliche Personallage.
- `GET /validations/shifts/full?date=...` liefert die vollstaendige Schichtsicht inklusive Qualification-Function-Warnungen.

Der Full-Endpoint orchestriert bestehende Validations. Er soll fachliche Warnungen sichtbar machen, aber keine Assignments blockieren oder veraendern.

## Demo- und Frontend-Linien

CareFlow besitzt aktuell zwei Frontend-Linien mit unterschiedlichem Zweck.

Die aktive Demo- und Praesentations-Frontend-Linie liegt unter `frontend`. Sie ist die aktuell verwendete Demo fuer die Pilotpraesentation und enthaelt unter anderem:

- rollierende Fuehrungsuebersicht
- Tages- und Wochenansichten
- Abweichungen
- Interventionen
- Mitarbeitenden- und Personalsichten
- QM-Situation
- Simulation
- Sensitivitaetsanalyse
- Assessment-Kontext
- BESA/interRAI-Kontext

Diese aktive Demo-Linie ist nicht automatisch gleichbedeutend mit einer produktionsreifen SaaS-Frontend-Architektur. Teile der Demo koennen praesentationsorientiert oder lokal modelliert sein und sind nicht zwingend vollstaendig durch produktionsreife Backend-APIs gedeckt.

Das fruehere Leadership-Day-MVP-Frontend liegt unter `apps/careflow-mvp-frontend`. Es bleibt als reduzierte, backend-integrierte Referenz fuer die Leadership-Day-Demo erhalten und zeigt aktuell die Nutzung bestehender Backend-MVP-Endpunkte.

Das fruehere Leadership-Day-MVP umfasst:

- stable day
- attention/request-context day
- critical operational gap
- critical qualification gap
- absence-driven gap
- mixed gap
- planning comparison scenario im Backend/API-Kontext

Die fruehere MVP-Referenz nutzt insbesondere diese API-Bereiche:

- `/leadership/day`
- `/leadership/week`
- `/leadership/month`
- `/planning-months/:id/comparison`

Der reproduzierbare Ablauf ist im Runbook dokumentiert:

- `docs/governance/mvp-demo-runbook-v0.1.md`

Ergaenzende Governance-Dokumente:

- `docs/governance/mvp-scope-v0.2.md`
- `docs/governance/mvp-demo-scenarios-v0.1.md`
- `docs/governance/mvp-api-contract-v0.1.md`
- `docs/governance/mvp-demo-seed-strategy-v0.1.md`
- `docs/governance/mvp-demo-runbook-v0.1.md`

Die MVP-Demo enthaelt bewusst keinen produktiven Import, keine automatische Dienstplanung, keine personenbezogene Gap-Ausgabe, keinen ReferencePlan-Freeze, kein PeriodClosing und kein produktives SaaS-Frontend.

## Deployment

Das aktuelle Demo-Deployment ist manuell.

Im Repository existiert aktuell kein CI/CD-Workflow und kein Deployment-Script fuer die aktive Demo. `frontend/dist` ist der Build-Stand, der derzeit als Quelle fuer das Demo-Deployment verwendet wird.

## Tests

Die Tests laufen ueber den bestehenden npm-Test-Harness.

```bash
npm.cmd test -- --run
```

Fuer gezielte Pruefungen koennen einzelne Modul- oder Integrationstests ausgefuehrt werden, zum Beispiel:

```bash
npm.cmd test -- src/modules/validations
```

Tests dienen in CareFlow nicht nur der technischen Stabilitaet. Sie dokumentieren auch fachliche Wahrheit, besonders bei Besetzung, Qualifikation, Tagesfunktion, Abwesenheiten und Leadership View.

## Governance und technische Dokumentation

Die aktuellen Governance-Dokumente liegen hier:

- `docs/governance/ki-einsatzmatrix-v0.1.md`
- `docs/governance/entwicklungszyklus-v0.1.md`

Sie definieren die Grenzen von KI-Nutzung, Human-in-the-loop-Verantwortung und den Standardablauf fuer fachlich relevante Entwicklungsschritte.

Technische Dokumentation:

- `docs/technical/README.md`
- `docs/indexes/careflow-implementation-index.md`
- `docs/adr/ADR-110 – Active Demo Frontend and Frontend Consolidation Boundary.md`

## Bewusst nicht Teil des MVP

- automatische Planung
- automatische Assignment-Generierung
- automatische Assignment-Blockierung durch Qualification-Function-Warnungen
- Payroll oder Zeiterfassung
- HR-Self-Service
- Forecasts, Scores oder Empfehlungslogik ohne explizite fachliche Entscheidung
- automatische Deployment-Pipeline
- finale SaaS-Frontend-Architektur

CareFlow bleibt fokussiert auf Pflegeheim-Monatsplanung, operative Lagebilder, erklaerbare Warnungen und Fuehrungsentscheidungen.
