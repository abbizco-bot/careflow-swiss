# ADR-015 – Generisches Übergabe- und Kommunikationsschema

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

CareFlow kann aus Planungs- und Validierungsdaten führungsrelevante Informationen erzeugen. Diese Informationen können für Übergaben, Tagessteuerung oder Kommunikation nützlich sein.

Damit solche Informationen später an unterschiedliche Systeme übergeben werden können, braucht CareFlow ein generisches Schema statt systemabhängiger Einzellösungen.

## Entscheidung

CareFlow soll langfristig ein generisches Übergabe- und Kommunikationsschema verwenden.

Dieses Schema soll strukturierte Informationen zu Ereignissen, Risiken, Schichten, Funktionen und Massnahmen enthalten.

Es soll unabhängig davon sein, ob die Ausgabe später an Beekeeper, Teams, E-Mail, PDF, Dashboard oder ein anderes System geht.

## Begründung

Ein generisches Schema verhindert technische Abhängigkeit von einzelnen Kommunikationssystemen.

CareFlow kann dadurch dieselbe Information in unterschiedliche Kanäle rendern.

Beispielinhalt:

- Datum
- betroffene Schicht
- betroffene Abteilung
- Ereignistyp
- Führungsstatus
- Risiko
- notwendige Handlung
- verantwortliche Rolle
- Massnahme
- Kommentar

## Konsequenzen

CareFlow soll Kommunikationsinhalte strukturiert erzeugen und erst danach kanalspezifisch ausgeben.

Mögliche spätere Ausgabeformen:

- Dashboard-Karte
- Übergabetext
- E-Mail
- PDF
- API-Payload
- Kommunikationssystem-Nachricht

## Nicht-Ziele

Diese ADR führt nicht ein:

- sofortige externe Integration
- produktive Messaging-Funktion
- automatische Alarmierung
- verbindliche Eskalationsworkflows

## Zusammenfassung

CareFlow soll für Übergabe- und Kommunikationsinformationen ein generisches Schema verwenden. Dadurch bleiben spätere Ausgabekanäle flexibel und austauschbar.