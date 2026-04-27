# CareFlow MVP Frontend Wireframe and Copy Concept v0.1

## Ziel der Oberflaeche

Die Oberflaeche soll CareFlow als Fuehrungs- und Decision-Layer verstaendlich machen.

Sie soll zeigen:

- Was ist die aktuelle Tageslage?
- Ist die Lage stabil, beobachtungsbeduerftig oder kritisch?
- Welche Schichten sind betroffen?
- Welche Ursache wird erkannt?
- Welche Luecke ist wirksam?
- Wie unterscheidet sich Planung von operativer Lage?

Sie soll nicht zeigen:

- vollstaendige Dienstplanung
- personenbezogene Verantwortlichkeit
- Import
- ReferencePlan-Freeze
- DecisionOption-Ausfuehrung
- PeriodClosing
- Architekturreserve-Funktionen

## Ausgangslage

`docs/governance/mvp-frontend-prototype-scope-v0.1.md` definiert den Scope.

Der MVP ist lokal ueber `npm run seed:mvp` reproduzierbar.

Die MVP-Demo-Endpunkte funktionieren.

Es gibt noch kein aktives Frontend im Repository.

Der bestehende lokale `careflow-frontend`-Ordner wird nicht uebernommen.

Dieses Dokument ist noch keine Implementierung.

## Empfohlene Seitenstruktur

### A. Header

Text:

- CareFlow MVP Demo
- Fuehrungs- und Decision-Layer fuer operative Personallage

Zweck:

- Produktkontext setzen
- klarstellen, dass die Demo Fuehrungslage zeigt
- keine Produktnavigation vortaeuschen

### B. Scenario Switcher

Buttons:

- Stabiler Tag
- Aufmerksamkeit
- Operative Unterdeckung
- Qualifikationsluecke
- Abwesenheitswirkung
- Gemischte Ursache
- Planning Comparison

Zweck:

- stabile Demo-Szenarien direkt aufrufbar machen
- keine vollstaendige Navigation vortaeuschen
- Demo-Erzaehlung fuehren

### C. Main Panel: Leadership Day

Inhalt:

- Tagesheadline
- Lagebadge
- kurzer Erklaerungstext
- Schichtkarten

Zweck:

- Tageslage auf einen Blick zeigen
- betroffene Schichten sichtbar machen
- Ursache und Dringlichkeit fuehrungstauglich erklaeren

### D. Shift Cards

Pro Schicht:

- Schichtlabel
- geplante Besetzung
- wirksame Besetzung
- Coverage Gap
- Qualification Gap
- Ursache
- Severity
- optional technische Codes klein anzeigen

Zweck:

- operative Lage je Schicht lesbar machen
- Luecken und Ursachen erklaerbar darstellen
- keine Planung oder Zuteilung anbieten

### E. Secondary Panel / Tab: Planning Comparison

Inhalt:

- Planungsrahmen vs operative Lage
- Summary
- betroffene Tage / Schichten
- Gap-Signale als sekundaere Details

Zweck:

- zweite Analyseebene sichtbar machen
- Planungsrahmen und operative Realitaet vergleichbar machen
- nicht als ReferencePlan-Freeze darstellen

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

### Kurze Erklaerungstexte

Stabil:

> Die geplante Besetzung ist wirksam abgedeckt.

Beobachten:

> Es gibt einen relevanten Kontext, aber noch keine wirksame Unterdeckung.

Kritisch:

> Es besteht eine wirksame Luecke in Besetzung oder Qualifikation.

## Demo-Szenario-Copy

Stabiler Tag:

- zeigt Normalzustand ohne Gap

Aufmerksamkeit:

- zeigt einen Request-Kontext ohne wirksame Unterdeckung

Operative Unterdeckung:

- zeigt eine direkte personelle Unterdeckung

Qualifikationsluecke:

- zeigt eine wirksame Qualifikationsluecke

Abwesenheitswirkung:

- zeigt, wie Abwesenheit geplante Besetzung unwirksam macht

Gemischte Ursache:

- zeigt mehrere Ursachen in einer Lage

Planning Comparison:

- zeigt Planungsrahmen im Vergleich zur operativen Lage

## Sichtbare Felder

### Primaer sichtbar

- `headline.title`
- `headline.detail`
- `headline.contextLine`
- `shift.label`
- `shift.plannedCount`
- `shift.actualCount`
- `shift.qualification.status`
- `gap.severity` in Fuehrungssprache
- `gap.primaryCause` in Fuehrungssprache
- `gap.effectiveCoverageGap`
- `gap.effectiveQualificationGap`

### Sekundaer sichtbar

- `gap.signals`
- technische `primaryCause`/`severity`-Codes
- Planning Comparison `gapSignals`

### Nicht sichtbar

- `employeeName`
- `employeeId`
- `absenceReason`
- `PersonGapContext`
- `DecisionOptionPreview`
- `ReferencePlanSnapshot`
- `ClosedPeriodReview`
- `SpecialNeed` / `SpecialCompetence`
- `ImportDryRun`

## Layout-Idee

Die Demo kann mit einer linken oder oberen Demo-Szenario-Navigation arbeiten.

Die zentrale Flaeche zeigt die Tagesansicht.

Eine rechte Info- oder Erklaerungsspalte kann den ausgewaehlten Demo-Fall erklaeren.

Alternativ kann ein unterer Detailbereich technische Details aufnehmen.

Planning Comparison sollte als separater Tab oder Button erreichbar sein.

Kritische Lage soll visuell deutlich, aber nicht alarmistisch erscheinen.

Technische Details sollen einklappbar oder klein dargestellt werden.

## Tonalitaet

Die Oberflaeche soll wirken:

- ruhig
- fuehrungsorientiert
- nicht alarmistisch
- nicht schuldzuweisend
- klar in den Begriffen
- nicht uebertechnisiert
- nicht personalisierend

## Risiken

Die wichtigsten Risiken sind:

- UI zeigt API-Codes zu prominent.
- Kritisch wirkt wie automatische Anweisung.
- Fehlender Import wird als Luecke verstanden.
- Demo-Buttons wirken kuenstlich ohne Erklaerung.
- Planning Comparison wird als ReferencePlan-Freeze gelesen.
- Schichtkarten wirken wie Dienstplanung statt Fuehrungslage.
- Technische Details ueberfordern Entscheider.

## Konsequenz

Dieses Dokument ist Wireframe- und Copy-Konzept, keine Implementierung.

Kein Tooling ist entschieden.

Kein Frontend-Code wird dadurch erzeugt.

Naechster Schritt kann ein Tooling-Audit sein:

- statisches HTML/JS
- Vite/React
- API-Demo ohne Frontend

Alternativ kann direkt ein minimaler statischer Prototyp geplant werden, aber erst nach gesonderter Entscheidung.
