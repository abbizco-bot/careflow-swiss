ADR-035 – Bekannte Rollplanungsdaten fliessen in den nächsten Planentwurf ein

Status: Accepted
Datum: 2026-04-25
Kontext: Die rollierende Führungssicht kann bereits Informationen über den Folgemonat enthalten, etwa genehmigte Abwesenheiten, offene Wünsche, bekannte Konflikte oder früh sichtbare Risiken. Wenn ein neuer Monatsplan importiert wird, darf CareFlow dieses Vorwissen nicht ignorieren.

Entscheidung: Bekannte Informationen aus der Rollplanung des Vormonats fliessen in den Planentwurf der neuen Planperiode ein. Gesicherte Informationen werden in den Planentwurf übernommen. Unsichere Informationen bleiben als Hinweise sichtbar. Widersprüche zwischen CSV-Import und Rollplanung werden als Konflikte markiert.

Begründung: CareFlow soll nicht bei jedem Monatsimport wieder bei null beginnen. Vorwissen aus der rollierenden Führungssicht verbessert die Planqualität und macht Konflikte früh sichtbar.

Konsequenzen:
Wenn eine Person laut Rollplanung im Folgemonat genehmigt abwesend ist, der neue CSV-Import sie aber einplant, muss CareFlow einen Konflikt anzeigen. Der Konflikt darf nicht automatisch gelöst werden. Erst nach Prüfung und Freigabe entsteht der neue Referenzplan.