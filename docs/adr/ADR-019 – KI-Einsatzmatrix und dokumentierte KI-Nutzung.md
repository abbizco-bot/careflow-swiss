# ADR-019 – KI-Einsatzmatrix und dokumentierte KI-Nutzung

## Status

Accepted

## Hinweis

Diese ADR rekonstruiert eine bereits fachlich getroffene Entscheidung, die im ADR-Verzeichnis noch nicht dokumentiert war.

## Kontext

CareFlow wird mit Unterstützung von KI-Werkzeugen entwickelt, insbesondere ChatGPT und Codex.

KI unterstützt dabei fachliche Konzeption, Architekturreflexion, Codegenerierung, Dokumentation, Tests und Review.

Da KI-generierte Beiträge nicht ungeprüft übernommen werden sollen, braucht CareFlow eine dokumentierte KI-Einsatzlogik.

## Entscheidung

CareFlow verwendet eine KI-Einsatzmatrix zur Einordnung von KI-Unterstützung.

Die KI darf unterstützen, aber nicht unkontrolliert entscheiden.

Fachliche Verantwortung, Architekturverantwortung und finale Übernahme bleiben beim Projektverantwortlichen bzw. menschlichen Entwickler.

## Begründung

KI kann Entwicklung beschleunigen, birgt aber Risiken:

- falsche Annahmen
- nicht passende Architekturentscheidungen
- versteckte Seiteneffekte
- ungetesteter Code
- unklare Verantwortung
- Verlust von Projektkohärenz

Eine KI-Einsatzmatrix macht sichtbar, wofür KI genutzt wird und wo menschliche Prüfung zwingend bleibt.

## Mögliche Einsatzbereiche

KI kann unterstützen bei:

- Ideenentwicklung
- fachlicher Strukturierung
- ADR-Entwurf
- Codevorschlägen
- Testvorschlägen
- Dokumentation
- Review
- Fehlersuche

KI darf nicht allein entscheiden über:

- finale Architektur
- produktive Freigabe
- rechtliche Bewertung
- sicherheitskritische Entscheidungen
- ungeprüfte Codeübernahme
- fachliche Verantwortung gegenüber Kunden

## Konsequenzen

KI-generierte Inhalte sollen geprüft werden.

Wichtige KI-gestützte Entscheidungen sollen dokumentiert werden, insbesondere wenn sie Architektur, Datenmodell oder Produktlogik betreffen.

## Nicht-Ziele

Diese ADR führt nicht ein:

- vollständiges KI-Governance-System
- automatisierte KI-Freigabe
- Ersetzung menschlicher Verantwortung
- regulatorische Compliance-Prüfung

## Zusammenfassung

CareFlow nutzt KI als Entwicklungsunterstützung. Die KI-Einsatzmatrix stellt sicher, dass KI-Beiträge reflektiert, geprüft und dokumentiert werden.