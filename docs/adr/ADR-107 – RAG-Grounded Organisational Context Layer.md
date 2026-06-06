# ADR-107 – RAG-Grounded Organisational Context Layer

**Status:** Proposed
**Date:** 2026-06-06
**Project:** CareFlow-Swiss
**Decision Area:** RAG, organisational knowledge, report grounding, source governance, leadership context
**Related ADRs:** ADR-079, ADR-080, ADR-081, ADR-088, ADR-089, ADR-090, ADR-091, ADR-092, ADR-093, ADR-094, ADR-095, ADR-096, ADR-097, ADR-098, ADR-100, ADR-101, ADR-102, ADR-103, ADR-104, ADR-105, ADR-106

---

## Context

CareFlow-Swiss is designed as a leadership support system for care organisations. It translates operational signals, staffing pressure, qualification coverage, deviations, interventions, simulation results, sensitivity results and statistical patterns into leadership-relevant situation views and reports.

ADR-105 defines statistical leadership reporting as the descriptive reporting foundation. ADR-106 defines AI-supported situation report generation as a controlled language and summarisation layer.

A further step is required if CareFlow reports are to be organisationally useful: reports should not only describe operational data, but also connect relevant situations to approved organisational knowledge.

Care organisations rely on internal rules, quality management documents, escalation procedures, care concepts, role descriptions, planning principles, regulatory references, training rules, internal decisions and lessons learned. These sources provide context for interpreting a leadership situation.

For example, if CareFlow detects a recurring qualification gap, the system may need to reference internal minimum qualification rules. If a simulation shows a critical late-shift situation, the system may need to reference an escalation procedure. If a QM-relevant pattern appears, the system may need to reference a quality review process.

RAG can support this by retrieving relevant information from a controlled organisational knowledge base and making it available to AI-supported report generation.

However, RAG also introduces risks. If uncontrolled, it may retrieve outdated, irrelevant, unauthorised or contextually inappropriate information. It may make a retrieved document appear more authoritative than it is. It may mix tenant-specific rules. It may expose sensitive internal documents to the wrong role. It may also cause AI-generated reports to cite rules that are not actually applicable.

Therefore, CareFlow requires a clear architectural decision on how RAG may be used.

---

## Decision

CareFlow-Swiss will implement RAG as a **grounded organisational context layer**.

RAG may retrieve relevant organisational context from approved, versioned and traceable knowledge sources in order to support leadership reports, simulation explanations, sensitivity summaries, QM review notes and organisational learning.

RAG must not be treated as an autonomous authority.

RAG may provide context.
RAG may retrieve relevant rules, procedures or documents.
RAG may support explanation and review.
RAG may link a situation to approved organisational knowledge.

RAG must not create new rules.
RAG must not decide which action must be taken.
RAG must not override local leadership judgement.
RAG must not retrieve from uncontrolled or unapproved sources.
RAG must not mix documents across tenants or organisations.
RAG must not present outdated sources as current.

The guiding role of RAG is:

**to connect CareFlow situation reports with approved organisational knowledge in a traceable and reviewable way.**

---

## Rationale

CareFlow reports become more useful when they can refer to relevant organisational context.

A report that says “qualification coverage is reduced” is useful.
A report that also says “according to the approved internal qualification planning guideline, this situation should be reviewed before shift finalisation” is more useful.

However, this usefulness depends entirely on source control.

RAG should not turn CareFlow into a system that casually retrieves any document and uses it as authority. In a care organisation, rules and procedures are sensitive, versioned and context-dependent. A guideline may apply only to one home, one role, one canton, one care type or one organisational period.

Therefore, RAG must be implemented as a controlled knowledge layer, not as free search.

The value of RAG lies in disciplined retrieval from trusted sources, not in open-ended knowledge generation.

---

## Definition

In CareFlow-Swiss, RAG means the retrieval of relevant information from a controlled organisational knowledge base and its use as grounded context for report generation, explanation or review support.

The RAG layer may retrieve from:

* approved quality management documents,
* internal escalation procedures,
* care concepts,
* staffing and qualification guidelines,
* role descriptions,
* planning principles,
* internal process descriptions,
* approved organisational policies,
* CareFlow ADRs,
* implementation notes,
* pilot decisions,
* lessons learned,
* tenant-specific configuration documents,
* validated operational guidance.

RAG does not mean unrestricted internet search.
RAG does not mean uncontrolled document upload.
RAG does not mean autonomous rule creation.
RAG does not mean automatic legal, clinical or quality judgement.

---

## Source Governance

CareFlow will only use RAG sources that are approved for retrieval.

Each source should have metadata.

Required metadata may include:

* document title,
* document type,
* tenant or organisation,
* version,
* validity date,
* approval status,
* owner,
* applicable scope,
* language,
* confidentiality level,
* retrieval permission,
* last update,
* source identifier.

Sources without sufficient metadata should not be used for formal RAG-supported reports.

Where a source is outdated, draft, superseded or unapproved, this must be visible and the source must not be used as authoritative context unless explicitly allowed for historical comparison.

---

## Tenant Separation

RAG must respect tenant separation.

CareFlow may later serve different care homes, groups or organisations. Their internal rules, QM documents, staffing principles and escalation paths may differ.

Therefore, RAG retrieval must not mix knowledge across tenants.

A report for one organisation must not retrieve internal documents from another organisation.

Tenant-specific knowledge bases must remain separated unless an explicit shared-source configuration exists.

This is especially important for:

* quality management rules,
* staffing requirements,
* internal policies,
* escalation procedures,
* employee-related guidance,
* pilot-specific decisions,
* organisational learning notes.

---

## Permitted RAG Functions

RAG may be used for the following purposes.

### 1. Contextualising Situation Reports

RAG may retrieve relevant internal rules or procedures that help interpret a CareFlow situation.

Example:

A report identifies reduced qualification coverage.
RAG retrieves the approved internal qualification guideline.
The report may state that the situation should be reviewed in relation to this guideline.

---

### 2. Supporting Simulation Explanations

RAG may retrieve organisational guidance related to simulated incidents.

Example:

A simulation includes a resident death with documentation and family communication load.
RAG may retrieve the internal end-of-life documentation or family communication procedure.

---

### 3. Supporting Sensitivity Review

RAG may retrieve relevant rules when sensitivity analysis shows a repeated tipping point.

Example:

A shift repeatedly becomes critical when one key qualification is removed.
RAG may retrieve the internal staffing and qualification planning principle.

---

### 4. Supporting QM and Organisational Learning

RAG may retrieve quality management processes, review templates or learning procedures when repeated patterns are detected.

Example:

A recurring late-shift qualification gap appears over a rolling period.
RAG may retrieve the internal QM review process or workforce planning guideline.

---

### 5. Linking Reports to Source Evidence

RAG may provide source references so that a human user can verify why a specific rule, procedure or note was included.

The report should be able to show:

* which source was retrieved,
* which section was used,
* why it was considered relevant,
* whether the source is current and approved.

---

## Prohibited RAG Functions

RAG must not be used for the following purposes.

### 1. Uncontrolled Internet Retrieval

CareFlow RAG must not retrieve uncontrolled internet content for formal leadership reports.

External legal, regulatory or clinical references require separate source governance and validation.

---

### 2. Rule Creation

RAG must not create new organisational rules.

It may retrieve existing rules.
It may not invent policy.

---

### 3. Autonomous Decision-Making

RAG must not determine the final action.

It may provide relevant context.
The decision remains with the responsible human leader.

---

### 4. Automatic Quality Judgement

RAG must not turn retrieved quality documents into automatic quality assessment.

Acceptable wording:

“This pattern should be reviewed in relation to the approved QM procedure.”

Non-acceptable wording:

“The unit has failed the QM requirement.”

---

### 5. Cross-Tenant Knowledge Leakage

RAG must not retrieve or expose documents belonging to another tenant or organisation.

---

### 6. Use of Outdated Sources as Current Authority

RAG must not present outdated or superseded documents as current guidance.

If historical sources are retrieved for learning purposes, they must be marked as historical.

---

## Relationship to AI

RAG and AI must be clearly separated.

RAG retrieves context.
AI formulates language.
Statistics describe patterns.
Human leadership decides.

AI may use RAG-retrieved context when generating a situation report, but it must not transform retrieved context into stronger claims than the source supports.

Example:

If RAG retrieves a guideline saying that reduced qualification coverage should be reviewed, AI may write:

“The situation should be reviewed in relation to the internal qualification planning guideline.”

AI must not write:

“The organisation is non-compliant.”

Unless such a statement is explicitly supported by an authorised source and appropriate review process, it is prohibited.

---

## Relationship to Statistical Reporting

RAG does not replace statistical reporting.

Statistical reporting identifies patterns.
RAG helps connect these patterns to organisational knowledge.

Example:

Statistical report:

“Late-shift qualification gaps occurred repeatedly over the rolling period.”

RAG context:

“Internal staffing guidance defines qualification coverage as a planning review point.”

Combined report:

“Late-shift qualification gaps occurred repeatedly over the rolling period. This should be reviewed in relation to the approved staffing and qualification planning guidance.”

The statistical observation and the RAG context must remain distinguishable.

---

## Relationship to Simulation and Sensitivity Analysis

RAG may enrich simulation and sensitivity outputs.

Simulation identifies what changes under selected incidents.
Sensitivity analysis identifies which factors create fragility or resilience.
RAG may retrieve relevant organisational guidance for reviewing these results.

Example:

A sensitivity analysis shows that a shift becomes critical when one key qualification is removed.
RAG may retrieve the relevant internal qualification standard.
The generated report may recommend reviewing the scenario against that standard.

RAG does not change the simulation result.
RAG does not change the sensitivity result.
RAG adds organisational context.

---

## Leadership-Level Interpretation

RAG-supported context must respect the Three-Level Leadership View Model.

### Level 1 – Operational Home and Residential Unit Leadership

At Level 1, RAG may retrieve operational procedures, shift-related guidance, qualification rules and immediate escalation paths.

The focus is concrete review support.

---

### Level 2 – Area and Overall Leadership

At Level 2, RAG may retrieve organisational coordination rules, support procedures, multi-unit escalation guidelines and group-level planning principles.

The focus is support, prioritisation and coordination.

RAG outputs must remain aggregated and must avoid enabling central micromanagement.

---

### Level 3 – Strategy, Quality Management and Organisational Development

At Level 3, RAG may retrieve QM processes, strategic workforce planning principles, organisational learning documents, internal standards and review frameworks.

The focus is structural learning, quality reflection and organisational development.

RAG must not generate automatic quality judgement.

---

## Source Referencing

RAG-supported reports should include source references where appropriate.

A reference should indicate:

* document title,
* version or date,
* relevant section if available,
* source status,
* retrieval date,
* applicability scope.

A report should not hide the fact that it used retrieved organisational context.

Example:

“Context source: Internal Qualification Planning Guideline, v1.3, approved, applicable to Wohnbereich A.”

This allows human users to verify the basis of the report.

---

## Epistemic Boundaries

RAG-supported reports must clearly distinguish:

* operational observation,
* statistical pattern,
* simulation result,
* sensitivity result,
* retrieved organisational context,
* AI-generated wording,
* human review or decision.

Example structure:

**Observation:** The late shift is currently tense.
**Pattern:** Similar late-shift pressure occurred repeatedly in the rolling period.
**Retrieved context:** Internal staffing guidance marks reduced qualification coverage as a review point.
**Review path:** Check qualification coverage and available reserve.
**Boundary:** This is not an automatic quality assessment.

This distinction is mandatory for trustworthy reporting.

---

## Human Review

RAG-supported reports must remain reviewable by authorised human users.

Human review is especially important when the report involves:

* quality management,
* staffing pressure,
* resident-related incidents,
* qualification gaps,
* escalation procedures,
* organisational learning,
* sensitive internal rules.

A human user should be able to:

* inspect retrieved sources,
* accept or reject the retrieved context,
* edit report language,
* add local knowledge,
* approve or decline the report.

RAG must support human judgement, not bypass it.

---

## Data Protection and Confidentiality

RAG must respect confidentiality and access rights.

Not every user should be able to retrieve every document.

Access must be role-based and tenant-specific.

Sensitive documents may require restricted retrieval or redacted output.

This applies especially to:

* employee-related information,
* resident-related information,
* internal investigations,
* audit reports,
* confidential leadership notes,
* HR-related procedures,
* tenant-specific policies,
* pilot partner documents.

The RAG layer must be designed with data minimisation and purpose limitation.

---

## Demo Implications

In the demo, RAG should not be overpromised.

A first demo may show a placeholder or conceptual example rather than a fully implemented RAG system.

A suitable demo label could be:

**Organisational Context**

or in German:

**Organisationskontext**

A demo report could state:

“Future RAG support may link this recurring qualification pattern to approved internal staffing and QM guidelines. In the current demo, this is shown as a conceptual example.”

If shown in the demo, RAG output should be clearly marked as:

* retrieved context,
* source-bound,
* not an automatic decision,
* not an automatic quality judgement.

---

## Non-Goals

This ADR does not define the full vector database architecture.

This ADR does not define embedding models or retrieval algorithms.

This ADR does not define document ingestion pipelines in detail.

This ADR does not define external legal or clinical knowledge retrieval.

This ADR does not permit uncontrolled internet search.

This ADR does not define final access control implementation.

This ADR does not replace human review, quality management or leadership responsibility.

This ADR does not define all prompt templates for AI-generated reports.

---

## Design Boundaries

The following boundaries are binding.

RAG may only retrieve from approved and controlled sources.

RAG must respect tenant separation.

RAG outputs must be source-referenced where used for formal reports.

RAG must distinguish current, draft, historical and superseded sources.

RAG must not create rules, decisions or quality judgements.

RAG must remain subordinate to human leadership review.

RAG-supported reports must preserve the distinction between data, pattern, context, interpretation and decision.

---

## Risks

The first risk is source misuse. A retrieved document may be irrelevant, outdated or not applicable. This must be mitigated through metadata, versioning and human review.

The second risk is authority inflation. Retrieved text may appear more authoritative than it is. Reports must show source status and scope.

The third risk is tenant leakage. Documents from one organisation must not be retrieved for another organisation.

The fourth risk is overinterpretation. AI may overstate retrieved context. Prompt rules and report boundaries must prevent this.

The fifth risk is confidentiality breach. Sensitive documents must be protected by role-based access and retrieval permissions.

The sixth risk is document sprawl. Too many uncontrolled sources may reduce trust. Knowledge base governance is therefore essential.

---

## Implementation Notes

The first implementation may remain conceptual or use manually curated context snippets.

A later implementation should define a controlled organisational knowledge base.

Each ingested document should include:

* source identifier,
* title,
* owner,
* tenant,
* version,
* date,
* approval status,
* validity period,
* confidentiality level,
* applicable organisational scope,
* retrieval permissions,
* document type,
* language,
* supersession status.

Retrieval results should include:

* matched source,
* relevant excerpt or section,
* confidence or relevance marker if available,
* source status,
* applicability note,
* retrieval timestamp.

Future implementation may include:

* tenant-specific knowledge bases,
* role-based retrieval,
* source versioning,
* RAG audit trail,
* report-source linking,
* human source approval,
* source freshness checks,
* feedback loop for irrelevant retrievals,
* integration with AI-generated report drafts.

Implementation must proceed incrementally and must not be introduced as uncontrolled AI knowledge access.

---

## Accepted Decision

CareFlow-Swiss will use RAG as a grounded organisational context layer.

RAG may retrieve relevant context from approved, versioned and tenant-specific organisational sources to support leadership reports, simulation explanations, sensitivity summaries and QM review notes.

RAG does not create rules, decide actions, judge quality, assign blame or replace human leadership.

RAG-supported outputs must remain source-bound, traceable, reviewable and aligned with the three-level leadership model.

The guiding principle is:

**CareFlow RAG retrieves approved organisational context. It does not invent authority.**
