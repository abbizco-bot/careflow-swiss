# CareFlow Analytical Modules Roadmap v0.1

## Status

Draft / Strategic Orientation

## Purpose

This roadmap describes the analytical and product-infrastructure module landscape of CareFlow-Swiss.

CareFlow-Swiss is not a classical duty planning tool, ERP system, payroll system or generic communication platform. It is a leadership and decision layer for Swiss elderly care and nursing homes.

The visible product surface shall remain calm, focused and leadership-oriented. Analytical complexity shall remain mostly in the background and shall feed a limited number of professional leadership views.

The purpose of this roadmap is to preserve relevant module ideas, define their strategic role and prevent premature implementation during the pilot phase.

## Core Principle

CareFlow shall expose calm leadership views while progressively enriching them through read-only analytical modules that interpret planning, operational, qualification, workload, fairness, resilience and organisational pattern data without replacing human leadership decisions.

CareFlow shall not automatically judge employees, managers or teams. It shall surface patterns, tensions, risks and decision situations in a way that supports responsible human leadership.

## Module Groups

The module landscape is grouped into four maturity and function levels:

1. Pilot-near analytical and infrastructure modules
2. Post-pilot leadership modules
3. Later SaaS / advanced organisational intelligence modules
4. Cross-cutting product infrastructure modules

The grouping is not a strict implementation sequence. It defines strategic maturity, product risk and architectural relevance.

---

## 1. Pilot-near Analytical and Infrastructure Modules

Pilot-near modules support the first professional product presentation and early pilot operation. These modules should remain read-only, simple, explainable and closely connected to existing data structures.

### 1.1 Rolling Leadership View Module

Purpose:
Provide a rolling view of the next operational planning window, typically 28 days.

Core questions:
- Which days are stable, tense or critical?
- Where do coverage, qualification or operational context signals appear?
- Which upcoming days require leadership attention?

Pilot relevance:
High.

Implementation note:
This is the central frontend focus for Phase 10.

### 1.2 Reference Plan Comparison Module

Purpose:
Compare the published or reference planning state with the current operational situation.

Core questions:
- Where does operational reality deviate from the reference plan?
- Which deviations are caused by absences, requests or operational changes?
- Which days remain aligned with the reference plan?

Pilot relevance:
High.

Implementation note:
This module shall remain read-only and shall not mutate assignments or planning records.

### 1.3 Data Quality Module

Purpose:
Assess whether imported planning and employee data is usable for leadership interpretation.

Core questions:
- Are employee qualifications complete?
- Are shift records consistent?
- Are duplicate or missing planning entries present?
- Are external IDs stable?
- Are imported files structurally valid?

Pilot relevance:
High.

Implementation note:
This module is essential for real pilot data because CareFlow depends on reliable imports from external planning systems.

### 1.4 Import and Mapping Module

Purpose:
Provide a controlled bridge from external planning systems, CSV files or HR/planning exports into CareFlow.

Core questions:
- Can external planning data be mapped into CareFlow structures?
- Are fields, dates, qualifications and shift types interpretable?
- Can a draft planning frame be generated from imported data?

Pilot relevance:
High.

Implementation note:
This module should support strict imports, validation, mapping profiles and clear error reporting.

### 1.5 Plan Visibility Module

Purpose:
Define which planning states, operational states and leadership signals are visible to which role.

Core questions:
- What does leadership see?
- What does team leadership see?
- What does an employee see?
- Which planning state is visible internally but not yet published?
- Which information is aggregated, role-limited or employee-specific?

Pilot relevance:
High as an architectural concept, limited implementation in Phase 10.

Implementation note:
This module is connected to ADR-079 and ADR-081. In Phase 10 it may be represented only through leadership-facing visibility states and plan-state hints.

### 1.6 CareFlow Communication and Interaction Module

Purpose:
Provide structured, plan-related communication between leadership roles and employees.

Core questions:
- Who needs to know about a planning state or change?
- Who is allowed to see which planning information?
- Which employee requests require leadership approval?
- When is a plan or change considered communicated?
- Which changes require acknowledgement?
- How are publication, feedback and confirmation represented?

Product principle:
CareFlow shall not become a generic chat or messaging system. Communication shall remain structured, plan-related, role-based and leadership-governed.

Pilot relevance:
High as an architectural concept, limited implementation in Phase 10.

Implementation note:
This module is connected to ADR-079, ADR-080 and ADR-081. In the first pilot UI, communication may be represented only through visibility states, request counts, publication states and version hints.

Scope boundary:
The module may support employee requests, approval workflows, change acknowledgements, publication status and event-related notifications. It shall not implement generic messaging, social communication, uncontrolled chat functions or automatic plan changes.

### 1.7 Plan Versioning Module

Purpose:
Track the difference between reference plan, published plan and operational changes.

Core questions:
- What was originally planned?
- What changed after publication?
- Why was it changed?
- Who approved or triggered the change?
- What effect did the change have?

Pilot relevance:
Medium.

Implementation note:
For the first pilot, versioning may remain conceptually prepared and minimally represented.

### 1.8 Basic Stability Signal Module

Purpose:
Show whether a plan remains stable over time or requires frequent operational corrections.

Core questions:
- How often is the plan changed after publication?
- Which days or shifts are repeatedly adjusted?
- Which departments produce frequent instability?

Pilot relevance:
Medium.

Implementation note:
Only simple signals should be considered in early versions.

---

## 2. Post-pilot Leadership Modules

These modules should follow after first pilot feedback. They create stronger leadership value but require more governance, sensitivity and product maturity.

### 2.1 Fairness Module

Purpose:
Analyse whether workload, shift burden, requests, short-term changes and responsible functions are distributed in a balanced and professionally justifiable way.

Core questions:
- Are weekend, night, late or difficult shifts distributed evenly?
- Are short-term changes concentrated on few employees?
- Are employee requests considered proportionally?
- Are certain qualification groups carrying disproportionate responsibility?

Product principle:
The module shall not judge individual employees or managers. It shall surface distribution patterns and possible imbalance.

Pilot relevance:
Low for Phase 10, high for later differentiation.

Implementation note:
Initially aggregated or carefully phrased signals only.

### 2.2 Workload and Fatigue Risk Module

Purpose:
Identify organisational patterns that may indicate increased workload or fatigue risk.

Core questions:
- Are recovery periods repeatedly short?
- Are employees repeatedly used for difficult sequences?
- Are the same people frequently stabilising operational gaps?
- Are certain teams continuously under pressure?

Product principle:
No medical or psychological diagnosis. Only work-organisation risk signals.

Pilot relevance:
Post-pilot.

### 2.3 Resilience Module

Purpose:
Assess whether a plan is robust against disturbances.

Core questions:
- Would the day remain stable if one additional absence occurs?
- Which shifts depend on one critical person?
- Where is there no qualified reserve?
- Which days are formally covered but fragile?

Product principle:
Resilience is different from current stability. A day can be stable but not resilient.

Pilot relevance:
Post-pilot, strategically very important.

### 2.4 Escalation Module

Purpose:
Define when an operational issue becomes a leadership issue.

Core questions:
- Can the team solve this?
- Should the PDL be informed?
- Does the Heimleitung need visibility?
- Is the issue structural rather than operational?

Product principle:
The module supports escalation awareness but does not replace leadership judgement.

Pilot relevance:
Post-pilot.

### 2.5 Decision Log Module

Purpose:
Document professional leadership decisions in response to operational deviations.

Core questions:
- What situation was detected?
- What options were available?
- What decision was made?
- Why was this decision chosen?
- What effect did it have?

Product principle:
CareFlow shall support traceability of leadership decisions without becoming a blame system.

Pilot relevance:
Post-pilot.

### 2.6 External Resources Module

Purpose:
Analyse the use of external staff and its role in operational stabilisation.

Core questions:
- How often is stability achieved through external resources?
- Which departments rely on external staff?
- Which qualifications are frequently covered externally?
- Are external resources used structurally rather than exceptionally?

Pilot relevance:
Post-pilot.

### 2.7 Pilot Feedback Module

Purpose:
Collect structured feedback from pilot users about the accuracy and usefulness of CareFlow signals.

Core questions:
- Was the displayed situation accurate?
- Was the leadership hint useful?
- What was missing?
- Which signal was unclear?
- Did CareFlow reveal something previously hidden?

Pilot relevance:
High after first pilot use.

Implementation note:
This module may become important for product learning and validation.

---

## 3. Later SaaS / Advanced Organisational Intelligence Modules

These modules represent later maturity stages. They may become premium modules or consulting-supported extensions.

### 3.1 Scenario and Alternatives Module

Purpose:
Generate possible staffing alternatives in response to operational gaps.

Core questions:
- Which internal substitution options exist?
- Which swap would preserve qualification coverage?
- Which option creates the least secondary burden?
- Which solution requires leadership approval?

Product principle:
CareFlow may suggest options but shall not automatically change assignments.

Implementation note:
Human-in-the-loop approval is mandatory.

### 3.2 Skill and Competence Map Module

Purpose:
Extend formal qualification logic with practical competence profiles.

Core questions:
- Which employees have specific experience?
- Which skills are critical for certain units or situations?
- Is formal qualification sufficient for the operational need?
- Which teams depend on few specialised people?

Possible competence areas:
- Dementia competence
- Palliative care
- Wound management
- Medication responsibility
- Vocational training role
- Night shift experience
- House responsibility
- Department familiarity
- Language competence

### 3.3 Cost and Resource Impact Module

Purpose:
Connect operational instability with resource and cost implications.

Core questions:
- Where do external staffing costs arise?
- Which operational patterns drive additional costs?
- Which departments require costly stabilisation?
- Does better plan quality reduce external staffing needs?

Product principle:
CareFlow shall remain a leadership system and not become a pure controlling tool.

### 3.4 Resident and Care Intensity Context Module

Purpose:
Include resident-related care intensity as contextual information for staffing interpretation.

Core questions:
- Does resident structure explain increased staffing need?
- Are high-care-intensity areas sufficiently covered?
- Do admissions, discharges or hospital returns affect staffing risk?
- Are dementia or palliative situations reflected in operational planning?

Product principle:
This module is sensitive and requires strong data governance.

### 3.5 Incident and Event Module

Purpose:
Represent operational events as structured triggers for leadership interpretation.

Core questions:
- What happened?
- Which shift, department or function is affected?
- Which qualification is missing?
- What follow-up effects arise?
- Was the situation stabilised?

Possible event types:
- Sickness absence
- Short-term absence
- Accident
- Emergency event
- Resident-related event
- Staff request
- Operational reassignment

### 3.6 Pattern Recognition and Learning Module

Purpose:
Identify recurring organisational patterns across historical planning and operational data.

Core questions:
- Which days repeatedly become critical?
- Which shifts regularly lack qualification coverage?
- Which departments are structurally fragile?
- Which planning assumptions repeatedly fail?
- Which interventions stabilise the system?

Product principle:
The module supports organisational learning and must remain explainable.

### 3.7 Early Warning Module

Purpose:
Provide forward-looking signals about emerging risk situations.

Core questions:
- Which upcoming days look fragile?
- Where are reserves too low?
- Which future weeks show accumulated risk?
- Which shifts require early leadership attention?

Product principle:
Warnings shall remain calm, specific and explainable.

### 3.8 Organisational Diagnosis Module

Purpose:
Interpret recurring planning and operational patterns as organisational development signals.

Core questions:
- Where does the organisation operate permanently in compensation mode?
- Which units stabilise other units?
- Where are formal structure and operational reality misaligned?
- Where do hidden burdens accumulate?
- Where does leadership attention repeatedly concentrate?

Product principle:
This module connects CareFlow with organisational development, but must avoid over-interpretation.

### 3.9 Culture and Trust Signal Module

Purpose:
Surface indirect signals related to planning culture and trust.

Core questions:
- Are changes transparent?
- Are employee requests handled consistently?
- Are many changes made shortly before execution?
- Are certain teams often surprised by operational changes?
- Does planning communication appear stable or reactive?

Product principle:
The module shall not claim to measure culture directly. It may only indicate possible organisational signals.

### 3.10 Compliance and Regulatory Module

Purpose:
Check relevant labour, qualification and organisational constraints.

Core questions:
- Are rest periods respected?
- Are maximum working times respected?
- Are learner constraints considered?
- Are qualification requirements fulfilled?
- Are internal rules or cantonal requirements reflected?

Product principle:
This module requires careful legal and regulatory validation before productive use.

### 3.11 Audit and Traceability Module

Purpose:
Provide structured evidence of detected situations, decisions and stabilisation actions.

Core questions:
- Which critical situations occurred?
- How were they handled?
- Which risks were detected early?
- Which decisions were documented?
- Which patterns repeated over time?

Product principle:
The module supports quality management and organisational learning, not surveillance.

### 3.12 CareFlow Readiness Module

Purpose:
Assess whether an organisation is ready to use CareFlow effectively.

Core questions:
- Are planning data available?
- Are employee qualifications documented?
- Are roles and responsibilities clear?
- Are planning processes sufficiently structured?
- Is leadership prepared to use a decision layer?

Product principle:
This module may become part of consulting, onboarding and pilot selection.

---

## 4. Cross-cutting Product Infrastructure Modules

Cross-cutting modules are not analytical modules in the narrow sense. They provide infrastructure for multilingual use, product consistency, role-based delivery and future SaaS maturity.

### 4.1 Localization and Multilingual Rendering Module

Purpose:
Enable CareFlow to render leadership views, planning signals, communication states and decision texts in multiple languages, especially de-CH, fr-CH, it-CH and en.

Core questions:
- Which language is used by the organisation?
- Which language is preferred by the user?
- Are analytical signals separated from rendered text?
- Are leadership terms consistently translated?
- Are Swiss-specific terminology variants respected?

Product principle:
CareFlow shall separate analytical meaning from linguistic rendering. Backend logic shall use stable codes, enums, message keys and parameters. User-facing text shall be rendered through locale-specific terminology and translation layers.

Pilot relevance:
High as an architectural principle, low as full implementation.

Implementation note:
Phase 10 may use de-CH only, but text handling should avoid hard-coding German business meaning into backend logic.

Initial locale strategy:
- de-CH as first pilot language
- fr-CH as first expansion language for the Romandie
- it-CH as Swiss market extension
- en for product documentation, technical contexts, investors, partners and later international use

Architecture note:
Backend services should expose stable analytical fields such as severity, signalType, shiftType, primaryCause, messageKey and parameters. The frontend or rendering layer should translate these into user-facing language.

### 4.2 Terminology Governance Module

Purpose:
Maintain consistent CareFlow terminology across languages, interfaces, documentation and generated outputs.

Core questions:
- Which terms are canonical in de-CH?
- Which terms must be translated consistently into fr-CH, it-CH and en?
- Which terms are allowed for leadership communication?
- Which terms are too dramatic, unclear or misleading?
- How are new terms introduced and approved?

Product principle:
CareFlow terminology shall remain calm, precise, leadership-oriented and culturally appropriate for Swiss elderly care and nursing homes.

Pilot relevance:
Medium.

Implementation note:
A first de-CH terminology list should be created before broader frontend expansion. Translation packages can follow later.

---

## Architectural Rule

CareFlow shall not expose all modules as separate user-facing dashboards.

Analytical modules shall primarily feed a small number of calm leadership views:

- Rolling Leadership View
- Leadership Day View
- Leadership Week View
- Leadership Month View
- Planning Comparison View
- Future Decision / Situation View

The user should not be confronted with analytical complexity. The product surface shall remain editorial, calm, explainable and leadership-oriented.

## Communication Rule

CareFlow communication shall remain structured, plan-related, role-based and leadership-governed.

CareFlow may:
- show plan publication states
- show request states
- show change states
- support approvals and rejections
- support acknowledgements
- record event-related communication
- provide role-based visibility

CareFlow shall not:
- become a generic chat system
- replace existing communication platforms entirely
- allow uncontrolled plan-related communication
- change plans automatically through communication events
- create employee-facing pressure through excessive notifications

## Multilingual Rendering Rule

CareFlow shall separate analytical meaning from linguistic rendering.

Backend modules shall primarily expose:
- stable codes
- enums
- message keys
- parameters
- structured analytical results

User-facing text shall be rendered through:
- locale-specific frontend language files
- terminology packages
- controlled rendering rules
- future multilingual output policies

The first implementation language may be de-CH, but the architecture shall allow fr-CH, it-CH and en without redesigning backend logic.

## Human-in-the-Loop Rule

All modules shall follow the human-in-the-loop principle.

CareFlow may:
- detect signals
- show patterns
- compare states
- highlight risks
- document decisions
- prepare options

CareFlow shall not:
- automatically assign employees
- automatically judge employee performance
- automatically escalate without human interpretation
- automatically impose fairness conclusions
- replace leadership responsibility

## Privacy and Governance Rule

Modules involving employee-level history, fairness, workload, fatigue risk, culture, competence, communication, acknowledgement records or resident context require explicit governance before implementation.

Sensitive modules shall begin with aggregated, read-only and carefully worded outputs.

## Phase 10 Boundary

Phase 10 shall focus on the first pilot-ready Rolling Leadership View frontend.

The analytical module roadmap shall not expand the Phase 10 implementation scope unless explicitly decided.

For Phase 10, the following modules may be referenced or lightly prepared but not fully implemented:

- Rolling Leadership View Module
- Reference Plan Comparison Module
- Data Quality Module
- Import and Mapping Module
- Plan Visibility Module
- CareFlow Communication and Interaction Module
- Basic Stability Signal Module
- Localization and Multilingual Rendering Module

The following modules are explicitly deferred:

- Fairness Module
- Workload and Fatigue Risk Module
- Resilience Module
- Scenario and Alternatives Module
- Skill and Competence Map Module
- Cost and Resource Impact Module
- Resident and Care Intensity Context Module
- Organisational Diagnosis Module
- Culture and Trust Signal Module
- Compliance and Regulatory Module
- Audit and Traceability Module

## Strategic Positioning

The analytical module architecture strengthens the core positioning of CareFlow-Swiss:

CareFlow-Swiss is a leadership and decision layer for Swiss elderly care and nursing homes.

It does not replace existing planning systems. It interprets planning and operational data and makes leadership-relevant deviations, risks, tensions and patterns visible.

CareFlow combines operational clarity with organisational responsibility.

CareFlow shows the situation, not only the duty plan.

## Suggested ADR Follow-up

The following ADRs should be considered after this roadmap is saved:

- ADR-084 Fairness and Workload Distribution Signals
- ADR-085 Plan Resilience and Fragility Signals
- ADR-086 Analytical Module Boundary and Leadership Surface Principle
- ADR-087 Multilingual Rendering and Swiss Localization
- ADR-088 Communication and Interaction Module Boundary

## Next Steps

1. Preserve this roadmap as a strategic reference document.
2. Keep Phase 10 focused on the pilot-ready Rolling Leadership View frontend.
3. Inspect the backend for user-facing German text literals before multilingual expansion.
4. Create a dedicated ADR for the Fairness Module.
5. Create a dedicated ADR for the Resilience Module.
6. Create a dedicated ADR for Multilingual Rendering and Swiss Localization.
7. Create a dedicated ADR for the Communication and Interaction Module boundary, unless ADR-079 to ADR-081 are considered sufficient.
8. Revisit the module roadmap after the first pilot presentation.


Neue Module

## Erweiterung: Operative Beobachtungs- und Eskalationssignale (Referenz: „Stop and Watch“)

### Kontext
In Pflegeorganisationen existieren strukturierte Prozesse zur frühzeitigen Erkennung von Veränderungen bei Bewohnern/Kunden (z. B. „Stop and Watch“). Diese Prozesse erfassen beobachtete Auffälligkeiten und führen über eine definierte Eskalationskette zu Triage, Massnahmenplanung und Evaluation.

Diese Beobachtungen sind heute nicht Teil der klassischen Dienstplanung, haben jedoch direkten Einfluss auf die operative Belastung und Führungslage.

### Bedeutung für CareFlow
CareFlow versteht sich als Führungs- und Decision-Layer. Die tatsächliche Lage einer Abteilung ergibt sich nicht nur aus:
- geplanter Besetzung
- effektiver Besetzung
- Abwesenheiten
- Qualifikation

sondern auch aus:
- erhöhtem Beobachtungsbedarf
- gehäuften Auffälligkeiten bei Bewohnern
- laufenden Abklärungen und Massnahmenprozessen

Diese Faktoren wirken als **Lageverstärker**, auch wenn keine formale Unterdeckung vorliegt.

### Aktuelle Einordnung (Phase 9–10)
- Keine Implementierung im aktuellen MVP
- Keine Integration in bestehende API- oder Datenmodelle
- Verwendung ausschliesslich als konzeptionelle Referenz für Pilotkommunikation

### Mögliche Weiterentwicklung (post-MVP)
Einführung eines konzeptionellen Moduls:
**Operational Observation Signals**

Mögliche Eigenschaften:
- Erfassung oder Import von Beobachtungsmeldungen (z. B. „Stop and Watch“)
- Statusmodell: erfasst → triagiert → in Klärung → Massnahme geplant → evaluiert
- Aggregation auf Tages-/Abteilungsebene
- Keine medizinische Bewertung, sondern rein kontextuelle Darstellung

### Integration in Leadership View (zukünftig)
- Verwendung als zusätzlicher Kontextlayer in der Tageslage
- Beispielhafte Darstellung:
  - „Mehrere Beobachtungsmeldungen in Abklärung“
  - „Erhöhter Betreuungs- und Beobachtungsbedarf“
- Einfluss auf Lagebewertung möglich (z. B. von „stabil“ zu „angespannt“)

### Offene Architekturfragen
- Datenquelle: Eigenes CF-Modul vs. Import aus Systemen wie CareCoach
- Granularität: Einzelmeldung vs. aggregierte Signale
- Datenschutz und fachliche Abgrenzung zur Pflegeakte
- Verantwortlichkeiten und Sichtbarkeit (Pflege vs. Führung)

### Status
Beobachtung aufgenommen und als relevante Erweiterung für die operative Lagebewertung bestätigt.
Umsetzung bewusst zurückgestellt bis nach erfolgreichem Pilot von CareFlow v0.1.