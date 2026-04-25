ADR-041 – Keine falsche Kausalität in Leadership-Meldungen

Status: Accepted
Datum: 2026-04-25
Kontext: Wenn eine Schicht bereits im Referenzplan unterdeckt war und zusätzlich eine Krankmeldung auftritt, darf CareFlow nicht automatisch behaupten, die Unterdeckung sei durch die Krankmeldung entstanden.

Entscheidung: CareFlow darf Ursachen nur dann als Hauptursache darstellen, wenn sie durch Daten und Ereignislogik begründet sind. Ereignisse ohne Kippwirkung dürfen nicht als Ursache eines kritischen Zustands dargestellt werden.

Begründung: Falsche Kausalität würde Vertrauen zerstören und die Führung in die Irre führen. CareFlow muss präzise zwischen Referenzproblem, Ereigniswirkung, Verschärfung und nicht-kipprelevantem Kontext unterscheiden.

Konsequenzen:
Richtig ist zum Beispiel: „Unterdeckung war bereits im Referenzplan vorhanden; die Krankmeldung verschärft die Lage.“ Oder: „Unterdeckung war bereits im Referenzplan vorhanden; die Krankmeldung ist nicht kipprelevant.“ Falsch wäre: „Unterdeckung durch Krankheit“, wenn die Unterdeckung schon vorher bestand.