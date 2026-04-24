# ADR-025 – Ereignisbasierte Planänderungen

## Status

Proposed

## Kontext

In der laufenden Planperiode treten regelmässig Ereignisse auf, die den ursprünglich geplanten Dienstplan verändern.

Typische Beispiele sind:

- Krankmeldungen
- entschuldigte Absenzen
- Ausseneinsätze
- Weiterbildungen
- kurzfristige Diensttausche
- Einsatz von Springerinnen oder Springern
- Einsatz externer Mitarbeitender
- Ausfall einer Tagesfunktion
- Wechsel von Hausverantwortung oder Tagesverantwortung
- bewusste Akzeptanz einer Unterdeckung

Diese Ereignisse verändern die operative Führungslage. Sie sollen jedoch nicht den ursprünglichen Referenzplan überschreiben.

Wenn CareFlow operative Änderungen nur durch direkte Änderung von Assignments abbildet, geht der Zusammenhang zwischen Ursache, Wirkung und Entscheidung verloren.

Für Führung, Nachvollziehbarkeit, Periodenabschluss, Planungsgüte und Controlling ist jedoch entscheidend, warum eine Änderung entstanden ist.

## Entscheidung

CareFlow behandelt operative Planänderungen künftig ereignisbasiert.

Eine Änderung am operativen Plan soll aus einem dokumentierten Ereignis entstehen.

Das Ereignis beschreibt die Ursache oder den Anlass der Planänderung.

Die operative Änderung beschreibt die Auswirkung auf den CareFlow-Plan.

Die menschliche Entscheidung beschreibt, welche Massnahme gewählt oder welches Risiko akzeptiert wurde.

Damit gilt:

- Ereignisse überschreiben den Referenzplan nicht.
- Ereignisse verändern oder beeinflussen den operativen CareFlow-Plan.
- Jede relevante Planänderung soll auf ein Ereignis oder eine dokumentierte Entscheidung zurückführbar sein.
- Ereignisse werden als eigenständige fachliche Objekte verstanden.
- Planänderungen bleiben nachvollziehbar, auswertbar und historisierbar.

## Begründung

Pflegeplanung ist nicht statisch. Die operative Realität verändert den Plan laufend.

Für CareFlow ist deshalb nicht nur wichtig, dass eine Änderung stattgefunden hat, sondern auch:

- warum sie stattgefunden hat
- wann sie stattgefunden hat
- welche Schichten betroffen waren
- welche Personen betroffen waren
- welche Qualifikation oder Tagesfunktion betroffen war
- welche Folgeprobleme entstanden sind
- welche Entscheidung getroffen wurde
- ob das Problem gelöst oder als Risiko akzeptiert wurde

Eine ereignisbasierte Modellierung ermöglicht es, den Unterschied zwischen Planungsabsicht und operativer Realität sichtbar zu halten.

Sie stärkt die spätere Auswertbarkeit von Planungsgüte, Belastung, Controlling und Mustererkennung.

## Fachliche Ereignistypen

Mögliche Ereignistypen sind:

- `sickness`
- `excused_absence`
- `external_assignment`
- `training`
- `shift_swap`
- `replacement`
- `external_staffing`
- `function_change`
- `coverage_gap`
- `qualification_gap`
- `accepted_risk`
- `manual_correction`
- `other`

Die konkrete technische Umsetzung kann schrittweise erfolgen. Die Ereignistypen müssen nicht alle sofort produktiv verwendet werden.

## Fachliche Struktur eines Ereignisses

Ein Ereignis kann langfristig folgende Informationen enthalten:

- Ereignistyp
- Datum
- betroffene Planperiode
- betroffene Schicht
- betroffene Person
- betroffene Funktion
- betroffene Qualifikation
- Beschreibung
- Erfassungszeitpunkt
- Quelle der Information
- Status
- Verweis auf daraus entstandene Planänderungen
- Verweis auf Entscheidung oder Massnahme

## Operative Planänderung

Eine Planänderung beschreibt, was sich aufgrund eines Ereignisses im operativen Plan verändert.

Beispiele:

- Person fällt für eine Schicht aus.
- Person wird als Ersatz eingesetzt.
- Person wechselt von Spätdienst in Frühdienst.
- Tagesverantwortung wird neu zugewiesen.
- Hausverantwortung wird auf andere Person übertragen.
- Schicht bleibt unterdeckt.
- externe Unterstützung wird eingetragen.
- Risiko wird dokumentiert akzeptiert.

Die Planänderung verändert den operativen Plan, nicht den Referenzplan.

## Technische Konsequenzen

Diese ADR bereitet spätere Modelle wie `PlanEvent` und `PlanChange` vor.

Mögliche technische Richtung:

- Einführung eines Modells `PlanEvent`
- spätere Einführung eines Modells `PlanChange`
- Verknüpfung mit `PlanningPeriod`
- Verknüpfung mit `Shift`
- optionale Verknüpfung mit `Employee`
- optionale Verknüpfung mit `Assignment`
- Speicherung von Ereignistyp, Beschreibung, Status und Zeitstempel
- Auslösung einer erneuten Validierung betroffener Schichten oder Tage

Im ersten Schritt kann eine vereinfachte Ereignislogik ausreichen.

## Auswirkungen auf Validierung

Wenn ein Ereignis erfasst wird, soll CareFlow die betroffene Lage neu bewerten.

Beispiele:

- Krankmeldung führt zur Neuberechnung der Schichtdeckung.
- Ausfall einer dipl. HF führt zur Prüfung der Qualifikationsdeckung.
- Wechsel der Hausverantwortung führt zur Prüfung der Funktionslogik.
- Diensttausch führt zur Prüfung von Deckung, Qualifikation, Belastung und möglichen Konflikten.

Die Validierung soll nicht nur das Ereignis sehen, sondern dessen operative Wirkung.

## Nicht-Ziele

Diese ADR führt noch nicht ein:

- automatische Lösung aller Ereignisse
- automatische Neuplanung ganzer Perioden
- vollständige Optimierungsengine
- automatische Kommunikation an externe Systeme
- arbeitsrechtliche Bewertung von Abwesenheiten
- verbindliche Kompensationsberechnungen

Diese Themen können später ergänzt werden.

## Zusammenhang mit anderen ADRs

Diese ADR baut auf folgenden Entscheidungen auf:

- ADR-022 – Referenzplan und operativer CareFlow-Plan
- ADR-024 – PlanningPeriod als periodische Grundstruktur

Sie bereitet folgende spätere Themen vor:

- Decision Log
- Period Closure
- Planungsgüte
- Resource Controlling
- Mustererkennung

## Zusammenfassung

CareFlow behandelt operative Planänderungen künftig ereignisbasiert. Ereignisse wie Krankmeldungen, Absenzen, Diensttausche oder Funktionswechsel werden nicht als stille Überschreibungen des Plans verstanden, sondern als explizite Ursachen operativer Veränderungen.

Dadurch bleiben Ursache, Wirkung und Führungsentscheidung nachvollziehbar. Diese Logik bildet eine zentrale Grundlage für spätere Planungsgüte, Controlling und organisationales Lernen.