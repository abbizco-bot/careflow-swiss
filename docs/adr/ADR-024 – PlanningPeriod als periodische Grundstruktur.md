# ADR-024 – PlanningPeriod als periodische Grundstruktur

## Status

Proposed

## Kontext

CareFlow arbeitet bisher mit Schichten, Mitarbeitenden, Assignments, Qualifikationen, Tagesfunktionen, Abwesenheiten und Validierungen.

Diese Objekte sind bereits geeignet, einzelne Tage oder Schichten zu prüfen. Für die weitere Entwicklung reicht eine rein tages- oder schichtbezogene Struktur jedoch nicht aus.

CareFlow soll künftig auch Monatspläne, Planperioden, Referenzpläne, operative Planverläufe, Periodenabschlüsse, Planungsgüte und historische Muster abbilden können.

Dazu braucht CareFlow eine periodische Grundstruktur.

Eine Planperiode kann zum Beispiel ein Monat sein, aber auch ein anderer Zeitraum, etwa eine Ferienperiode, eine Testperiode, ein Quartal oder ein definierter Pilotzeitraum.

Ohne eine solche Periodenstruktur bleiben Schichten und Assignments nur lose Einzelobjekte. Dadurch wäre es später schwierig, einen Monatsplan als Einheit zu prüfen, freizugeben, historisch zu speichern oder mit dem Ist-Verlauf zu vergleichen.

## Entscheidung

CareFlow führt künftig eine fachliche und technische Periodenstruktur ein.

Diese Struktur wird als `PlanningPeriod` bezeichnet.

Eine `PlanningPeriod` bündelt Schichten, Assignments, Validierungsergebnisse und spätere Planstände innerhalb eines definierten Zeitraums.

Sie bildet die Grundlage für:

- periodenbezogene Validierung
- Monatsplanprüfung
- Referenzplan-Logik
- operative Planverläufe
- Periodenabschluss
- Planungsgüte
- Historisierung
- spätere Mustererkennung

Die Einführung von `PlanningPeriod` ist der erste technische Schritt, um CareFlow von einer reinen Tages- oder Schichtvalidierung zu einer periodenbezogenen Führungs- und Lernlogik weiterzuentwickeln.

## Begründung

CareFlow soll künftig nicht nur beantworten:

> Ist diese Schicht korrekt besetzt?

Sondern auch:

> Ist diese Planperiode tragfähig?
> Welche Tage sind kritisch?
> Wie verändert sich der Plan im Verlauf der Periode?
> Wie gut war die Planung im Rückblick?
> Welche Muster zeigen sich über mehrere Perioden?

Diese Fragen können nur beantwortet werden, wenn CareFlow die Planperiode als fachliches Objekt kennt.

Eine `PlanningPeriod` erlaubt es, zusammengehörige Schichten und Assignments als Einheit zu betrachten. Dadurch kann CareFlow einen Monatsplan importieren, prüfen, freigeben, später mit operativen Änderungen vergleichen und am Ende auswerten.

## Fachliche Definition

Eine `PlanningPeriod` beschreibt einen definierten Planungszeitraum für einen bestimmten organisatorischen Kontext.

Mögliche Eigenschaften:

- Name der Periode
- Startdatum
- Enddatum
- organisatorischer Bereich
- Quelle des Plans
- Status der Periode
- Erstellungszeitpunkt
- Importzeitpunkt
- Freigabezeitpunkt
- optional: Beschreibung oder Bemerkung

Beispiele:

- Mai 2026 – Abteilung A
- Juni 2026 – Gesamtbetrieb
- Ferienperiode Juli 2026
- Pilotperiode Heim 1
- Testperiode für CSV-Import

## Mögliche Statuswerte

Eine `PlanningPeriod` kann verschiedene Status durchlaufen.

Mögliche Statuswerte:

- `draft`
- `imported`
- `validated`
- `released`
- `released_with_warnings`
- `closed`
- `archived`

Die konkrete Umsetzung der Statuswerte kann schrittweise erfolgen.

Im ersten Schritt genügt eine einfache Statuslogik. Wichtig ist jedoch, dass die Periodenstruktur spätere Referenzplan- und Abschlusslogik nicht blockiert.

## Technische Konsequenzen

Die Einführung von `PlanningPeriod` erfordert langfristig eine Beziehung zwischen Perioden und Schichten.

Schichten sollen einer Planperiode zugeordnet werden können.

Assignments bleiben weiterhin Schichten zugeordnet. Über die Schicht ergibt sich der Periodenbezug.

Mögliche technische Richtung:

- neues Modell `PlanningPeriod`
- Beziehung `Shift -> PlanningPeriod`
- API-Endpunkte für Anlegen, Lesen und spätere Verwaltung von Planperioden
- Möglichkeit, Validierungen periodenbezogen auszuführen
- spätere Speicherung von Validierungsergebnissen pro Periode

Die konkrete Umsetzung soll klein beginnen und bestehende Tages- und Schichtlogik möglichst wenig verändern.

## Auswirkungen auf bestehende Logik

Die bestehende Tagesvalidierung und Leadership View sollen nicht gebrochen werden.

Bestehende Schichten können zunächst weiterhin funktionieren. Die Periodenstruktur ergänzt die bestehende Logik.

Falls bestehende Testdaten keine Periode besitzen, kann für die Übergangsphase eine Default- oder Testperiode verwendet werden.

Die Einführung von `PlanningPeriod` soll kontrolliert erfolgen und nicht sofort komplexe Referenzplan-, operative Plan- oder Periodenabschlusslogik erzwingen.

## Nicht-Ziele

Diese ADR führt noch nicht ein:

- vollständigen Referenzplan
- vollständigen operativen Parallelplan
- Periodenabschluss
- Planungsgütebericht
- Mustererkennung
- automatische Neuplanung
- Rückschreibung in externe Planungssysteme

Diese Funktionen werden durch `PlanningPeriod` vorbereitet, aber nicht sofort umgesetzt.

## Empfohlene Umsetzungsschritte

Die Umsetzung sollte schrittweise erfolgen:

- Prisma-Modell `PlanningPeriod` ergänzen
- Beziehung zwischen `Shift` und `PlanningPeriod` herstellen
- einfache API für Planperioden einführen
- bestehende Tests anpassen oder ergänzen
- einfache periodenbezogene Validierung ermöglichen
- keine automatische Änderung an Assignment-Logik
- keine automatische Referenzplan-Freigabe im ersten Schritt

## Zusammenfassung

`PlanningPeriod` wird als periodische Grundstruktur eingeführt, damit CareFlow Monatspläne und andere Planungszeiträume als fachliche Einheit behandeln kann.

Diese Entscheidung ist die technische Grundlage für Referenzplan, operativen CareFlow-Plan, Periodenabschluss, Planungsgüte, Historisierung und spätere Mustererkennung.