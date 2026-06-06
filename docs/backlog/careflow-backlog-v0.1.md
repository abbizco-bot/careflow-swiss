# CareFlow-Swiss – Backlog v0.1

---

## POLY-001 – Polypoint Exploration

**Typ:** Markt-/Integrationsklärung  
**Priorität:** Mittel bis hoch  
**Status:** Offen  
**Quelle:** Erstgespräch Provivatis, 20.05.2026

## Fragestellung

CareFlow-Swiss muss besser verstehen, welche Planungs-, Ist- und Abweichungsdaten aus Polypoint exportiert oder über Schnittstellen verfügbar gemacht werden können.

## Hintergrund

Im Gespräch mit Provivatis wurde deutlich, dass Polypoint nicht nur Monatspläne verwaltet, sondern offenbar auch laufende Änderungen, Inzidenzen und rückwirkende Daten für HR-/ERP-Prozesse verarbeitet. Für CareFlow ist entscheidend, diese Daten nicht doppelt zu erfassen, sondern vorhandene Daten zu nutzen.

## Zu klärende Punkte

- Gibt es CSV- oder Excel-Exporte aus Polypoint?
- Können Monatspläne exportiert werden?
- Können Ist-Daten und nachträgliche Abweichungen exportiert werden?
- Werden Krankmeldungen und kurzfristige Ausfälle strukturiert gespeichert?
- Gibt es eine API oder standardisierte Schnittstelle?
- Können Daten standortübergreifend für Heimgruppen exportiert werden?
- Welche Daten werden an HR oder ERP weitergegeben?

## Mögliche spätere Konsequenz

Falls Polypoint strukturierte Exporte ermöglicht, könnte CareFlow-Swiss in der Pilotphase mit CSV-/Excel-Importen arbeiten und später API- oder Schnittstellenlogik entwickeln.

## Nicht jetzt umsetzen

Keine direkte Polypoint-Integration im aktuellen MVP. Zuerst fachliche Klärung und Pilotvalidierung.