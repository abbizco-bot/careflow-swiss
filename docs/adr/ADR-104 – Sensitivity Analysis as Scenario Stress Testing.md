# ADR-104 – Sensitivity Analysis as Scenario Stress Testing

**Status:** Proposed
**Date:** 2026-06-06
**Project:** CareFlow-Swiss
**Decision Area:** Sensitivity analysis, simulation, leadership stress testing, resilience visibility
**Related ADRs:** ADR-079, ADR-080, ADR-081, ADR-088, ADR-097, ADR-098, ADR-100, ADR-101, ADR-102, ADR-103

---

## Context

CareFlow-Swiss introduces simulation as a rule-based What-if Layer. Simulation allows leaders to examine how a current or planned care situation may change if selected incidents occur.

However, simulation alone does not fully answer a key leadership question: which factors make a situation fragile or resilient?

A single simulation can show that a late shift becomes tense when one staff member is absent. But leadership also needs to understand whether the situation would remain stable with one absence, become tense with two absences, or become critical only when an absence coincides with a missing key qualification or increased resident workload.

This requires a sensitivity logic.

Sensitivity analysis helps CareFlow show which influence factors have the strongest effect on a care planning situation. It identifies where a small change can create a major deterioration, and where the organisation remains robust despite pressure.

In the current maturity stage of CareFlow, sensitivity analysis must remain simple, explainable and leadership-oriented. It must not be presented as a mathematically precise prediction or an automated risk model.

---

## Decision

CareFlow-Swiss will implement sensitivity analysis as **Scenario Stress Testing**.

Sensitivity analysis will be treated as an extension of the rule-based simulation layer.

It will vary selected influence factors and show how the simulated leadership situation changes.

The basic logic is:

**Operational state + selected scenario + parameter variation = sensitivity result.**

Sensitivity analysis will answer the question:

**Which influence factor causes the care planning situation to shift from stable to tense or from tense to critical?**

CareFlow will not use sensitivity analysis as a standalone forecasting engine in the MVP phase.

---

## Rationale

Sensitivity analysis is important because care organisations often do not fail under pressure evenly. Some units have hidden buffers. Others are fragile. Some shifts can absorb a staff absence. Others become critical as soon as one key person is missing.

Leadership needs to know where these fragilities are.

A rule-based stress-testing approach is appropriate for CareFlow because it is transparent, understandable and consistent with the current simulation model.

It helps answer leadership questions such as:

Which residential unit has the least reserve?
Which shift depends most heavily on one key qualification?
How much resident workload increase can be absorbed before the situation becomes critical?
Where is cross-unit support most important?
Which pattern should be reviewed by quality management or organisational development?

This makes sensitivity analysis a leadership tool, not a technical modelling exercise.

---

## Definition

In CareFlow-Swiss, sensitivity analysis means the structured variation of selected influence factors in order to observe how the leadership situation changes.

A sensitivity analysis does not ask whether an incident will happen.

It asks what happens to the care planning situation if a relevant parameter changes.

Examples:

* one staff absence versus two staff absences,
* normal resident workload versus increased resident workload,
* full qualification coverage versus missing key qualification,
* reserve capacity available versus reserve capacity unavailable,
* normal communication load versus increased family communication and documentation load.

The result is a qualitative assessment of vulnerability, robustness and possible tipping points.

---

## Distinction from Simulation

Simulation and sensitivity analysis are related but not identical.

Simulation asks:

**What happens if a selected incident occurs?**

Sensitivity analysis asks:

**How strongly does the situation react when an influence factor changes?**

Simulation is incident-oriented.
Sensitivity analysis is parameter-oriented.

Simulation produces a conditional situation.
Sensitivity analysis examines the fragility or resilience of that situation.

Example:

A simulation shows what happens if one employee calls in sick.

A sensitivity analysis shows whether the shift remains stable with one absence, becomes tense with two absences, and becomes critical when the absence also affects a key qualification.

This distinction is binding for future design.

---

## Core Sensitivity Factors

The first implementation will focus on a small number of high-value sensitivity factors.

### 1. Staff Absence

This factor tests how strongly a care planning situation reacts to one or more short-term absences.

Typical variations:

* no absence,
* one absence,
* two absences,
* absence of a key person.

Leadership question:

**How many absences can the situation absorb before it becomes tense or critical?**

---

### 2. Qualification Coverage

This factor tests how strongly the situation depends on specific professional qualifications or competencies.

Typical variations:

* full qualification coverage,
* reduced qualification coverage,
* missing key qualification,
* missing medication competence,
* missing night-shift competence.

Leadership question:

**Does the situation depend on one key qualification, and when does that dependency become critical?**

---

### 3. Resident Workload

This factor tests how strongly the situation reacts to increased care intensity or complexity.

Typical variations:

* normal workload,
* increased workload,
* strongly increased workload,
* acute deterioration,
* additional supervision or mobilisation need.

Leadership question:

**At what level of resident workload does the current staffing and qualification setup become insufficient?**

---

### 4. Reserve Capacity

This factor tests whether available buffers can absorb pressure.

Typical variations:

* reserve available,
* limited reserve,
* no reserve,
* cross-unit support available,
* cross-unit support unavailable.

Leadership question:

**Does the situation remain manageable because a buffer exists, or does it become critical when the buffer disappears?**

---

## Optional Later Sensitivity Factors

Additional factors may be added in later development stages.

These include:

* documentation load,
* communication need,
* leadership availability,
* temporary staff ratio,
* team stability,
* infection pressure,
* external inspection load,
* system or interface reliability,
* seasonal workload,
* regional staff availability.

These factors are leadership-relevant, but they should not be introduced too early. The MVP and first demo should remain focused.

---

## Tipping Points

A central output of sensitivity analysis is the identification of tipping points.

A tipping point is reached when a relatively small change in an influence factor causes a relevant status change.

Examples:

* a shift remains stable with one absence but becomes critical with two absences,
* a unit remains stable with full qualification coverage but becomes critical when one qualified nurse is missing,
* a residential unit remains stable under normal workload but becomes tense under increased resident acuity,
* a home remains stable while reserve capacity is available but becomes tense when the reserve is removed.

CareFlow should make these tipping points visible in simple language.

The system should not present tipping points as mathematically absolute unless they are based on validated thresholds. In the MVP phase, tipping points remain rule-based and explanatory.

---

## Robustness Signals

Sensitivity analysis should not only identify fragility. It should also identify robustness.

A care planning situation may remain stable despite a staff absence because qualification coverage is strong, reserve capacity exists or workload is moderate.

This is valuable leadership information.

CareFlow should therefore be able to show:

* where the organisation is vulnerable,
* where the organisation is resilient,
* which buffers are effective,
* which units can absorb pressure,
* which units require early support.

The system should avoid framing every sensitivity result negatively.

---

## Leadership-Level Interpretation

Sensitivity analysis must be interpreted differently across the three leadership levels.

At **Level 1**, sensitivity analysis supports immediate operational judgement.

It answers:

**Which concrete change would make today’s or tomorrow’s shift critical?**

Examples:

* one additional absence,
* missing key qualification,
* increased resident workload,
* no available reserve.

At **Level 2**, sensitivity analysis supports support prioritisation across units or homes.

It answers:

**Which units have the least buffer and need leadership attention first?**

Examples:

* Residential Unit A becomes tense with one absence.
* Residential Unit B remains stable with one absence.
* Home C becomes critical when qualification coverage is reduced.

At **Level 3**, sensitivity analysis supports strategy, quality management and organisational development.

It answers:

**Which recurring sensitivities reveal structural vulnerability?**

Examples:

* repeated dependency on one key qualification,
* chronic lack of reserve capacity,
* recurring late-shift fragility,
* repeated sensitivity to resident workload increase.

---

## Output Requirements

Sensitivity analysis outputs should be simple, explainable and leadership-oriented.

Each output should include:

* selected sensitivity factor,
* parameter variation,
* status before variation,
* status after variation,
* identified tipping point if applicable,
* affected impact dimensions,
* explanation note,
* possible review path,
* assumption marker.

Example output:

**Sensitivity factor:** Staff absence
**Variation:** One absence / two absences
**Result:** Stable with one absence, critical with two absences
**Tipping point:** Second absence
**Affected dimensions:** Staffing capacity, shift stability, qualification coverage
**Review path:** Check reserve, cross-unit support and qualification coverage
**Assumption:** Based on current demo rules and planned staffing state.

---

## Relationship to Interventions

Sensitivity analysis should connect to intervention review paths.

If a situation is highly sensitive to staff absence, CareFlow may suggest checking reserve capacity, cross-unit support or shift adjustment.

If a situation is highly sensitive to qualification coverage, CareFlow may suggest reviewing key qualifications, medication competence or night-shift competence.

If a situation is highly sensitive to resident workload, CareFlow may suggest checking task prioritisation, additional support or temporary workload relief.

These are review paths, not automatic instructions.

The responsible leader remains accountable for the decision.

---

## Relationship to Statistics, AI and RAG

In later development stages, sensitivity analysis may be enriched by statistics, AI and RAG.

Statistics may help identify historically recurring sensitivities.

AI may help formulate sensitivity results in understandable leadership language.

RAG may link sensitivity results to internal rules, escalation guidelines, quality standards or organisational procedures.

However, the epistemic boundary remains binding.

CareFlow may explain, contextualise and support review. It must not present sensitivity results as certain predictions or automatic decisions.

---

## Demo Implications

The first demo implementation should keep sensitivity analysis deliberately simple.

A possible demo view may show three or four sensitivity cards:

* staff absence,
* qualification coverage,
* resident workload,
* reserve capacity.

Each card may show:

* low, medium or high sensitivity,
* the tipping point,
* the affected leadership dimension,
* a short review hint.

Example:

**Staff absence sensitivity:** High
**Tipping point:** second absence in late shift
**Explanation:** Shift becomes critical because qualification coverage and staffing capacity fall below the demo threshold.
**Review:** Check reserve and cross-unit support.

The demo should not show exact probabilities or complex mathematical scores.

---

## Non-Goals

This ADR does not define a probabilistic risk model.

This ADR does not define machine learning-based forecasting.

This ADR does not require exact numerical sensitivity scores.

This ADR does not define all possible sensitivity factors.

This ADR does not automate staffing decisions.

This ADR does not replace professional care judgement.

This ADR does not introduce automatic quality scoring.

---

## Design Boundaries

The following boundaries are binding.

Sensitivity analysis must remain explainable.

Sensitivity results must be presented as conditional and assumption-based.

The MVP must focus on a small number of core sensitivity factors.

The system must avoid false precision.

Sensitivity analysis must support leadership judgement, not replace it.

Sensitivity analysis must connect to the three leadership levels without enabling central micromanagement.

---

## Risks

The first risk is false precision. Sensitivity analysis may appear more mathematical or objective than the underlying rules justify. This risk must be addressed through qualitative status language and assumption markers.

The second risk is overcomplexity. Too many sensitivity factors would make the MVP difficult to understand and implement.

The third risk is misinterpretation. Users may treat sensitivity results as predictions. CareFlow must clearly label them as scenario-based stress tests.

The fourth risk is control misuse. Sensitivity results must not be used to blame individual employees, teams or local leaders.

The fifth risk is reductionism. Care work involves professional judgement, emotional labour and contextual knowledge. Sensitivity analysis can support this, but not replace it.

---

## Implementation Notes

The first implementation may use predefined demo rules.

A simple technical model may define each sensitivity factor with:

* factor identifier,
* display name,
* parameter levels,
* affected impact dimensions,
* severity transitions,
* tipping point condition,
* explanation text,
* review paths,
* applicable leadership level.

The first demo should not require dynamic statistical calculation.

Later implementation stages may include:

* configurable thresholds,
* tenant-specific sensitivity rules,
* historical data comparison,
* statistical pattern detection,
* AI-generated leadership summaries,
* RAG-supported guideline references,
* aggregated sensitivity views for multi-site leadership.

Implementation must remain incremental.

---

## Accepted Decision

CareFlow-Swiss will implement sensitivity analysis as scenario stress testing.

Sensitivity analysis will vary selected influence factors and show how the care planning situation reacts.

It will help identify tipping points, vulnerability and resilience across operational, overall leadership and strategic/QM levels.

The first implementation will focus on staff absence, qualification coverage, resident workload and reserve capacity.

CareFlow will not present sensitivity analysis as prediction, probability scoring or automated decision-making.

The guiding principle is:

**CareFlow does not only show that a situation can become critical. It shows which influence factors make the situation fragile or resilient.**
