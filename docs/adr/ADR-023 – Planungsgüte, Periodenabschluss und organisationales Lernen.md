# ADR-023 – Planungsgüte, Periodenabschluss und organisationales Lernen

## Status

Accepted

## Kontext

CareFlow soll nicht nur einzelne Schichten oder Tageslagen prüfen, sondern langfristig auch sichtbar machen, wie gut eine Planperiode im Verhältnis zur operativen Realität funktioniert hat.

In Pflegeheimen ist der freigegebene Periodenplan nur eine Ausgangslage. Während der laufenden Periode entstehen Abweichungen durch Krankmeldungen, Absenzen, Diensttausche, Ausseneinsätze, kurzfristige Ersatzlösungen, Qualifikationslücken, Führungsausfälle oder bewusst akzeptierte Risiken.

Diese Abweichungen sind nicht nur operative Störungen. Sie enthalten wichtige Informationen über die Tragfähigkeit der Planung, die Belastung einzelner Mitarbeitender, die Stabilität von Teams, die Qualität des Skill-Mix und die Führbarkeit einzelner Tage oder Abteilungen.

Wenn CareFlow diese Informationen nur kurzfristig anzeigt und danach verwirft, geht wertvolles Führungswissen verloren.

Deshalb soll CareFlow nach Abschluss einer Planperiode den unveränderten Referenzplan, den operativen Verlauf und den tatsächlichen Ist-Abschluss miteinander vergleichen. Daraus entsteht eine Auswertung der Planungsgüte.

Über mehrere historisierte Perioden hinweg kann CareFlow wiederkehrende Muster erkennen und dadurch strategische Rückschlüsse für die Organisation ermöglichen.

## Entscheidung

CareFlow soll künftig am Ende einer Planperiode einen Periodenabschluss erzeugen.

Dieser Periodenabschluss vergleicht den ursprünglichen Referenzplan mit dem operativen Verlauf und dem tatsächlichen Ist-Abschluss.

Aus diesem Vergleich entsteht eine Auswertung der Planungsgüte.

Die Planungsgüte wird nicht als Schuldzuweisung verstanden, sondern als lernorientierte Analyse der Frage, wie tragfähig der ursprüngliche Plan unter realen Bedingungen war.

Die Ergebnisse des Periodenabschlusses werden historisiert. Über mehrere abgeschlossene Perioden hinweg bildet diese Historie die Grundlage für Mustererkennung, strategische Hinweise und organisationales Lernen.

Damit gelten folgende Grundsätze:

- Jede abgeschlossene Planperiode soll als historischer Lerngegenstand gespeichert werden.
- Der Referenzplan bleibt der Massstab für den Vergleich.
- Operative Abweichungen werden nicht nur als Fehler, sondern als Lernsignale verstanden.
- Planungsgüte beschreibt die Tragfähigkeit eines Plans unter realen Bedingungen.
- Wiederkehrende Muster sollen langfristig strategische Rückschlüsse ermöglichen.
- CareFlow unterstützt damit nicht nur operative Steuerung, sondern auch organisationale Entwicklung.
- Die Interpretation der Ergebnisse bleibt eine menschliche Führungsaufgabe.

## Begründung

Pflegeheime benötigen nicht nur aktuelle Dienstplaninformationen, sondern auch Hinweise darauf, ob ihre Planungslogik langfristig tragfähig ist.

Ein Plan kann formal korrekt sein und dennoch operativ fragil bleiben.

Beispiele:

- Frühdienste sind regelmässig knapp geplant.
- Bestimmte Abteilungen kippen häufiger als andere.
- Einzelne Mitarbeitende springen überdurchschnittlich oft ein.
- Wochenend- und Nachtdienste sind ungleich verteilt.
- Hausverantwortung hängt an zu wenigen Personen.
- Qualifikationslücken treten wiederholt in ähnlichen Schichten auf.
- Externe Mitarbeitende werden immer in denselben Zeitfenstern benötigt.
- Die Organisation akzeptiert Risiken, ohne diese systematisch auszuwerten.

Durch den Periodenabschluss kann CareFlow solche Beobachtungen sichtbar machen. Dadurch entsteht ein Übergang von operativer Tagessteuerung zu strategischer Organisationsentwicklung.

CareFlow wird damit nicht nur ein Validierungsinstrument, sondern ein Instrument der organisationalen Selbstbeobachtung.

## Fachliche Definition: Planungsgüte

Planungsgüte beschreibt, wie tragfähig, stabil, qualifikatorisch angemessen, funktional führbar und belastungsfair ein Periodenplan im Verhältnis zur tatsächlichen Entwicklung war.

Planungsgüte bedeutet nicht, dass ein Plan perfekt sein muss. In der Pflege sind Abweichungen unvermeidbar.

Planungsgüte fragt vielmehr:

- War der Plan bei Freigabe realistisch?
- Welche Risiken waren bereits sichtbar?
- Welche Abweichungen traten später auf?
- Welche Abweichungen konnten kompensiert werden?
- Welche Abweichungen führten zu Unterdeckung?
- Welche Qualifikations- oder Funktionslücken entstanden?
- Welche Mitarbeitenden wurden besonders belastet?
- Welche Muster wiederholen sich?
- Welche Schlussfolgerungen ergeben sich für die nächste Planperiode?

## Dimensionen der Planungsgüte

CareFlow kann Planungsgüte langfristig über mehrere Dimensionen abbilden.

### Planstabilität

Planstabilität beschreibt, wie stark der ursprüngliche Plan während der laufenden Periode verändert werden musste.

Mögliche Indikatoren:

- Anzahl Planänderungen
- Anzahl kurzfristiger Ersatzbesetzungen
- Anzahl Diensttausche
- Anzahl kritischer Tagesereignisse
- Anzahl Eskalationen
- Anteil unveränderter Schichten

### Deckungsgüte

Deckungsgüte beschreibt, wie oft Schichten tatsächlich ausreichend besetzt waren.

Mögliche Indikatoren:

- Anzahl vollständig gedeckter Schichten
- Anzahl unterdeckter Schichten
- Anzahl überdeckter Schichten
- Dauer oder Häufigkeit von Unterdeckungen
- Anteil kritischer Dienste

### Qualifikationsgüte

Qualifikationsgüte beschreibt, ob der notwendige Skill-Mix vorhanden war.

Mögliche Indikatoren:

- Schichten mit fehlender Mindestqualifikation
- Schichten ohne geeignete Hausverantwortung
- Schichten ohne geeignete Tagesverantwortung
- wiederkehrende Qualifikationslücken
- Abhängigkeit von wenigen qualifizierten Personen

### Funktionsgüte

Funktionsgüte beschreibt, ob operative Tagesfunktionen angemessen besetzt waren.

Mögliche Indikatoren:

- korrekte Besetzung von Pflegeleitung, Hausverantwortung und Tagesverantwortung
- kurzfristige Funktionswechsel
- fehlende Stellvertretungen
- Konzentration von Führungsfunktionen auf wenige Personen

### Belastungsgüte

Belastungsgüte beschreibt, ob belastende Dienste fair und tragfähig verteilt waren.

Mögliche Indikatoren:

- Wochenenddienste pro Mitarbeitende
- Nachtdienste pro Mitarbeitende
- kurzfristiges Einspringen
- Springerbelastung
- Zusatzdienste
- Überstunden
- wiederholte Führungslast

### Reaktionsgüte

Reaktionsgüte beschreibt, wie wirksam die Organisation auf Abweichungen reagiert hat.

Mögliche Indikatoren:

- Zeit bis zur Ersatzlösung
- Anteil gelöster Unterdeckungen
- Anteil bewusst akzeptierter Risiken
- Anzahl Eskalationen
- Annahme oder Ablehnung von Vorschlägen
- dokumentierte Ersatzmassnahmen

### Risikotransparenz

Risikotransparenz beschreibt, ob erkannte Risiken sichtbar, entschieden und dokumentiert wurden.

Mögliche Indikatoren:

- Anzahl dokumentierter Risikoentscheidungen
- Anzahl nicht gelöster Warnungen
- Anzahl bewusst akzeptierter Unterdeckungen
- Zusammenhang zwischen Warnungen bei Freigabe und späteren Ereignissen

## Periodenabschluss

Der Periodenabschluss ist der fachliche Prozess am Ende einer Planperiode.

Er erzeugt mindestens folgende Ergebnisse:

- Vergleich Referenzplan versus operativer Verlauf
- Vergleich Referenzplan versus Ist-Abschluss
- Übersicht über operative Abweichungen
- Übersicht über Krankmeldungen, Absenzen, Diensttausche und Ersatzlösungen
- Bewertung der Deckung
- Bewertung der Qualifikation
- Bewertung der Tagesfunktionen
- Bewertung der Belastungsverteilung
- Hinweise auf wiederkehrende Muster
- Empfehlungen für die nächste Planperiode
- Speicherung der Ergebnisse in der Historie

Der Periodenabschluss kann zunächst einfach umgesetzt werden und später um weitere Kennzahlen und Berichtslogik erweitert werden.

## Historisierung

CareFlow speichert abgeschlossene Perioden nicht nur als vergangene Pläne, sondern als Lernobjekte.

Ein historisierter Periodenabschluss sollte langfristig enthalten:

- Referenzplan
- operative Änderungen
- Tagesereignisse
- Führungsentscheidungen
- Ist-Abschluss
- Validierungsergebnisse
- Planungsgüte-Auswertung
- erkannte Muster
- empfohlene Massnahmen

Diese Historie bildet die Grundlage für spätere Mustererkennung.

## Mustererkennung

Mustererkennung wird nicht sofort im MVP umgesetzt. Sie setzt mehrere abgeschlossene und historisierte Perioden voraus.

Nach mehreren Perioden kann CareFlow Hinweise erzeugen wie:

- bestimmte Schichten kippen regelmässig
- bestimmte Abteilungen sind wiederholt unterdeckt
- bestimmte Qualifikationen fehlen systematisch
- einzelne Mitarbeitende werden überdurchschnittlich belastet
- Wochenend- oder Nachtdienste sind ungleich verteilt
- externe Einsätze häufen sich in bestimmten Zeiträumen
- bestimmte Planannahmen erweisen sich wiederholt als zu optimistisch

Solche Muster können strategische Fragen auslösen:

- Muss der Stellenplan angepasst werden?
- Braucht es einen internen Springerpool?
- Müssen weitere Mitarbeitende für bestimmte Funktionen aufgebaut werden?
- Ist die Wochenend- oder Nachtdienstverteilung neu zu regeln?
- Sind bestimmte Teams strukturell fragil?
- Gibt es ein Risiko stiller Überlastung?
- Muss die Heimleitung oder Trägerschaft über strukturelle Engpässe informiert werden?

## Verbindung zur lernenden Organisation

CareFlow versteht Planabweichungen nicht primär als Fehler, sondern als Signale.

Der Lernzyklus lautet:

> Planen → Führen → Abweichen → Verstehen → Lernen → Neu planen

Oder ausführlicher:

> Referenzplan → operativer Verlauf → Ist-Abschluss → Planvergleich → Planungsgüte → Mustererkennung → strategische Massnahme → verbesserte nächste Planung

Damit unterstützt CareFlow eine lernende Organisation. Operative Störungen werden nicht nur gelöst, sondern in organisationales Wissen übersetzt.

## Technische Konsequenzen

Diese ADR erzwingt keine sofortige Umsetzung aller genannten Funktionen.

Sie legt jedoch fest, dass CareFlow künftig so entwickelt werden soll, dass Periodenabschlüsse, Planungsgüte und Historisierung möglich werden.

Daraus ergeben sich folgende technische Leitlinien:

- Einführung oder Nutzung einer `PlanningPeriod`
- spätere Einführung eines `PeriodClosure`
- Speicherung periodenbezogener Validierungsergebnisse
- Speicherung operativer Ereignisse
- Speicherung von Entscheidungen
- Möglichkeit zum Vergleich verschiedener Planstände
- Möglichkeit zur Auswertung abgeschlossener Perioden
- Vorbereitung historischer Auswertungen über mehrere Perioden
- keine Vermischung von Referenzplan, operativem Verlauf und Ist-Abschluss

Mögliche spätere Modelle oder Module:

- `PlanningPeriod`
- `ReferencePlan`
- `OperationalPlan`
- `PlanEvent`
- `PlanChange`
- `DecisionLog`
- `ActualWorkRecord`
- `PeriodClosure`
- `PlanningQualityReport`
- `PatternInsight`

## Nicht-Ziele

Nicht Bestandteil dieser ADR sind:

- sofortige automatische Mustererkennung im MVP
- verbindliche arbeitsrechtliche Kompensationsberechnung
- automatische strategische Entscheidungen
- automatische Personalbedarfsplanung
- vollständige KI-Prognosemodelle
- automatische Rückschreibung in externe Planungssysteme

Diese Themen können später separat entschieden werden.

## Auswirkungen auf den MVP

Für den aktuellen MVP bedeutet diese ADR:

CareFlow soll noch keine vollständige Planungsgüte-Engine enthalten. Es soll jedoch so weiterentwickelt werden, dass periodenbezogene Validierung, spätere Historisierung und Periodenabschluss nicht blockiert werden.

Kurzfristig genügt es, Planperioden und Validierungsergebnisse sauber zu strukturieren.

Die eigentliche Planungsgüte-Auswertung wird in einer späteren Entwicklungsphase umgesetzt.

## Empfohlene Entwicklungsreihenfolge

Die Umsetzung sollte schrittweise erfolgen:

- bestehende Tages- und Full-Validation stabilisieren
- `PlanningPeriod` einführen
- periodenbezogene Validierung ermöglichen
- Referenzplan-Status einführen
- operative Ereignisse und Planänderungen sauber abbilden
- Decision Log ergänzen
- Periodenabschluss einführen
- einfache Planungsgüte-Auswertung erzeugen
- abgeschlossene Perioden historisieren
- nach mehreren Perioden Mustererkennung entwickeln

## Zusammenfassung

CareFlow soll abgeschlossene Planperioden auswerten und historisieren. Der ursprüngliche Referenzplan wird mit dem operativen Verlauf und dem tatsächlichen Ist-Abschluss verglichen. Daraus entsteht eine Planungsgüte-Auswertung.

Diese Auswertung dient nicht der Schuldzuweisung, sondern dem organisationalen Lernen. Über mehrere Perioden hinweg kann CareFlow wiederkehrende Muster erkennen und daraus strategische Hinweise für Führung, Personalplanung, Qualifikationsentwicklung und Organisationsentwicklung ableiten.