# ADR-009 – CSV- und Excel-Import als MVP-Integrationsweg

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

CareFlow soll Pflegeheime bei der Validierung und Führung von Einsatz- und Dienstplänen unterstützen. In vielen Heimen werden Monatspläne bereits in bestehenden Systemen wie Polypoint, Excel oder anderen Fachanwendungen erstellt.

Für den MVP ist eine direkte API-Integration mit allen möglichen Planungssystemen nicht realistisch. Gleichzeitig soll CareFlow früh mit echten oder realitätsnahen Planungsdaten getestet werden können.

Daher braucht CareFlow einen einfachen, pragmatischen Integrationsweg.

## Entscheidung

CareFlow unterstützt im MVP den Import von Planungsdaten über CSV- oder Excel-nahe Strukturen.

CSV/Excel wird als pragmatischer erster Integrationsweg gewählt, weil viele Heime solche Exporte bereits erzeugen können oder mit vertretbarem Aufwand bereitstellen können.

CareFlow ersetzt damit nicht das Ursprungssystem, sondern liest exportierte Planungsdaten ein und verarbeitet sie für Validierung, Leadership View und spätere Auswertungen.

## Begründung

CSV- und Excel-Daten ermöglichen einen frühen Praxistest ohne komplexe Schnittstellenentwicklung.

Dieser Ansatz erlaubt:

- schnelle Pilotierung
- einfache Datenübergabe durch Heime
- geringe technische Einstiegshürde
- Testbarkeit mit realen Monatsplänen
- spätere Erweiterbarkeit Richtung API-Integration

Der CSV-/Excel-Import ist bewusst als MVP-Lösung zu verstehen, nicht als endgültige Integrationsarchitektur.

## Konsequenzen

CareFlow soll Importdaten strukturiert prüfen und in interne Modelle überführen.

Langfristig sollen folgende Daten importierbar sein:

- Mitarbeitende
- Schichten
- Assignments
- Qualifikationen
- Tagesfunktionen
- Abwesenheiten
- Planperiode
- organisatorischer Bereich

Im MVP genügt eine reduzierte Importlogik, solange sie die zentrale Validierung ermöglicht.

## Nicht-Ziele

Diese ADR entscheidet nicht über:

- vollständige Polypoint-API-Integration
- bidirektionale Synchronisation
- automatische Rückschreibung in Planungssysteme
- vollständige Datenmigration
- produktive Schnittstellen zu allen Heimsystemen

## Zusammenfassung

CSV- und Excel-Importe bilden den pragmatischen MVP-Integrationsweg. CareFlow kann dadurch früh mit realen oder realitätsnahen Plandaten arbeiten, ohne sofort komplexe Schnittstellen bauen zu müssen.
