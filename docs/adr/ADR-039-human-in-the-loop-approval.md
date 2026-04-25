ADR-039 – Human-in-the-Loop-Genehmigung vor operativer Änderung

Status: Accepted
Datum: 2026-04-25
Kontext: CareFlow kann Vorschläge erzeugen, aber operative Planänderungen betreffen reale Mitarbeitende, Verantwortungen, Arbeitsbelastungen und Pflegequalität. Solche Änderungen müssen von einer verantwortlichen Führungsperson genehmigt werden.

Entscheidung: Jede operative Änderung, die aus einem Vorschlag oder einer Simulation entsteht, wird erst nach expliziter Genehmigung durch die Führung wirksam.

Begründung: Die Führung kennt Kontext, den CareFlow nicht vollständig kennen kann. Dazu gehören Teamdynamik, Belastungsgrenzen, informelle Absprachen, kurzfristige Bereitschaft oder persönliche Situationen.

Konsequenzen:
Vorschläge erhalten Status wie system_proposal, manual_proposal, pending_validation, validated_proposal, pending_approval, approved_change und applied_operational_change. Erst applied_operational_change wirkt auf die operative Planlage.