ADR-047 – Rollierende Sicht überschreitet Monatsgrenzen mit Datenlage-Kennzeichnung

Status: Accepted
Datum: 2026-04-25
Kontext: Eine 28-Tage-Sicht kann über Monatsgrenzen hinausgehen. Für den aktuellen Monat kann ein freigegebener Referenzplan vorhanden sein, während für den Folgemonat nur ein Planentwurf, Vorinformationen oder unvollständige Daten vorliegen.

Entscheidung: Die rollierende Sicht endet nicht an Monatsgrenzen. CareFlow muss jedoch die Datenlage jenseits der aktuellen Referenzperiode klar kennzeichnen.

Begründung: Führung muss früh in den Folgemonat sehen können, darf aber keine falsche Sicherheit erhalten, wenn dort noch kein freigegebener Referenzplan existiert.

Konsequenzen:
CareFlow unterscheidet in der rollierenden Sicht: Referenzplan vorhanden, Planentwurf vorhanden, nur Vorinformationen vorhanden oder Datenlage unvollständig. Die Validierungstiefe richtet sich nach der Datenlage.