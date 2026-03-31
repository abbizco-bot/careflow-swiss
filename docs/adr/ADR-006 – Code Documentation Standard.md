# ADR-006 – Code Documentation Standard

## Status
Accepted

## Kontext
CareFlow wird iterativ entwickelt und soll über längere Zeit verständlich, wartbar und für KI-gestützte Entwicklung anschlussfähig bleiben. Da zentrale Teile der Geschäftslogik in Python implementiert werden, braucht das Projekt einen einheitlichen Standard für die Dokumentation im Code.

## Entscheidung
Für CareFlow werden Python-Docstrings nach folgendem Standard verwendet:

- PEP 257 als formale Basis
- Google Style Docstrings als konkretes Format im Code

Docstrings werden insbesondere für folgende Elemente verbindlich eingesetzt:
- zentrale Funktionen mit Geschäftslogik
- Funktionen zur Datenvalidierung
- Funktionen zur Risikoprüfung
- Funktionen mit regelbasierter Entscheidungslogik
- zentrale Klassen und Module

Die Code- und Docstring-Sprache ist Englisch.

## Begründung
- gute Lesbarkeit für Menschen
- klare Struktur für KI-gestützte Entwicklung mit Codex
- bessere Wartbarkeit
- konsistente Projektdokumentation direkt im Code
- gute Anschlussfähigkeit für spätere Entwickler

PEP 257 liefert die allgemeinen Konventionen für Python-Docstrings.
Google Style Docstrings bieten ein modernes, kompaktes und leicht lesbares Format.

## Konsequenzen
- zentrale Logik wird systematisch dokumentiert
- der Code wird verständlicher und leichter reviewbar
- zusätzliche Disziplin beim Schreiben neuer Funktionen ist erforderlich
- triviale Hilfsfunktionen müssen nicht überdokumentiert werden

## Alternativen
- keine verbindliche Docstring-Regel (verworfen wegen Inkonsistenz)
- freie Kommentarstile ohne Standard (verworfen wegen schlechter Wartbarkeit)
- NumPy Style Docstrings (nicht gewählt, da für dieses Projekt unnötig schwergewichtig)
- JSDoc (verworfen, da CareFlow primär in Python entwickelt wird)