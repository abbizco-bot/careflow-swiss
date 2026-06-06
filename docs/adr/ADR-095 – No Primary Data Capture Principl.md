# ADR-095 – No Primary Data Capture Principle

Status: Accepted  
Datum: 20.05.2026

## Kontext

Frühe Marktgespräche, insbesondere das Erstgespräch mit Provivatis Winterthur am 20.05.2026, zeigten deutlich, dass Pflegeinstitutionen zusätzlichen Erfassungsaufwand und Doppelerfassung vermeiden möchten.

Bestehende Systeme wie Polypoint bleiben im Heimalltag führend für Planung, Abweichungen, Ist-Daten und HR-/ERP-nahe Prozesse.

## Entscheidung

CareFlow erzeugt keine Primärdaten.

CareFlow ersetzt keine Dienstplanung, kein ERP-System und keine bestehenden HR- oder Planungssysteme.

CareFlow interpretiert und verdichtet vorhandene Planungs-, Abwesenheits- und Personaldaten zu einer ruhigen Leadership- und Decision-Sicht.

## Konsequenzen

- Keine zusätzliche Erfassungsebene im MVP.
- Keine Doppelerfassung von Inzidenzen, Abweichungen oder Personalereignissen.
- CSV-/Excel-Importe bleiben für die Pilotphase prioritär.
- API- und Schnittstellenlogik werden später geprüft.
- Bestehende Systeme bleiben fachlich führend.
- CareFlow bleibt ein ergänzender Leadership Layer.
- Die Produktkommunikation muss den Grundsatz „keine Doppelerfassung“ explizit enthalten.

## Nicht entschieden

- Keine direkte Polypoint-Integration im aktuellen MVP.
- Keine Ausweitung auf vollständige ERP- oder Dienstplanungsfunktionen.
- Keine automatische Personalentscheidung durch CareFlow.