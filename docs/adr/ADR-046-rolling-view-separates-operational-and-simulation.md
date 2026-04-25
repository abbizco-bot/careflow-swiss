ADR-046 – Rollierende Sicht unterscheidet gültige Lage, Simulation und offene Entscheidung

Status: Accepted
Datum: 2026-04-25
Kontext: In der rollierenden Sicht können gleichzeitig gültige operative Lage, offene Wünsche, Vorschläge, Führungsvorschläge, Simulationen und genehmigte Änderungen sichtbar sein.

Entscheidung: Die rollierende Führungssicht unterscheidet jederzeit zwischen gültiger operativer Lage, Simulation, offenem Vorschlag, genehmigter Änderung, angewendeter Änderung und unvollständiger Datenlage.

Begründung: Ohne diese Trennung könnte CareFlow falsche Sicherheit erzeugen oder Vorschläge fälschlich als gültige Planung darstellen.

Konsequenzen:
Ein Vorschlag darf nicht als Besetzung zählen. Eine Simulation darf nicht als operative Wahrheit erscheinen. Nur genehmigte und angewendete Änderungen wirken auf die operative Planlage.