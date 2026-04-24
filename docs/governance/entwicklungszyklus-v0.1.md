# Standardisierter Entwicklungszyklus v0.1

## Zweck

Der Entwicklungszyklus beschreibt, in welcher Reihenfolge fachliche Fragen, konzeptionelle Klärung, technische Umsetzung, Test und Dokumentation in CareFlow zusammenwirken. Er soll verhindern, dass Änderungen nur technisch funktionieren, aber fachlich unklar, begrifflich unsauber oder architektonisch widersprüchlich bleiben.

CareFlow wird als fachlich sensibles Führungsinstrument entwickelt. Deshalb beginnt Entwicklung nicht mit Code, sondern mit einer fachlichen Unterscheidung oder einer operativen Irritation.

## Grundprinzip

Jede relevante Änderung in CareFlow folgt nach Möglichkeit dieser Logik:

**Frage klären → Domäne schärfen → Entscheidung festhalten → klein umsetzen → testen → fachlich prüfen → Dokumentation nachziehen**

Der Zyklus ist bewusst einfach gehalten. Er soll nicht bürokratisieren, sondern disziplinieren.

## Der Zyklus im Standardablauf

### 1. Fachlichen Anlass benennen

Am Anfang steht eine konkrete fachliche Frage, Beobachtung oder Irritation.

Beispiele:

- Warum erscheint dieser Tag als kritisch?
- Ist das ein Qualifikationsproblem oder ein Funktionsproblem?
- Zählt eine Krankmeldung hier operativ oder nur administrativ?
- Fehlt eine neue Regel oder ist nur die Darstellung unklar?

In diesem Schritt wird noch nichts gelöst. Es wird nur präzise benannt, was eigentlich die Frage ist.

### 2. Domänenlogik klären

Nun wird die fachliche Bedeutung geklärt. Dabei geht es um Begriffe, Unterscheidungen und Geltungsgrenzen.

Fragen in diesem Schritt sind typischerweise:

- Welche Domänenunterscheidung ist betroffen?
- Handelt es sich um Stammqualifikation oder Tagesfunktion?
- Geht es um geplante Besetzung oder wirksame operative Besetzung?
- Existiert ein Ereignis nur, oder ist es kipprelevant?
- Betrifft die Frage Core-Logik, Read-only-Sicht oder sprachliche Verdichtung?

Dieser Schritt ist zentral, weil CareFlow nicht auf begrifflicher Unschärfe weiterentwickelt werden soll.

### 3. Änderungsart bestimmen

Danach wird bestimmt, welcher Typ von Änderung überhaupt notwendig ist.

Mögliche Typen sind:

- reine Fachklärung ohne Codeänderung
- Dokumentationsanpassung
- kleine Logikänderung
- neue Validierung
- Read-only-Verdichtung
- Testergänzung
- Architekturentscheidung
- Modelländerung

Hier wird aus einer offenen Frage ein klarer Arbeitsgegenstand.

### 4. Entscheidung explizit machen

Wenn die Änderung fachlich oder architektonisch relevant ist, wird die Entscheidung kurz festgehalten, bevor implementiert wird.

Das kann geschehen als:

- ADR
- Arbeitsnotiz
- README-Ergänzung
- AGENTS.md-Erweiterung
- kleine Governance-Notiz

Nicht jede Änderung braucht ein großes Dokument. Aber jede relevante Änderung braucht eine explizite Form der Verbindlichkeit.

### 5. Kleinste sinnvolle Umsetzung definieren

Jetzt wird die kleinste kohärente Umsetzung bestimmt.

Die Leitfrage lautet:

**Was ist die kleinste Änderung, die die fachliche Frage korrekt bearbeitet, ohne neue Unklarheit zu erzeugen?**

Dabei gilt:

- lieber klein und prüfbar als groß und diffus
- lieber ein sauberer Schritt als mehrere vermischte Änderungen
- lieber bestehende Modulgrenzen respektieren als vorschnell umbauen

### 6. Umsetzung im Code

Erst jetzt wird implementiert.

Die Umsetzung soll:

- der geklärten Domänenlogik folgen
- bestehende Architektur respektieren
- deterministische Fachlogik im Core belassen
- Read-only-Schichten nicht ungewollt in Write-Side-Logik verwandeln
- keine stillen Nebenwirkungen einführen

Wenn während der Umsetzung eine neue fachliche Unklarheit sichtbar wird, wird diese nicht versteckt, sondern wieder zurück in die fachliche Klärung geführt.

### 7. Tests ergänzen oder anpassen

Jede relevante Verhaltensänderung braucht passende Tests.

Besonders testpflichtig sind Änderungen an:

- Coverage-Logik
- Qualifikationslogik
- Tagesfunktionslogik
- Absenzwirkung
- Leadership View
- Situation Layer
- Planning Comparison
- Signal- und Kontextableitungen

Wenn Verhalten über mehrere Module hinweg entsteht, sind Integrationstests zu bevorzugen.

### 8. Fachliche Review

Nach der technischen Umsetzung folgt die fachliche Prüfung.

Hier wird gefragt:

- Entspricht das neue Verhalten wirklich der gemeinten Fachlogik?
- Wurde nur das geändert, was geändert werden sollte?
- Ist die neue Aussage nachvollziehbar?
- Ist die Begriffsverwendung konsistent?
- Wurde eine Grenze des Systems versehentlich verschoben?

Dieser Schritt trennt technisches Gelingen von fachlicher Gültigkeit.

### 9. Dokumentation nachziehen

Wenn sich durch die Änderung das Projektverständnis verändert, wird die Dokumentation aktualisiert.

Typische Dokumentationsorte sind:

- README
- AGENTS.md
- ADRs
- Governance-Dokumente
- Testfälle als Verhaltensdokumentation

Nicht jede kleine Korrektur gehört in die README. Aber jede Änderung, durch die man CareFlow sonst falsch verstehen würde, muss dokumentiert werden.

### 10. Nächsten kleinsten Schritt benennen

Jeder abgeschlossene Schritt soll nach Möglichkeit mit einer kurzen Antwort enden auf:

**Was ist jetzt der nächste kleinste sinnvolle Schritt?**

So bleibt die Entwicklung anschlussfähig und fällt nicht in diffuse Großplanung zurück.

## Kurzform des Zyklus

### Standardsequenz

1. fachlichen Anlass benennen  
2. Domänenlogik klären  
3. Änderungsart bestimmen  
4. Entscheidung explizit machen  
5. kleinste sinnvolle Umsetzung definieren  
6. im Code umsetzen  
7. Tests ergänzen oder anpassen  
8. fachlich reviewen  
9. Dokumentation nachziehen  
10. nächsten kleinsten Schritt benennen  

## Entscheidungslogik im Zyklus

### Wann der Zyklus vollständig durchlaufen werden soll

Der vollständige Zyklus gilt besonders bei:

- neuen Domänenunterscheidungen
- veränderter Fachlogik
- neuen Validierungen
- Änderungen an Read-only-Führungssichten
- Änderungen mit Auswirkungen auf Erklärbarkeit
- Modellierungsänderungen
- Änderungen mit Dokumentationsrelevanz

### Wann eine Kurzform genügt

Eine Kurzform genügt bei:

- rein technischen Kleinreparaturen
- offensichtlichen Tippfehlern
- kleinen Refactors ohne Verhaltensänderung
- Testwartung ohne neue Fachlogik

Auch dann sollten aber mindestens diese drei Fragen beantwortet werden:

- Was wurde geändert?
- Warum war es nötig?
- Hat sich fachliches Verhalten verändert?

## Rollen im Entwicklungszyklus

### Mensch

Der Mensch trägt die letzte Verantwortung für:

- fachliche Bedeutung
- Priorisierung
- Freigabe
- Begriffsstabilität
- Grenzziehung des Systems

### ChatGPT

ChatGPT unterstützt vor allem bei:

- fachlicher Klärung
- Begriffsarbeit
- Strukturierung
- Entscheidungsformulierung
- Dokumentation
- Testdenken
- Architekturreflexion

### Codex

Codex unterstützt vor allem bei:

- Umsetzung
- Refactoring
- Testergänzung
- Projektkonsistenz
- kleinen bis mittleren strukturierten Änderungen

Codex setzt um, aber setzt nicht die fachliche Wahrheit.

## Leitsätze

Für CareFlow gelten im Entwicklungszyklus diese Leitsätze:

**Erst verstehen, dann ändern.**  
**Erst unterscheiden, dann implementieren.**  
**Erst Regeln klären, dann verdichten.**  
**Erst testen, dann gelten lassen.**  
**Erst dokumentieren, wenn Projektverständnis betroffen ist.**

## Kanonische Kurzfassung

Der standardisierte Entwicklungszyklus von CareFlow folgt der Sequenz: fachliche Frage klären, betroffene Domänenlogik schärfen, relevante Entscheidung explizit festhalten, die kleinste sinnvolle Änderung umsetzen, passende Tests ergänzen, das Ergebnis fachlich prüfen und die Dokumentation dort aktualisieren, wo sich das Projektverständnis verändert. Die letzte Verantwortung bleibt beim Menschen; ChatGPT unterstützt die konzeptionelle Klärung, Codex die technische Umsetzung.

## Status

Version: v0.1  
Status: Arbeitsversion / Governance-Grundlage  
Geltungsbereich: CareFlow Entwicklungslogik
