# ADR-008 – Controlled Execution Flow and Recursion Avoidance

## Status
Accepted

## Kontext
CareFlow soll als stabiles, nachvollziehbares und wartbares Führungsinstrument entwickelt werden. Bereits im MVP ist absehbar, dass zentrale Systemteile wie Validierung, Planung, Risikoprüfung und Reporting in einer festen Verarbeitungslogik zusammenwirken. Mit wachsender Komplexität besteht grundsätzlich das Risiko von unkontrollierten Aufrufketten, zyklischen Modulabhängigkeiten, unnötiger Rekursion oder schwer nachvollziehbaren Verarbeitungsschleifen.

Da solche Strukturen zu Instabilität, schwerer Debuggbarkeit und im Extremfall zu Stack-Overflow-Fehlern oder Endlosschleifen führen können, braucht CareFlow früh ein klares Architekturprinzip zur Steuerung des Ausführungsflusses.

## Entscheidung
Für CareFlow gilt als Architekturprinzip:

- Der Ausführungsfluss wird grundsätzlich kontrolliert, gerichtet und nachvollziehbar aufgebaut.
- In der Kernlogik des MVP wird Rekursion vermieden, sofern sie nicht fachlich oder technisch zwingend erforderlich ist.
- Iterative und klar abgegrenzte Verarbeitungsschritte werden bevorzugt.
- Zyklische Aufrufketten zwischen zentralen Modulen werden vermieden.
- Verarbeitungsschritte sollen einer klaren Flussrichtung folgen, insbesondere zwischen Validierung, Planung, Risikoprüfung und Reporting.
- Kritische Verarbeitungslogiken sollen mit Schutzmechanismen wie Iterationsgrenzen, Abbruchbedingungen oder Wiederholungskontrollen vorbereitet werden.
- Datenstrukturen und Serialisierungswege sollen möglichst so gestaltet werden, dass zirkuläre Referenzen vermieden werden.

Dieses ADR definiert bewusst ein frühes Architekturprinzip, noch keine vollständige technische Feinspezifikation.

## Begründung
- Rekursive oder zyklische Logiken erhöhen die Fehleranfälligkeit.
- Unkontrollierte Aufrufketten erschweren Debugging, Logging und Validation.
- CareFlow soll fachlich erklärbar bleiben; das gelingt besser mit linearen und nachvollziehbaren Verarbeitungswegen.
- Ein frühes Architekturprinzip reduziert das Risiko späterer struktureller Fehlentwicklungen.
- Iterative, kontrollierte Abläufe sind für das geplante MVP fachlich ausreichend und technisch robuster.

## Konsequenzen
- Die Modularchitektur wird so entworfen, dass klare Flussrichtungen bevorzugt werden.
- Rekursive Muster werden in der MVP-Logik nicht als Standardansatz verwendet.
- Spätere Regel-Engine- oder Forecast-Logiken müssen auf kontrollierte Ausführung geprüft werden.
- Logging und Debugging profitieren von klaren Verarbeitungspfaden.
- Komplexere Rückkopplungsmechanismen müssen später bewusst und abgesichert entworfen werden.

## Alternativen
- Rekursion und freie Aufrufketten als normales Architekturmittel zulassen (verworfen wegen höherer Fehleranfälligkeit und geringerer Nachvollziehbarkeit)
- Schutzmechanismen erst nach Auftreten von Problemen einführen (verworfen wegen hohem Nachrüstaufwand)
- Vollständig offene Regelverkettung im MVP zulassen (verworfen wegen Instabilitätsrisiko)

## Hinweis auf spätere Präzisierung
Sobald die Modularchitektur und die Regel-Engine von CareFlow konkret definiert sind, soll ein nachgelagertes ADR erstellt werden, das dieses Architekturprinzip präzisiert.

Dieses Folge-ADR soll insbesondere festlegen:
- die konkrete Ausführungsreihenfolge zentraler Module
- zulässige und unzulässige Modulaufrufe
- Iterations- und Abbruchregeln in der Regel-Engine
- Umgang mit Wiederholung, Re-Checks und potenziellen Rückkopplungen
- technische Schutzmechanismen gegen Endlosschleifen, zyklische Aufrufe und tiefe Verarbeitungsketten