# CareFlow MVP

CareFlow ist ein Fuehrungs- und Entscheidungsinstrument fuer Pflegeheime. Es ist als Leadership- und Decision-Layer konzipiert, nicht als ERP-, Payroll- oder HR-System.

Der MVP macht operative Personallage, Qualifikationsabdeckung, Tagesfunktionen und erkennbare Risiken lesbar. CareFlow soll Fuehrungspersonen unterstuetzen, ohne automatische Disposition oder verdeckte Entscheidungslogik einzufuehren.

## Aktueller Stand

- Backend auf Node.js, TypeScript, PostgreSQL und Prisma.
- Integrationstests und Modul-Tests bilden den fachlichen Test-Harness.
- `Employee.baseQualification` beschreibt die stabile Grundqualifikation einer Person.
- `Assignment.assignedFunction` beschreibt die operative Tagesfunktion in einer konkreten Zuteilung.
- Die Full Validation zeigt unzulaessige Kombinationen aus Grundqualifikation und Tagesfunktion als `qualification-function` warning.
- Assignments werden durch diese Pruefung nicht automatisch blockiert.
- Die Leadership Day View zeigt Funktionshinweise fuehrungstauglich an.
- Governance-Dokumente liegen unter `docs/governance/`.

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

- `GET /validations/shifts/overview?date=...` beantwortet die taegliche Versorgungslage.
- `GET /validations/employees/overview?date=...` beantwortet die taegliche Personallage.
- `GET /validations/shifts/full?date=...` liefert die vollstaendige Schichtsicht inklusive Qualification-Function-Warnungen.

Der Full-Endpoint orchestriert bestehende Validations. Er soll fachliche Warnungen sichtbar machen, aber keine Assignments blockieren oder veraendern.

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

## Governance

Die aktuellen Governance-Dokumente liegen hier:

- `docs/governance/ki-einsatzmatrix-v0.1.md`
- `docs/governance/entwicklungszyklus-v0.1.md`

Sie definieren die Grenzen von KI-Nutzung, Human-in-the-loop-Verantwortung und den Standardablauf fuer fachlich relevante Entwicklungsschritte.

## Bewusst nicht Teil des MVP

- automatische Planung
- automatische Assignment-Generierung
- automatische Assignment-Blockierung durch Qualification-Function-Warnungen
- Payroll oder Zeiterfassung
- HR-Self-Service
- Forecasts, Scores oder Empfehlungslogik ohne explizite fachliche Entscheidung

CareFlow bleibt fokussiert auf Pflegeheim-Monatsplanung, operative Lagebilder, erklaerbare Warnungen und Fuehrungsentscheidungen.
