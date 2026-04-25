ADR-048 – Rollierende Sicht liefert Vorinformationen für den nächsten Planentwurf

Status: Accepted
Datum: 2026-04-25
Kontext: Die rollierende Sicht kann bereits Informationen enthalten, die in den nächsten Monatsplan einfliessen sollten. Dazu gehören genehmigte Abwesenheiten, offene Wünsche, bekannte Risiken oder ungelöste Konflikte.

Entscheidung: Informationen aus der rollierenden Sicht können in den nächsten Planentwurf einfliessen. Sie erzeugen jedoch nicht automatisch den nächsten Referenzplan.

Begründung: CareFlow soll Lern- und Vorbereitungslogik ermöglichen, ohne den Freigabeprozess zu umgehen.

Konsequenzen:
Beim Import des nächsten Monatsplans werden bekannte Rollplanungsinformationen abgeglichen. Konflikte zwischen neuem CSV-Import und bestehenden Vorinformationen werden sichtbar gemacht. Der neue Referenzplan entsteht weiterhin erst nach Validierung und Freigabe.