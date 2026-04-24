# ADR-012 – Tageskontext und ereignisbasierte Führungshinweise

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

Eine Schicht kann unterdeckt oder kritisch sein, ohne dass sofort klar ist, warum. Für Führungspersonen ist jedoch nicht nur der Status wichtig, sondern der Kontext.

Beispiele:

- Unterdeckung durch Krankmeldung
- Qualifikationslücke durch Ausfall einer dipl. HF
- Unsichere Besetzung durch Anfrage oder offene Verfügbarkeit
- Keine aktuelle Veränderung trotz bestehender knapper Planung

CareFlow muss deshalb zwischen bloßer Existenz eines Ereignisses und dessen tatsächlicher Wirkung auf die Führungslage unterscheiden.

## Entscheidung

CareFlow erzeugt Tageskontext und ereignisbasierte Führungshinweise nur dann, wenn diese für die aktuelle Lage relevant sind.

Ereignisse sollen nicht automatisch als kritisch dargestellt werden. Entscheidend ist, ob sie eine kipprelevante Wirkung auf Schichtdeckung, Qualifikation, Funktion oder Führungslage haben.

## Begründung

Eine Krankmeldung ist nicht immer führungskritisch, wenn die Schicht weiterhin stabil bleibt. Umgekehrt kann eine bereits knappe Planung ohne neues Ereignis kritisch sein.

CareFlow soll daher nicht nur melden:

> Ereignis existiert.

Sondern:

> Ereignis wirkt auf die Führungslage.

## Konsequenzen

Die Kontextlogik soll unterscheiden zwischen:

- vorhandenen Ereignissen
- kipprelevanten Ereignissen
- bereits vorher bestehender Unterdeckung
- stabilen Tagen ohne aktuellen Kontext
- mehreren Ereignissen mit unterschiedlicher Wirkung

Die Kontextlinie soll ruhig und präzise bleiben.

## Nicht-Ziele

Diese ADR führt nicht ein:

- vollständige Ereignis-Engine
- automatische Massnahmensteuerung
- komplexe Prognose
- vollständige operative Planversionierung

## Zusammenfassung

CareFlow zeigt Tageskontext nur, wenn dieser führungsrelevant ist. Entscheidend ist nicht, ob ein Ereignis existiert, sondern ob es die operative Lage verändert oder erklärt.