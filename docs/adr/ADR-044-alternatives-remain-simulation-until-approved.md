ADR-044 – Alternativen bleiben Simulation bis zur Genehmigung

Status: Accepted
Datum: 2026-04-25
Kontext: CareFlow kann mehrere Alternativen simulieren. Diese Alternativen dürfen nicht mit der gültigen operativen Planlage verwechselt werden.

Entscheidung: Eine Alternative bleibt bis zur expliziten Genehmigung eine Simulation beziehungsweise Entscheidungsoption. Sie verändert weder Referenzplan noch operative Planlage noch Rollplanung.

Begründung: Der Unterschied zwischen gültiger Realität und möglicher Option ist für Nachvollziehbarkeit und Führungsverantwortung zentral.

Konsequenzen:
CareFlow muss zwischen operativer Lage, Simulation, offenem Vorschlag, genehmigter Änderung und angewendeter Änderung unterscheiden. Nur angewendete genehmigte Änderungen verändern die operative Planlage.