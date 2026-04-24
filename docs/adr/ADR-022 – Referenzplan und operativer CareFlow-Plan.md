# ADR-022 – Referenzplan und operativer CareFlow-Plan

## Status

Accepted

## Kontext

CareFlow verarbeitet Dienst- und Einsatzpläne für Pflegeheime. Diese Pläne entstehen in der Regel nicht originär in CareFlow, sondern in bestehenden Planungssystemen wie Polypoint, Excel oder anderen Fachanwendungen.

Bisher prüft CareFlow Schichten, Zuweisungen, Qualifikationen, Tagesfunktionen, Abwesenheiten und Führungslagen vor allem aus der Perspektive der aktuellen Validierung und Leadership View.

Mit der Weiterentwicklung von CareFlow entsteht die fachliche Notwendigkeit, zwischen dem ursprünglich geplanten Periodenplan und der laufenden operativen Realität zu unterscheiden.

In der Praxis bleibt ein freigegebener Periodenplan selten unverändert. Während der laufenden Planperiode treten Ereignisse auf, zum Beispiel Krankmeldungen, entschuldigte Absenzen, Ausseneinsätze, kurzfristige Diensttausche, Ersatz durch Springer, Einsatz externer Mitarbeitender, Änderungen von Tagesfunktionen oder bewusst akzeptierte Risikoentscheidungen bei Unterdeckung.

Wenn solche Ereignisse direkt in den ursprünglichen Plan geschrieben würden, ginge die ursprüngliche Planungsabsicht verloren. CareFlow könnte später nicht mehr zuverlässig unterscheiden, ob ein Problem bereits im Referenzplan angelegt war oder erst durch operative Ereignisse entstanden ist.

Für CareFlow ist diese Unterscheidung zentral, weil das System nicht nur Planfehler anzeigen, sondern Planstabilität, operative Anpassungen und Führungsentscheidungen nachvollziehbar machen soll.

## Entscheidung

CareFlow unterscheidet künftig fachlich zwischen einem unveränderten Referenzplan und einem operativen CareFlow-Plan.

Der Referenzplan bildet den ursprünglich importierten, geprüften oder freigegebenen Periodenplan ab. Er bleibt nach seiner Freigabe unverändert und dient als stabile Vergleichsbasis.

Der operative CareFlow-Plan wird aus dem Referenzplan abgeleitet. Er bildet die laufende Realität der Planperiode ab und kann durch Ereignisse, Korrekturen, Ersatzentscheidungen und Führungsentscheidungen angepasst werden.

CareFlow überschreibt den Referenzplan nicht destruktiv. Änderungen werden im operativen Plan oder in zugehörigen Ereignis- und Änderungsprotokollen dokumentiert.

Damit gelten folgende Grundsätze:

- Der originäre Periodenplan bleibt als Referenzplan erhalten.
- Der operative CareFlow-Plan bildet die jeweils aktuelle Führungslage ab.
- Jede operative Anpassung ist nachvollziehbar und historisierbar.
- Ereignisse und Entscheidungen werden nicht als stille Überschreibungen, sondern als explizite Planveränderungen behandelt.
- CareFlow bleibt ein Decision Layer und ersetzt nicht das originäre Planungssystem.
- Automatische Rückschreibungen in externe Planungssysteme erfolgen nicht im MVP und sind nur als spätere Integrationsoption denkbar.
- Die menschliche Führungsentscheidung bleibt verbindlich; CareFlow macht Vorschläge, markiert Risiken und dokumentiert Entscheidungen.

## Begründung

Diese Entscheidung erhält die Integrität des ursprünglichen Plans. Sie ermöglicht CareFlow, zwischen Planungsabsicht, operativer Anpassung und tatsächlichem Verlauf zu unterscheiden.

Dies ist fachlich wichtig, weil viele relevante Führungsfragen nur durch den Vergleich dieser Ebenen beantwortet werden können:

- War der Plan bereits bei Freigabe fragil?
- Welche Probleme entstanden erst durch Tagesereignisse?
- Welche Schichten mussten häufig korrigiert werden?
- Welche Personen wurden überdurchschnittlich oft als Ersatz eingesetzt?
- Welche Qualifikationen oder Tagesfunktionen waren besonders kritisch?
- Welche Risiken wurden bewusst akzeptiert?
- Welche Anpassungen führten zu Folgeproblemen in anderen Schichten?

Die Trennung zwischen Referenzplan und operativem Plan stärkt Nachvollziehbarkeit, Auditierbarkeit und Akzeptanz von CareFlow. Das System verändert den ursprünglichen Plan nicht unsichtbar, sondern macht jede Veränderung transparent.

## Fachliche Konsequenzen

CareFlow benötigt langfristig mindestens drei Planebenen.

### Referenzplan

Der Referenzplan zeigt, wie die Planperiode ursprünglich geplant oder freigegeben wurde.

Er beantwortet die Frage:

> Was war geplant?

### Operativer CareFlow-Plan

Der operative Plan zeigt, wie sich die Planperiode durch Ereignisse, Entscheidungen und Anpassungen laufend verändert.

Er beantwortet die Frage:

> Was gilt aktuell?

### Ist-Abschluss

Der Ist-Abschluss zeigt nach Ende der Periode, was tatsächlich gearbeitet, kompensiert, ersetzt oder bewusst als Risiko akzeptiert wurde.

Er beantwortet die Frage:

> Was ist tatsächlich geschehen?

Diese drei Ebenen bilden die Grundlage für spätere Planvergleiche, Planungsgüteberichte und Mustererkennung.

## Technische Konsequenzen

Diese ADR erzwingt noch keine sofortige vollständige Umsetzung eines parallelen operativen Plans.

Sie legt jedoch die Richtung für die weitere Entwicklung fest.

Kurzfristig soll CareFlow so weiterentwickelt werden, dass spätere Referenz- und operative Planlogik nicht verhindert wird.

Daraus ergeben sich folgende technische Leitlinien:

- Einführung eines Periodenbegriffs, zum Beispiel `PlanningPeriod`
- Zuordnung von Schichten zu einer Planperiode
- Möglichkeit, einen Planstand später als Referenzplan zu markieren
- keine destruktive Überschreibung ursprünglicher Planinformationen
- Ereignisse wie Krankheit, Absenz oder Diensttausch als eigenständige fachliche Objekte behandeln
- Validierungen so gestalten, dass sie sich auf bestimmte Planstände oder Perioden beziehen können
- spätere Erweiterbarkeit für `OperationalPlan`, `PlanEvent`, `PlanChange`, `DecisionLog` und `PeriodClosure`

Im MVP kann zunächst weiterhin mit bestehenden Schichten, Assignments, Abwesenheiten und Validierungen gearbeitet werden. Die vollständige operative Planversionierung wird erst in einer späteren Entwicklungsphase umgesetzt.

## Nicht-Ziele

Diese ADR entscheidet nicht, dass CareFlow sofort eine vollständige automatische Neuplanung erzeugt.

Nicht Bestandteil dieser Entscheidung sind:

- automatische Erstellung eines komplett neuen Monatsplans
- automatische Rückgabe von Planänderungen an Polypoint oder andere Systeme
- vollständige Optimierungsengine
- arbeitsrechtlich verbindliche Kompensationsentscheidungen
- automatische Ersetzung menschlicher Führungsentscheidungen
- strategische Mustererkennung über mehrere Perioden

Diese Themen können später in eigenen ADRs behandelt werden.

## Auswirkungen auf den MVP

Für den aktuellen MVP bedeutet diese Entscheidung vor allem:

CareFlow bleibt zunächst prüfend, validierend und führungsunterstützend. Der ursprüngliche Plan wird nicht automatisch verändert. Tagesereignisse und operative Anpassungen werden als Grundlage einer späteren operativen Planlogik verstanden.

Als nächster sinnvoller Entwicklungsschritt wird die Einführung einer `PlanningPeriod` empfohlen. Diese bildet die Grundlage, um Schichten, Assignments und Validierungen künftig periodenbezogen auswerten zu können.

## Konsequenzen für spätere Entwicklung

Diese ADR bereitet folgende spätere Module vor:

- PlanningPeriod
- Period Validation
- Reference Plan
- Operational Plan
- Plan Events
- Plan Changes
- Decision Log
- Period Closure
- Planning Quality Report
- Historical Pattern Detection

## Zusammenfassung

CareFlow verändert den originären Periodenplan nicht direkt. Der importierte oder freigegebene Plan bleibt als Referenzplan erhalten. Auf dieser Grundlage kann CareFlow einen operativen Plan führen, der Ereignisse, Anpassungen und Führungsentscheidungen während der laufenden Periode abbildet.

Damit bleibt CareFlow ein transparenter Decision Layer über bestehenden Planungssystemen und schafft die Grundlage für spätere Planungsgüte, Historisierung und organisationales Lernen.