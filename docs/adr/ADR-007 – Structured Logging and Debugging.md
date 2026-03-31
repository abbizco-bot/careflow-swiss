# ADR-007 – Structured Logging and Debugging Approach

## Status
Accepted

## Kontext
CareFlow soll als nachvollziehbares Führungsinstrument entwickelt werden. Das System muss nicht nur technisch stabil sein, sondern auch fachlich erklärbar bleiben. Da Fehlerquellen in CareFlow sowohl im Code als auch in Regeln und Daten liegen können, braucht das Projekt einen einheitlichen Ansatz für Logging und Debugging.

## Entscheidung
Für CareFlow wird ein strukturierter Logging- und Debugging-Ansatz eingeführt.

Logging wird in zwei Hauptkategorien unterteilt:
- technisches Logging
- fachliches Entscheidungs-Logging

Zusätzlich werden Datenqualitätsereignisse und zentrale Prozessereignisse protokolliert.

Debugging wird als systematischer Teil der Entwicklung verstanden und umfasst drei Ebenen:
- technisches Debugging
- Logik-Debugging
- Daten-Debugging

Im MVP gilt:
- jedes zentrale Modul schreibt strukturierte Logs
- Logs werden mit einheitlichen Feldern erzeugt
- fachlich relevante Regeln und Entscheidungen werden explizit protokolliert
- Debugging erfolgt modulweise, nicht nur systemweit
- Logs dienen sowohl der Fehlersuche als auch der Nachvollziehbarkeit

## Begründung
- technische Fehler allein erklären im CareFlow-Kontext nicht alle Probleme
- viele Fehler entstehen durch Datenmängel oder unklare Regelwirkungen
- die fachliche Erklärbarkeit ist Teil des Produktwerts
- strukturierte Logs verbessern Debugging, Validation und Vertrauen
- ein früher Standard verhindert spätere Inkonsistenzen zwischen Modulen

## Konsequenzen
- Logging wird von Anfang an in die Modularchitektur integriert
- die Entwicklung benötigt klare Ereignistypen und Log-Felder
- zusätzliche Disziplin beim Implementieren ist erforderlich
- Logs können später für Debug-Modus, Validation und Reporting genutzt werden
- CareFlow bleibt besser erklärbar und wartbar

## Alternativen
- rein technisches Logging ohne fachliche Entscheidungslogs (verworfen wegen mangelnder Erklärbarkeit)
- ad-hoc-Debugging ohne gemeinsame Struktur (verworfen wegen Inkonsistenz)
- Logging erst in späteren Versionen einführen (verworfen wegen hohem Nachrüstaufwand)
- vollständige externe Observability-Plattform bereits im MVP (verworfen wegen unnötiger Komplexität)