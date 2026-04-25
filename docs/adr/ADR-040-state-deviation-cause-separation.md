ADR-040 – Abweichungen werden als Zustand, Abweichung und Ursache getrennt

Status: Accepted
Datum: 2026-04-25
Kontext: Eine einfache Warnung wie „Unterdeckung“ reicht für die Führung nicht aus. CareFlow muss erklären können, was aktuell kritisch ist, wie dies vom Referenzplan abweicht und wodurch die Abweichung entstanden ist.

Entscheidung: CareFlow trennt bei der Interpretation von Planungsdaten drei Ebenen: Zustand, Abweichung und Ursache. Zustand beschreibt die aktuelle Bewertung. Abweichung beschreibt den Unterschied zwischen Referenzplan und operativer Planlage. Ursache erklärt den nachvollziehbaren Grund dieser Abweichung.

Begründung: Nur diese Trennung macht CareFlow erklärungsfähig. Sie verhindert, dass aktuelle Zustände ohne Kontext angezeigt werden.

Konsequenzen:
Leadership-Meldungen sollen nicht nur „kritisch“ anzeigen, sondern erklären, ob das Risiko im Referenzplan vorhanden war, durch ein Ereignis entstand, durch einen Wunsch simulativ relevant wurde oder durch eine genehmigte Änderung kompensiert wurde.