# CareFlow Release and Deployment Policy v0.1

## Zweck

Dieses Dokument definiert den kontrollierten Übergang von einem freigegebenen Repository-Stand zu einem gebauten, bereitgestellten und akzeptierten CareFlow-Stand.

Es unterscheidet ausdrücklich zwischen Implementierung abgeschlossen, Arbeitspaket done, Release Candidate, Release, gebaut, bereitgestellt, technisch abgenommen und fachlich abgenommen. Diese Zustände sind nicht gleichbedeutend.

Die Policy ergänzt Entwicklungszyklus, KI-Einsatzmatrix, Git Workflow Policy, AI Coding Instruction und Definition of Done. Sie ersetzt diese Dokumente nicht.

## Grundverständnis

Der verbindliche Grundablauf lautet:

```text
freigegebener Commit oder Tag
→ reproduzierbarer Build
→ identifizierbares Deployment-Paket
→ kontrolliertes Deployment
→ technischer Smoke-Test
→ fachliche Abnahme
→ dokumentiertes Ergebnis
→ Rollback-Fähigkeit
```

Deployment erzeugt keine fachliche Gültigkeit. Ein Build ist nicht automatisch ein Release. Ein Release ist nicht automatisch bereitgestellt. Ein bereitgestellter Stand ist nicht automatisch akzeptiert.

Jeder bereitgestellte Stand muss auf einen Commit oder Tag zurückführbar sein.

## Geltungsbereich

Diese Policy gilt für Backend-Releases und Deployments, aktive Demo-Frontend-Deployments, spätere integrierte Produkt-Releases, VPS-Deployments, Pilot-Deployments, Rollback- und Hotfix-Behandlung, Release-Tags und Deployment-Nachweise.

Sie definiert nicht den finalen Produktionsbetrieb, Mandantenbetrieb, vollständigen SaaS-Betrieb oder eine automatisierte CI/CD-Architektur. Dafür können spätere Policies erforderlich sein.

## Begriffe und Zustände

### Freigegebener Commit

Ein freigegebener Commit ist ein Commit, der die anwendbare Definition of Done erfüllt, menschlich geprüft wurde, auf `master` vorhanden ist und auf `origin/master` gepusht wurde.

### Release Candidate

Ein Release Candidate ist ein freigegebener Commit oder Tag, der für finalen Build, Deployment und Abnahmeprüfungen vorbereitet wird.

Ein Release Candidate ist noch kein akzeptiertes Release.

### Release

Ein Release ist ein formal identifizierter und freigegebener Softwarestand.

Ein Release soll normalerweise durch einen Git-Tag identifiziert werden.

### Build

Ein Build ist generierter Output aus einem identifizierbaren Commit oder Tag.

Build-Output ist kein Quellcode und wird normalerweise nicht committed.

### Deployment

Deployment ist die kontrollierte Übertragung eines ausgewählten Builds in eine definierte Zielumgebung.

### Technische Abnahme

Technische Abnahme bestätigt, dass die bereitgestellte Anwendung erreichbar ist, lädt, korrekt startet, die beabsichtigte Version erkennen lässt, grundlegende Smoke-Checks besteht und keinen unmittelbaren Deploymentfehler zeigt.

### Fachliche Abnahme

Fachliche Abnahme bestätigt, dass das beabsichtigte CareFlow-Verhalten und die Präsentation für den Release-Zweck korrekt sind.

Technische Abnahme ersetzt keine fachliche Abnahme.

### Rollback

Rollback stellt das letzte bekannte akzeptierte Deployment oder einen anderen ausdrücklich freigegebenen früheren Stand wieder her.

## Verbindliche Voraussetzungen

Ein Release oder Deployment darf nur beginnen, wenn `master` sauber ist, lokaler `master` und `origin/master` auf denselben freigegebenen Commit zeigen, relevante Arbeitspakete die Definition of Done erfüllen, relevante Tests und Builds bestanden haben, erforderliche Pull Requests und Reviews abgeschlossen sind, der Release-Umfang dokumentiert ist, die Zielumgebung identifiziert ist, die Rollback-Quelle bekannt ist und die Deploymentfreigabe ausdrücklich vorliegt.

Empfohlene Prüfung:

```bash
git status
git branch -vv
git log -1 --oneline --decorate
```

## Release-Entscheidung

Der menschliche Produktverantwortliche entscheidet, ob ein Release erstellt wird, welcher Commit oder Tag als Release freigegeben wird, welchem Zweck das Release dient, welchen Umfang es hat, welche Zielumgebung verwendet wird, welche Abnahmekriterien gelten, wann Deployment erfolgt und ab welcher Schwelle Rollback erforderlich ist.

KI darf Release-Notizen und Checklisten vorbereiten, aber kein Release autonom genehmigen oder erstellen.

## Versions- und Tagging-Modell

Semantische Versionierung dient als Standardorientierung:

```text
MAJOR.MINOR.PATCH
```

`MAJOR` steht für inkompatible oder fundamentale Produktänderungen. `MINOR` steht für rückwärtskompatible funktionale Erweiterungen. `PATCH` steht für rückwärtskompatible Korrekturen.

Für die aktuelle Pilot- und Demo-Phase sind Pre-1.0-Versionen passend, zum Beispiel:

```text
v0.1.0
v0.2.0
v0.2.1
```

Optionale beschreibende Suffixe dürfen nur verwendet werden, wenn sie echte Orientierung schaffen:

```text
v0.3.0-demo
v0.4.0-pilot
```

Lange Modulnamen in Tags sind zu vermeiden:

```text
v0.3.0-roles-matrix-dashboard-final
```

Tags identifizieren einen kohärenten Release-Stand, nicht einen einzelnen Modulbranch.

Es werden annotierte Tags verwendet:

```bash
git tag -a v0.1.0 -m "CareFlow release v0.1.0"
git push origin v0.1.0
```

Tag-Erstellung erfordert ausdrückliche menschliche Freigabe.

Ein veröffentlichter Tag darf nicht verschoben oder neu erstellt werden. Wenn ein Release geändert wird, wird eine neue Version erstellt.

## Build-Verfahren

Jeder Build muss auf einen Commit oder Tag zurückführbar sein.

Der Build muss aus einem identifizierbaren Commit oder Tag mit dokumentierten Befehlen reproduzierbar erzeugt werden können.

Vor dem Build wird aufgezeichnet:

```bash
git log -1 --oneline --decorate
git status
```

Das Arbeitsverzeichnis muss sauber sein.

### Backend-Build

Der Backend-Build läuft aus dem Repository-Root:

```bash
npm run build
```

Der Backend-Build-Output wird erzeugt unter:

```text
dist/
```

### Aktive Demo-Frontend-Build

Der aktive Demo-Frontend-Build läuft aus:

```text
frontend/
```

Verwendete Befehle:

```bash
npm run build
npm run lint
```

Der generierte Build-Output ist:

```text
frontend/dist/
```

Dies ist die aktuelle Deployment-Quelle für die aktive Demo.

### Frühere Leadership-Day-MVP-Frontend-Build

Diese Frontend-Linie wird nur gebaut, wenn ein Release ausdrücklich dieses Frontend betrifft:

```text
apps/careflow-mvp-frontend/
```

Build-Befehl:

```bash
npm run build
```

Der Output darf nicht mit der aktiven Demo-Deployment-Quelle verwechselt werden.

## Deployment-Paket

Ein Deployment-Paket muss aus einem identifizierbaren sauberen Build stammen, mit einem Commit oder Tag verbunden sein, nur für den Betrieb erforderliche Dateien enthalten, keine Quellcode-Geheimnisse oder Zugangsdaten, keine lokale `.env`, keine reinen Entwicklungsdateien ohne Notwendigkeit enthalten und nicht als lokales ZIP-Archiv committed werden.

Wenn für manuelle Übertragung ein ZIP oder Archiv verwendet wird, ist es ein temporäres Deployment-Artefakt außerhalb des Repositories oder späterer Anhang eines Release-Nachweises.

Das Deployment-Paket soll enthalten oder begleitet werden von Release-Version, Commit-Hash, Build-Datum, Zielumgebung, Release-Notizen und Rollback-Quelle.

## Zielumgebung und Deployment-Zuordnung

Die aktuelle Zuordnung lautet:

```text
Active demo source:
frontend/src/

Active demo build output:
frontend/dist/

Deployment target:
demo.careflow-swiss.ch

Deployment method:
manual VPS deployment

Current repository automation:
none
```

Das tatsächliche VPS-Zielverzeichnis und serverbezogene Zugangsdaten dürfen nicht in öffentlicher oder gewöhnlicher Repository-Dokumentation abgelegt werden, wenn dadurch ein Sicherheitsrisiko entsteht.

Sensible Serverdetails gehören in geschützte operative Dokumentation oder in einen Passwortmanager.

## Manueller Deployment-Ablauf

Der manuelle Deployment-Ablauf ist kontrolliert und nachvollziehbar auszuführen.

1. Freigegebenen Commit oder Tag prüfen.
2. Sauberes Arbeitsverzeichnis prüfen.
3. Relevante Tests und Builds ausführen.
4. Commit-Hash oder Tag aufzeichnen.
5. Build-Output prüfen.
6. Deployment-Paket außerhalb von Git vorbereiten.
7. Zielumgebung prüfen.
8. Aktuelles akzeptiertes Deployment sichern oder identifizieren.
9. Neuen Build auf den VPS übertragen.
10. Deployment aktivieren.
11. Technische Smoke-Tests ausführen.
12. Fachliche Abnahmeprüfungen ausführen.
13. Ergebnis dokumentieren.
14. Bei fehlgeschlagenen Prüfungen Rollback ausführen oder Abnahme abbrechen.

Secret-Zugangsdaten und genaue private Serverpfade werden hier nicht dokumentiert.

## Prüfungen nach Deployment

### Technischer Smoke-Test

Der technische Smoke-Test richtet sich nach der bereitgestellten Komponente.

Für das aktive Demo-Frontend ist mindestens zu prüfen, dass `demo.careflow-swiss.ch` erreichbar ist, die Anwendung ohne leeren Bildschirm lädt, Hauptnavigation funktioniert, erwartete Assets laden, keine unmittelbaren Fehler in der Browser-Konsole die Nutzung blockieren, zentrale Demo-Ansichten öffnen, die aktuelle Release-Identität feststellbar ist und HTTPS funktioniert.

Falls die Anwendung die Versionsidentität noch nicht sichtbar anzeigt, muss sie zumindest über Commit, Tag und Deployment-Nachweis eindeutig rekonstruierbar sein.

Wenn Backend-Komponenten beteiligt sind, ist zu prüfen, dass der Service startet, erwartete Endpunkte antworten, kein unmittelbarer Serverfehler sichtbar ist, die Datenbankverbindung wo anwendbar funktioniert und ein relevanter Health- oder Smoke-Endpunkt antwortet, sofern vorhanden.

### Fachliche Abnahme

Für die Demo werden abhängig vom Release-Zweck ausgewählte Szenarien und Views geprüft.

Dazu gehören, wo anwendbar, rollierende Führungsübersicht, Tages- und Wochenansichten, Abweichungen, Interventionen, QM-Situation, Simulation, Sensitivitätsanalyse, Assessment-Kontext, BESA/interRAI-Kontext, rollenspezifische Navigation sowie Sprache und Darstellung.

Der konkrete Abnahmeumfang hängt vom Release ab.

### Dokumentation des Ergebnisses

Das Ergebnis dokumentiert Version oder Tag, Commit-Hash, Deployment-Datum, Zielumgebung, freigebende Person, technische Prüfungen, fachliche Prüfungen, gefundene Probleme, akzeptierten oder abgelehnten Status, ob Rollback durchgeführt wurde, und Folgepunkte.

## Rollback-Verfahren

Rollback muss vor Beginn des Deployments möglich sein.

Vor dem Deployment muss sichergestellt sein, dass der letzte akzeptierte Build oder ein eindeutig reproduzierbarer Rollback-Stand verfügbar ist.

Die Rollback-Quelle ist normalerweise der letzte akzeptierte Release-Tag, das letzte akzeptierte Deployment-Paket oder ein dokumentierter früherer Commit mit zugehörigem Build.

Rollback-Ablauf:

1. Abnahme des fehlgeschlagenen Releases stoppen.
2. Letzten akzeptierten Stand identifizieren.
3. Vorherigen Build wiederherstellen.
4. Erreichbarkeit und Kernfunktionen prüfen.
5. Rollback-Ergebnis dokumentieren.
6. Korrigierendes Arbeitspaket eröffnen.
7. Release-Historie nicht stillschweigend überschreiben.

Rollback darf nicht auf einem unbekannten lokalen Ordner oder unnachvollziehbaren ZIP beruhen.

## Fehler- und Abbruchregeln

Deployment muss gestoppt oder abgelehnt werden, wenn Commit oder Tag unklar ist, das Arbeitsverzeichnis nicht sauber ist, Build fehlschlägt, relevante Tests fehlschlagen, das Deployment-Paket unerwartete Dateien enthält, Zugangsdaten oder Secrets enthalten sind, Zielumgebung unklar ist, Rollback-Quelle fehlt, Deployment nicht nachvollziehbar ist, Smoke-Test fehlschlägt, fachliche Abnahme fehlschlägt oder ein wesentlicher Widerspruch ungelöst bleibt.

Ein fehlgeschlagenes Deployment ist kein Release-Erfolg.

## Sicherheits- und Geheimnisschutz

Die folgenden Inhalte dürfen nicht im Repository oder Deployment-Paket enthalten sein, sofern sie nicht ausdrücklich erforderlich und sicher verwaltet sind:

- `.env`
- Passwörter
- Tokens
- private SSH-Schlüssel
- Datenbank-Zugangsdaten
- VPS-Root-Zugangsdaten
- private Zertifikate

Secrets werden über geschützte Umgebungskonfiguration oder ein geeignetes Verfahren zur sicheren Verwaltung von Zugangsdaten und Geheimnissen (Secrets Management) verwaltet.

Sensible Server-Screenshots oder Zugangsdaten gehören nicht in gewöhnliche Repository-Dokumentation.

## Regeln für KI-Unterstützung

KI darf Release-Notizen vorbereiten, Checklisten vorbereiten, Commits zusammenfassen, Tags vergleichen, Build-Befehle prüfen, Smoke-Tests entwerfen helfen, Deployment-Ergebnisse dokumentieren helfen und fehlende Schritte identifizieren.

KI darf nicht autonom Tags erstellen, Releases veröffentlichen, Deployment-Ziele auswählen, Dateien übertragen, sich an Servern authentifizieren, Serverkonfiguration ändern, deployen, Abnahme genehmigen, Rollback ausführen oder Deployment-Stände löschen.

Für alle Release-, Deployment-, Abnahme- und Rollback-Handlungen ist menschliche Freigabe erforderlich.

## Release- und Deployment-Nachweis

Jedes Release oder Deployment soll einen knappen Nachweis haben.

Der Nachweis kann als GitHub Release, geschütztes Deployment-Log, Release Note, Pilot-Deployment-Protokoll oder versioniertes nicht-geheimes Repository-Dokument abgelegt werden.

Der Nachweis muss rekonstruierbar machen, was released wurde, aus welchem Commit oder Tag, wie es gebaut wurde, wohin es bereitgestellt wurde, welche Prüfungen erfolgten, wer freigegeben hat, ob es akzeptiert wurde und wie Rollback funktionieren würde.

Secrets oder operativ sensible Details werden nicht im Nachweis abgelegt.

## Checkliste

- [ ] Release-Umfang: Zweck und Umfang des Releases sind klar.
- [ ] Commit oder Tag: Commit oder Tag ist identifiziert und freigegeben.
- [ ] Repository-Status: Arbeitsverzeichnis ist sauber und `origin/master` ist synchron.
- [ ] Tests: Relevante Tests wurden ausgeführt und bestanden.
- [ ] Build: Relevante Builds wurden aus dem identifizierten Stand erzeugt.
- [ ] Deployment-Paket: Paket ist nachvollziehbar, vollständig und ohne Secrets.
- [ ] Zielumgebung: Zielumgebung ist identifiziert.
- [ ] Rollback-Quelle: Rückfallstand ist bekannt und erreichbar.
- [ ] Deploymentfreigabe: Deploymentfreigabe liegt vor.
- [ ] Technischer Smoke-Test: Technische Smoke-Tests sind bestanden.
- [ ] Fachliche Abnahme: Fachliche Abnahme ist erfolgt.
- [ ] Nachweis: Nachweis ist dokumentiert.
- [ ] Endstatus: Ergebnis ist akzeptiert, abgelehnt oder zurückgerollt.

## Verhältnis zu anderen Governance-Dokumenten

`entwicklungszyklus-v0.1.md` definiert die Entwicklungslogik.

`ki-einsatzmatrix-v0.1.md` definiert KI-Rollengrenzen.

`git-workflow-policy-v0.1.md` definiert den Versionskontroll-Workflow.

`ai-coding-instruction-v0.1.md` definiert die operative KI-Ausführung.

`definition-of-done-v0.1.md` definiert den Abschluss von Arbeitspaketen.

`release-and-deployment-policy-v0.1.md` definiert Release, Build, Deployment, Abnahme und Rollback.

## Kanonische Kurzfassung

Ein CareFlow-Deployment muss immer von einem freigegebenen und zentral gesicherten Commit oder Tag ausgehen, reproduzierbar gebaut werden, ein identifizierbares Deployment-Paket verwenden, technische Smoke-Tests und fachliche Abnahme bestehen, dokumentiert werden und rollbackfähig bleiben. Build, Release, Deployment und Abnahme sind getrennte Zustände. KI darf bei Vorbereitung und Nachweis unterstützen, aber nicht autonom taggen, releasen, deployen, abnehmen oder rollbacken.

## Status

```text
Version: v0.1
Status: Verbindliche Governance-Grundlage
Geltungsbereich: CareFlow Releases, Builds, VPS-Deployments, Abnahmen und Rollbacks
```
