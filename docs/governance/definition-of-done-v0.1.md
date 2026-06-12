# CareFlow Definition of Done v0.1

## Zweck

Dieses Dokument definiert, wann ein CareFlow-Arbeitspaket als abgeschlossen gelten darf.

Die Definition of Done unterscheidet ausdrücklich zwischen umgesetzt, technisch geprüft, fachlich validiert, dokumentiert, versioniert, zentral gesichert, veröffentlicht, bereitgestellt und akzeptiert. Diese Zustände sind nicht gleichbedeutend.

Lokal lauffähiger Code ist nicht automatisch done. Ein erfolgreicher Build allein ist nicht done. Eine KI-generierte Umsetzung ist vor menschlicher Prüfung nicht done. Ein lokaler Commit ist vor erfolgreichem Push nicht zentral gesichert. Deployment ist nicht Bestandteil jedes Arbeitspakets. Bereitgestellt bedeutet nicht automatisch fachlich akzeptiert.

## Grundverständnis von Done

Ein Arbeitspaket ist nur dann done, wenn sein genehmigter Zweck erfüllt wurde, die relevanten fachlichen und technischen Prüfungen abgeschlossen sind, unbeabsichtigte Änderungen ausgeschlossen wurden, erforderliche Dokumentation aktualisiert wurde, das Ergebnis menschlich geprüft wurde und der freigegebene Stand versioniert und zentral gesichert ist.

Umgesetzt bedeutet noch nicht done. Bestandene Tests bedeuten nicht automatisch fachlich korrekt. Committed bedeutet nicht automatisch zentral gesichert. Bereitgestellt bedeutet nicht automatisch akzeptiert.

Done ist risikobasiert. Kleine Dokumentationskorrekturen brauchen weniger Nachweise als Änderungen an fachlicher Kernlogik, Datenmodell, Sicherheit, Schnittstellen oder Deploymentverhalten.

## Geltungsbereich

Dieses Dokument gilt für CareFlow-Arbeitspakete im Repository, einschließlich fachlicher Kernlogik, demo-orientierter Funktionalität, Dokumentation, Governance, Tests und Architekturentscheidungen.

Es gilt für Backend-Arbeiten unter `src/`, aktive Demo-Frontend-Arbeiten unter `frontend/`, ausdrücklich genehmigte Arbeiten an `apps/careflow-mvp-frontend/`, technische Dokumentation, Governance-Dokumente, Tests und repositorybezogene Infrastrukturentscheidungen.

Release- und Deploymentverfahren werden später in einer separaten Policy definiert. Nicht jedes Arbeitspaket enthält Deployment.

## Risikobasierte Anwendung

### Niedriges Risiko

Niedriges Risiko umfasst offensichtliche Tippfehler, sehr kleine Formatierungskorrekturen und kleine Dokumentationskorrekturen ohne fachliche, architektonische, datenmodellbezogene, sicherheitsbezogene oder deploymentbezogene Auswirkung.

Die Mindestprüfung darf reduziert sein, muss aber den korrekten Umfang, Dateiprüfung, Diff-Prüfung und sauberen Status enthalten. Wenn das Arbeitspaket als abgeschlossen gelten soll, muss der freigegebene Stand committed und zentral gesichert sein.

### Mittleres Risiko

Mittleres Risiko umfasst mehrdateilige Dokumentationsarbeit, isolierte Frontend-Änderungen, isolierte nicht-kernlogische Backend-Änderungen, begrenztes Refactoring, Testergänzungen und demo-orientierte Feature-Änderungen.

Solche Arbeitspakete erfordern in der Regel einen Arbeitsbranch, relevante Builds oder Lint-Prüfungen, Tests wo anwendbar, Dokumentationsprüfung, menschliche Prüfung, Merge und Push.

### Hohes Risiko

Hohes Risiko umfasst fachliche Kernlogik, Qualifikationslogik, Besetzungs- oder Abwesenheitslogik, Interventions- oder Simulationslogik, Datenmodell, Migrationen, Berechtigungen, Sicherheit, externe Schnittstellen, Deploymentverhalten und Architekturgrenzen.

Solche Arbeitspakete erfordern ein explizites Arbeitspaket, eine relevante ADR oder dokumentierte Entscheidung, einen Arbeitsbranch, einen GitHub Pull Request, relevante Tests, Integrationstests wo anwendbar, Build, fachliche Prüfung, Architekturprüfung, Dokumentationsaktualisierung, explizite menschliche Freigabe, zentralen Push und Release- oder Deploymentprüfung wo anwendbar.

Ein erforderlicher externer fachlicher oder technischer Review darf nicht durch reine Selbstfreigabe ersetzt werden.

## Verbindliche Abschlusskriterien

### Fachlicher Zweck und Umfang

Done setzt voraus, dass die ursprüngliche Frage oder das ursprüngliche Problem klar benannt ist, der genehmigte Umfang bekannt ist und das Ergebnis genau zu diesem Umfang passt.

Es dürfen keine unfreigegebenen Features, keine opportunistische Bereinigung und keine versteckten Erweiterungen enthalten sein. Offene Folgepunkte und Annahmen müssen sichtbar und separat dokumentiert sein.

### Fachliche Gültigkeit

Done setzt voraus, dass die fachliche Bedeutung geprüft wurde, Terminologie konsistent ist und keine fachliche Regel durch KI oder technische Bequemlichkeit erfunden wurde.

Bestehende ADRs und verbindliche Regeln müssen respektiert werden. Berechnungen, Schwellenwerte und Mappings müssen nachvollziehbar sein. Demo-Verhalten darf nicht fälschlich als produktiv validiertes Systemverhalten dargestellt werden. Widersprüche müssen gelöst oder ausdrücklich verschoben sein.

### Architektur- und Governance-Konformität

Done setzt voraus, dass der richtige Quellbereich geändert wurde. Backend-Änderungen gehören unter `src/`. Änderungen an der aktiven Demo gehören unter `frontend/`. `apps/careflow-mvp-frontend/` darf nur mit ausdrücklicher Freigabe geändert werden.

Generierte Verzeichnisse werden nicht als Quelle verwendet. Relevante ADRs und Governance-Dokumente wurden geprüft. Es gab keine versteckte Architekturänderung. Abhängigkeits- oder Werkzeugänderungen wurden ausdrücklich genehmigt.

### Technische Umsetzung

Done setzt voraus, dass die Umsetzung innerhalb des genehmigten Umfangs vollständig ist.

Es darf kein temporärer Debug-Code verbleiben. Toter oder auskommentierter Experimentiercode bleibt nur dann bestehen, wenn dies bewusst dokumentiert ist. Fehlerbehandlung muss angemessen sein. Durch die Änderung verursachte TypeScript- oder Lint-Fehler müssen gelöst sein. Es dürfen keine Zugangsdaten, lokale Konfigurationen, generierten Outputs oder lokalen Deployment-Archive eingeführt worden sein.

### Tests und Validierung

Done setzt voraus, dass die relevanten Prüfungen tatsächlich ausgeführt wurden.

Mögliche Prüfungen sind:

```bash
npm run build
npm test
npm run lint
git diff --check
```

Nicht jede Änderung erfordert jeden Befehl. Jede anwendbare Prüfung muss aber laufen. Nicht ausgeführte Prüfungen sind als nicht ausgeführt zu berichten. Tests dürfen nicht abgeschwächt werden, nur damit eine Implementierung als erfolgreich erscheint. Fehlgeschlagene Prüfungen bedeuten nicht done.

Wenn eine erforderliche Prüfung nicht ausgeführt werden kann, ist das Arbeitspaket nicht done, sofern dies nicht ausdrücklich als Ausnahme akzeptiert wurde. Hochriskante Logik benötigt gezielte Tests und, wenn Verhalten über Module hinweg entsteht, Integrationstests.

### Dokumentation

Done setzt Dokumentationsaktualisierung voraus, wenn sich das Projektverständnis ändert.

Mögliche Dokumentation umfasst README, ADRs, Governance, technische Dokumentation, Implementierungsindex, Sprach- oder Terminologiedokumentation, Runbooks und Tests als Verhaltensdokumentation.

Nicht jede triviale Codekorrektur braucht Dokumentationsänderung. Dokumentation ist aber erforderlich, wenn sonst Systemverhalten, Architektur, aktive Quellorte, API-Vertrag, Deploymentprozess, Domain-Logik, bekannte Einschränkungen oder verschobene Entscheidungen missverstanden würden.

### Diff- und Dateiprüfung

Vor Done sind folgende Prüfungen auszuführen:

```bash
git status --short
git diff --check
git diff --stat
git diff --name-status
```

Wo relevant, zusätzlich:

```bash
git diff
```

Done setzt voraus, dass nur beabsichtigte Dateien geändert wurden, keine nicht zusammenhängenden Änderungen enthalten sind, keine Secret-Dateien, unerwarteten Paket- oder Lockfile-Änderungen, generierten Outputs oder relevanten ungetrackten Dateien fehlen.

Neue Dateien müssen vollständig geprüft sein. Encoding- oder Zeilenendungsbeschädigungen schließen Done aus.

### Versionskontrolle

Done setzt einen kohärenten Commit mit beschreibender Commit-Nachricht voraus.

Der richtige Branch muss verwendet worden sein. Nach dem Commit muss das Arbeitsverzeichnis sauber sein. Es darf keinen ungelösten Merge-Konflikt und keinen ungeprüften direkten Commit auf `master` geben. Arbeitsbranches werden gemäß Git Workflow Policy integriert.

### Zentrale Sicherung

Done setzt voraus, dass der freigegebene Stand gepusht wurde.

Für stabil abgeschlossene Arbeit gilt:

```text
Der lokale Branch master und origin/master zeigen auf denselben freigegebenen Commit.
```

Ein lokaler Commit allein ist nicht done, wenn zentrale Sicherung erforderlich ist.

Zur Prüfung dienen:

```bash
git status
git branch -vv
```

### Freigabe

Done setzt eine menschliche Prüfung voraus, die dem Risiko der Änderung entspricht.

Der menschliche Produktverantwortliche genehmigt fachliche Bedeutung, Umfangserfüllung, Commit, Merge, Release und Deployment. KI darf Fertigstellung berichten, aber keinen finalen Done-Status erteilen.

## Zusätzliche Kriterien nach Änderungsart

### Dokumentationsänderungen

Dokumentationsänderungen sind done, wenn Inhalt und Terminologie korrekt sind, keine Widersprüche zu ADRs bestehen, UTF-8 korrekt ist, Pfade und Befehle stimmen, der Diff geprüft wurde und der freigegebene Stand zentral gesichert ist.

### Backend-Änderungen

Backend-Änderungen sind done, wenn Build, relevante Unit-Tests und bei modulübergreifendem Verhalten Integrationstests erfolgreich waren. API- oder Vertragswirkungen müssen geprüft sein. Es darf keine unbeabsichtigte Schemaänderung geben.

### Aktive Demo-Frontend-Änderungen

Aktive Demo-Frontend-Änderungen sind done, wenn sie unter `frontend/` erfolgen, Build und Lint erfolgreich waren, eine manuelle UI-Prüfung und Szenario-Prüfung erfolgt ist und Dokumentation aktualisiert wurde, sofern sich Demo-Verhalten ändert.

Demo-Verhalten darf nicht ohne Backend-Stützung als Produktionsreife dargestellt werden.

### Frühere Leadership-Day-MVP-Frontend-Änderungen

Änderungen an `apps/careflow-mvp-frontend/` sind nur mit ausdrücklicher Freigabe zulässig.

Done erfordert Arbeit im richtigen Verzeichnis, relevante Builds, keine versehentliche Verdopplung aktiver Demo-Arbeit und Dokumentation, warum diese Frontend-Linie geändert wurde.

### Datenmodell- und Migrationsänderungen

Datenmodell- und Migrationsänderungen erfordern eine explizite Architektur- oder ADR-Entscheidung, Pull Request, Schema-Review, Migrations-Review, Tests, Rollback-Überlegung, Datensicherheitsprüfung und ausdrückliche Freigabe.

Datenmigrationen müssen vor produktivem Einsatz mit repräsentativen Testdaten oder in einer geeigneten Testumgebung geprüft werden.

### Schnittstellenänderungen

Schnittstellenänderungen erfordern Vertragsprüfung, Auswirkungsprüfung für Verbraucher, Rückwärtskompatibilitätsbetrachtung, aktualisierte Dokumentation, relevante Tests und Pull Request.

### Sicherheits- und Berechtigungsänderungen

Sicherheits- und Berechtigungsänderungen erfordern ausdrückliche Freigabe, Pull Request, passende Bedrohungs- oder Risikoprüfung, Tests, keine Secrets im Repository, Dokumentation und gesonderte Deploymentfreigabe wo anwendbar.

### Refactoring

Refactoring ist done, wenn keine Verhaltensänderung beabsichtigt ist, außer sie wurde ausdrücklich freigegeben, Tests weiterhin gültig sind, der Diff begrenzt bleibt und keine stille Änderung fachlicher Regeln enthalten ist.

Bei wesentlicher struktureller Wirkung muss die Begründung dokumentiert sein.

### KI-gestützte Änderungen

KI-gestützte Änderungen sind done, wenn der KI-Arbeitsumfang explizit war, alle KI-geänderten Dateien aufgelistet sind, Tests und Checks wahrheitsgemäß berichtet wurden, Annahmen offengelegt wurden und menschliche Prüfung stattgefunden hat.

KI darf nicht autonom committen, mergen, taggen, releasen oder deployen.

### Deployment-relevante Änderungen

Deployment-relevante Änderungen sind done, wenn Build-Quelle, Commit oder Tag, Zielumgebung, Deploymentmethode, Abnahmeprüfungen und Rollback-Pfad bekannt sind und eine ausdrückliche Deploymentfreigabe vorliegt.

Done erfordert außerdem ein dokumentiertes Deployment-Abnahmeergebnis, die Bestätigung des tatsächlich bereitgestellten Commits oder Tags und einen abgeschlossenen Post-Deployment-Smoke-Test.

Das detaillierte Verfahren bleibt durch eine separate Release- und Deployment-Policy geregelt.

## Nicht erfüllt bedeutet nicht Done

Ein Arbeitspaket ist nicht done, wenn der Arbeitsumfang unklar ist, relevante Tests nicht gelaufen sind, Prüfungen fehlgeschlagen sind, fachliche Prüfung fehlt, Dokumentation veraltet ist, nicht zusammenhängende Dateien geändert wurden, Secrets oder generierte Outputs enthalten sind, KI-Annahmen verborgen bleiben, der Branch nicht integriert ist, der freigegebene Stand nicht gepusht ist, ein erforderlicher Pull Request fehlt, Deployment ohne identifizierbaren Quell-Commit erfolgte oder ein ungelöster Widerspruch das Ergebnis betrifft.

## Definition of Done Checkliste

- [ ] Arbeitsumfang: Zweck, Umfang, Annahmen und Ausschlüsse sind klar.
- [ ] Fachlichkeit: Domain-Bedeutung und Terminologie sind geprüft.
- [ ] Architektur: Quellbereich, ADRs und Governance-Grenzen sind eingehalten.
- [ ] Umsetzung: Umsetzung ist vollständig, begrenzt und ohne Debug- oder Experimentierreste.
- [ ] Tests: Relevante Prüfungen liefen tatsächlich und Ergebnisse sind dokumentiert.
- [ ] Dokumentation: Erforderliche Dokumentation ist aktuell.
- [ ] Diff: Status, Diff, Stat und Name-Status wurden geprüft.
- [ ] Git: Commit, Branch und Merge entsprechen der Git Workflow Policy.
- [ ] Push: Der freigegebene Stand ist zentral gesichert.
- [ ] Freigabe: Menschliche Prüfung und Freigabe liegen passend zum Risiko vor.
- [ ] Deployment, falls anwendbar: Quelle, Ziel, Verfahren, Abnahme und Rollback sind geprüft und freigegeben.

## Ausnahmen

Ausnahmen müssen ausdrücklich, begründet und menschlich genehmigt sein.

Eine Ausnahme dokumentiert, welches Kriterium nicht erfüllt ist, warum es nicht erfüllt ist, welches Risiko entsteht, welche temporäre Minderung gilt, wer verantwortlich ist, welche Folgearbeit nötig ist und welcher Termin oder Review-Punkt gilt, soweit praktikabel.

Eine undokumentierte Ausnahme ist keine Ausnahme. Sie ist unfertige Arbeit.

## Beziehung zu anderen Governance-Dokumenten

`entwicklungszyklus-v0.1.md` definiert die Entwicklungslogik.

`ki-einsatzmatrix-v0.1.md` definiert KI-Rollengrenzen.

`git-workflow-policy-v0.1.md` definiert den Versionskontroll-Workflow.

`ai-coding-instruction-v0.1.md` definiert die operative KI-Ausführung.

`definition-of-done-v0.1.md` definiert Abschlusskriterien.

Eine zukünftige Release- und Deployment-Policy definiert Release, Tag, VPS-Deployment und Abnahme.

## Kanonische Kurzfassung

Ein CareFlow-Arbeitspaket ist nur done, wenn der genehmigte Zweck erfüllt ist, fachliche und technische Gültigkeit geprüft wurden, relevante Tests und Prüfungen tatsächlich durchgeführt und erfolgreich abgeschlossen wurden, Dokumentation aktuell ist, keine unbeabsichtigten Änderungen verbleiben und das Ergebnis menschlich freigegeben, versioniert und zentral gesichert wurde. Deployment ist ein zusätzlicher Zustand und erfordert separate identifizierbare Freigabe.

## Status

```text
Version: v0.1
Status: Verbindliche Governance-Grundlage
Geltungsbereich: Abschluss und Freigabe von CareFlow-Arbeitspaketen
```
