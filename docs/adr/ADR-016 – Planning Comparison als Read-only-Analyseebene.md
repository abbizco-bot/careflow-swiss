# ADR-016 – Planning Comparison als Read-only-Analyseebene

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

CareFlow soll unterschiedliche Planungszustände oder Planungsaspekte vergleichen können, ohne dadurch operative Daten zu verändern.

Eine Vergleichslogik ist wichtig, um geplante Besetzung, benötigte Besetzung, Anfragen, Abweichungen oder spätere Periodenvergleiche sichtbar zu machen.

Solche Analysen dürfen jedoch nicht unbeabsichtigt Assignment-, Validierungs- oder Planungslogik verändern.

## Entscheidung

Planning Comparison wird als Read-only-Analyseebene behandelt.

Diese Ebene liest vorhandene Daten, berechnet Vergleichsinformationen und gibt beschreibende Ergebnisse zurück.

Sie verändert keine Schichten, Assignments, Verfügbarkeiten oder Validierungsregeln.

## Begründung

Read-only-Disziplin schützt die Stabilität des Systems.

Eine Vergleichsansicht soll Führung unterstützen, aber keine operativen Seiteneffekte erzeugen.

Dadurch bleibt klar:

- operative Daten werden in den zuständigen Modulen verändert
- Vergleichslogik beschreibt Zustände
- keine versteckte Planänderung durch Analyse

## Konsequenzen

Planning Comparison darf:

- Daten lesen
- Unterschiede berechnen
- Kennzahlen ausgeben
- Hinweise erzeugen
- Vergleiche darstellen

Planning Comparison darf nicht:

- Assignments erzeugen
- Assignments verändern
- Schichten ändern
- Status überschreiben
- Validierungsregeln ändern

## Nicht-Ziele

Diese ADR führt nicht ein:

- automatische Planoptimierung
- Rückschreibung in operative Planung
- vollständige Planungsgüte
- vollständigen Periodenabschluss

## Zusammenfassung

Planning Comparison ist eine reine Analyseebene. Sie liest und vergleicht vorhandene Daten, verändert aber keine operativen Planungsdaten.