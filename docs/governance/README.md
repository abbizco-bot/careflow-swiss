# CareFlow Governance

## Zweck

Dieses Dokument ist die zentrale Einstiegsseite für die CareFlow-Governance.

Es ersetzt keine einzelne Policy, ADR oder technische Dokumentation. Es hilft dabei, vor einer Änderung oder Freigabe das richtige Governance-Dokument zu finden und die Beziehung zwischen Governance, ADRs, technischer Dokumentation, Tests und Repository-Zustand zu verstehen.

Die Seite richtet sich an menschliche Entwickler, Reviewer, Produktverantwortliche und KI-Werkzeuge.

## Governance-Landkarte

Der typische Orientierungsfluss lautet:

```text
Fachliche Frage oder Änderungsanlass
→ Entwicklungszyklus
→ KI-Rollen klären
→ Git-Arbeitsweise festlegen
→ KI-Auftrag operativ begrenzen
→ Definition of Done prüfen
→ falls Release oder Deployment: Release and Deployment Policy anwenden
```

Nicht jedes Arbeitspaket erfordert jedes Dokument vollständig. Nicht-triviale Änderungen müssen aber die jeweils relevanten Dokumente konsultieren.

## Verbindliche Lesereihenfolge

Die Standard-Lesereihenfolge für nicht-triviale Arbeitspakete ist:

1. `entwicklungszyklus-v0.1.md`
2. `ki-einsatzmatrix-v0.1.md`
3. `git-workflow-policy-v0.1.md`
4. `ai-coding-instruction-v0.1.md`
5. `definition-of-done-v0.1.md`
6. `release-and-deployment-policy-v0.1.md`

Diese Reihenfolge schafft Orientierung: zuerst fachliche und epistemische Logik, dann KI-Rollen, danach Git-Ausführung, operative KI-Arbeit, Abschlusskriterien und schließlich Release oder Deployment.

Die in ihrem jeweiligen Statusabschnitt als verbindlich gekennzeichneten Fassungen gelten bis zu ihrer dokumentierten Aktualisierung oder Ablösung.

## Die sechs Kern-Governance-Dokumente

### 1. Entwicklungszyklus

`entwicklungszyklus-v0.1.md` definiert die fachlich und epistemisch geführte Entwicklungslogik.

Es beschreibt, wie eine Frage geklärt, fachliche Bedeutung geschärft, eine Entscheidung explizit gemacht, die kleinste kohärente Änderung umgesetzt, getestet, fachlich geprüft und dokumentiert wird.

### 2. KI-Einsatzmatrix

`ki-einsatzmatrix-v0.1.md` definiert, wo KI unterstützen darf, wo sie begrenzt ist und wo sie keine Entscheidungsautorität hat.

Sie schützt die Grenze zwischen KI-Unterstützung und menschlicher Produktverantwortung.

### 3. Git Workflow Policy

`git-workflow-policy-v0.1.md` definiert Branches, Commits, Merges, Pushes, Pull Requests, zentrale Sicherung und Rollback-Grundsätze in Git.

Sie legt fest, wie ein lokaler Arbeitsstand nachvollziehbar und zentral gesichert wird.

### 4. AI Coding Instruction

`ai-coding-instruction-v0.1.md` definiert, wie KI-Werkzeuge ein konkretes Arbeitspaket vorbereiten, ausführen, validieren, berichten und stoppen müssen.

Sie ist die operative Anleitung für Codex, GitHub Copilot und ähnliche Werkzeuge.

### 5. Definition of Done

`definition-of-done-v0.1.md` definiert, wann ein Arbeitspaket als abgeschlossen gelten darf.

Sie unterscheidet Umsetzung, technische Prüfung, fachliche Validierung, Dokumentation, Versionierung, zentrale Sicherung, Release, Deployment und Akzeptanz.

### 6. Release and Deployment Policy

`release-and-deployment-policy-v0.1.md` definiert Release, Tag, Build, Deployment, technische Abnahme, fachliche Abnahme, Nachweis und Rollback.

Sie gilt, wenn ein freigegebener Repository-Stand in einen bereitgestellten und abgenommenen Stand überführt werden soll.

## Situationsbezogene Nutzung

### Neue fachliche oder technische Änderung

Für eine neue fachliche oder technische Änderung sind der Entwicklungszyklus, relevante ADRs, technische Dokumentation, Git Workflow Policy und Definition of Done maßgeblich.

Der Entwicklungszyklus klärt die Frage und den fachlichen Sinn. ADRs und technische Dokumentation zeigen bestehende Entscheidungen und Systemgrenzen. Git Workflow Policy und Definition of Done sichern Umsetzung und Abschluss.

### KI-gestützter Umsetzungsauftrag

Für KI-gestützte Umsetzung sind KI-Einsatzmatrix, AI Coding Instruction, relevante ADRs, Git Workflow Policy und Definition of Done zu verwenden.

KI darf den Auftrag vorbereiten, begrenzt umsetzen und prüfen. Sie darf Konflikte, Scope-Erweiterungen oder fachliche Entscheidungen nicht stillschweigend selbst lösen.

### Commit, Merge und Push

Für Commit, Merge und Push gilt die Git Workflow Policy. Die Definition of Done prüft zusätzlich, ob der Stand fachlich, technisch und dokumentarisch abgeschlossen ist.

Ein lokaler Commit ist nicht automatisch zentral gesichert.

### Prüfung, ob ein Arbeitspaket abgeschlossen ist

Für die Abschlussprüfung gilt die Definition of Done.

Zusätzlich sind Entwicklungszyklus, relevante Tests und betroffene Dokumentation zu prüfen, wenn Fachlogik, Architektur, API-Verträge, Demo-Verhalten oder Governance betroffen sind.

### Release oder Deployment

Für Release oder Deployment gelten Definition of Done, Release and Deployment Policy und Git Workflow Policy.

Ein Build, ein Release, ein Deployment und eine fachliche Abnahme sind getrennte Zustände.

### Widerspruch oder Unsicherheit

Bei Widerspruch oder Unsicherheit sind relevante ADRs, aktuelle Implementierung, Tests, Governance-Dokumente und menschliche Entscheidung zusammenzuführen.

KI darf materielle Konflikte nicht stillschweigend auflösen. Widersprüche müssen dokumentiert und ausdrücklich entschieden oder verschoben werden.

## Verhältnis zu ADRs

ADRs dokumentieren verbindliche Architektur- oder fachliche Entscheidungen. Governance-Dokumente definieren, wie Arbeit entschieden, ausgeführt, geprüft und freigegeben wird.

ADRs und Governance haben unterschiedliche Aufgaben. Ein aktueller akzeptierter ADR hat Vorrang vor einem älteren ersetzten beziehungsweise überholten ADR.

Wenn ein ADR mit tatsächlicher Implementierung oder Deployment-Zustand kollidiert, muss der Widerspruch dokumentiert und ausdrücklich aufgelöst werden. Er darf nicht ignoriert werden.

## Verhältnis zu technischer Dokumentation

Technische Dokumentation beschreibt aktuelle Struktur, Befehle, Grenzen, Architektur und Implementierungsstand.

Governance beschreibt, wie Änderungen entschieden, ausgeführt, geprüft und akzeptiert werden.

Technische Dokumentation muss aktualisiert werden, wenn sich der tatsächliche Systemzustand ändert oder wenn sonst eine falsche Orientierung entstehen würde.

## Verhältnis zu Tests

Tests liefern ausführbare Nachweise über implementiertes Verhalten.

Tests definieren nicht selbstständig fachliche Wahrheit. Sie müssen mit ADRs, fachlichen Entscheidungen und beabsichtigtem Verhalten übereinstimmen.

Tests dürfen nicht abgeschwächt werden, nur damit Code erfolgreich erscheint.

## Verhältnis zum Repository-Zustand

Der tatsächliche Repository- und Deployment-Zustand ist faktischer Nachweis.

Dokumentation darf keine Struktur behaupten, die dem verifizierten Repository-Zustand widerspricht.

Die aktuelle verbindliche Repository- und Frontend-Klassifikation lautet:

- aktive Backend-Quelle: `src/`
- generierter Backend-Build-Output: `dist/`
- aktives Demo-Frontend: `frontend/`
- aktiver Demo-Quellbereich: `frontend/src/`
- generierter Demo-Build-Output und aktuelle Deploymentquelle: `frontend/dist/`
- frühere Leadership-Day-MVP-Frontend-Linie: `apps/careflow-mvp-frontend/`

Diese Übersicht führt bestehende Entscheidungen zusammen und führt keine neue Architekturentscheidung ein.

## Weitere Governance-Dokumente

Neben den sechs Kern-Governance-Dokumenten enthält `docs/governance/` weitere kontextuelle, bereichsspezifische oder zweckspezifische Dokumente, darunter:

- `mvp-scope-v0.2.md`
- `mvp-api-contract-v0.1.md`
- `mvp-demo-runbook-v0.1.md`
- `mvp-demo-scenarios-v0.1.md`
- `mvp-demo-seed-strategy-v0.1.md`
- `mvp-frontend-prototype-scope-v0.1.md`
- `mvp-frontend-tooling-decision-v0.1.md`
- `pilot-to-managed-saas-strategy-v0.1.md`

Diese Dokumente geben Kontext für bestimmte MVP-, Demo- oder SaaS-Fragen. Sie ersetzen die sechs Kern-Governance-Dokumente nicht.

Wenn ein bereichs- oder zweckspezifisches Dokument historisch überholt ist, haben aktuelle ADRs und der verifizierte Repository-Zustand Vorrang.

## Vorrang- und Konfliktregel

Bei Konflikten wird zwischen normativer Geltung und faktischem Nachweis unterschieden.

Normative Geltung beschreibt, was die Arbeit steuern soll:

1. explizite, nachvollziehbar dokumentierte und menschlich freigegebene Entscheidung für das aktuelle Arbeitspaket
2. aktueller akzeptierter ADR
3. sechs Kern-Governance-Dokumente
4. aktuelle bereichs- oder zweckspezifische Verträge und dokumentierte Entscheidungen

Eine undokumentierte oder nur informelle Aussage überschreibt einen akzeptierten ADR nicht stillschweigend.

Faktischer Nachweis beschreibt, was den tatsächlichen Systemzustand belegt:

1. verifizierter Repository- und Deployment-Zustand
2. tatsächlich ausgeführte Tests, Builds und Validierungsergebnisse
3. aktuelle technische Dokumentation
4. historische, konzeptionelle oder ersetzte Dokumente

Faktischer Nachweis ersetzt normative Geltung nicht stillschweigend. Er kann jedoch belegen, dass Dokumentation, Entscheidung und tatsächlicher Zustand auseinanderliegen. Ein solcher Widerspruch muss ausdrücklich geprüft, entschieden und dokumentiert werden.

KI-Präferenz oder KI-Vorschlag hat keine Autorität gegenüber menschlich freigegebenen Entscheidungen, akzeptierten ADRs, Governance oder verifiziertem Nachweis.

## Kanonische Kurzfassung

CareFlow-Governance trennt sechs Funktionen: Entwicklungslogik, KI-Rollengrenzen, Git-Ausführung, operative KI-Arbeit, Abschlusskriterien und Release-/Deployment-Kontrolle. Vor einer Änderung sind die relevanten Dokumente und ADRs zu lesen. Während der Umsetzung sind Arbeitsumfang und Repository-Grenzen einzuhalten. Vor Abschluss sind Tests, Dokumentation, Git-Zustand und menschliche Freigabe zu prüfen. Release und Deployment sind separate kontrollierte Zustände.

## Status

```text
Version: v0.1
Status: Verbindliche Governance-Einstiegsseite
Geltungsbereich: Orientierung und Anwendung der CareFlow-Governance
```
