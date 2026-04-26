ADR-056 - Leadership Gap Severity Semantics

Status: Accepted
Datum: 2026-04-26
Kontext: Seit Commit dda1f38 enthaelt day.shifts[] in der Leadership Day View ein read-only gap-Feld mit primaryCause, signals, effectiveCoverageGap und effectiveQualificationGap. Eine kuenftige Severity soll daraus eine einfache, read-only Dringlichkeit fuer die Leadership Day View ableiten.

Entscheidung: Severity ist zunaechst leadership-spezifisch und wird nicht direkt in den Shared Gap Interpretation Helper integriert. Der Shared Helper bleibt diagnostisch. Severity ist eine darstellungs- und fuehrungsspezifische Einordnung.

Severity bleibt read-only und deterministisch. Sie ist keine Empfehlung, loest keine Planaenderung aus und ist kein Human-in-the-Loop-Genehmigungsworkflow. Sie veraendert headline, contextLine und deutsche Texte nicht. Sie veraendert Planning Comparison nicht und ist zunaechst nur fuer die Leadership Day View vorgesehen.

Geplante Werte:
- none
- attention
- critical

Geplante Ableitungsregeln:
- critical: effectiveCoverageGap > 0 oder effectiveQualificationGap > 0.
- attention: effectiveCoverageGap === 0 und effectiveQualificationGap === 0 und primaryCause === "request_context".
- none: effectiveCoverageGap === 0 und effectiveQualificationGap === 0 und primaryCause === "none".

Fuer mixed gilt:
- mixed mit effektiver Coverage- oder Qualification-Luecke wird critical.
- mixed ohne effektive Luecke wird konservativ attention, falls dieser Fall spaeter auftreten sollte.

Begruendung: Eine einfache Severity kann spaeter helfen, aggregierte Shift-Zeilen in der Leadership Day View schneller lesbar zu machen, ohne Entscheidungslogik, Empfehlungen oder automatische Workflows einzufuehren.

Konsequenzen:
- Qualification-Function-Warnings sind aktuell nicht Teil von gap und werden in dieser Severity-Semantik zunaechst nicht abgebildet.
- Aggregierte Shift-Zeilen bleiben relevant: Severity gilt pro sichtbarer aggregierter Shift-Zeile, nicht pro einzelner Shift-Instanz.
- Ein spaeterer Schritt 8.4b kann einen kleinen, isolierten Leadership-Helper mit Tests ergaenzen, zum Beispiel leadership-gap-severity.ts.
