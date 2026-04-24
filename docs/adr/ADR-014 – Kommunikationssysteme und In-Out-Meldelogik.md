# ADR-014 – Kommunikationssysteme und In-/Out-Meldelogik

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

Pflegeheime nutzen unterschiedliche Kommunikationssysteme, zum Beispiel Beekeeper, Microsoft Teams, E-Mail, interne Tools oder andere Plattformen.

Über solche Systeme werden häufig kurzfristige Informationen ausgetauscht:

- Krankmeldungen
- Diensttauschwünsche
- Rückmeldungen zu Einsätzen
- externe Verfügbarkeiten
- kurzfristige organisatorische Hinweise
- Übergabeinformationen

CareFlow soll solche Systeme nicht ersetzen, aber langfristig relevante In- und Out-Meldungen verarbeiten oder erzeugen können.

## Entscheidung

CareFlow soll langfristig eine generische In-/Out-Meldelogik für Kommunikationssysteme unterstützen.

Dabei gilt:

- eingehende Meldungen können operative Ereignisse auslösen
- ausgehende Meldungen können strukturierte Führungsinformationen liefern
- CareFlow bleibt nicht das Kommunikationssystem selbst
- CareFlow erzeugt oder verarbeitet strukturierte Inhalte

## Begründung

Pflegeheime nutzen unterschiedliche Kommunikationsplattformen. Eine enge Festlegung auf ein einzelnes System wäre zu früh.

Eine generische Logik erlaubt spätere Integrationen mit verschiedenen Systemen.

CareFlow soll relevante Informationen aus Kommunikation in operative Führungslogik übersetzen können.

Beispiel:

> Krankmeldung kommt über Kommunikationssystem → CareFlow erkennt betroffenes Assignment → Tageslage wird neu validiert.

Oder:

> CareFlow erkennt kritische Unterdeckung → strukturierter Hinweis wird an Pflegeleitung ausgegeben.

## Konsequenzen

CareFlow soll perspektivisch zwischen zwei Richtungen unterscheiden:

### In-Meldungen

Informationen, die in CareFlow eingehen und Ereignisse auslösen.

### Out-Meldungen

Informationen, die CareFlow an Kommunikationssysteme oder Führungspersonen ausgibt.

## Nicht-Ziele

Diese ADR führt nicht ein:

- sofortige Beekeeper-Integration
- produktive API-Anbindung an Kommunikationssysteme
- Chatfunktion
- vollständiges internes Nachrichtensystem
- automatische Kommunikation ohne Freigabe

## Zusammenfassung

CareFlow soll langfristig Kommunikationssysteme anbinden können, ohne selbst ein Kommunikationssystem zu werden. Dafür wird eine generische In-/Out-Meldelogik als Zukunftsrichtung festgelegt.