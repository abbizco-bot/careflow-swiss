ADR-038 – Inzidenzen erzeugen Vorschläge, keine automatischen Planänderungen

Status: Accepted
Datum: 2026-04-25
Kontext: Operative Inzidenzen wie Krankmeldungen, kurzfristige Abwesenheiten oder Ausfall einer Hausverantwortung können eine Schicht kritisch machen. CareFlow soll darauf reagieren, aber nicht autonom planen.

Entscheidung: Bei einer Inzidenz erkennt CareFlow die operative Wirkung, identifiziert betroffene Schicht, Qualifikation oder Funktion und erzeugt Alternativvorschläge. Diese Vorschläge verändern die operative Planlage oder Rollplanung nicht automatisch.

Begründung: CareFlow ist ein Führungs- und Decision-Layer, kein autonomes Dienstplanungssystem. Die Verantwortung für Planänderungen bleibt bei der Führung.

Konsequenzen:
CareFlow darf Alternativen vorschlagen, deren Wirkung simulieren und Risiken erklären. Es darf keine Ersatzperson automatisch eintragen, keine Funktion automatisch umverteilen und keine Rollplanung ohne Genehmigung verändern.