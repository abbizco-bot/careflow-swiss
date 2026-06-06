# ADR-102 – Simulation as Rule-Based What-if Layer

**Status:** Proposed
**Date:** 2026-06-06
**Project:** CareFlow-Swiss
**Decision Area:** Simulation, scenario logic, leadership support
**Related ADRs:** ADR-079, ADR-081, ADR-088, ADR-097, ADR-098, ADR-100, ADR-101

---

## Context

CareFlow-Swiss currently provides visibility into operational staffing, deviations, interventions, residential unit situations and leadership-relevant care planning signals. The system is increasingly being positioned not only as a visualisation layer for current operational states, but also as a leadership support system that helps care organisations understand how fragile or resilient a planned situation may be.

Care organisations are exposed to frequent short-term disruptions. These include sickness notifications, qualification gaps, increased resident acuity, absences, emotional and organisational events such as a resident death, external inspections, infection situations, sudden workload increases and combinations of several incidents at the same time.

A leadership system for care planning should therefore not only display the current state. It should also allow leaders to ask structured what-if questions:

What happens if one employee calls in sick?
What happens if a qualified nurse is missing in the late shift?
What happens if resident acuity increases?
What happens if several incidents occur at the same time?
What happens to the leadership situation if a planned shift becomes unstable?

At the same time, CareFlow must avoid creating the impression that it can predict the future with certainty. The system must remain transparent, explainable and responsible. For the current development stage, a rule-based simulation approach is therefore more appropriate than a predictive or opaque algorithmic model.

---

## Decision

CareFlow-Swiss will introduce simulation as a **rule-based What-if Layer**.

The simulation layer will apply defined hypothetical incidents to an existing operational state and show how the care situation, staffing situation, qualification coverage, pressure level and support need may change.

The simulation will not be designed as a predictive forecasting engine in the first implementation. It will not claim to know what will happen. It will show what may happen under explicitly selected assumptions.

The basic simulation logic is:

**Current or planned operational state + selected incident or incident combination = simulated leadership situation.**

The result of a simulation is not an automatic decision. It is a leadership signal that supports review, prioritisation and preparation.

---

## Rationale

A rule-based simulation approach is appropriate for CareFlow-Swiss for several reasons.

First, it is explainable. Care leaders must be able to understand why a situation is shown as stable, tense or critical. If the system uses explicit rules, the reasoning behind a simulated status can be displayed and discussed.

Second, it is compatible with the current maturity level of the product. CareFlow is still in an early demo and MVP-oriented phase. A transparent rule-based model is easier to validate with care homes than an advanced predictive model.

Third, it protects the epistemic boundary of the system. CareFlow should not overclaim. It should support judgement, not replace it. A What-if simulation makes assumptions visible, whereas a predictive model may create false confidence.

Fourth, it fits the leadership philosophy of CareFlow. The system is designed to support orientation, prioritisation and organisational learning. Simulation should therefore help leaders explore possible pressure points rather than automate operational decisions.

---

## Definition of Simulation

In CareFlow-Swiss, simulation means the structured application of one or more defined hypothetical incidents to a current or planned care planning state.

A simulation can be based on:

* a single day,
* a shift,
* a residential unit,
* a week,
* a rolling planning period,
* one care home,
* several care homes in an aggregated view.

The simulation shows the potential effect of an incident on defined leadership-relevant dimensions.

These dimensions may include:

* staffing capacity,
* qualification coverage,
* resident workload,
* shift stability,
* leadership attention,
* documentation load,
* communication need,
* intervention need,
* quality-relevant risk signals.

Simulation does not mean full modelling of reality. It means controlled testing of selected scenarios that are relevant for leadership decisions.

---

## Rule-Based Approach

The first implementation of simulation will be rule-based.

This means that each incident type has predefined effects on one or more operational or leadership indicators.

Example:

A qualified nurse is removed from a late shift.
The system checks whether minimum qualification coverage remains sufficient.
If coverage falls below the defined threshold, the simulated status changes from stable to tense or critical.
CareFlow displays a leadership note indicating that qualification coverage should be reviewed.

Another example:

A resident death is selected as a simulated incident.
The system does not treat this only as a reduction in resident count.
It also considers documentation, communication, emotional team load, family contact and possible later reoccupation dynamics as relevant leadership signals.

The rules must be understandable, documented and adjustable as the system develops.

---

## Distinction from Forecasting

CareFlow simulation must be clearly distinguished from forecasting.

Forecasting asks:

**What is likely to happen?**

Simulation asks:

**What would happen to the leadership situation if a defined event occurred?**

This distinction is binding.

CareFlow must not present early simulations as probability-based predictions unless a later statistical or AI-supported forecasting model has been explicitly developed, validated and documented.

For now, simulation is a controlled exploration of possible scenarios, not a prediction of the future.

---

## Leadership Integration

Simulation will be connected to the Three-Level Leadership View Model.

At **Level 1**, simulation supports operational home leadership and residential unit leadership. It helps answer immediate questions such as:

What happens to today’s late shift if one employee calls in sick?
Is qualification coverage still sufficient?
Which intervention should be reviewed?

At **Level 2**, simulation supports area or overall leadership. It helps answer questions such as:

Which unit or home becomes critical if several incidents occur at once?
Where would support be most urgent?
Which area has the least resilience under pressure?

At **Level 3**, simulation supports strategy, quality management and organisational development. It helps answer questions such as:

Which recurring simulated scenarios reveal structural weaknesses?
Where are qualification reserves insufficient?
Which patterns indicate a need for organisational learning?

Thus, simulation is not only an operational tool. It is also a leadership, prioritisation and learning instrument.

---

## Incident Scope

The simulation layer will initially support selected incident categories. These categories will be defined in more detail in a separate ADR on incident taxonomy and combined event handling.

Initial incident categories include:

* staff absence,
* qualification gap,
* increased resident workload,
* resident death,
* resident admission or discharge,
* infection or epidemic pressure,
* documentation or inspection load,
* system or process disruption,
* team overload,
* multi-incident combinations.

The first demo implementation should use a small number of clearly understandable scenarios rather than a broad and complex incident catalogue.

---

## Output of a Simulation

A simulation output should include four elements.

First, it should show the simulated status of the care situation, for example stable, tense or critical.

Second, it should show the main reason for the status change.

Third, it should show which leadership dimension is affected, such as staffing, qualification, resident workload or communication load.

Fourth, it should show possible review paths, not automatic instructions.

Example output:

**Simulated status:** Tense
**Reason:** Qualification coverage in the late shift falls below the defined threshold.
**Affected dimension:** Qualification coverage and shift stability.
**Review path:** Check replacement option, cross-unit support or task prioritisation.

The output must remain explanatory rather than directive.

---

## Intervention Link

Simulation must be connected to the intervention logic of CareFlow.

If a simulated incident creates a tense or critical situation, CareFlow may suggest intervention review paths.

Possible review paths include:

* check replacement staff,
* review qualification coverage,
* check cross-unit support,
* consider shift adjustment,
* prioritise non-urgent tasks,
* escalate to leadership attention,
* document quality-relevant pattern,
* prepare communication or coordination.

CareFlow must not automatically implement an intervention based on a simulation. The system may indicate what should be reviewed. The responsible leader decides what is appropriate.

---

## Implications for the Demo

The demo should introduce simulation in a limited and understandable way.

A first demo version may include a view titled:

**Simulation / What-if**

or, in German:

**Simulation / Was-wäre-wenn**

The demo may offer a small set of selectable scenarios, for example:

* one sickness notification in the late shift,
* missing qualified nurse coverage,
* increased resident workload,
* resident death with family communication and documentation load,
* combined sickness notification and qualification gap.

After selecting a scenario, the demo should show a changed leadership situation and a short explanation.

The demo should explicitly state:

This is not a prediction.
This is a What-if simulation.
The result is a leadership signal.
The decision remains with the responsible leader.

---

## Non-Goals

This ADR does not define a predictive forecasting model.

This ADR does not introduce machine learning-based simulation.

This ADR does not define statistical probability estimates.

This ADR does not define a complete incident taxonomy.

This ADR does not define the full intervention workflow.

This ADR does not automate operational decisions.

This ADR does not replace duty planning, HR planning, care documentation or local leadership judgement.

---

## Design Boundaries

The following boundaries are binding for future development.

CareFlow simulation must remain transparent and explainable.

Simulation results must be presented as conditional outputs based on selected assumptions.

Simulation must not be framed as certain prediction.

Simulation must not trigger automatic staffing decisions.

Simulation must respect the distinction between operational detail, aggregated leadership signals and strategic learning patterns.

Simulation must support leadership judgement without replacing responsibility.

---

## Risks

The main risk is overinterpretation. Users may read simulated results as predictions rather than conditional scenarios.

A second risk is false precision. If the system presents simulated results with too much numerical certainty, it may appear more accurate than it is.

A third risk is hidden normativity. Simulation rules may contain assumptions about staffing, qualification or workload that must be made explicit and periodically reviewed.

A fourth risk is emotional insensitivity. Certain incidents, especially resident death, must not be reduced to capacity effects.

These risks must be addressed through careful wording, transparent assumptions and responsible demo design.

---

## Implementation Notes

The first implementation should be deliberately simple.

The simulation layer can initially be implemented as a predefined scenario selector in the demo. Each scenario changes selected indicators and displays a short explanatory note.

The demo should not attempt to simulate every possible care situation. It should demonstrate the leadership principle.

A possible first implementation path is:

* define a small set of simulation scenarios,
* map each scenario to affected leadership dimensions,
* show before/after status,
* display a short explanation,
* connect simulated pressure to intervention review paths,
* avoid automatic decisions.

Later implementation stages may introduce configurable rules, tenant-specific thresholds, statistical support, sensitivity analysis, AI-generated explanations and RAG-supported contextual reports.

---

## Accepted Decision

CareFlow-Swiss will implement simulation as a rule-based What-if Layer.

The simulation layer will test how defined incidents or incident combinations affect a current or planned care planning state.

Simulation results will be used as leadership signals for orientation, prioritisation, preparation and organisational learning.

CareFlow will not present simulation as prediction, will not automate operational decisions and will not replace human leadership judgement.

The guiding principle is:

**CareFlow does not simulate the future as certainty. It makes visible how a care planning situation may react under defined assumptions.**
