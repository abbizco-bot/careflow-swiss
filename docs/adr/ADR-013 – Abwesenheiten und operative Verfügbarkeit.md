# ADR-013 – Abwesenheiten und operative Verfügbarkeit

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

In der Pflegeplanung ist nicht jede geplante Person tatsächlich operativ verfügbar. Mitarbeitende können krank, entschuldigt abwesend, extern im Einsatz, in Weiterbildung oder aus anderen Gründen nicht einsetzbar sein.

CareFlow muss zwischen geplanter Zuweisung und tatsächlicher operativer Verfügbarkeit unterscheiden.

## Entscheidung

CareFlow bewertet die operative Besetzung nicht allein anhand geplanter Assignments, sondern berücksichtigt Verfügbarkeit und Abwesenheiten.

Für die wirksame Besetzung zählen nur Personen, die tatsächlich operativ verfügbar sind.

Abwesenheiten wie Krankheit oder entschuldigte Absenz reduzieren die operative Besetzung, auch wenn die Person ursprünglich geplant war.

## Begründung

Ein Dienstplan kann formal vollständig aussehen, obwohl Personen tatsächlich nicht verfügbar sind.

CareFlow soll die reale Führungslage anzeigen, nicht nur den ursprünglichen Planstatus.

Dadurch kann sichtbar werden:

- geplante, aber nicht verfügbare Personen
- Unterdeckung durch Abwesenheit
- weiterhin vorhandene oder fehlende Qualifikation
- Bedarf an Ersatz oder Risikoentscheidung

## Konsequenzen

CareFlow soll Verfügbarkeit als eigene fachliche Dimension behandeln.

Mögliche Statuswerte:

- planned
- available
- sick
- absent
- requested
- external
- unavailable
- replaced

Die konkrete technische Umsetzung kann schrittweise erfolgen.

## Nicht-Ziele

Diese ADR führt nicht ein:

- vollständige Absenzenverwaltung
- HR-System-Funktionalität
- Lohnrelevanz
- arbeitsrechtliche Bewertung
- automatische Ersatzplanung

## Zusammenfassung

CareFlow unterscheidet zwischen geplanter Zuweisung und operativer Verfügbarkeit. Für die Führungslage zählt nicht nur, wer geplant ist, sondern wer tatsächlich verfügbar ist.