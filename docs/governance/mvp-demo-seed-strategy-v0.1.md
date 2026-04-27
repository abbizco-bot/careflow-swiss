# CareFlow MVP Demo Seed Strategy v0.1

## Grundentscheidung

Fuer den MVP soll spaeter ein separates Demo-Seed-Script verwendet werden.

Die Demo darf nicht auf manuellen lokalen DB-Daten basieren.

Die Demo darf nicht direkt an Integrationstest-Fixtures gekoppelt werden.

Die Demo darf keine produktive Importlogik benoetigen.

Die Demo darf nicht von "heute" abhaengen.

Die Demo darf keine zufaelligen Demo-Dates verwenden.

Die Demo darf keine real wirkenden personenbezogenen Daten enthalten.

## Ausgangslage

Es gibt aktuell kein `prisma/seed.*`.

Es gibt aktuell kein Seed-Script in `package.json`.

Gute fachliche Szenarien existieren in Integrationstests, insbesondere:

- `leadership-view.integration.test.ts`
- `planning-comparison.integration.test.ts`

Diese Testdaten sind fachlich wertvoll, aber nicht direkt als Demo-Daten geeignet.

Gruende:

- dynamische Jahre
- Zufallssuffixe
- testlokale Cleanup-Logik
- starke Kopplung an Assertions und Testaufbau

Lokale DB-Daten sind nicht versioniert, nicht reproduzierbar und duerfen nicht Demo-Grundlage sein.

`docs/governance/mvp-demo-scenarios-v0.1.md` definiert die Demo-Szenarien.

`docs/governance/mvp-api-contract-v0.1.md` definiert die relevanten Demo-API-Ausschnitte.

## Empfohlene technische Strategie

Als spaetere Zielrichtung wird empfohlen:

- eigenes Demo-Seed-Script, z. B. `npm run seed:mvp`
- feste Demo-Daten
- isolierter Demo-Year
- idempotent oder klar resetbar
- Seed loescht eigene Demo-Daten zuerst
- Seed erzeugt die Demo-Szenarien reproduzierbar neu
- Integrationstests dienen nur als fachliche Vorlage
- PlanningMonth-ID wird nach Seed ausgegeben, weil `/planning-months/:id/comparison` dynamische IDs verwendet

Dieses Dokument implementiert das noch nicht.

Die technische Umsetzung folgt in einem spaeteren Schritt.

## Empfohlener Demo-Year

Fuer den MVP wird ein isoliertes Demo-Jahr empfohlen, z. B. `2088`.

Das Demo-Year liegt bewusst weit in der Zukunft, damit keine realen oder lokalen Daten kollidieren.

Demo-Dates sind stabil und nicht relativ zu "heute".

`2082-08-11` bleibt ein bekanntes Smoke-Test-Beispiel, wird aber nicht automatisch Demo-Standard.

## Empfohlene Demo-Dates

Als Zielbild werden folgende Demo-Dates empfohlen:

- Stable day: `2088-05-12`
- Attention/request-context: `2088-05-13`
- Critical operational gap: `2088-05-05`
- Critical qualification gap: `2088-05-06`
- Absence-driven gap: `2088-05-16`
- Mixed gap: `2088-05-07`
- Optional Qualification-Function-Warning: `2088-05-15`
- Planning Comparison scenario: `2088-06-01` bis `2088-06-04`

Die finalen Demo-Dates koennen vor Seed-Implementierung nochmals geprueft werden.

Die sieben Kernfaelle reichen fuer die erste MVP-Demo.

## Reset- und Idempotenzstrategie

Demo-Daten sollen klar isoliert sein.

Wo moeglich sollen Demo-Prefixe oder Demo-Namen verwendet werden.

Wo moeglich sollen Metadaten, Notizen oder Marker verwendet werden, falls das Schema solche Felder bietet.

Wo Marker fehlen, sollen feste Demo-Zeitraeume verwendet werden.

Reset loescht nur klar erkennbare Demo-Daten.

Empfohlene Reset-Reihenfolge:

1. Assignments
2. Absences
3. AvailabilityRequests
4. Shifts
5. PlanningMonth / PlanningDay / PlanningShiftTemplate
6. Demo-Employees

Spaeter soll der Reset idealerweise in einer Transaktion laufen.

## Demo-Personen

Demo-Mitarbeitende sollen pseudonymisiert und klar als Demo erkennbar sein.

Keine echten Namen verwenden.

Keine realen Personalnummern verwenden.

Keine sensiblen personenbezogenen Informationen verwenden.

Leadership-Gap-Ausgabe bleibt weiterhin nicht personenbezogen.

## MVP-Demo-Szenarien

Der Seed soll spaeter mindestens folgende Szenarien erzeugen:

- Stabiler Tag
- Attention/request-context Tag
- Critical operational gap
- Critical qualification gap
- Absence-driven gap
- Mixed gap
- Planning Comparison scenario

Optional:

- Qualification-Function-Warning

## Risiken

Die wichtigsten Risiken sind:

- Demo-Seed ueberschreibt echte lokale Daten.
- Demo-Daten kollidieren mit lokalen Altlasten.
- Seed ist nicht idempotent und erzeugt doppelte Szenarien.
- Test-Fixtures und Demo-Daten werden zu eng gekoppelt.
- Dynamische PlanningMonth-IDs erschweren dokumentierte API-Aufrufe.
- Demo-Namen wirken wie echte Mitarbeitende.
- Zu viele Szenarien ueberladen den MVP.
- Demo-Daten wirken kuenstlich, wenn sie nicht als Fuehrungssituationen erklaert werden.

## Konsequenz

Dieses Dokument ist Strategie, keine Implementierung.

Naechster technischer Schritt darf ein separates Demo-Seed-Script sein.

Kein produktiver Import.

Kein Parser.

Keine Import-Route.

Kein Mapping-Service.

Keine API-Erweiterung.

Keine DB-Migration.

Seed-Implementierung muss vor Commit mit Build und Tests geprueft werden.
