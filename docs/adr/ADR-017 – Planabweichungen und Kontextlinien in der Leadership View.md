# ADR-017 – Planabweichungen und Kontextlinien in der Leadership View

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

Die Leadership View soll nicht nur anzeigen, dass ein Tag oder eine Schicht kritisch ist. Sie soll auch kurz erklären, warum.

Eine solche Erklärung muss knapp, verständlich und führungsrelevant sein.

Dafür wurde die Idee einer Kontextlinie eingeführt.

## Entscheidung

Die Leadership View kann eine Kontextlinie anzeigen, wenn ein Ereignis oder eine Planabweichung die aktuelle Lage erklärt.

Die Kontextlinie soll eine kurze, verdichtete Beschreibung liefern, zum Beispiel:

- Krankmeldung wirkt auf Frühdienst
- unsichere Besetzung betrifft Spätdienst
- Qualifikationslücke durch Ausfall
- keine aktuelle Veränderung
- Unterdeckung ohne neues Ereignis

Die Kontextlinie wird nicht angezeigt, wenn kein relevanter Kontext vorliegt.

## Begründung

Führungspersonen brauchen schnell erfassbare Lageinformationen.

Eine Kontextlinie hilft, den Unterschied zwischen Status und Ursache sichtbar zu machen.

Beispiel:

> Unterdeckung

ist weniger hilfreich als:

> Unterdeckung durch Krankmeldung im Frühdienst

Gleichzeitig soll die UI nicht überladen werden. Daher muss die Kontextlinie selektiv und präzise bleiben.

## Konsequenzen

Die Kontextlogik soll:

- Ereignisse auswerten
- Wirkung auf Schicht oder Tag prüfen
- nur relevante Kontexte anzeigen
- mehrere Ereignisse sinnvoll priorisieren
- stabile Tage nicht unnötig kommentieren

## Nicht-Ziele

Diese ADR führt nicht ein:

- vollständige Ereignishistorie in der Leadership View
- ausführliche Berichtsfunktion
- automatische Entscheidungslogik
- vollständige Ursachenanalyse

## Zusammenfassung

Kontextlinien erklären in der Leadership View kurz, warum eine Lage relevant ist. Sie machen Planabweichungen verständlicher, ohne die Führungssicht zu überladen.