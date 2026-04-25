ADR-032 – CSV-/Polypoint-Import erzeugt Planentwurf, keinen Referenzplan

Status: Accepted
Datum: 2026-04-25
Kontext: CareFlow soll bestehende Planungsdaten aus Systemen wie Polypoint oder aus CSV-Dateien verarbeiten. Diese Daten sind jedoch externe Rohdaten. Sie können unvollständig, unterschiedlich codiert, fachlich uneindeutig oder lokal angepasst sein. Ein direkter Import als Referenzplan würde die Gefahr erzeugen, dass fehlerhafte oder ungeprüfte Daten als verbindliche Planbasis gelten.

Entscheidung: Ein CSV-/Polypoint-Import erzeugt in CareFlow niemals direkt einen freigegebenen Referenzplan. Der Import erzeugt zunächst einen Planentwurf. Dieser Planentwurf muss über Mapping, Normalisierung, technische Prüfung, fachliche Validierung, Abgleich mit bekannten Rollplanungsdaten und bewusste Freigabe durch die Führung gehen, bevor er zum Referenzplan wird.

Begründung: CareFlow ist ein Decision-Layer und kein blindes Importsystem. Die Qualität der späteren Führungslogik hängt davon ab, dass die Ausgangsdaten verstanden, geprüft und bewusst freigegeben werden.

Konsequenzen:
Der Importprozess braucht einen fachlichen Zwischenstatus „Planentwurf“. Der Referenzplan entsteht erst nach Freigabe. Importfehler, unbekannte Codes oder Konflikte müssen vor der Freigabe sichtbar werden. Codex darf Importlogik nicht so bauen, dass importierte Daten automatisch als Referenzplan gelten.