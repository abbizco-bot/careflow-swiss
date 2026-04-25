ADR-043 – Führung kann eigene Alternativen erfassen

Status: Accepted
Datum: 2026-04-25
Kontext: CareFlow kann Alternativen vorschlagen, aber die Führung kennt häufig zusätzlichen Kontext, den das System nicht vollständig kennt. Deshalb darf die Führung nicht auf CareFlow-Vorschläge beschränkt sein.

Entscheidung: Die Führung kann CareFlow-Vorschläge genehmigen, ablehnen, verändern oder eigene Alternativen erfassen. Führungseigene Alternativen sind gleichwertige Entscheidungsoptionen neben systemgenerierten Vorschlägen.

Begründung: CareFlow unterstützt Führung, ersetzt sie aber nicht. Erfahrungswissen, Teamkontext und situative Einschätzung bleiben zentrale Führungsressourcen.

Konsequenzen:
Manuelle Alternativen erhalten eigene Status wie manual_proposal oder modified_proposal. Sie werden wie systemgenerierte Vorschläge validiert, simuliert und erst nach Genehmigung operativ wirksam.