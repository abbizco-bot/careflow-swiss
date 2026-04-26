ADR-057 - Leadership Gap Severity API Output

Status: Accepted
Datum: 2026-04-26
Kontext: Seit Commit 72a9690 gibt die Leadership Day View im bestehenden day.shifts[].gap-Objekt ein read-only Feld severity aus. Die fachlichen Regeln fuer diese Severity wurden zuvor in ADR-056 dokumentiert.

Entscheidung: severity ist Teil von day.shifts[].gap und wird ausschliesslich ueber deriveLeadershipGapSeverity(...) abgeleitet.

severity hat folgende Werte:
- none
- attention
- critical

severity bleibt leadership-spezifisch. Sie ist keine Empfehlung, loest keine Planaenderung aus und ist kein Human-in-the-Loop-Workflow. Sie veraendert headline und contextLine nicht, veraendert keine deutschen Texte und veraendert Planning Comparison nicht.

Qualification-Function-Warnings sind weiterhin nicht Teil dieser Severity. Severity gilt pro sichtbarer aggregierter day.shifts[]-Zeile.

Begruendung: Das Feld dient einer spaeteren Frontend- und Fuehrungssicht als strukturierte Dringlichkeitsinformation, ohne Entscheidungs- oder Planungslogik in die API-Ausgabe einzubauen.

Konsequenzen:
- day.shifts[].gap enthaelt neben primaryCause, signals, effectiveCoverageGap und effectiveQualificationGap nun auch severity.
- Die Severity bleibt read-only und deterministisch.
- Bestehende Headline-, Context-Line-, Text- und Planning-Comparison-Semantik bleibt unveraendert.
