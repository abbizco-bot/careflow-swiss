# ADR-103 – Prioritised Incident Catalogue and Combined Event Handling

**Status:** Proposed
**Date:** 2026-06-06
**Project:** CareFlow-Swiss
**Decision Area:** Simulation, incident modelling, leadership relevance, demo scope
**Related ADRs:** ADR-079, ADR-080, ADR-081, ADR-088, ADR-097, ADR-098, ADR-100, ADR-101, ADR-102

---

## Context

ADR-102 defines simulation in CareFlow-Swiss as a rule-based What-if Layer. This means that CareFlow does not predict the future, but tests how a current or planned care planning situation may change if selected incidents occur.

In an early draft, a broad list of possible incidents was identified. This list included staff absences, qualification gaps, resident workload changes, resident death, organisational load, team instability, system disruptions and external events.

However, this broad incident catalogue creates an important design risk. If every potentially relevant event is treated as a full simulation event from the beginning, CareFlow becomes too complex for the MVP and too difficult to explain in demo situations. The system would risk becoming an encyclopaedia of possible disruptions rather than a focused leadership support instrument.

Therefore, CareFlow requires a distinction between:

1. incidents that must be modelled early,
2. incidents that are relevant but belong to later development stages,
3. contextual factors, impact dimensions or recurring patterns that should not necessarily become standalone simulation events.

The simulation model must remain clear, explainable and leadership-relevant.

---

## Decision

CareFlow-Swiss will use a **prioritised incident catalogue** for simulation.

Not every potentially relevant event will be implemented as a simulation event in the MVP or demo.

An incident will only be included as a simulation event if it changes the leadership situation in at least one central impact dimension.

The initial central impact dimensions are:

* staffing capacity,
* qualification coverage,
* resident workload,
* shift stability,
* communication need,
* documentation load,
* quality-relevant risk,
* leadership attention,
* intervention need.

CareFlow will distinguish between three layers:

1. **Core Simulation Incidents**
   These are incidents that are directly relevant for the MVP, demo and early leadership validation.

2. **Expansion Incidents**
   These are leadership-relevant incidents that may be added in later development phases.

3. **Context Factors and Patterns**
   These are relevant for interpretation, reporting, quality management or organisational learning, but they do not automatically become standalone simulation events.

This ADR replaces the broad incident-list approach with a staged and leadership-focused approach.

---

## Rationale

CareFlow-Swiss is intended to support leadership judgement, not to model every possible disruption in a care organisation.

A long incident list may be fachlich plausible, but it creates several problems.

First, it increases implementation complexity too early.

Second, it makes the demo harder to understand.

Third, it may blur the distinction between incident, effect, pattern and context.

Fourth, it may suggest that CareFlow claims to fully model the complexity of care work. This would be inappropriate at the current maturity level.

The better approach is to start with a small number of high-value incidents that are easy to understand, frequent enough to be credible and directly connected to leadership decisions.

The MVP and demo should therefore focus on incidents that clearly affect care planning stability, qualification coverage, workload and leadership attention.

---

## Core Simulation Incidents

The following incidents form the initial core catalogue for MVP and demo development.

### 1. Sickness Notification or Short-Term Staff Absence

This is the most basic and most intuitive simulation case.

It directly affects staffing capacity and may affect qualification coverage if the absent person carries a key qualification.

Core leadership question:

**Does the shift remain stable if one person is absent?**

Primary impact dimensions:

* staffing capacity,
* shift stability,
* qualification coverage,
* intervention need.

---

### 2. Missing Key Qualification

This incident occurs when the required professional competence for a shift, residential unit or care situation is no longer sufficiently covered.

Examples include missing qualified nurse coverage, missing FaGe coverage or missing medication competence.

Core leadership question:

**Is the required professional qualification still covered?**

Primary impact dimensions:

* qualification coverage,
* quality-relevant risk,
* shift stability,
* leadership attention.

---

### 3. Increased Resident Workload or Acute Deterioration

This incident captures situations where the number of residents may remain unchanged, but the care intensity rises.

Examples include acute deterioration, increased supervision need, increased mobilisation need or increased complexity of care.

Core leadership question:

**Does the existing staffing and qualification setup still fit the actual care intensity?**

Primary impact dimensions:

* resident workload,
* staffing pressure,
* qualification need,
* quality-relevant risk,
* intervention need.

---

### 4. Resident Death with Communication and Documentation Load

Resident death is included as a core simulation incident, but it must be treated with professional and ethical sensitivity.

CareFlow must not model resident death merely as a reduction in occupancy or workload. A resident death may reduce direct care workload in one dimension, but it can increase communication need, documentation load, emotional team load, coordination work and later reoccupation dynamics.

Core leadership question:

**Which additional communication, documentation and team load arises despite a possible reduction in direct care workload?**

Primary impact dimensions:

* communication need,
* documentation load,
* leadership attention,
* emotional team load,
* organisational coordination,
* quality-relevant documentation.

---

### 5. Resident Admission or Reoccupation Pressure

A new admission or rapid reoccupation may increase workload and coordination needs, especially if the resident has complex care needs or if the team is already under pressure.

Core leadership question:

**Does the admission create additional pressure in an already tense operational situation?**

Primary impact dimensions:

* resident workload,
* documentation load,
* communication need,
* staffing pressure,
* leadership attention.

---

### 6. Fall Incident or Acute Care Incident

A fall or acute care incident may create immediate care needs, documentation requirements, family communication and quality-relevant follow-up.

Core leadership question:

**Does the incident create additional care, documentation or quality management workload?**

Primary impact dimensions:

* resident workload,
* documentation load,
* communication need,
* quality-relevant risk,
* intervention need.

---

### 7. Infection Situation or Outbreak Pressure

An infection situation can affect several dimensions at the same time. It may increase resident workload, staff absence, protective measures, documentation requirements and leadership coordination.

Core leadership question:

**Does a local incident become a unit-wide or home-wide leadership situation?**

Primary impact dimensions:

* resident workload,
* staffing capacity,
* process reliability,
* communication need,
* quality-relevant risk,
* leadership attention.

---

### 8. Combined Critical Scenario

The combined scenario is essential because care pressure often emerges from the accumulation of several incidents.

A suitable demo scenario is:

**sickness notification + missing key qualification + increased resident workload**

Core leadership question:

**Which combination causes the care planning situation to tip from stable to tense or critical?**

Primary impact dimensions:

* staffing capacity,
* qualification coverage,
* resident workload,
* shift stability,
* intervention need,
* leadership attention.

---

## Expansion Incidents

The following incidents are leadership-relevant but should not be implemented as full simulation events in the first MVP or first demo unless a specific pilot partner requires them.

They belong to later development stages.

Expansion incidents include:

* training-related absence,
* mandatory internal training,
* absence of a leadership person,
* documentation backlog,
* internal audit or quality review,
* external inspection,
* unusually high temporary staff ratio,
* repeated overload of the same employees,
* team conflict or role tension,
* high turnover,
* process change,
* project workload,
* system outage,
* interface disruption,
* missing data import,
* heatwave,
* severe weather,
* transport disruption,
* supply shortage,
* regulatory additional requirement,
* regional staff shortage.

These incidents may later be added when the rule model, data model and leadership reporting logic are mature enough.

---

## Context Factors and Patterns

Some relevant phenomena should not initially be treated as standalone incidents.

They are better understood as context factors, impact dimensions or recurring patterns.

Examples include:

* emotional team load,
* family communication,
* documentation burden,
* team stability,
* organisational resilience,
* chronic qualification gaps,
* repeated late-shift pressure,
* recurring overload of the same residential unit,
* seasonal workload increase,
* structural staffing shortage,
* regional labour market pressure,
* repeated dependency on key persons.

These factors are highly leadership-relevant, but they should mainly be used to interpret simulation results, enrich situation reports or support quality management and organisational learning.

They should not automatically become selectable simulation events in the first demo.

---

## Distinction Between Incident, Impact Dimension and Pattern

CareFlow will distinguish between three concepts.

An **incident** is a concrete trigger.

Examples:

* sickness notification,
* missing qualified nurse,
* resident death,
* new admission,
* fall incident,
* infection outbreak.

An **impact dimension** is the way in which an incident affects the leadership situation.

Examples:

* staffing capacity,
* qualification coverage,
* resident workload,
* documentation load,
* communication need,
* quality-relevant risk,
* leadership attention.

A **pattern** is a repeated or structurally relevant development over time.

Examples:

* repeated late-shift qualification gaps,
* chronic staffing pressure,
* repeated overload in one residential unit,
* recurring documentation backlog,
* seasonal instability.

This distinction is binding for future design. It prevents CareFlow from confusing concrete events with their effects or with longer-term organisational learning patterns.

---

## Combined Event Handling

CareFlow will support combined event handling from the beginning, but only for a limited number of predefined combinations.

Combined events must not be treated as a simple addition of isolated effects.

The system must consider interaction effects.

A combined event becomes more critical when:

* several incidents affect the same impact dimension,
* an incident removes an existing buffer,
* one incident amplifies another,
* a minimum threshold is crossed,
* the current operational state is already tense before the incident is applied.

Example:

A sickness notification in a stable shift may create a tense situation.

A sickness notification in a shift with missing key qualification and increased resident workload may create a critical situation.

This logic is essential for CareFlow because real care pressure often arises through accumulation, not through isolated events.

---

## Severity Logic

CareFlow will use simple and explainable severity levels.

The initial levels are:

**Stable**
The situation remains manageable under the selected assumptions.

**Tense**
The situation requires leadership attention, review or preparation.

**Critical**
The situation requires urgent leadership review, support, intervention or escalation.

Every severity change must be accompanied by a short explanation.

Example:

**Simulated status:** Critical
**Reason:** The combination of staff absence, missing key qualification and increased resident workload reduces shift stability below the defined planning threshold.
**Affected dimensions:** Staffing capacity, qualification coverage, resident workload, shift stability.
**Review path:** Check replacement staff, cross-unit support, task prioritisation and leadership escalation.

---

## Leadership-Level Interpretation

Incidents must be interpreted differently across the three leadership levels.

At **Level 1**, incidents are interpreted operationally. The focus is immediate stabilisation of a shift, unit or home.

At **Level 2**, incidents are interpreted as support and prioritisation signals. The focus is where area or overall leadership needs to assist, relieve pressure or coordinate resources.

At **Level 3**, incidents are interpreted as possible organisational patterns. The focus is whether repeated incidents reveal structural vulnerabilities, quality-relevant learning needs or strategic workforce issues.

The same incident can therefore have different leadership meanings depending on the level.

Example:

A repeated late-shift qualification gap is a concrete operational issue at Level 1.
It is a support and prioritisation signal at Level 2.
It becomes a workforce planning and quality management pattern at Level 3.

---

## Output Requirements

Simulation outputs based on incidents must include:

* selected incident or incident combination,
* affected impact dimensions,
* severity before and after simulation,
* reasoning note,
* review path,
* assumption marker.

The output must make clear that the simulated result depends on selected assumptions and rules.

CareFlow may suggest what should be reviewed. It must not automatically decide what should be done.

---

## MVP and Demo Scope

The first demo should not expose the full incident catalogue.

The recommended first demo set is:

1. sickness notification in the late shift,
2. missing key qualification,
3. increased resident workload,
4. resident death with communication and documentation load,
5. combined scenario: sickness notification plus missing key qualification.

This limited set is sufficient to demonstrate the core leadership value of simulation without overloading the user.

The demo should explicitly communicate:

* this is a What-if simulation,
* this is not a prediction,
* the result is a leadership signal,
* the decision remains with the responsible leader,
* only selected core incidents are shown in the demo.

---

## Non-Goals

This ADR does not define a full mathematical simulation engine.

This ADR does not define machine learning-based incident prediction.

This ADR does not define probability scoring.

This ADR does not require all possible incidents to be implemented in the MVP.

This ADR does not automate staffing decisions.

This ADR does not replace professional care judgement.

This ADR does not create automatic blame attribution for incidents.

This ADR does not define the final legal, privacy or data protection model for employee-related incident data.

---

## Design Boundaries

The following boundaries are binding.

CareFlow must not treat every leadership-relevant phenomenon as a standalone simulation event.

The first simulation catalogue must remain small, explainable and demo-ready.

Incidents must be distinguished from impact dimensions and longer-term patterns.

Combined events must consider interaction effects, not merely additive effects.

Resident death must be modelled with professional and ethical sensitivity.

Higher leadership levels must receive aggregated signals and patterns, not unnecessary operational detail.

No incident category may be used to create automatic blame logic or employee ranking.

---

## Risks

The first risk is overcomplexity. A large incident catalogue would make CareFlow difficult to explain and difficult to implement.

The second risk is oversimplification. A small catalogue may omit relevant situations. This risk is accepted for the MVP and can be addressed through later expansion.

The third risk is false objectivity. Incident classification may appear neutral, but it contains assumptions. These assumptions must be documented and reviewed.

The fourth risk is emotional insensitivity. Resident death, overload and conflict must be handled with careful language.

The fifth risk is control misuse. Incident data could be misread as individual performance data. This must be prevented through aggregation, role design and wording.

---

## Implementation Notes

The first technical implementation should represent core incidents as simple configuration objects.

Each core incident should define:

* incident identifier,
* display name,
* description,
* affected impact dimensions,
* severity effect,
* explanatory text,
* possible review paths,
* applicable leadership level.

The first demo implementation may hard-code the five selected demo scenarios.

Later versions may add:

* tenant-specific incident configuration,
* editable thresholds,
* expanded incident catalogue,
* statistical pattern analysis,
* sensitivity analysis,
* AI-generated explanation,
* RAG-supported contextual reporting,
* quality management learning views.

Expansion must be incremental and validated with care organisations.

---

## Accepted Decision

CareFlow-Swiss will use a prioritised incident catalogue for simulation.

The MVP and demo will focus on a small number of core simulation incidents that directly affect leadership-relevant dimensions such as staffing capacity, qualification coverage, resident workload, shift stability, communication need, documentation load and quality-relevant risk.

Not every potentially relevant event will be implemented as a simulation event.

CareFlow will distinguish between incidents, impact dimensions and patterns.

The guiding principle is:

**CareFlow does not simulate everything that can happen. It simulates selected incidents that meaningfully change the leadership situation.**
