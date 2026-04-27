# CareFlow MVP Demo Runbook v0.1

## Voraussetzungen

Fuer die lokale MVP-Demo muessen folgende Voraussetzungen erfuellt sein:

- lokale Datenbank ist erreichbar
- `DATABASE_URL` ist gesetzt
- Dependencies sind installiert
- Prisma Client ist generiert
- Projekt wird im CareFlow-Repository ausgefuehrt
- keine produktive Datenbank verwenden

Wichtig:

`npm run seed:mvp` ist fuer lokale Demo- und Entwicklungsdaten gedacht.

`npm run seed:mvp` darf nicht gegen eine Produktivdatenbank ausgefuehrt werden.

## Demo-Daten erzeugen

Befehl:

```bash
npm run seed:mvp
```

Das Script:

- baut zuerst das Projekt
- loescht vorhandene Demo-Daten fuer den Demo-Bereich
- erzeugt Demo-Daten neu
- gibt am Ende Demo-URLs und `PlanningMonth.id` aus

## PlanningMonth.id notieren

`PlanningMonth.id` ist dynamisch.

Die ID wird fuer diesen Endpoint benoetigt:

```text
GET /planning-months/:id/comparison
```

Die ID wird in der Konsolenausgabe von `npm run seed:mvp` angezeigt.

Beispiel aus dem letzten Smoke Test:

```text
PlanningMonth.id: 140
```

Diese ID kann beim naechsten Seed-Lauf anders sein.

## Server starten

Befehl:

```bash
npm run dev
```

Die Standard-API laeuft lokal auf dem konfigurierten Port, aktuell typischerweise:

```text
http://localhost:3001
```

Falls der Port abweicht, muessen die Demo-URLs entsprechend angepasst werden.

## Demo-Endpunkte

### Leadership Day

Stable day:

```text
GET /leadership/day?date=2088-05-12
```

Erwartung:

- `primaryCause = "none"`
- `severity = "none"`

Attention/request-context:

```text
GET /leadership/day?date=2088-05-13
```

Erwartung:

- `primaryCause = "request_context"`
- `severity = "attention"`

Critical operational gap:

```text
GET /leadership/day?date=2088-05-05
```

Erwartung:

- `effectiveCoverageGap > 0`
- `severity = "critical"`

Critical qualification gap:

```text
GET /leadership/day?date=2088-05-06
```

Erwartung:

- `effectiveQualificationGap > 0`
- `severity = "critical"`

Absence-driven gap:

```text
GET /leadership/day?date=2088-05-16
```

Erwartung:

- `primaryCause = "absence"`
- `severity = "critical"`

Mixed gap:

```text
GET /leadership/day?date=2088-05-07
```

Erwartung:

- mindestens eine Schicht mit `primaryCause = "mixed"`
- `severity = "critical"`

### Planning Comparison

```text
GET /planning-months/<PlanningMonth.id>/comparison
```

Erwartung:

- HTTP 200
- `operationalShifts` vorhanden
- effective staffing Werte vorhanden
- `gapSignals`, `primaryGapCause` und `primaryGapSignals` plausibel

## Demo-Erzaehlung

Stable zeigt Normalzustand.

Attention zeigt einen Kontext, der beobachtet werden sollte, aber keine Unterdeckung erzeugt.

Critical operational zeigt operative Unterdeckung.

Critical qualification zeigt Qualifikationsluecke.

Absence-driven zeigt die Wirkung einer Abwesenheit auf wirksame Besetzung.

Mixed zeigt kombinierte Ursachen.

Planning Comparison zeigt Planungsrahmen vs operative Realitaet.

## Was die Demo nicht zeigt

Die MVP-Demo zeigt bewusst nicht:

- keinen produktiven Import
- keinen ReferencePlan-Freeze
- keine Rolling 28-Day View als API
- keine DecisionOption-Engine
- keine personenbezogene Gap-Ausgabe
- keinen Periodenabschluss
- kein Frontend, falls noch nicht vorhanden

## Troubleshooting

Wenn Planning Comparison nicht funktioniert:

- `PlanningMonth.id` aus der Seed-Ausgabe pruefen

Wenn Daten unerwartet sind:

- `npm run seed:mvp` erneut ausfuehren

Wenn der Port nicht stimmt:

- Server-Log pruefen

Wenn Build fehlschlaegt:

- `npm run build` separat ausfuehren

Wenn `DATABASE_URL` fehlt:

- Umgebungsvariable pruefen

## Konsequenz

Dieses Runbook ist eine lokale MVP-Demo-Anleitung.

Es ist kein Deployment-Dokument.

Es ist kein Produktivbetriebsdokument.

Es ersetzt keine spaetere API- oder OpenAPI-Dokumentation.
