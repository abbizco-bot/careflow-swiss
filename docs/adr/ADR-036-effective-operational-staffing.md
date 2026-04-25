ADR-036 – Operative Planlage basiert auf wirksamer Besetzung

Status: Accepted
Datum: 2026-04-25
Kontext: Eine Person kann im Referenzplan eingetragen sein, aber operativ nicht verfügbar sein, etwa wegen Krankheit, Ferien, Weiterbildung, Abwesenheit oder Nichtverfügbarkeit. Für die Führung zählt nicht nur, wer geplant war, sondern wer tatsächlich wirksam eingesetzt werden kann.

Entscheidung: Die operative Planlage basiert auf der wirksamen operativen Besetzung. Eine Person zählt nur dann als operative Besetzung, wenn sie für die betreffende Schicht verfügbar, eingeplant und nicht durch ein blockierendes Ereignis neutralisiert ist.

Begründung: CareFlow muss die tatsächliche Führungsrealität abbilden. Eine im Referenzplan geplante, aber kranke Person darf für Mindestbesetzung, Qualifikation oder Funktion nicht operativ zählen.

Konsequenzen:
planned kann zählen, sofern kein blockierendes Ereignis vorliegt. sick, absent, vacation, cancelled und not_available zählen nicht als operative Besetzung. Ersatzpersonen zählen erst nach genehmigter operativer Übernahme. Der Referenzplan bleibt sichtbar, aber die operative Validierung bezieht sich auf die wirksame Besetzung.