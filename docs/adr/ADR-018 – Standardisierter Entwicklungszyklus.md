# ADR-018 – Standardisierter Entwicklungszyklus

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

CareFlow wird iterativ mit Unterstützung von ChatGPT, Codex und lokaler Entwicklung in VS Code weiterentwickelt.

Damit die Entwicklung nachvollziehbar, stabil und kontrollierbar bleibt, braucht das Projekt einen standardisierten Entwicklungszyklus.

Dieser Zyklus soll fachliche Entscheidungen, Umsetzung, Tests, Review und Dokumentation verbinden.

## Entscheidung

CareFlow folgt einem standardisierten Entwicklungszyklus.

Der Zyklus lautet:

> fachliche Klärung → Architekturentscheidung → Codex-Instruktion → Umsetzung → Test → Review → Dokumentation → nächste Iteration

Grössere fachliche Entscheidungen sollen als ADR dokumentiert werden.

Technische Änderungen sollen getestet und möglichst klein gehalten werden.

## Begründung

CareFlow entsteht schrittweise. Ohne klaren Entwicklungszyklus besteht die Gefahr, dass fachliche Entscheidungen, technische Änderungen und Dokumentation auseinanderlaufen.

Ein standardisierter Zyklus ermöglicht:

- bessere Nachvollziehbarkeit
- kleinere Umsetzungsschritte
- kontrollierte Erweiterung
- weniger Seiteneffekte
- bessere Zusammenarbeit mit KI-Werkzeugen
- sauberere Projektgeschichte

## Konsequenzen

Vor grösseren Änderungen soll geklärt werden:

- Was ist das fachliche Ziel?
- Welche bestehende Logik darf nicht gebrochen werden?
- Welche Dateien oder Module sind betroffen?
- Welche Tests sind nötig?
- Braucht es eine ADR?
- Welche Dokumentation muss angepasst werden?

## Nicht-Ziele

Diese ADR führt nicht ein:

- schwergewichtiges Projektmanagement
- umfangreiche Prozessbürokratie
- vollständiges Enterprise-Governance-Modell
- starre Releaseplanung

## Zusammenfassung

CareFlow folgt einem standardisierten Entwicklungszyklus, der fachliche Klärung, Architekturentscheidung, Umsetzung, Test und Dokumentation verbindet.