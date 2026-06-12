# CareFlow AI Coding Instruction v0.1

## Zweck

Dieses Dokument definiert die verbindliche operative Vorgehensweise für KI-gestützte Codierung, Dokumentation, Tests und technische Umsetzung in CareFlow.

Es beschreibt, wie ChatGPT, Codex, GitHub Copilot oder ein anderes KI-Werkzeug ein CareFlow-Arbeitspaket vorbereiten, ausführen, prüfen und beenden muss. Es ergänzt den Entwicklungszyklus, die KI-Einsatzmatrix und die Git Workflow Policy, ohne diese zu ersetzen.

Die Anleitung unterscheidet zwischen konzeptioneller Unterstützung, Codierungsunterstützung, Dokumentationsunterstützung, Testunterstützung und menschlicher Freigabe. KI ist ein Implementierungs- und Analyseassistent. Sie ist keine autonome Produktinstanz und keine Quelle eigener fachlicher Wahrheit.

## Geltungsbereich

Dieses Dokument gilt für nicht-triviale KI-gestützte Arbeiten im Repository `C:\Projects\careflow`.

Es gilt insbesondere für Backend-Arbeiten unter `src/`, demo-orientierte Frontend-Arbeiten unter `frontend/`, Dokumentations- und Governance-Arbeiten, Testarbeiten, technische Prüfungen, Diff-Analysen und Review-Unterstützung.

Für die frühere backend-integrierte Leadership-Day-MVP-Frontend-Linie unter `apps/careflow-mvp-frontend/` gilt diese Anleitung ebenfalls, wenn ein Auftrag ausdrücklich diese Ebene betrifft. Neue Features dürfen dort ohne explizite Freigabe nicht umgesetzt werden.

## Grundprinzip

CareFlow arbeitet auf Basis expliziter Fachregeln, nachvollziehbarer Backend-Fakten, ADRs, Governance-Dokumente, technischer Dokumentation und Tests.

KI darf unterstützen, strukturieren, implementieren und prüfen. Sie darf aber nicht selbst Scope, Domänenbedeutung, Architektur, Abhängigkeiten, Integration, Release oder Deployment entscheiden.

Die operative Reihenfolge lautet: zuerst den bestehenden Zustand lesen, dann den Auftrag begrenzen, danach die kleinste sinnvolle Änderung umsetzen, die relevanten Prüfungen ausführen, die Ergebnisse berichten und anschließend stoppen.

## Rollen und Verantwortung

### Menschlicher Produktverantwortlicher

Der menschliche Produktverantwortliche trägt die letzte Verantwortung.

Er definiert das Arbeitspaket, genehmigt den Umfang, entscheidet fachliche Bedeutung, genehmigt Architekturentscheidungen, prüft Ergebnisse und erteilt Freigaben für Commit, Merge, Release und Deployment.

KI darf diese Verantwortung nicht übernehmen.

### ChatGPT

ChatGPT darf bei fachlicher Klärung, Strukturierung, Vorbereitung von ADRs und Governance-Dokumenten, Arbeitspaketdefinition, Review-Kriterien, Interpretation von Diffs und Testergebnissen sowie Risiko- und Konsistenzanalyse unterstützen.

ChatGPT ist nicht die finale Instanz für fachliche Wahrheit.

### Codex und Copilot

Codex und GitHub Copilot dürfen bei der Inspektion von Dateien, gezielter Implementierung, Refactoring innerhalb genehmigter Grenzen, Testerstellung, Dokumentationsänderungen, Build- und Testausführung sowie Diff-Zusammenfassungen unterstützen.

Codex und Copilot dürfen nicht autonom über Scope, Domänenbedeutung, Architektur, Abhängigkeiten, Merge, Release oder Deployment entscheiden.

## Vorbereitung eines KI-Auftrags

### Arbeitsauftrag

Jeder nicht-triviale KI-Auftrag muss vor Beginn Ziel, Umfang, betroffene Komponente, erlaubte Dateien oder Verzeichnisse, relevante ADRs und Governance-Dokumente, relevante Tests, explizite Ausschlüsse, erforderliche Prüfungen, erwartete Abschlussausgabe und Stop-Bedingung benennen.

Wenn diese Angaben fehlen, ist der Auftrag unvollständig. Die KI darf dann nur eine sichere enge Annahme treffen oder muss die fehlende Klärung melden.

### Relevante Quellen

Vor jeder Änderung muss die KI die relevanten bestehenden Quellen lesen.

Dazu gehören die zu ändernden Dateien, direkt zugehörige Module, relevante Tests, relevante ADRs, relevante Governance-Dokumente, technische Dokumentation und der aktuelle Repository-Aufbau.

Die KI muss den aktuellen Zustand verstehen, bevor sie implementiert.

### Repository- und Branch-Prüfung

Vor der Umsetzung ist der aktuelle Repository-Zustand zu prüfen:

```bash
git branch --show-current
git status
git log -1 --oneline --decorate
```

Für neue Arbeitspakete ist der bevorzugte Startpunkt:

```bash
git checkout master
git pull --ff-only
git checkout -b <branch-name>
```

KI darf Branches nicht selbstständig anlegen oder wechseln, wenn dies nicht ausdrücklich beauftragt wurde.

KI darf für nicht-triviale Änderungen nicht direkt auf `master` arbeiten.

### Scope-Grenze

Die KI darf nur den ausdrücklich angeforderten Umfang umsetzen.

Sie darf keine unbeteiligten Module umgestalten, keine nicht zum Arbeitspaket gehörenden Dateien ändern, keine opportunistische Bereinigung einbauen, keine Interfaces ohne Notwendigkeit umbenennen, keine nicht angeforderten Features hinzufügen, nicht ohne ausdrückliche Freigabe zwischen Frontend-Linien migrieren, keine Deployment-Konfiguration verändern, keine Architektur ändern, weil sie sauberer erscheint, und keine Dokumentation über den angeforderten Zweck hinaus umschreiben.

Wenn ein verwandtes Problem sichtbar wird, wird es als separater Fund oder als mögliches späteres Arbeitspaket gemeldet. Es darf nicht stillschweigend in die aktuelle Umsetzung aufgenommen werden.

## Durchführung

### Bestehenden Zustand lesen

Die KI muss vor jeder Änderung den bestehenden Zustand der betroffenen Bereiche prüfen.

Für CareFlow gilt insbesondere: Backend-Arbeit gehört unter `src/`. Neue demo-orientierte Frontend-Arbeit gehört unter `frontend/`. `frontend/src/` ist der aktive Demo-Quellbereich. `apps/careflow-mvp-frontend/` ist eine frühere Leadership-Day-MVP-Referenz und darf ohne ausdrückliche Freigabe keine neuen Features erhalten.

Generierte Ordner wie `dist/` im Repository-Root, `frontend/dist/`, `node_modules/` und `src/generated/` sind keine Quellstandorte.

### Kleinste sinnvolle Änderung

Die KI muss die kleinste kohärente Änderung bevorzugen, die das genehmigte Problem löst.

Sie darf den Auftrag nicht vergrößern, weil eine breitere technische Umgestaltung attraktiv erscheint.

Refactoring ist nur erlaubt, wenn es ausdrücklich beauftragt ist, für die gewünschte Änderung notwendig ist, innerhalb des genehmigten Umfangs bleibt und durch Tests oder andere Validierung abgesichert ist.

### Dateigrenzen

Der Auftrag soll, wo praktikabel, erlaubte Dateien oder Verzeichnisse benennen.

Wenn die KI eine zusätzliche Datei ändern muss, erklärt sie warum, prüft die Relevanz und berichtet die zusätzliche Datei ausdrücklich im Abschluss.

Die KI darf `.env`, Zugangsdaten, Geheimnisse, Remote-Konfiguration, Deployment-Konfiguration, Paketdateien, Lockfiles, Datenbankschema, Migrationen, ADRs und Governance-Dokumente nicht ändern, sofern der Auftrag dies nicht ausdrücklich erlaubt.

### Fachliche und technische Grenzen

Die KI darf keine Besetzungsregeln, Qualifikationsregeln, Abwesenheitslogik, Interventionslogik, Simulationseffekte, Risikoschwellen, Forecast-Logik, Empfehlungslogik, Rollenberechtigungen, Datenverantwortung oder externes Schnittstellenverhalten erfinden.

Fachliche oder architektonische Unsicherheit muss gemeldet werden. Sie darf nicht durch Annahmen verdeckt werden.

Bestehende ADRs und Tests haben Vorrang vor KI-Präferenzen. Wenn Quellen widersprechen, stoppt die KI den betroffenen Teil und berichtet den Widerspruch.

### Dependencies und Tooling

Die KI darf ohne ausdrückliche Freigabe keine Abhängigkeiten hinzufügen oder aktualisieren.

Die folgenden Befehle dürfen ohne ausdrückliche Autorisierung nicht ausgeführt werden:

```bash
npm install
npm update
npm audit fix
```

Die KI darf `package.json`, Package-Lock-Dateien, TypeScript-Versionen, React-Versionen, Vite-Versionen, Lint-Konfiguration und Build-Tooling nur ändern, wenn das Arbeitspaket diese Änderungen ausdrücklich einschließt.

### Tests und Validierung

Nach der Umsetzung führt die KI die für die Änderung relevanten Prüfungen aus.

Mögliche Prüfungen sind:

```bash
npm run build
npm test
npm run lint
git diff --check
```

Backend-Prüfungen laufen aus der Repository-Wurzel. Prüfungen für die aktive Demo-Frontend-Linie laufen aus `frontend/`. Prüfungen für die frühere Leadership-Day-MVP-Frontend-Linie laufen aus `apps/careflow-mvp-frontend/` nur dann, wenn der Auftrag ausdrücklich diese Frontend-Linie betrifft.

Die KI darf nicht behaupten, dass Tests bestanden haben, wenn sie diese nicht ausgeführt und ein erfolgreiches Ergebnis erhalten hat. Wenn ein Test oder Build nicht ausgeführt werden kann, muss sie den Grund nennen.

Bestehende Tests dürfen nicht allein deshalb geändert, abgeschwächt oder entfernt werden, damit eine Implementierung erfolgreich erscheint. Änderungen an Tests müssen fachlich begründet und Teil des genehmigten Arbeitsumfangs sein.

## Abschluss eines KI-Auftrags

### Pflichtausgabe

Jeder nicht-triviale KI-Auftrag endet mit einem knappen Bericht.

Der Bericht enthält die Zusammenfassung der umgesetzten Änderung, alle geänderten und erstellten Dateien, ausgeführte Tests und Builds, Ergebnisse dieser Prüfungen, `git status --short`, `git diff --stat`, Annahmen, ungelöste Widersprüche, verschobene Punkte und die ausdrückliche Feststellung, dass kein Commit, Merge, Push, Tag, Release oder Deployment ohne gesonderte Freigabe durchgeführt wurde.

Nicht ausgeführte Prüfungen dürfen nicht als bestanden oder erfolgreich dargestellt werden.

Der Bericht unterscheidet zwischen abgeschlossen, nicht abgeschlossen, nicht getestet und verschoben.

### Diff- und Dateiprüfung

Vor der Übergabe prüft die KI:

```bash
git status --short
git diff --check
git diff --stat
```

Wo sinnvoll, prüft sie zusätzlich:

```bash
git diff
git diff --name-status
```

Die KI muss prüfen, dass keine nicht zum Arbeitspaket gehörenden Dateien geändert wurden.

Für neue ungetrackte Dateien muss die KI den vollständigen Inhalt zeigen oder ausreichend vollständig zusammenfassen, weil normales `git diff` ungetrackte Dateien nicht enthält.

### Stop-Regel

Nach der angeforderten Umsetzung und Validierung stoppt die KI.

Sie darf nicht stagen, committen, mergen, pushen, Branches löschen, Tags erstellen, Releases erstellen, deployen, zusätzlich refactoren oder unaufgefordert weitere Dokumentation ändern.

Der Standard-Stop-Punkt ist:

```text
Änderungen umgesetzt und geprüft, aber nicht gestaged oder committed.
```

## Erlaubte KI-Aktionen

KI darf inspizieren, suchen, erklären, vorschlagen, genehmigte Dateien bearbeiten, genehmigte Dateien erstellen, relevante Tests hinzufügen oder aktualisieren, genehmigte Prüfungen ausführen, Diffs zusammenfassen sowie Risiken und Widersprüche melden.

## Verbotene KI-Aktionen

KI darf nicht autonom fachliche Wahrheit definieren, den Umfang erweitern, unfreigegebene Dateien ändern, Abhängigkeiten hinzufügen, Architektur ändern, Datenbankschema ändern, Remote-Konfiguration ändern, committen, mergen, force-pushen, taggen, releasen, deployen, Branches löschen, Daten löschen oder veröffentlichte Historie umschreiben.

## Umgang mit Unsicherheit und Widersprüchen

Wenn ein Auftrag mehrdeutig ist, aber eine sichere enge Interpretation möglich ist, wählt die KI die engste Umsetzung und benennt die Annahme.

Wenn die Mehrdeutigkeit Domänenbedeutung, Architektur, Datenmodell, Berechtigungen, externe Schnittstellen, Deployment, Löschung oder Sicherheit betrifft, darf die KI nicht raten. Sie meldet das Problem und stoppt den betroffenen Teil.

Wenn ADRs, Tests und Implementierung einander widersprechen, benennt die KI den Konflikt und entscheidet nicht stillschweigend zugunsten einer Quelle.

## Standardinstruktion für Codex und Copilot

Die folgende Standardinstruktion kann für künftige Codex- und Copilot-Aufträge wiederverwendet werden:

```text
Read the relevant ADRs, governance documents, technical documentation and current implementation before changing anything.

Implement only the requested scope.

Do not change unrelated modules, dependencies, package files, architecture, domain rules, deployment configuration or remote configuration.

Run the relevant build, tests, lint and diff checks.

Report all modified files, checks, assumptions and unresolved issues.

Then stop.

Do not stage, commit, merge, push, tag, release or deploy.
```

## Beziehung zu anderen Governance-Dokumenten

`entwicklungszyklus-v0.1.md` definiert die Entwicklungslogik.

`ki-einsatzmatrix-v0.1.md` definiert zulässige KI-Rollen.

`git-workflow-policy-v0.1.md` definiert den Versionskontroll-Workflow.

`ai-coding-instruction-v0.1.md` definiert die operative Ausführung von KI-Arbeit.

Ein zukünftiges `definition-of-done-v0.1.md` definiert Abschlusskriterien.

Eine zukünftige Release- und Deployment-Policy definiert Release- und VPS-Verfahren.

## Kanonische Kurzfassung

KI-Arbeit in CareFlow beginnt mit dem Lesen der aktuellen Implementierung und der verbindlichen Dokumentation, verläuft nur innerhalb eines definierten Umfangs, verwendet die kleinste kohärente Änderung, führt relevante Prüfungen aus, berichtet alle Änderungen und Unsicherheiten und stoppt vor Staging oder Commit. KI darf unterstützen, aber fachliche Wahrheit, Freigabe, Integration und Deployment bleiben menschliche Verantwortung.

## Status

```text
Version: v0.1
Status: Verbindliche Governance-Grundlage
Geltungsbereich: KI-gestützte Codierung, Dokumentation, Tests und technische Umsetzung in CareFlow
```
