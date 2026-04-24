# CareFlow Glossar

Dieses Glossar ist die semantische Referenz fuer CareFlow-Dokumentation, Produktkommunikation und UI-nahe Sprache. Es ersetzt keine ADRs und keine technische API-Dokumentation.

## Produktbegriffe

### CareFlow

CareFlow ist ein Fuehrungsinstrument fuer die personelle Steuerung in Alters- und Pflegeheimen. Es ersetzt keine Dienstplanung, keine Lohnsysteme und keine Dokumentationssoftware, sondern macht operative Daten fuer Fuehrungsentscheidungen lesbar.

### Leadership Layer

Der Leadership Layer bezeichnet CareFlow als zusaetzliche Fuehrungsebene ueber operativen Basissystemen. CareFlow verwaltet nicht den gesamten Betrieb, sondern verdichtet relevante Signale fuer Leitung und Planung.

### Lagebeurteilung

Lagebeurteilung ist die fuehrungsorientierte Einordnung einer operativen Situation. Sie bleibt in CareFlow an explizite Backend-Fakten, Validierungen und nachvollziehbare Regeln gebunden.

### Risk Radar

Risk Radar bezeichnet die Sichtbarmachung von Besetzungs-, Qualifikations- und Funktionsrisiken. Der Begriff darf nicht als Black-Box-Scoring verstanden werden.

### Handlungsfenster

Das Handlungsfenster beschreibt den Zeitraum, in dem eine erkennbare Instabilitaet noch geordnet beeinflusst werden kann, bevor nur noch kurzfristige Notloesungen bleiben.

### Tragfaehigkeit

Tragfaehigkeit beschreibt die fachliche und organisatorische Belastbarkeit einer Schicht oder eines Tages. Sie umfasst mehr als reine Kopfzahl, bleibt aber an sichtbare Daten und Regeln gebunden.

### Entscheidungslage

Eine Entscheidungslage entsteht, wenn eine operative Abweichung Fuehrungsurteil erfordert. CareFlow zeigt solche Lagen an, trifft die Entscheidung aber nicht selbst.

### Human-in-the-loop

Human-in-the-loop bedeutet, dass CareFlow Hinweise und Warnungen liefert, die fachliche Entscheidung aber beim Menschen bleibt. CareFlow blockiert nicht automatisch und ersetzt keine Leitung.

### Erklaerbarkeit

Erklaerbarkeit bedeutet, dass Warnungen, Hinweise und Verdichtungen nachvollziehbar auf konkrete Backend-Fakten, Validierungen oder dokumentierte Regeln zurueckgefuehrt werden koennen.

## Fachliche Kernbegriffe

### Stammqualifikation

Stammqualifikation ist die stabile fachliche Grundqualifikation einer Person im Mitarbeitendenstamm. Im aktuellen Modell wird sie durch `Employee.baseQualification` vorbereitet.

### Tagesfunktion

Tagesfunktion ist die operative Rolle oder Verantwortung einer Person in einer konkreten Schicht oder Zuteilung. Im aktuellen Modell wird sie durch `Assignment.assignedFunction` beschrieben.

### Operative Qualifikationszaehlung

Die operative Zaehlgrundlage fuer `requiredQualifiedCount` bleibt vorerst `Employee.qualified`. `Employee.baseQualification` ersetzt diese Zaehlung nicht automatisch.

### Qualification-function warning

Eine Qualification-function warning weist auf eine fachlich auffaellige Kombination aus `Employee.baseQualification` und `Assignment.assignedFunction` hin. Sie ist ein Hinweis fuer Fuehrung und Validation, keine automatische Assignment-Blockierung.

### Read-only Fuehrungssicht

Eine Read-only Fuehrungssicht macht Lage, Historie, Vergleich oder Warnungen sichtbar, ohne operative Datensaetze wie Assignments, Shifts oder Validations zu veraendern.

## Sprachregel

- Begriffe muessen konsistent mit ADR-021 und den Governance-Dokumenten verwendet werden.
- Sprachliche Verdichtung darf erklaeren, aber keine neue fachliche Wahrheit erzeugen.
- Technische Codes duerfen stabil und knapp bleiben; fuehrungstaugliche Sprache entsteht in der Anzeige- oder Dokumentationsschicht.
- Warnungen werden als Hinweise formuliert, nicht als automatische Entscheidungen.
