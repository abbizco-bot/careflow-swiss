# ADR-011 – Leadership View als primäre Führungssicht

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

CareFlow erzeugt Validierungsdaten, Hinweise und Risiken. Diese Informationen müssen für Führungspersonen verständlich, ruhig und handlungsnah dargestellt werden.

Eine reine technische Validierungsliste reicht nicht aus. Pflegeleitung und Heimleitung benötigen eine verdichtete Sicht auf den Tag oder die Periode.

## Entscheidung

Die Leadership View wird als primäre Führungssicht von CareFlow etabliert.

Sie zeigt nicht alle Daten, sondern die führungsrelevanten Informationen:

- Tagesstatus
- betroffene Schichten
- Unterdeckungen
- Qualifikationslage
- Tagesfunktionen
- Abwesenheiten
- relevante Ereignisse
- Kontextlinie
- Handlungsbedarf

## Begründung

Führungspersonen brauchen keine technische Fehlermeldung, sondern eine klare Lageeinschätzung.

Die Leadership View soll beantworten:

> Was ist heute los?
> Was ist kritisch?
> Warum ist es kritisch?
> Welche Schicht ist betroffen?
> Welche Qualifikation oder Funktion fehlt?
> Muss jemand handeln?

Damit wird CareFlow im Alltag nutzbar.

## Konsequenzen

Die Leadership View soll:

- ruhig und übersichtlich bleiben
- keine unnötige Komplexität zeigen
- Risiken erklärbar darstellen
- vorhandene Validierungen verdichten
- Tagesnavigation ermöglichen
- später operative Ereignisse integrieren

## Nicht-Ziele

Die Leadership View ist nicht:

- vollständiger Dienstplaneditor
- vollständiges Reporting-System
- Ersatz für Detailansichten
- reine Entwicklerdiagnose

## Zusammenfassung

Die Leadership View ist die zentrale Führungssicht von CareFlow. Sie übersetzt Validierung und operative Lage in eine verständliche Tages- und Entscheidungsperspektive.