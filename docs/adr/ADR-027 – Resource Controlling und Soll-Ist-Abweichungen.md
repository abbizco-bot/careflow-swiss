# ADR-027 – Resource Controlling und Soll-Ist-Abweichungen

## Status

Proposed

## Kontext

CareFlow soll Pflegeheime nicht nur in der operativen Tagesführung und Planvalidierung unterstützen, sondern langfristig auch strukturierte Informationen für Führung, Heimleitung und Controlling bereitstellen.

Die bisherige CareFlow-Logik unterscheidet zwischen Referenzplan, operativem CareFlow-Plan und Ist-Abschluss.

Diese Unterscheidung ermöglicht es, Soll-Ist-Abweichungen sichtbar zu machen:

- Was war ursprünglich geplant?
- Was wurde während der Periode operativ angepasst?
- Was wurde tatsächlich geleistet?
- Welche Abweichungen entstanden?
- Welche Abweichungen waren kosten- oder ressourcenrelevant?
- Welche Ursachen lagen hinter den Abweichungen?

In Pflegeheimen sind solche Abweichungen betriebswirtschaftlich bedeutsam. Krankmeldungen, externe Einsätze, Zusatzdienste, Überzeit, kurzfristige Ersatzlösungen oder ungleich verteilte Belastung wirken sich auf Ressourcen, Kosten, Führung und Qualität aus.

Klassisches Controlling sieht häufig Zahlen, Kostenstellen und Abweichungen. CareFlow kann ergänzend die operative Geschichte hinter diesen Zahlen sichtbar machen.

## Entscheidung

CareFlow soll langfristig strukturierte Soll-Ist-Abweichungen für Resource Controlling bereitstellen.

CareFlow ersetzt kein Finanz-, Lohn- oder Controlling-System. Es liefert jedoch operative Abweichungsinformationen, die für Controlling, Heimleitung, Pflegedienstleitung und Trägerschaft relevant sein können.

Resource Controlling in CareFlow bedeutet:

- Vergleich von Referenzplan und Ist-Abschluss
- Sichtbarmachung operativer Abweichungen
- Klassifikation von Abweichungsgründen
- Erkennung kosten- und ressourcenrelevanter Ereignisse
- Bereitstellung von Daten für spätere Controlling-Auswertungen
- Verbindung von Planabweichung, Führungsentscheidung und Ressourcenwirkung

## Begründung

Der ursprüngliche Dienstplan zeigt, was geplant war. Der Ist-Abschluss zeigt, was tatsächlich geschehen ist. Dazwischen liegt der operative Verlauf.

Für Controlling und Heimleitung ist nicht nur die Differenz zwischen Soll und Ist relevant, sondern auch deren Ursache.

Beispiel:

Ein Frühdienst war mit drei internen Mitarbeitenden geplant. Eine Person meldet sich krank. Eine externe Ersatzperson wird eingesetzt. Formal bleibt die Schicht gedeckt, aber die Ressourcensituation verändert sich.

CareFlow kann in diesem Fall zeigen:

- Soll: drei interne Mitarbeitende
- Ereignis: Krankmeldung
- Massnahme: externe Ersatzperson
- Ist: zwei interne Mitarbeitende und eine externe Person
- Wirkung: Schicht gedeckt, aber kostenrelevant verändert
- Entscheidung: externe Unterstützung wurde gewählt

Damit liefert CareFlow dem Controlling nicht nur eine Zahl, sondern den operativen Kontext der Abweichung.

## Fachliche Abweichungstypen

CareFlow kann langfristig verschiedene Abweichungstypen unterscheiden:

- Personalabweichung
- Stundenabweichung
- Schichtabweichung
- Qualifikationsabweichung
- Funktionsabweichung
- Abwesenheitsbedingte Abweichung
- Ersatzbedingte Abweichung
- externe Besetzungsabweichung
- Zusatzdienst
- Minderbesetzung
- Überbesetzung
- akzeptiertes Risiko
- kostenrelevante operative Änderung

## Mögliche Kennzahlen

CareFlow kann später Kennzahlen für Resource Controlling bereitstellen.

Mögliche Kennzahlen:

- Planabweichungsquote
- Ersatzquote
- Externenquote
- Zusatzdienstquote
- krankheitsbedingte Abweichungsquote
- interne Kompensationsquote
- Anteil nicht kompensierter Unterdeckungen
- Anteil bewusst akzeptierter Risiken
- Qualifikationsabweichungsquote
- Funktionsabweichungsquote
- Überzeitindikatoren
- Wochenend- und Nachtdienstabweichungen
- Abweichungen nach Abteilung oder Kostenstelle

Diese Kennzahlen müssen nicht alle sofort umgesetzt werden. Sie dienen als langfristiger Orientierungsrahmen.

## Resource Controlling ist keine Lohnabrechnung

CareFlow soll zunächst keine vollständige Lohn-, Zuschlags- oder Finanzabrechnung durchführen.

CareFlow soll operative Ursachen und Abweichungen strukturiert bereitstellen.

Die finanzielle Bewertung kann später ergänzt oder durch externe Controlling-Systeme vorgenommen werden.

Damit bleibt die Verantwortung klar getrennt:

- CareFlow erklärt operative Soll-Ist-Abweichungen.
- Controlling-Systeme oder Finanzprozesse bewerten diese finanziell.
- Führung interpretiert die Ergebnisse im organisatorischen Kontext.

## Datenbedarf

Für Resource Controlling benötigt CareFlow langfristig strukturierte Informationen wie:

- geplante Schicht
- tatsächliche Schicht
- geplante Person
- tatsächlich eingesetzte Person
- geplante Funktion
- tatsächliche Funktion
- geplante Qualifikation
- tatsächliche Qualifikation
- Abweichungsgrund
- Ereignistyp
- Ersatzlösung
- interne oder externe Abdeckung
- Dauer oder Stunden
- Schichttyp
- Abteilung oder Bereich
- optional: Kostenstelle
- optional: Kostenkategorie

Nicht alle Daten müssen im ersten Umsetzungsschritt vorhanden sein.

## Zusammenhang mit Planungsgüte

Resource Controlling ergänzt die Planungsgüte.

Planungsgüte fragt:

> Wie tragfähig war der Plan unter realen Bedingungen?

Resource Controlling fragt zusätzlich:

> Welche ressourcen- oder kostenrelevanten Abweichungen sind aus dieser Planrealität entstanden?

Damit kann CareFlow später zeigen:

- ob ein Plan operativ stabil war
- ob ein Plan kostenwirksam stark abwich
- ob externe Einsätze strukturell zunehmen
- ob Zusatzdienste wiederkehrend nötig sind
- ob bestimmte Abteilungen regelmässig mehr Ressourcen benötigen
- ob fehlende Reserve zu wiederkehrenden Zusatzkosten führt

## Verbindung zu strategischer Steuerung

Über mehrere Perioden hinweg können Resource-Controlling-Daten strategische Fragen auslösen:

- Ist der Stellenplan realistisch?
- Braucht es einen internen Springerpool?
- Sind externe Einsätze strukturell oder nur punktuell?
- Sind bestimmte Monate systematisch kostenintensiver?
- Sind bestimmte Abteilungen dauerhaft unterdimensioniert?
- Führt mangelnde Qualifikationsreserve zu höheren Ersatzkosten?
- Welche Planannahmen sind betriebswirtschaftlich unrealistisch?

Damit unterstützt CareFlow nicht nur operative Planung, sondern auch strategische Ressourcensteuerung.

## Technische Konsequenzen

Diese ADR erzwingt noch keine unmittelbare Implementierung eines Controlling-Moduls.

Sie legt jedoch fest, dass spätere Soll-Ist-Abweichungen aus der CareFlow-Datenstruktur ableitbar sein sollen.

Daraus ergeben sich technische Leitlinien:

- Referenzplan, operativer Verlauf und Ist-Abschluss müssen unterscheidbar bleiben.
- Ereignisse und Planänderungen sollen Abweichungsgründe enthalten können.
- Assignments und Schichten sollen langfristig mit Abteilung, Bereich oder Kostenstelle verknüpfbar sein.
- Externe Einsätze sollen von internen Einsätzen unterscheidbar sein.
- Zusatzdienste, Ausfälle und Ersatzlösungen sollen auswertbar sein.
- Periodenabschlüsse sollen Grundlage für Controlling-Auswertungen bilden können.

Mögliche spätere Modelle oder Felder:

- `ResourceDeviation`
- `DeviationReason`
- `CostCategory`
- `CostCenter`
- `ExternalStaffingFlag`
- `ActualWorkRecord`
- `ControllingExport`

Diese Modelle sind nicht Bestandteil der unmittelbaren MVP-Umsetzung, sollen aber architektonisch nicht verhindert werden.

## Nicht-Ziele

Diese ADR führt nicht ein:

- vollständige Finanzbuchhaltung
- Lohnabrechnung
- automatische Zuschlagsberechnung
- verbindliche Kostenrechnung
- Budgetplanung
- automatische Personalbedarfsberechnung
- individuelle Leistungsbewertung von Mitarbeitenden

Diese Themen können später separat geprüft werden.

## Ethische und kommunikative Leitlinie

Resource Controlling darf nicht als individuelle Überwachungslogik verstanden werden.

CareFlow soll nicht primär fragen:

> Wer verursacht Kosten?

Sondern:

> Welche Planabweichungen erzeugen wiederkehrenden Ressourcenbedarf?

Die Auswertung soll auf strukturelle Planungs-, Führungs- und Ressourcenfragen ausgerichtet sein.

Die Sprache soll lernorientiert bleiben:

- Abweichung
- Zusatzbedarf
- operative Ursache
- strukturelle Belastung
- wiederkehrendes Muster
- Ressourcenwirkung

Nicht im Vordergrund stehen sollen Schuldzuweisung, Kontrolle oder individuelle Bewertung.

## Entwicklungsstadium

Resource Controlling wird nicht im aktuellen MVP umgesetzt.

Es wird relevant, sobald folgende Grundlagen bestehen:

- PlanningPeriod
- Referenzplan
- operativer CareFlow-Plan
- Ist-Abschluss
- Period Closure
- Planungsgüte-Auswertung

Ab diesem Stadium kann CareFlow strukturierte Soll-Ist-Abweichungen für Controlling und Heimleitung bereitstellen.

## Zusammenhang mit anderen ADRs

Diese ADR baut auf folgenden Entscheidungen auf:

- ADR-022 – Referenzplan und operativer CareFlow-Plan
- ADR-023 – Planungsgüte, Periodenabschluss und organisationales Lernen
- ADR-024 – PlanningPeriod als periodische Grundstruktur
- ADR-025 – Ereignisbasierte Planänderungen
- ADR-026 – Decision Log und Human-in-the-Loop-Entscheidungen

## Zusammenfassung

CareFlow soll langfristig strukturierte Soll-Ist-Abweichungen für Resource Controlling bereitstellen.

CareFlow ersetzt kein Finanz- oder Lohnsystem. Es erklärt jedoch die operative Geschichte hinter den Zahlen: Was war geplant, was geschah tatsächlich, welche Ereignisse führten zu Abweichungen, welche Massnahmen wurden getroffen und welche Ressourcenwirkung entstand daraus.

Damit wird CareFlow nicht nur für Pflegeführung, sondern auch für Heimleitung, Controlling und Trägerschaft relevant.