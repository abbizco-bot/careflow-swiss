ADR-033 – Mapping Profile zwischen externen Planungssystemen und CareFlow

Status: Accepted
Datum: 2026-04-25
Kontext: Polypoint- oder CSV-Exporte können unterschiedliche Spalten, Codes und Bedeutungen enthalten. Ein Code kann Diensttyp, Abwesenheit, Funktion, Status oder interne Markierung bedeuten. CareFlow benötigt jedoch getrennte interne Konzepte wie Schicht, Funktion, Abwesenheit, Qualifikation, Status und Mitarbeiterzuordnung.

Entscheidung: CareFlow verwendet Mapping-Profile, um externe Planungssprache in das interne CareFlow-Modell zu übersetzen. Ein Mapping-Profil muss mindestens Spaltenmapping, Wertemapping, Mitarbeitendenmapping, Schichtmapping, Funktionsmapping, Abwesenheitsmapping und Statusmapping unterstützen.

Begründung: Ein einheitlicher Import ist nur möglich, wenn lokale Polypoint- oder CSV-Codes kontrolliert in CareFlow-Begriffe übersetzt werden. Diese Übersetzung ist nicht nur technisch, sondern fachlich relevant.

Konsequenzen:
CareFlow muss Polypoint-/CSV-Daten zunächst als externe Rohdaten behandeln. Unbekannte Codes dürfen nicht stillschweigend übernommen werden. Mappingfehler müssen als Daten- oder Referenzkorrekturen unterscheidbar bleiben. Perspektivisch können Mapping-Profile pro Heim gespeichert werden.