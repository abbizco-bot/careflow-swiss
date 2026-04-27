# CareFlow MVP Demo Scenarios v0.1

## Zweck der Demo-Szenarien

Die Demo-Szenarien sollen zeigen:

- CareFlow erkennt operative Risiken.
- CareFlow zeigt Coverage- und Qualification-Gaps.
- CareFlow unterscheidet Ursachenklassen.
- CareFlow zeigt Severity.
- CareFlow unterstuetzt Fuehrungssicht.
- CareFlow plant nicht automatisch.
- CareFlow bewertet keine Mitarbeitenden.
- CareFlow benoetigt fuer den MVP keinen produktiven Import.

## Reproduzierbarkeitsprinzip

Demo-Daten muessen spaeter reproduzierbar erzeugbar sein.

Lokale Zufallsdaten duerfen nicht Demo-Grundlage sein.

Demo-Dates sollen fest und stabil sein, nicht relativ zu "heute".

Demo-Dates duerfen futuristisch sein, damit sie nicht mit realen Daten kollidieren.

Test-Fixtures duerfen fachlich als Vorlage dienen, sollen aber nicht unkontrolliert mit Demo-Seeds gekoppelt werden.

Seed-Daten sollen spaeter idempotent oder klar resetbar sein.

Dieses Dokument erzeugt noch keine Seed-Daten.

## MVP-minimale Demo-Szenarien

### A. Stabiler Tag

Ziel:

- keine Unterdeckung
- `gap.primaryCause = none`
- `gap.severity = none`

Erwartete API:

- `GET /leadership/day?date=<stable-demo-date>`
- `day.shifts[].gap.primaryCause = "none"`
- `day.shifts[].gap.severity = "none"`

### B. Attention-Tag

Ziel:

- Request-Kontext ohne effektive Unterdeckung
- `gap.primaryCause = request_context`
- `gap.severity = attention`

Erwartete API:

- `GET /leadership/day?date=<attention-demo-date>`
- `day.shifts[].gap.primaryCause = "request_context"`
- `day.shifts[].gap.severity = "attention"`

### C. Critical Operational Gap

Ziel:

- operative Unterdeckung
- `effectiveCoverageGap > 0`
- `gap.primaryCause = operational`
- `gap.severity = critical`

Erwartete API:

- `GET /leadership/day?date=<operational-gap-demo-date>`
- `effectiveCoverageGap > 0`
- `severity = "critical"`

### D. Critical Qualification Gap

Ziel:

- Qualifikationsluecke
- `effectiveQualificationGap > 0`
- `severity = critical`

Erwartete API:

- `GET /leadership/day?date=<qualification-gap-demo-date>`
- `effectiveQualificationGap > 0`
- `severity = "critical"`

### E. Absence-Driven Gap

Ziel:

- ausreichend geplante Besetzung wird durch Abwesenheit unwirksam
- `gap.primaryCause = absence`
- `gap.severity = critical`

Erwartete API:

- `GET /leadership/day?date=<absence-gap-demo-date>`
- `primaryCause = "absence"`
- `severity = "critical"`

### F. Mixed Gap

Ziel:

- operative und abwesenheitsbezogene Signale kombiniert
- `gap.primaryCause = mixed`
- `gap.severity = critical`

Erwartete API:

- `GET /leadership/day?date=<mixed-gap-demo-date>`
- `primaryCause = "mixed"`
- `severity = "critical"`

### G. Planning Comparison Scenario

Ziel:

- `PlanningShiftTemplate` gegen operative Shifts vergleichen
- effective staffing sichtbar machen
- Gap-Signale sichtbar machen

Erwartete API:

- `GET /planning-months/:id/comparison`
- `comparisonStatus` sichtbar
- `assignedCount`, `availableAssignedCount` und `absentAssignedCount` sichtbar
- `effectiveCoverageGap` und `effectiveQualificationGap` sichtbar
- `primaryGapCause` und `primaryGapSignals` sichtbar

## Optionale zweite Demo-Stufe

Optional, aber nicht MVP-minimal:

- Qualification-Function-Warning als ruhiger Fuehrungskontext
- Week/Month View mit stabil/attention/critical-Verlauf
- Open-ended Absence / Open Incident als spaeteres Spezialthema
- Rolling 28-Day View erst spaeter
- ReferencePlan-Freeze erst spaeter
- produktiver Import erst spaeter

## Benoetigte Daten

Fuer die Demo-Szenarien werden benoetigt:

- Employees mit unterschiedlichen Qualifikationen
- `qualified true/false`
- `baseQualification`, falls sinnvoll
- Shifts mit `date`, `type`, `requiredCount`, `requiredQualifiedCount`
- Assignments mit `planned`, `sick`, `requested` oder aequivalenten Statuswerten
- Absences fuer absence-driven Szenarien
- AvailabilityRequests fuer request-context/attention
- PlanningMonth
- PlanningDay
- PlanningShiftTemplate
- optional `assignedFunction`/`baseQualification`-Kombination fuer Qualification-Function-Warnings

## Vorgeschlagene Demo-Date-Strategie

Feste Demo-Dates verwenden.

Demo-Dates sollen sprechend gruppiert werden.

Eine zusammenhaengende Demo-Woche oder ein Demo-Monat ist sinnvoll.

Bestehende Testdaten wie `uniqueYear-05-12`, `uniqueYear-05-13`, `uniqueYear-05-05` und `uniqueYear-05-16` koennen fachlich als Vorlage dienen.

`2082-08-11` ist als Smoke-Test-Beispiel bekannt, aber nicht automatisch Demo-Standard.

Konkrete finale Demo-Dates werden vor Seed-Implementierung entschieden.

## API-Demo-Endpunkte

Erste Demo-Endpunkte:

- `GET /leadership/day?date=...`
- `GET /leadership/week?start=...&end=...`
- `GET /leadership/month?date=...`
- `GET /planning-months/:id/comparison`

Wichtige Response-Ausschnitte:

- `day.headline`
- `day.shifts[].gap`
- `gap.primaryCause`
- `gap.severity`
- `effectiveCoverageGap`
- `effectiveQualificationGap`
- Planning Comparison `summary`
- Planning Comparison `days[].gapSignals`
- Planning Comparison `primaryGapCause` / `primaryGapSignals`, falls vorhanden

## Risiken

Die wichtigsten Risiken sind:

- Demo-Daten sind nicht reproduzierbar.
- Lokale Datenbank enthaelt Altlasten.
- Szenarien wirken kuenstlich, wenn sie nicht als Pflege-Fuehrungssituation erzaehlt werden.
- Zu viele Szenarien ueberladen den MVP.
- Demo zeigt technische Codes statt Fuehrungssprache.
- Fehlender Import wird als Produktluecke gelesen.
- Fehlender Frontend-Prototyp erschwert Verstaendnis fuer Nicht-Techniker.

## Konsequenz

Dieses Dokument ist ein Demo-Szenario-Zielbild.

Es ist kein Seed-Script.

Es ist kein Test-Fixture.

Es ist kein API-Kontrakt.

Naechster sinnvoller Schritt ist API-Contract-Dokumentation fuer Leadership Day und Planning Comparison.

Danach kann ein reproduzierbares Seed- oder Fixture-Konzept erstellt werden.
