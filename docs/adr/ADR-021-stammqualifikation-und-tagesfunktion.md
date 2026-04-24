# ADR-021: Stammqualifikation und Tagesfunktion

## Status

Accepted

## Kontext

CareFlow unterscheidet im MVP zwischen stabilen Stammdaten einer Person und der operativen Verantwortung, die diese Person an einem konkreten Tag oder in einer konkreten Schicht übernimmt.

Bisher wurden Qualifikation und Rolle teilweise über grobe Felder wie `role`, `qualified` oder `qualificationLevel` beschrieben. Für die fachliche Steuerung in Pflegeinstitutionen reicht diese Sicht allein nicht aus. Eine Person kann eine stabile Grundqualifikation besitzen, aber je nach Tag unterschiedliche Funktionen übernehmen. Gleichzeitig sind nicht alle Funktionen mit jeder Grundqualifikation fachlich zulässig.

Diese Unterscheidung ist wichtig, weil CareFlow nicht nur formale Besetzung sichtbar machen soll, sondern auch operative Führungsrisiken, ohne dabei automatische Entscheidungen zu treffen oder Assignments zu blockieren.

## Entscheidung

CareFlow führt die Trennung zwischen Stammqualifikation und tagesbezogener Funktion explizit im Modell und in der Validierung.

- `Employee.baseQualification` beschreibt die stabile Grundqualifikation einer Person im Mitarbeitendenstamm.
- `Assignment.assignedFunction` beschreibt die operative Funktion einer Person in einer konkreten Schicht- bzw. Assignment-Situation.
- Die bestehende `Employee.role` bleibt aus Gründen der API-Stabilität vorerst erhalten.
- Eine isolierte Domain-Regelbasis prüft, ob eine `assignedFunction` grundsätzlich zur `baseQualification` passt.
- Verstöße gegen diese Regel werden nicht beim Erstellen eines Assignments blockiert.
- Verstöße erscheinen in der Full Validation als `warning`.

## Begründung

Die Trennung erhält eine zentrale fachliche Wahrheit von CareFlow:

Qualifikation beantwortet, welche stabile fachliche Grundlage eine Person mitbringt. Tagesfunktion beantwortet, welche operative Verantwortung diese Person in einer konkreten Schicht übernimmt.

Diese beiden Konzepte dürfen nicht vermischt werden. Eine dipl. Pflegefachperson kann unterschiedliche Tagesfunktionen übernehmen, ohne dass sich ihre Stammqualifikation ändert. Umgekehrt darf eine tagesbezogene Verantwortungsfunktion nicht automatisch aus einer allgemeinen Rolle oder einem booleschen Qualifikationsfeld abgeleitet werden.

Die Entscheidung, Verstöße nur als Warnung sichtbar zu machen, folgt dem Human-in-the-loop-Prinzip von CareFlow. Das System unterstützt Führung durch transparente Hinweise, ersetzt aber nicht die menschliche Entscheidung in der konkreten Planungssituation.

## Konsequenzen

Positive Konsequenzen:

- Die fachliche Unterscheidung zwischen Stammdaten und operativer Tagesverantwortung ist im Code sichtbar.
- Validierungsbefunde bleiben erklärbar und auf konkrete Backend-Fakten zurückführbar.
- Assignments bleiben möglich, auch wenn eine Kombination fachlich auffällig ist.
- Führungspersonen erhalten einen Hinweis, ohne dass CareFlow automatisch blockiert oder entscheidet.
- Die Regelbasis bildet eine Grundlage für spätere Skill-Mix-, Leadership- und Forecast-Funktionen.

Strukturelle Konsequenzen:

- `baseQualification` und `assignedFunction` müssen in zukünftigen Änderungen getrennt behandelt werden.
- Neue Regeln zwischen Qualifikation und Funktion gehören in eine explizite Domain-Regelbasis, nicht in verdeckte UI- oder Schreiblogik.
- Full Validation darf solche Befunde sichtbar machen, bleibt aber eine read-only Auswertung.
- Leadership View und Planning Comparison werden durch diese Entscheidung nicht automatisch erweitert.

Kompatibilitaet / Legacy-Felder:

- `Employee.role` bleibt vorerst aus API-, Import- und Anzeige-Kompatibilitaet erhalten.
- `Employee.qualified` und `Employee.qualificationLevel` bleiben vorerst erhalten, weil bestehende Import- und Validierungslogik daran haengt.
- `baseQualification` ersetzt diese Felder noch nicht automatisch.
- Die bestehende `requiredQualifiedCount`-Logik bleibt vorerst unveraendert.
- Eine spaetere Migration von `qualified` und `qualificationLevel` auf `baseQualification` wird separat entschieden.

Risiken und Grenzen:

- Die aktuelle MVP-Regelbasis ist bewusst einfach und nicht einrichtungsspezifisch konfigurierbar.
- Die Warnung bedeutet keine automatische Unzulässigkeit im organisatorischen Einzelfall.
- Spätere Erweiterungen müssen vermeiden, aus Warnungen verdeckte Scores oder automatische Empfehlungen abzuleiten.

## Aktueller Umsetzungsstand

Umgesetzt ist:

- `Employee.baseQualification` mit den MVP-Werten `DIPL_PFLEGE`, `FAGE`, `AGS`, `PFLEGEHILFE`, `LEARNER`, `EXTERNAL`, `OTHER`.
- `Assignment.assignedFunction` mit den MVP-Werten `Pflegeleitung`, `Hausverantwortung`, `Tagesverantwortung`, `Pflegedienst`, `Springer`, `Lernende`, `Externe`, `Andere`.
- Eine isolierte Regelbasis unter `src/modules/validations/qualification-function/qualification-function.rules.ts`.
- Unit-Tests für die Regelbasis.
- Integration der Regelbasis in die Full Validation als `warning` mit erklärbarer Meldung.
- Integrationstests für die Full Validation.

Nicht umgesetzt ist:

- keine Blockierung beim Assignment-Create.
- keine Erweiterung der Leadership View.
- keine Erweiterung der Planning Comparison.
- keine einrichtungsspezifische Konfiguration der Regelmatrix.
- keine Forecast- oder Empfehlungsschicht.
