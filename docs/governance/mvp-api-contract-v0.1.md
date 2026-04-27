# CareFlow MVP API Contract v0.1

## Zweck dieses API-Contracts

Dieses Dokument beschreibt nur die fuer die MVP-Demo relevanten Endpunkte.

Es ist kein vollstaendiger OpenAPI-Ersatz.

Es dokumentiert keine vorbereiteten Type-Sketches als API.

Es macht keine Post-MVP-Features sichtbar.

Es dient der Demo-Stabilitaet und Erklaerbarkeit.

## MVP-relevante Endpunkte

Fuer die MVP-Demo relevant sind:

- `GET /leadership/day?date=YYYY-MM-DD`
- `GET /leadership/week?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET /leadership/month?date=YYYY-MM-DD`
- `GET /planning-months/:id/comparison`

Nicht Teil des MVP-API-Contracts:

- kein Import-Endpunkt
- kein ReferencePlan-Freeze-Endpunkt
- kein Rolling-View-Endpunkt
- kein DecisionOption-Endpunkt
- kein PersonGapContext-Endpunkt
- kein PeriodClosing-Endpunkt

## Leadership Day Contract

### Demo-relevante Felder

`day.headline`:

- `title`
- `detail`
- `contextLine`

`day.shifts[]`:

- `type`
- `label`
- `plannedCount`
- `actualCount`
- `qualification.status`
- `gap.primaryCause`
- `gap.signals`
- `gap.effectiveCoverageGap`
- `gap.effectiveQualificationGap`
- `gap.severity`

### Bedeutung

`primaryCause` beschreibt die erkannte Ursachenklasse.

`signals` sind technische Erklaerungscodes.

`effectiveCoverageGap` zeigt die wirksame personelle Luecke.

`effectiveQualificationGap` zeigt die wirksame Qualifikationsluecke.

`severity` ist Fuehrungsdringlichkeit, keine Empfehlung.

### Moegliche Werte

`primaryCause`:

- `none`
- `operational`
- `absence`
- `request_context`
- `mixed`

`severity`:

- `none`
- `attention`
- `critical`

### Grenzen

Leadership Day Gap enthaelt keine Namen.

Leadership Day Gap enthaelt keine personenbezogenen Schuldzuweisungen.

Leadership Day Gap erzeugt keine automatische Planaenderung.

`contextLine` bleibt getrennt von `gap`.

## Leadership Week / Month Contract

Week und Month dienen der aggregierten Fuehrungssicht.

Sie sind fuer die MVP-Demo nuetzlich, aber die Day View bleibt die Hauptsicht.

Week und Month duerfen nicht als Rolling 28-Day View missverstanden werden.

Rolling 28-Day View ist vorbereitet, aber kein MVP-Endpunkt.

Demo-relevante Felder sind:

- ausgewaehltes Datum oder Datumsbereich
- aggregierte Situation
- Tagesliste oder Tagesgruppen
- Tagesdatum
- Tagesstatus oder Situation

Die MVP-Demo sollte Week und Month als Kontext zeigen, nicht als Detailanalyse.

## Planning Comparison Contract

Endpoint:

- `GET /planning-months/:id/comparison`

Demo-relevante Felder:

- `comparisonStatus`
- `days[]`
- `operationalShifts[]`
- `assignedCount`
- `availableAssignedCount`
- `absentAssignedCount`
- `qualifiedAssignedCount`
- `availableQualifiedCount`
- `effectiveCoverageGap`
- `effectiveQualificationGap`
- `primaryGapCause`
- `primaryGapSignals`
- `gapSignals`

Planning Comparison vergleicht `PlanningShiftTemplate` gegen operative Shifts.

Planning Comparison ist read-only.

Planning Comparison erzeugt keinen `ReferencePlan`.

Planning Comparison friert nichts ein.

Planning Comparison erzeugt keine operativen Shifts.

Planning Comparison ist kein Periodenabschluss.

## Technische Codes und Fuehrungssprache

`primaryCause`, `signals` und `gapSignals` sind technische Codes.

Fuer die MVP-Demo duerfen sie sichtbar sein, muessen aber erklaert werden.

Ein spaeteres Frontend sollte diese Codes in verstaendliche Fuehrungssprache uebersetzen.

Die API trifft keine Entscheidungen.

## Abgrenzung zu Architekturreserve

Nicht Teil dieses MVP-API-Contracts:

- `ImportDryRun`
- `MappingProfile`
- `ReferencePlanSnapshot`
- `PersonGapContext`
- `DecisionOptionPreview`
- `RollingPlanningView`
- `ClosedPeriodReview`
- `SpecialNeed`
- `SpecialCompetence`

ADR-075 gilt: Type-Sketches sind keine API-Kontrakte.

## Risiken

Die wichtigsten Risiken sind:

- technische Codes werden ohne Erklaerung missverstanden
- `severity` wird als Empfehlung gelesen
- Planning Comparison wird als `ReferencePlan` freeze missverstanden
- Week/Month View wird als Rolling View missverstanden
- fehlender Import-Endpunkt wird als Produktluecke gelesen
- API-Demo ohne Fuehrungssprache wirkt zu technisch

## Konsequenz

Dieses Dokument stabilisiert die MVP-Demo-API.

Es erzeugt keine neue API.

Es aendert keine bestehende API.

Es ersetzt keine spaetere OpenAPI-Dokumentation.

Naechster Schritt kann ein Demo-Seed- oder Fixture-Konzept sein.
