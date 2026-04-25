ADR-037 – Verfügbarkeitswünsche werden simuliert, bevor sie wirksam werden

Status: Accepted
Datum: 2026-04-25
Kontext: Verfügbarkeitswünsche oder Dienständerungswünsche verändern die operative Lage nicht automatisch. Sie können aber kipprelevant sein, wenn ihre Genehmigung eine Schicht unterdeckt, eine Qualifikation entfernt oder eine Funktion gefährdet.

Entscheidung: Verfügbarkeitswünsche verändern die operative Besetzung erst nach Genehmigung. Vorher simuliert CareFlow die Wirkung einer möglichen Genehmigung. Wenn ein Wunsch kipprelevant wäre, erzeugt CareFlow Hinweise und Alternativvorschläge.

Begründung: CareFlow soll differenzieren zwischen aktueller Realität und möglicher zukünftiger Wirkung. Ein Wunsch ist kein Ausfall, aber ein potenzielles Führungsrisiko.

Konsequenzen:
requested zählt nicht automatisch als Ausfall. CareFlow muss prüfen, ob die Genehmigung eines Wunsches Mindestbesetzung, qualifizierte Besetzung oder Funktion gefährden würde. Die Rollplanung wird erst angepasst, wenn die Führung eine Entscheidung genehmigt.