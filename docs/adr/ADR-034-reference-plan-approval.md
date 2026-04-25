ADR-034 – Referenzplan entsteht erst nach Validierung und Freigabe

Status: Accepted
Datum: 2026-04-25
Kontext: Ein Monatsplan ist in Pflegeheimen häufig die offizielle Planperiode. CareFlow benötigt diesen Monatsplan als Vergleichsbasis. Diese Vergleichsbasis darf aber erst entstehen, wenn der importierte Planentwurf geprüft und bewusst akzeptiert wurde.

Entscheidung: Der Referenzplan ist der freigegebene Monatsplan einer Planperiode. Er entsteht erst nach Import, Mapping, Normalisierung, technischer Prüfung, fachlicher Validierung, Abgleich mit bekannten Rollplanungsdaten und expliziter Freigabe durch die Führung.

Begründung: Der Referenzplan bildet die offizielle Ausgangslage. Nur wenn dieser Stand bewusst fixiert ist, kann CareFlow später sauber unterscheiden, ob ein Risiko bereits im Ausgangsplan vorhanden war oder erst operativ entstanden ist.

Konsequenzen:
Der Referenzplan ist nicht identisch mit dem Import. Ein Planentwurf kann korrigiert, ergänzt oder verworfen werden. Nach der Freigabe dient der Referenzplan als Vergleichsbasis. Operative Änderungen dürfen ihn nicht überschreiben.