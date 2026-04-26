ADR-055 - Leadership Headline Count Semantics

Status: Accepted
Datum: 2026-04-26
Kontext: Ein Smoke Test zeigte, dass GET /leadership/day?date=2082-08-11 zwei aggregierte day.shifts[]-Zeilen ausgibt, waehrend headline.detail "6 Schichten betroffen" lautet. Diese Differenz entsteht aus der bestehenden Zaehllogik der Leadership-Day-Headline.

Entscheidung: Die aktuelle Semantik von headline.detail bleibt unveraendert. Die Headline wird in buildLeadershipDayHeadline(...) gebildet. Fuer Unterdeckung zaehlt sie aktuell Full-Validation-Eintraege mit coverage.status === "understaffed".

Diese Zahl entspricht konkreten Shift-Instanzen bzw. Validierungsbefunden pro shiftId. Sie entspricht nicht zwingend der Anzahl sichtbarer day.shifts[]-Zeilen und nicht direkt dem effectiveCoverageGap.

day.shifts[] ist nach Shift-Typ aggregiert. gap.effectiveCoverageGap beschreibt die operative Luecke innerhalb der aggregierten Shift-Zeile.

Begruendung: Die Formulierung "Schichten betroffen" ist technisch vertretbar, weil konkrete Shift-Instanzen gezaehlt werden. Sie kann aber missverstaendlich wirken, wenn Leserinnen und Leser die Zahl mit den sichtbaren aggregierten day.shifts[]-Zeilen vergleichen.

Konsequenzen:
- Es wird jetzt keine Aenderung an headline, contextLine oder deutschen Texten vorgenommen.
- Diese ADR dokumentiert die aktuelle Semantik und ist kein Produktumbau.
- Ein spaeterer Mini-Fix kann pruefen, ob die Textformulierung praezisiert wird.
- Alternativ oder zusaetzlich koennten strukturierte Counts eingefuehrt werden, zum Beispiel affectedShiftInstanceCount und affectedShiftRowCount.
