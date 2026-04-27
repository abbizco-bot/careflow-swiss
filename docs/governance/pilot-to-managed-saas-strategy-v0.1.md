# CareFlow Pilot to Managed SaaS Strategy v0.1

## Grundsatz

CareFlow wird zunaechst als pilotiertes Fuehrungsinstrument eingefuehrt.

CareFlow wird nicht sofort als fertiges Self-Service-SaaS vermarktet.

CareFlow wird nicht als vollstaendiges Dienstplanungssystem positioniert.

CareFlow wird nicht als ERP-Ersatz positioniert.

Zuerst soll realer Nutzen in 2 bis 4 Pilotbetrieben validiert werden.

Spaetere SaaS-Faehigkeit wird bewusst vorbereitet.

## Ausgangslage

ADR-078 haelt fest: CareFlow wird SaaS-faehig gebaut, aber zunaechst nicht als fertiges Self-Service-SaaS verkauft.

Der aktuelle MVP ist lokal demonstrierbar.

Die MVP-Demo kann ueber `npm run seed:mvp` reproduzierbar erzeugt werden.

Ein MVP-Frontend-Prototyp ist vorbereitet, aber noch nicht implementiert.

CareFlow ist als Fuehrungs- und Decision-Layer positioniert, nicht als ERP oder klassisches Dienstplanungssystem.

## Phasenmodell

### Phase 1: MVP / Demonstrator

Ziel:

- Decision-Layer-Story zeigen
- Leadership Day View demonstrieren
- Planning Comparison demonstrieren
- Coverage-/Qualification-Gaps erklaeren
- `primaryCause` und `severity` zeigen

Nicht enthalten:

- produktiver Import
- Mandantenfaehigkeit
- Billing
- Self-Service-Onboarding
- produktives Deployment
- vollstaendiges Frontend

### Phase 2: Pilotiertes Fuehrungsinstrument

Ziel:

- 2 bis 4 Pilotbetriebe
- reale Fuehrungssituationen beobachten
- Datenqualitaet verstehen
- Begriffe und Fuehrungssprache testen
- Nutzenversprechen validieren
- Implementierungsaufwand pro Heim lernen
- Support- und Begleitbedarf verstehen

Nicht versprechen:

- fertiges MassensaaS
- vollstaendige Automatisierung
- sofortige Integration aller Fremdsysteme
- automatische Dienstplanung
- vollautomatische Optimierung

### Phase 3: Managed SaaS

Ziel:

- betreutes SaaS-Angebot
- kontrolliertes Onboarding
- ggf. mandantenfaehiger Betrieb
- Support- und Betriebskonzept
- standardisierte Demo-/Pilotdatenlogik
- schrittweise Datenintegration

Nicht zwingend:

- vollstaendiger Self-Service
- automatisiertes Billing
- breite offene Registrierung
- unbeaufsichtigte Tenant-Provisionierung

### Phase 4: Skalierbares SaaS

Ziel:

- erst nach validierter Produktlogik
- stabiler Datenintegration
- klarer Mandantenfaehigkeit
- Datenschutz-/Betriebsmodell
- belastbarem Supportmodell
- spaeter eventuell Self-Service-Onboarding und Billing

## Pilotbetriebe

Die Zielgroesse fuer die erste Pilotphase liegt bei 2 bis 4 Pilotbetrieben.

Pilotbetriebe sollen unterschiedlich genug sein, um Daten- und Fuehrungsrealitaeten zu verstehen.

Pilotierung braucht enge Begleitung.

Pilotbetriebe liefern Feedback zu:

- Fuehrungssprache
- Tageslage
- Gap-Verstaendlichkeit
- Datenqualitaet
- Einfuehrungsaufwand
- Akzeptanz der Fuehrung
- technischem Integrationsbedarf

## Pilotversprechen

CareFlow darf im Pilot versprechen:

- bessere Sicht auf operative Personallage
- transparentere Coverage-/Qualification-Gaps
- nachvollziehbare Ursachenklassen
- ruhige Fuehrungssicht statt Alarmismus
- Entscheidungshilfe, nicht automatische Entscheidung
- Erkenntnisse fuer bessere Planung

CareFlow darf im Pilot nicht versprechen:

- automatische Dienstplanung
- vollstaendige Systemintegration ab Tag 1
- Ersatz bestehender ERP-/Planungssysteme
- rechtliche oder arbeitsrechtliche Entscheidungen
- personenbezogene Leistungsbewertung
- garantiert vollstaendige Datenqualitaet ohne Mitwirkung

## Lernziele der Pilotphase

Die Pilotphase soll klaeren:

- Welche Daten sind in Heimen realistisch verfuegbar?
- Wie zuverlaessig sind Plan-/Ist-Daten?
- Welche Begriffe verstehen Fuehrungskraefte intuitiv?
- Welche Gaps sind entscheidungsrelevant?
- Welche Views werden tatsaechlich genutzt?
- Wie gross ist der Einrichtungsaufwand?
- Welche Integrationen sind wirklich noetig?
- Welche Supportprozesse entstehen?
- Welche Preislogik ist realistisch?

## Uebergang zu Managed SaaS

Managed SaaS wird erst sinnvoll, wenn:

- MVP-Story validiert ist
- 2 bis 4 Pilotbetriebe verwertbares Feedback geliefert haben
- Demo-/Pilotdatenlogik stabil ist
- Frontend-Prototyp verstaendlich ist
- Betriebs- und Datenschutzanforderungen klarer sind
- Onboarding-Aufwand abschaetzbar ist
- Supportmodell formuliert ist

## Beziehung zur technischen Architektur

Technische SaaS-Faehigkeit wird vorbereitet.

Multi-Tenant, Billing und Self-Service kommen spaeter.

Das MVP-Frontend soll nicht wie ein fertiges SaaS-Portal wirken.

Das Backend bleibt sauber modular.

Type-Sketches und ADR-Zielbilder sind keine fertigen SaaS-Features.

Pilotdaten und Demo-Daten bleiben klar getrennt.

## Risiken

Die wichtigsten Risiken sind:

- Pilot wird als fertiges Produkt missverstanden.
- SaaS-ready wird als sofort SaaS interpretiert.
- Zu fruehe SaaS-Infrastruktur verlangsamt Produktlernen.
- Fehlende Pilotbegleitung gefaehrdet Akzeptanz.
- Zu breites Leistungsversprechen erzeugt Enttaeuschung.
- Integrationsaufwand wird unterschaetzt.
- Datenschutz-/Betriebsfragen werden zu spaet adressiert.
- MVP-Frontend wirkt fertiger, als das Produkt ist.

## Konsequenz

Dieses Dokument ist Produkt- und Go-to-Market-Governance, keine Implementierung.

Naechster technischer Schritt bleibt der MVP-Frontend-Prototyp.

Pilotstrategie beeinflusst Sprache, Demo, Angebot und technische Prioritaeten.

Vor produktivem Managed SaaS braucht es eigene Architekturentscheidungen zu Mandantenfaehigkeit, Auth, Hosting, Datenschutz, Betrieb und Support.
