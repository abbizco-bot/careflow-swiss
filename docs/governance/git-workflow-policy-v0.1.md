# CareFlow Git Workflow Policy v0.1

## Zweck

Dieses Dokument definiert den verbindlichen Git-Workflow für die aktuelle Solo- und KI-gestützte CareFlow-Entwicklung.

Der Workflow soll pragmatisch und nachvollziehbar bleiben und eine verlässliche Grundlage für spätere Review- und Nachweisanforderungen schaffen. Git unterstützt Rückverfolgbarkeit, ist aber kein vollständiges Audit- oder Compliance-System.

Der Workflow soll die heutige Arbeitsweise mit einem menschlichen Produktverantwortlichen, der die letzte Verantwortung trägt, ChatGPT, Codex und GitHub Copilot abbilden und später teamfähig sein, ohne unnötige Git-Flow-Komplexität einzuführen.

Git dient in CareFlow der Versionierung, Rückverfolgbarkeit, zentralen Sicherung und kontrollierten Integration. Git ersetzt keine fachliche Validierung, keine Tests, keine Dokumentation und keine menschliche Freigabe.

## Verbindliche Repository-Referenzen

Das lokale Repository liegt unter:

```text
C:\Projects\careflow
```

Die stabile Hauptlinie ist:

```text
master
```

Der zentrale Remote heißt:

```text
origin
```

Das zentrale Remote-Repository ist:

```text
https://github.com/abbizco-bot/careflow-swiss.git
```

Die zentral gesicherte Hauptreferenz ist:

```text
origin/master
```

Das lokale Repository ist die Arbeitskopie. Ein lokaler Commit ist erst dann zentral gesichert, wenn er erfolgreich auf den relevanten Remote-Branch oder auf `origin/master` gepusht wurde.

`.gitattributes` definiert die Zeilenendungsregeln des Repositories. `.gitignore` schließt Umgebungsdateien, generierte Outputs, Abhängigkeiten und das lokale manuelle Demo-Deployment-Archiv aus.

## Grundprinzipien

CareFlow verwendet einen einfachen Branch-Workflow mit `master` als stabiler Hauptlinie und kurzlebigen, aufgabenbezogenen Arbeitsbranches.

Jede Änderung soll einem klaren Arbeitspaket zugeordnet sein. Der Umfang eines Branches und eines Commits muss fachlich und technisch lesbar bleiben. Nicht zusammenhängende Änderungen dürfen nicht in einem Branch oder Commit vermischt werden.

Die menschliche Produktverantwortung bleibt verbindlich. KI-Werkzeuge können helfen, aber sie definieren keine fachliche Wahrheit, entscheiden keine Integration und führen keine Releases oder Deployments autonom aus.

## Branch-Modell

CareFlow verwendet derzeit keinen `develop`-Branch. Der Standardpfad ist `work branch → master`. Ein `develop`-Branch darf erst später eingeführt werden, wenn parallele Teamentwicklung oder Release-Koordination einen nachweisbaren Bedarf schafft.

### Stabile Hauptlinie

`master` ist die stabile Hauptlinie des CareFlow-Repositories.

`master` enthält nur geprüfte und akzeptierte Änderungen. Von `master` können später Releases und Deployments vorbereitet werden.

Direkte experimentelle Arbeit, unkontrollierte KI-generierte Änderungen oder breit angelegte Explorationsarbeit dürfen nicht auf `master` stattfinden.

`origin/master` ist die zentral gesicherte Referenz für den stabilen CareFlow-Repository-Stand.

### Kurzlebige Arbeitsbranches

Arbeitsbranches sind kurzlebig und auf ein konkretes Arbeitspaket begrenzt.

Ein zusammenhängendes Arbeitspaket soll normalerweise genau einen Branch verwenden. Der Branch wird nach Integration und zentraler Sicherung wieder entfernt.

Permanente Modulbranches sind nicht zulässig. Begriffe wie `dashboard`, `qualification`, `simulation`, `personnel` oder `reporting` beschreiben Repository-Struktur oder Produktbereiche, aber keine dauerhaften Branches.

### Branch-Namenskonvention

Branch-Namen müssen ein konkretes Arbeitspaket beschreiben. Geeignete Präfixe sind:

```text
feature/
fix/
docs/
refactor/
test/
chore/
```

Beispiele:

```text
feature/add-qm-situation-view
fix/simulation-status-calculation
docs/git-workflow-policy
refactor/frontend-structure
test/add-leadership-view-cases
chore/repository-hygiene
```

## Standardablauf

### Vor Beginn eines Arbeitspakets

Der Standardablauf vor einem neuen Arbeitspaket lautet:

```bash
git checkout master
git pull --ff-only
git status
git checkout -b <branch-name>
```

Vor dem Erstellen des Arbeitsbranches ist zu prüfen, dass das richtige Repository geöffnet ist, `master` ausgecheckt ist, `master` mit `origin/master` synchron ist, das Arbeitsverzeichnis sauber ist und das Arbeitspaket einen klaren und begrenzten Umfang hat.

### Während der Umsetzung

Änderungen bleiben innerhalb des definierten Arbeitspakets.

Wenn während der Umsetzung eine neue Architektur-, Governance- oder Domänenfrage sichtbar wird, wird der Arbeitsumfang nicht stillschweigend erweitert. Die Frage wird geklärt oder als separates Arbeitspaket dokumentiert.

Relevante ADRs, Governance-Dokumente, technische Grenzen und CareFlow-Domänenunterscheidungen sind zu beachten.

### Vor dem Commit

Vor jedem Commit werden mindestens Status und Diff geprüft:

```bash
git status
git diff
```

Je nach betroffenem Bereich werden die passenden Checks ausgeführt:

```bash
npm run build
npm test
npm run lint
git diff --check
```

Nicht jede Änderung erfordert jeden Befehl. Die relevanten Checks richten sich nach dem betroffenen Bestandteil.

Vor dem Commit muss geprüft werden, dass nur beabsichtigte Dateien geändert wurden, keine Zugangsdaten oder `.env`-Dateien enthalten sind, kein generierter Build-Output enthalten ist, keine nicht zum Arbeitspaket gehörenden Refactorings vermischt wurden, relevante Tests und Builds bestanden haben und Dokumentation aktualisiert wurde, wenn sich das Projektverständnis geändert hat.

### Commit

Commits sollen klein, zusammenhängend und beschreibend sein.

Wo praktikabel, werden Conventional-Commit-ähnliche Präfixe verwendet:

```text
feat:
fix:
docs:
refactor:
test:
chore:
```

Beispiele:

```text
feat: add assessment context to demo
fix: correct qualification gap severity
docs: add Git workflow policy
refactor: extract simulation calculation helpers
test: add leadership gap integration cases
chore: remove tracked deployment archive
```

Eine Commit-Nachricht beschreibt, was geändert wurde. Sie darf nicht nur festhalten, dass Arbeit erledigt wurde.

### Push und zentrale Sicherung

Ein Arbeitsbranch soll normalerweise nach `origin` gepusht werden, wenn die Arbeit über eine kurze lokale Sitzung hinausgeht, Review über GitHub vorgesehen ist, der Branch zentral gesichert werden soll oder eine andere Person oder ein anderes Werkzeug Zugriff braucht.

```bash
git push -u origin <branch-name>
```

Nach Integration in `master` wird die stabile Hauptlinie gepusht:

```bash
git push origin master
```

Eine abgeschlossene Änderung ist erst zentral gesichert, wenn der relevante Branch oder `master` erfolgreich gepusht wurde.

### Integration in master

Im aktuellen Solo-Workflow ist ein lokal geprüfter Merge erlaubt, wenn der Diff inspiziert wurde, relevante Tests und Builds bestanden haben, Dokumentationschecks abgeschlossen sind, der Branch einen zusammenhängenden Arbeitsumfang hat und der menschliche Produktverantwortliche die Integration ausdrücklich freigibt.

Vor dem Merge wird folgende zusätzliche Prüfung empfohlen:

```bash
git status
git log --oneline master..<branch-name>
git diff master...<branch-name>
```

Diese Befehle zeigen den aktuellen Arbeitszustand, die Commits des Arbeitsbranches und das vollständige Änderungspaket, das in `master` integriert werden soll.

Für substanzielle, klar abgegrenzte Arbeitspakete ist ein sichtbarer Merge-Commit geeignet:

```bash
git checkout master
git pull --ff-only
git merge --no-ff <branch-name>
git push origin master
```

`--no-ff` ist sinnvoll, wenn die Grenze des Arbeitspakets in der Git-Historie sichtbar bleiben soll. Kleine Korrekturbranches können per Fast-Forward integriert werden, wenn ein separater Merge-Knoten keinen Mehrwert schafft.

### Branch-Bereinigung

Nach erfolgreicher Integration und erfolgreichem Push kann der lokale Branch gelöscht werden:

```bash
git branch -d <branch-name>
```

Wenn der Branch auf GitHub gepusht wurde und nicht mehr benötigt wird:

```bash
git push origin --delete <branch-name>
```

Nur vollständig integrierte Branches dürfen gelöscht werden. Erzwungene Branch-Löschung ist erst nach Prüfung erlaubt, ob der Branch ungemergte Commits enthält.

## Direkte Commits auf master

Direkte Commits auf `master` sind nur für die kleinsten eindeutig risikoarmen Korrekturen erlaubt. Dazu gehören offensichtliche Tippfehler oder sehr kleine Dokumentationskorrekturen ohne fachliche, architektonische, datenmodellbezogene oder deploymentbezogene Auswirkung.

Wenn mehrere Dateien, Datei-Löschungen, Normalisierungsregeln, strukturelle Repository-Einstellungen oder breitere Repository-Hygiene betroffen sind, muss ein Arbeitsbranch verwendet werden.

Neue Funktionalität, fachliche Kernlogik, Validierungen, Datenmodell-Änderungen, Architekturentscheidungen, Schnittstellen- oder API-Änderungen, Sicherheits- oder Berechtigungsänderungen, Multi-File-Dokumentationsänderungen, Refactorings, Deployment-relevante Änderungen und substanzielle KI-generierte Änderungen müssen normalerweise über einen Arbeitsbranch laufen.

Vor einem direkten Commit muss der aktuelle Branch geprüft werden:

```bash
git branch --show-current
```

## Pull-Request-Regelung

Pull Requests sind verpflichtend, wenn mehr als ein menschlicher Entwickler beteiligt ist, GitHub-basierter Review erforderlich ist, externe Reviewer beteiligt sind oder ein auditierbarer Review-Nachweis erforderlich ist.

Änderungen an fachlicher Kernlogik, Datenmodell, Sicherheit, Berechtigungen, externen Schnittstellen oder Deploymentverhalten erfordern normalerweise auch in der Solo-Entwicklung einen GitHub Pull Request.

Im aktuellen Solo-Workflow sind lokale Prüfung und kontrollierter Merge für risikoärmere Änderungen erlaubt.

Ein Pull Request wird auch in Solo-Entwicklung für Änderungen mit hoher Tragweite empfohlen, weil er einen konsolidierten Diff, einen expliziten Review-Punkt, eine Testzusammenfassung und einen nachvollziehbaren Entscheidungsnachweis schafft.

## Commit-Nachrichten

Commit-Nachrichten müssen fachlich und technisch lesbar sein. Sie sollen den konkreten Inhalt einer Änderung beschreiben und nicht nur den Arbeitsschritt benennen.

Gute Commit-Nachrichten sind kurz, konkret und nachvollziehbar:

```text
docs: add Git workflow policy
fix: correct qualification gap severity
test: add leadership gap integration cases
```

Ungeeignet sind nichtssagende Nachrichten wie `update`, `changes`, `work`, `fix stuff` oder `codex changes`.

## Regeln für KI-gestützte Entwicklung

KI-Werkzeuge dürfen bestehenden Code und Dokumentation inspizieren, Umsetzungsvorschläge vorbereiten, Dateien innerhalb eines explizit definierten Arbeitsumfangs bearbeiten, Tests erstellen oder aktualisieren, Diffs zusammenfassen, Risiken und Inkonsistenzen benennen und Commit-Nachrichten vorschlagen.

KI-Werkzeuge dürfen nicht autonom Branches mergen, Force-Pushes ausführen, veröffentlichte Historie umschreiben, Branches löschen, Releases erstellen, Tags erstellen, deployen, Remote-Konfiguration ändern, Dependencies ohne explizite Zustimmung hinzufügen, Domänenregeln erfinden oder den Arbeitsumfang ohne Freigabe erweitern.

Der menschliche Produktverantwortliche bleibt verantwortlich für Arbeitsumfang, fachliche Gültigkeit, Review, Commit-Freigabe, Merge-Freigabe, Release-Freigabe und Deployment-Freigabe.

## Unzulässige Praktiken

Unzulässig sind insbesondere `git push --force` auf `master`, unkontrollierte Arbeit direkt auf `master`, das Committen von `.env`-Dateien, Credentials, Tokens oder privaten Schlüsseln, das Committen von `node_modules`, das Committen von generiertem `dist` oder Build-Output ohne separate Freigabe, das Committen lokaler Deployment-Archive, das Vermischen nicht zusammenhängender Änderungen, stille Änderungen an fachlicher Logik während Refactorings, das Umschreiben bereits gepushter Commits auf gemeinsam genutzten Branches ohne explizite Zustimmung, das Löschen von Branches ohne Merge-Status-Prüfung und die Nutzung von Git-Historie als Ersatz für Tests, Validierung oder Dokumentation.

## Wiederherstellung und Rollback

Rollback erfolgt normalerweise über:

```bash
git revert <commit>
```

oder über einen neuen korrigierenden Commit.

Veröffentlichte Historie soll normalerweise nicht umgeschrieben werden. `git reset --hard`, Force-Pushes und aggressives Pruning benötigen explizite Zustimmung und einen klaren Wiederherstellungsgrund.

Vor riskanten Git-Operationen sind Branch, Status des Arbeitsverzeichnisses, Remote-Status und Wiederherstellbarkeit des aktuellen Commits zu prüfen.

## Verhältnis zu anderen Governance-Dokumenten

`entwicklungszyklus-v0.1.md` definiert den fachlich und epistemisch geführten Entwicklungsprozess.

`ki-einsatzmatrix-v0.1.md` definiert erlaubte und verbotene Rollen von KI.

`git-workflow-policy-v0.1.md` definiert Ausführung der Versionskontrolle, Branch-Verwaltung und zentrale Sicherung.

Ein zukünftiges `ai-coding-instruction-v0.1.md` soll das operative Verfahren für KI-Coding-Aufträge definieren.

Ein zukünftiges `definition-of-done-v0.1.md` soll Abschlusskriterien definieren.

Eine zukünftige Release- und Deployment-Policy soll Release-Tags, Builds, VPS-Deployment und Abnahme definieren.

## Kanonische Kurzfassung

CareFlow verwendet `master` als stabile Hauptlinie und `origin/master` als zentral gesicherte Referenz. Relevante Änderungen werden in kurzlebigen, aufgabenspezifischen Branches entwickelt, über Diffs, Tests und Dokumentationschecks geprüft und danach in `master` integriert. Ein lokaler Commit ist erst zentral gesichert, wenn er erfolgreich gepusht wurde. KI darf Implementierung und Review unterstützen, aber nicht autonom mergen, Historie umschreiben, taggen, releasen oder deployen. Git unterstützt Nachvollziehbarkeit, ersetzt aber keine fachliche Validierung, keine Tests und keine menschliche Freigabe.

## Status

```text
Version: v0.1
Status: Verbindliche Governance-Grundlage
Geltungsbereich: CareFlow Repository, Versionskontrolle und Entwicklungsintegration
```
