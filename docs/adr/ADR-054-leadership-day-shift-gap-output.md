ADR-054 - Leadership Day Shift Gap Output

Status: Accepted
Datum: 2026-04-26
Kontext: Ab Commit dda1f38 gibt die Leadership Day View pro Schicht ein strukturiertes Gap-Diagnosefeld aus. Die interne Gap-Interpretation war bereits vorbereitet und wird nun in der Day-View-API sichtbar, ohne die bestehende Fuehrungsheadline oder Context-Line zu veraendern.

Entscheidung: Die Leadership Day View gibt in day.shifts[] pro aggregierter Schicht ein read-only Feld gap aus. Dieses Feld enthaelt primaryCause, signals, effectiveCoverageGap und effectiveQualificationGap.

primaryCause kann folgende Werte haben:
- none
- operational
- absence
- request_context
- mixed

signals bleiben technische Codes. In dieser Phase werden keine deutschen Labels, Erklaerungstexte oder Empfehlungen daraus erzeugt.

Begruendung: Das Feld macht operative Gap-Ursachen strukturiert sichtbar und schafft eine stabile Grundlage fuer spaetere Frontend- und Fuehrungssichten. Es bleibt dabei ein Diagnosefeld, keine Planungsentscheidung und keine Empfehlung.

Konsequenzen:
- gap ist read-only.
- gap veraendert keine Planung.
- gap erzeugt keine Empfehlung.
- gap veraendert headline und contextLine nicht.
- Leadership Day View und Planning Comparison bleiben getrennte Read-Layer.
- Beide duerfen dieselbe Shared Gap Interpretation nutzen, ohne direkt aneinander gekoppelt zu werden.
- Das Feld dient als strukturierte Entscheidungsgrundlage fuer spaetere sichtbare Fuehrungsdarstellungen.
