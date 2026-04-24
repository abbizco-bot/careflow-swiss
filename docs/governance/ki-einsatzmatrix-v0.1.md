# KI-Einsatzmatrix v0.1

## Zweck

Diese Matrix beschreibt für CareFlow, in welchen Bereichen KI eingesetzt werden darf, in welchen Bereichen sie nur assistieren darf und in welchen Bereichen sie keine fachliche Entscheidungsautorität hat.

Sie dient der epistemischen und praktischen Trennung zwischen:

- konzeptioneller Unterstützung
- technischer Assistenz
- sprachlicher Verdichtung
- deterministischer Systemwahrheit
- menschlicher Verantwortung

Der Grundsatz lautet:

**KI darf in CareFlow klären, strukturieren, formulieren und bei der Umsetzung helfen. Sie darf jedoch nicht die fachliche Wahrheit des Systems bestimmen.**

## Grundlogik

CareFlow ist ein Führungs- und Decision-Layer für Pflegeorganisationen. Die Kernlogik des Systems beruht auf expliziten Regeln, strukturierten Daten und nachvollziehbaren Validierungen.

Daraus folgt:

- Die fachliche Wahrheit liegt im Code und in den definierten Regeln.
- Die erklärende und verdichtende Sprache darf nur auf validierten Fakten aufbauen.
- Die letzte Verantwortung für Modellierung, Freigabe und Geltung bleibt beim Menschen.
- Sprachliche Verdichtung darf Backend-Fakten lesbar machen, aber keine Priorität, Prognose oder Entscheidung erfinden.

## KI-Einsatzmatrix

| Bereich | Aufgabe | KI-Rolle | Zulässig | Nicht zulässig | Verbindliche Instanz |
|---|---|---|---|---|---|
| Fachkonzeption | Begriffe schärfen, Modelle strukturieren, Optionen formulieren | Sparring / Strukturhilfe | Ja | Fachliche Wahrheit selbst setzen | Mensch |
| Architektur | Varianten vergleichen, Vor- und Nachteile formulieren | Reflexionshilfe | Ja | Architektur stillschweigend festlegen | Mensch |
| Dokumentation | README, ADR, Arbeitsnotizen, Zusammenfassungen formulieren | Assistenz / Verdichtung | Ja | Widersprüchliche Regeln neu erfinden | Mensch + bestehende Projektdokumente |
| Codierung | Implementierungsvorschläge, Refactoring, Testergänzungen | Umsetzungsassistenz | Ja | Fachlogik eigenmächtig umdefinieren | Code + Mensch |
| Tests | Grenzfälle vorschlagen, Testfälle formulieren, Testcode ergänzen | Assistenz | Ja | Fachlich falsches Verhalten als gültig setzen | Tests + Mensch |
| Datenmodell | Schemaideen, Modellvarianten, Benennungen vorschlagen | Assistenz | Ja | Schema ohne bewusste Entscheidung verändern | Mensch |
| Kernlogik Besetzung | Coverage, Unterdeckung, Zählregeln, Schichtlogik | Keine Entscheidungsautorität | Nur erklären oder nach klarer Vorgabe implementieren | Freie Heuristik oder Schätzung | Deterministischer Code |
| Qualifikationslogik | Stammqualifikation, Zulässigkeit, Mindestanforderungen | Keine Entscheidungsautorität | Nur abbilden und erklären | Eigene Interpretation ohne Regelbasis | Deterministischer Code |
| Tagesfunktionslogik | Funktionszuteilung, Zulässigkeit je Qualifikation | Keine Entscheidungsautorität | Nur nach expliziter Regel implementieren | Konzepte verschmelzen oder abschwächen | Deterministischer Code |
| Absenzlogik | Operative Nichtverfügbarkeit, Availability-Wirkung | Begrenzte Assistenz | Erklären, dokumentieren, testbar machen | Eigene Abwesenheitslogik erfinden | Deterministischer Code |
| Leadership View | Verdichtung, Kontextsätze, lesbare Zusammenfassungen | Sprachliche Verdichtung | Ja, auf Basis validierter Fakten | Freie Deutung ohne Rückbindung an Backend-Fakten | Backend-Fakten + Mensch |
| Situation Layer | Summary, Trend, History beschreiben | Erklären | Ja | Prognosen, Empfehlungen oder versteckte Scores einführen | Read-only Systemlogik |
| Planning Comparison | Gaps sprachlich erklären | Erklären | Ja | Empfehlungen, Prioritäten oder Optimierung simulieren | Read-only Vergleichslogik |
| Empfehlungen | Handlungsoptionen formulieren | Optionale Assistenz, später | Nur explizit als Option und nur wenn vorgesehen | Entscheidungen automatisch treffen | Mensch |
| Prognose / Forecast | Künftige Entwicklung ableiten | Vorläufig ausgeschlossen | Nein, außer später explizit eingeführt | Vorhersagen in MVP- oder Read-only-Schichten | Noch keine |
| Produktkommunikation | Produkttexte, Narrative, Hilfetexte, UX-Mikrotexte | Assistenz | Ja | Fachlich nicht gedeckte Versprechen | Mensch |
| Produktive Laufzeit-KI | Chat, Explainability, Übergabemeldungen | Spätere Assistenzschicht | Nur auf validierten Systemfakten | Kernwahrheit ersetzen | Core-System + kontrollierte KI-Schicht |

## Drei Zonen

### Grüne Zone

Hier ist KI klar nützlich und gewünscht:

- Konzeption
- Dokumentation
- Codierungsunterstützung
- Testunterstützung
- sprachliche Verdichtung
- Produktkommunikation

### Gelbe Zone

Hier darf KI nur unter klaren Bedingungen helfen:

- Erklärungen in der Leadership View
- Kontextsätze
- spätere Empfehlungen als Optionen
- spätere produktive Assistenz

Bedingung ist immer: **nur auf validierter Faktenbasis**.

### Rote Zone

Hier darf KI nicht die führende Instanz sein:

- Besetzungsberechnung
- Qualifikationsprüfung
- Funktionszulässigkeit
- operative Kernvalidierungen
- automatische Disposition
- Prognosen im MVP
- versteckte Scores oder Black-Box-Entscheidungen

## Kanonische Kurzform

**KI wird in CareFlow für Konzeption, Dokumentation, Codierungsassistenz, Testunterstützung und sprachliche Verdichtung eingesetzt. Die deterministische Fachlogik von Besetzung, Qualifikation, Tagesfunktion, Absenzwirkung und Read-only-Führungssichten bleibt im Systemcode verankert. KI darf erklären und strukturieren, aber keine neue fachliche Wahrheit erzeugen. Die letzte Verantwortung bleibt beim Menschen.**

## Status

Version: v0.1  
Status: Arbeitsversion / Governance-Grundlage  
Geltungsbereich: CareFlow Entwicklungs- und spätere Produktlogik
