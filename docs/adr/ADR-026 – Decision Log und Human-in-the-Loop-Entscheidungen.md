# ADR-026 – Decision Log und Human-in-the-Loop-Entscheidungen

## Status

Proposed

## Kontext

CareFlow erkennt Risiken, Unterdeckungen, Qualifikationslücken, Funktionsprobleme, Belastungsmuster und operative Planabweichungen.

Das System kann daraus Hinweise, Warnungen und Vorschläge ableiten.

In der Pflegeplanung gibt es jedoch viele Situationen, in denen keine eindeutige automatische Lösung existiert. Eine Unterdeckung kann manchmal durch Springer gelöst werden, manchmal durch Diensttausch, manchmal durch externe Unterstützung, manchmal nur durch Priorisierung der Pflegeleistungen und bewusste Risikoakzeptanz.

CareFlow soll deshalb nicht als automatische Planungs- oder Kontrollmaschine verstanden werden, sondern als Führungs- und Entscheidungsunterstützung.

Die verbindliche Entscheidung bleibt bei der verantwortlichen Führungsperson.

Damit diese Entscheidungen später nachvollziehbar, auswertbar und lernfähig werden, braucht CareFlow eine Entscheidungslogik.

## Entscheidung

CareFlow führt langfristig ein Decision Log ein.

Das Decision Log dokumentiert relevante menschliche Führungsentscheidungen im Zusammenhang mit Planhinweisen, Ereignissen, Risiken und Änderungsvorschlägen.

CareFlow schlägt vor, bewertet, warnt und macht Zusammenhänge sichtbar. Die verbindliche Entscheidung bleibt beim Menschen.

Damit gelten folgende Grundsätze:

- CareFlow ersetzt keine Führungsentscheidung.
- CareFlow erzeugt keine stillen automatischen Planänderungen ohne menschliche Bestätigung.
- Vorschläge können angenommen, abgelehnt, verändert oder zurückgestellt werden.
- Risiken können bewusst akzeptiert und begründet dokumentiert werden.
- Entscheidungen sollen nachvollziehbar gespeichert werden.
- Das Decision Log bildet eine Grundlage für Periodenabschluss, Planungsgüte, Controlling und organisationales Lernen.

## Begründung

In Pflegeheimen hängt eine gute Entscheidung nicht nur von formalen Regeln ab.

Führungspersonen berücksichtigen auch Kontextwissen:

- Verfügbarkeit von Mitarbeitenden
- aktuelle Teamstimmung
- Belastung einzelner Personen
- Bewohnerlage
- kurzfristige Prioritäten
- rechtliche und organisatorische Rahmenbedingungen
- Erfahrung mit bestimmten Situationen
- Zumutbarkeit einer Ersatzlösung
- Kommunikation mit Mitarbeitenden

CareFlow kann diese Kontexte teilweise sichtbar machen, aber nicht vollständig ersetzen.

Deshalb ist Human-in-the-Loop fachlich notwendig.

Gleichzeitig ist es wertvoll, Entscheidungen zu dokumentieren. Dadurch wird später sichtbar:

- welche Vorschläge CareFlow gemacht hat
- welche Massnahme gewählt wurde
- warum ein Vorschlag abgelehnt wurde
- wann Risiken bewusst akzeptiert wurden
- welche Lösungen wiederholt funktionieren
- welche Probleme ungelöst bleiben
- wo strukturelle Muster entstehen

## Fachliche Struktur einer Entscheidung

Eine Entscheidung im Decision Log kann langfristig folgende Informationen enthalten:

- Bezug zur Planperiode
- Bezug zur Schicht oder zum Tag
- Bezug zum Ereignis
- Bezug zum Validierungshinweis
- vorgeschlagene Massnahme
- gewählte Massnahme
- Entscheidungsstatus
- Begründung
- verantwortliche Rolle oder Person
- Zeitpunkt der Entscheidung
- Wirkung auf den operativen Plan
- Hinweis auf akzeptiertes Risiko
- optional: Eskalationsstufe

## Mögliche Entscheidungsstatus

Mögliche Statuswerte:

- `accepted`
- `rejected`
- `modified`
- `deferred`
- `risk_accepted`
- `escalated`
- `resolved`
- `unresolved`

Die konkrete technische Umsetzung kann schrittweise erfolgen.

## Beispiele

### Beispiel 1: Vorschlag angenommen

CareFlow erkennt eine Unterdeckung im Frühdienst.

Vorschlag:

> Springer B anfragen.

Entscheidung:

> Vorschlag angenommen. Springer B übernimmt den Dienst.

### Beispiel 2: Vorschlag abgelehnt

CareFlow schlägt vor, Mitarbeiterin C aus dem Spätdienst in den Frühdienst zu verschieben.

Entscheidung:

> Vorschlag abgelehnt, weil dadurch im Spätdienst die Tagesverantwortung fehlen würde.

### Beispiel 3: Risiko akzeptiert

CareFlow meldet Unterdeckung im Frühdienst.

Keine Ersatzperson ist verfügbar.

Entscheidung:

> Unterdeckung wird bewusst akzeptiert. Pflegeleistungen werden priorisiert. Pflegeleitung ist informiert.

### Beispiel 4: Eskalation

CareFlow erkennt wiederholte Qualifikationslücken an mehreren Tagen.

Entscheidung:

> Thema wird an Heimleitung eskaliert und im Monatsreview behandelt.

## Technische Konsequenzen

Diese ADR bereitet ein späteres Modell `DecisionLog` oder `DecisionRecord` vor.

Mögliche technische Richtung:

- Verknüpfung mit `PlanningPeriod`
- Verknüpfung mit `PlanEvent`
- Verknüpfung mit `ValidationIssue`
- Verknüpfung mit `PlanChange`
- Speicherung von Entscheidung, Status, Begründung und Zeitstempel
- spätere Auswertung im Periodenabschluss
- spätere Nutzung für Planungsgüte und Mustererkennung

Im MVP kann zunächst eine einfache Entscheidungsnotiz oder ein einfacher Status genügen.

## Auswirkungen auf die Benutzeroberfläche

Langfristig sollte die Oberfläche nicht nur Warnungen anzeigen, sondern auch Entscheidungen ermöglichen.

Beispiele:

- Vorschlag annehmen
- Vorschlag ablehnen
- Alternative Massnahme eintragen
- Risiko akzeptieren
- Eskalation markieren
- Kommentar hinzufügen

Die UI soll dabei ruhig und führungstauglich bleiben. Das Decision Log soll unterstützen, nicht bürokratisch belasten.

## Nicht-Ziele

Diese ADR führt noch nicht ein:

- automatische Genehmigungsworkflows
- digitale Signaturen
- arbeitsrechtlich verbindliche Entscheidungen
- automatische Eskalation an externe Stellen
- vollständige Audit-Compliance
- personenbezogene Leistungsbewertung

Diese Themen können später separat behandelt werden.

## Zusammenhang mit anderen ADRs

Diese ADR baut auf folgenden Entscheidungen auf:

- ADR-022 – Referenzplan und operativer CareFlow-Plan
- ADR-025 – Ereignisbasierte Planänderungen

Sie unterstützt folgende spätere Themen:

- Period Closure
- Planungsgüte
- Resource Controlling
- Mustererkennung
- CareFlow Insight Layer

## Zusammenfassung

CareFlow bleibt ein Human-in-the-Loop-System. Es erkennt Risiken, macht Vorschläge und zeigt Zusammenhänge. Die verbindliche Entscheidung bleibt bei der verantwortlichen Führungsperson.

Das Decision Log dokumentiert diese Entscheidungen nachvollziehbar. Dadurch werden operative Entscheidungen später auswertbar und können in Planungsgüte, Controlling und organisationales Lernen einfliessen.