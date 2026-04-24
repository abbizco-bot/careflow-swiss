# CareFlow Style Guide

Dieser Style Guide beschreibt die Sprache fuer CareFlow-Dokumentation, UI-nahe Texte und fuehrungsorientierte Verdichtung.

## Grundhaltung

CareFlow spricht ruhig, konkret und fuehrungstauglich. Die Sprache soll Orientierung geben, ohne dramatisch, belehrend oder entscheidungsersetzend zu wirken.

Leitlinien:

- klar statt clever
- beobachtend statt wertend
- knapp statt ueberladen
- nachvollziehbar statt suggestiv
- fuehrungsunterstuetzend statt automatisierend

## Backend und Frontend

Das Backend darf stabile technische Codes verwenden. Diese Codes sind Teil des Systemvertrags und sollen deterministisch, testbar und sprachneutral bleiben.

Beispiele:

- Validation issue codes
- Statuswerte
- Gap- oder Signal-Codes
- technische Warning-Typen

Frontend, Leadership View und Dokumentation uebersetzen diese Codes in ruhige, lesbare Sprache. Diese Sprache darf die Bedeutung erklaeren, aber keine neue fachliche Bewertung hinzufuegen.

## Warnings

Warnings sind Hinweise. Sie sind keine automatischen Entscheidungen, keine Sperren und keine versteckten Empfehlungen.

Gute Formulierungen:

- "Funktionshinweis vorhanden"
- "Tagesfunktion passt fachlich nicht zur Stammqualifikation"
- "Schicht ist unterdeckt"
- "Qualifikationsabdeckung nicht erreicht"

Zu vermeiden:

- "Unzulaessig geplant"
- "Muss sofort korrigiert werden"
- "System entscheidet"
- "Automatisch blockiert"
- dramatisierende oder sanktionierende Sprache

## Qualification-function language

Bei Stammqualifikation und Tagesfunktion gilt:

- `Employee.baseQualification` ist die stabile Stammqualifikation.
- `Assignment.assignedFunction` ist die operative Schicht- oder Tagesfunktion.
- `Employee.qualified` bleibt vorerst die operative Zaehlgrundlage fuer `requiredQualifiedCount`.
- Qualification-function warnings zeigen Auffaelligkeiten, blockieren aber keine Assignment-Erstellung.

## Human-in-the-loop

CareFlow darf Fuehrungsentscheidungen vorbereiten, aber nicht ersetzen. Texte sollen deshalb klar machen, dass das System Hinweise liefert und die fachliche Entscheidung beim Menschen bleibt.

Formulierungen sollen:

- erklaeren, was sichtbar ist
- zeigen, worauf die Warnung basiert
- offenlassen, welche konkrete Massnahme die Leitung waehlt

Formulierungen sollen nicht:

- Handlungen automatisch anordnen
- Prioritaeten vortaeuschen
- Scores oder Prognosen suggerieren
- Backend-Fakten sprachlich ueberdehnen

## Governance-Regel

Neue Begriffe und UI-nahe Formulierungen sollen gegen `docs/language/careflow-glossary.md`, `docs/governance/ki-einsatzmatrix-v0.1.md` und `docs/governance/entwicklungszyklus-v0.1.md` geprueft werden.
