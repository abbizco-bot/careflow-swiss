# ADR-105 – Statistical Leadership Reporting

**Status:** Proposed
**Date:** 2026-06-06
**Project:** CareFlow-Swiss
**Decision Area:** Statistical reporting, leadership visibility, pattern recognition, quality-related signals
**Related ADRs:** ADR-079, ADR-080, ADR-081, ADR-088, ADR-097, ADR-098, ADR-100, ADR-101, ADR-102, ADR-103, ADR-104

---

## Context

CareFlow-Swiss currently provides leadership visibility into operational care planning situations, including rolling overviews, day views, week views, deviations, interventions, staff-related views, residential unit views and quality-management-oriented situation views.

As CareFlow develops further, it will increasingly generate reports from operational data, simulation outputs, sensitivity results and recurring patterns. These reports may later be enriched by AI-generated language and RAG-supported organisational context. However, before AI and RAG are introduced, CareFlow requires a clear statistical reporting foundation.

Care organisations generate many signals that are individually useful but only become leadership-relevant when patterns become visible. Examples include repeated staffing pressure, recurring qualification gaps, late-shift instability, repeated deviation patterns, increasing resident workload, repeated intervention needs or recurring sensitivity to staff absence.

Statistical reporting is therefore necessary to move from isolated events to leadership-relevant patterns.

At the same time, statistical reporting carries risks. Numbers may appear more objective than they are. Small samples may be overinterpreted. Descriptive statistics may be mistaken for prediction. Quality-relevant signals may be misread as automatic quality judgements. Aggregated indicators may be used as control instruments if the reporting logic is not clearly bounded.

This ADR defines how CareFlow-Swiss will use statistical reporting as a leadership support layer.

---

## Decision

CareFlow-Swiss will implement statistical reporting as a **descriptive leadership reporting layer**.

Statistical reporting will be used to identify, summarise and compare operational patterns across time, shifts, residential units, homes and leadership levels.

In the MVP and early product phases, statistical reporting will remain primarily descriptive. It will not be presented as a predictive forecasting model, automatic quality assessment, employee performance ranking or automated decision system.

The purpose of statistical reporting is to answer leadership questions such as:

**What has happened repeatedly?**
**Where do pressure patterns accumulate?**
**Which units, shifts or periods show recurring instability?**
**Which interventions appear repeatedly?**
**Which sensitivity factors repeatedly create tipping points?**
**Where may leadership support, quality review or organisational learning be required?**

CareFlow will use statistics to make leadership-relevant patterns visible, not to replace leadership judgement.

---

## Rationale

CareFlow’s value does not lie only in showing the current state. A single staff absence, one qualification gap or one tense shift may require action, but leadership becomes stronger when repeated patterns are made visible.

Statistical reporting helps distinguish between isolated incidents and recurring organisational patterns.

A single late-shift gap may be an operational issue.
Repeated late-shift gaps across several weeks become a leadership issue.
Repeated qualification gaps across multiple units may become a strategic workforce and quality-management issue.

This movement from individual signal to pattern is central to CareFlow.

However, statistical reporting must be introduced carefully. CareFlow should not create the impression that a statistical pattern automatically proves a cause, assigns responsibility or defines quality. A repeated pattern is a reason for review, not a final judgement.

Therefore, statistical reporting must be transparent, bounded and connected to the three-level leadership model.

---

## Definition

In CareFlow-Swiss, statistical leadership reporting means the structured use of quantitative and countable operational signals to describe patterns relevant for care leadership.

These signals may include:

* number and frequency of deviations,
* recurring tense or critical shifts,
* repeated staff absence pressure,
* qualification coverage gaps,
* resident workload changes,
* intervention frequency,
* simulation results,
* sensitivity tipping points,
* recurring support needs,
* repeated quality-relevant signals.

Statistical reporting describes visible patterns in available data.

It does not automatically determine causality.
It does not automatically assign responsibility.
It does not automatically judge quality.
It does not automatically prescribe action.

---

## Reporting Scope

CareFlow statistical reporting may initially include the following reporting areas.

### 1. Deviation Reporting

CareFlow may report how often deviations occur, where they occur and whether they recur in specific shifts, residential units or time periods.

Examples:

* number of tense shifts per week,
* number of critical shifts per residential unit,
* repeated late-shift instability,
* recurring weekend pressure,
* deviation frequency across a rolling 28-day period.

The leadership question is:

**Where do deviations accumulate, and do they suggest an isolated problem or a repeated pattern?**

---

### 2. Staffing Pressure Reporting

CareFlow may report recurring pressure linked to staff availability.

Examples:

* number of short-term absences,
* repeated staff shortage in specific shifts,
* frequency of understaffed periods,
* repeated dependency on reserve staff,
* recurring need for cross-unit support.

The leadership question is:

**Where is staffing pressure repeatedly visible?**

---

### 3. Qualification Coverage Reporting

CareFlow may report recurring qualification-related gaps or dependencies.

Examples:

* repeated missing key qualification,
* frequency of reduced FaGe coverage,
* repeated dependence on one qualified nurse,
* qualification gaps in late or night shifts,
* recurring medication competence gaps.

The leadership question is:

**Where does qualification coverage become a repeated leadership or quality-relevant issue?**

---

### 4. Resident Workload Reporting

CareFlow may report workload-related patterns when the necessary data or structured estimates are available.

Examples:

* repeated increased resident workload,
* recurring acute deterioration signals,
* workload pressure during admissions or reoccupations,
* repeated high-supervision situations,
* recurring workload peaks in specific units.

The leadership question is:

**Where does resident workload repeatedly exceed the planned care capacity?**

---

### 5. Intervention Reporting

CareFlow may report how often interventions are suggested, reviewed or implemented.

Examples:

* repeated review paths,
* frequent need for reserve checks,
* repeated cross-unit support,
* recurring task-prioritisation situations,
* interventions that appear to stabilise repeated pressure situations.

The leadership question is:

**Which interventions recur, and do they point to structural pressure or effective support patterns?**

---

### 6. Simulation and Sensitivity Reporting

CareFlow may report recurring simulation outcomes and sensitivity patterns.

Examples:

* units that become critical under one additional absence,
* shifts that become critical when one key qualification is removed,
* recurring sensitivity to resident workload,
* repeated lack of reserve capacity,
* recurring tipping points across several planning periods.

The leadership question is:

**Which recurring sensitivities indicate fragility or resilience?**

---

## Leadership-Level Reporting

Statistical reporting must follow the Three-Level Leadership View Model.

### Level 1 – Operational Home and Residential Unit Leadership

At Level 1, statistical reporting supports short-term operational awareness.

Reports may show:

* deviations in the current week,
* repeated tense shifts in the residential unit,
* qualification coverage risks,
* immediate intervention frequency,
* short-term workload patterns.

The reporting question is:

**What does the local leadership need to know now or this week to stabilise the situation?**

---

### Level 2 – Area and Overall Leadership

At Level 2, statistical reporting supports prioritisation across units or homes.

Reports may show:

* comparison between residential units,
* homes with repeated support needs,
* units with low resilience,
* recurring pressure clusters,
* aggregated risk and support signals.

The reporting question is:

**Where should overall leadership provide support, prioritise attention or coordinate resources?**

Level 2 reporting must remain aggregated. It must not become a central micromanagement interface.

---

### Level 3 – Strategy, Quality Management and Organisational Development

At Level 3, statistical reporting supports long-term learning, quality reflection and strategic development.

Reports may show:

* recurring qualification gaps,
* structural staffing vulnerabilities,
* repeated sensitivity tipping points,
* long-term workload patterns,
* quality-relevant clusters,
* organisational resilience indicators.

The reporting question is:

**Which recurring patterns require strategic review, quality management attention or organisational development?**

Level 3 reporting must not create automatic quality scores. It marks patterns for review.

---

## Statistical Methods in the Early Phase

In the MVP and early demo-oriented phase, CareFlow will use simple descriptive statistics.

Suitable methods include:

* counts,
* frequencies,
* rolling period summaries,
* simple comparisons,
* trend indicators,
* before/after observations,
* stable/tense/critical distributions,
* repeated-pattern markers,
* simple threshold-based flags.

CareFlow will avoid complex statistical models in the early phase unless they are explicitly validated and documented.

The emphasis is on clarity, traceability and leadership usefulness.

---

## No Automatic Forecasting

Statistical reporting must be distinguished from forecasting.

Statistical reporting describes patterns in available data.

Forecasting attempts to estimate what may happen in the future.

CareFlow may later introduce forecasting models, but this requires separate architectural decisions, validation rules, data-quality requirements, communication boundaries and ethical review.

Until such a decision exists, CareFlow statistical reports must not be presented as predictive forecasts.

Acceptable wording:

**In the observed period, late-shift pressure occurred repeatedly.**

Non-acceptable wording in the early phase:

**Late-shift pressure will occur next week.**

A future-oriented statement may only be framed as a planning signal or scenario-based assumption, not as a prediction.

---

## No Automatic Quality Assessment

CareFlow statistical reporting may identify quality-relevant signals, but it must not automatically assess quality.

Acceptable wording:

**Repeated qualification gaps in late shifts are quality-relevant and should be reviewed.**

Non-acceptable wording:

**The quality of care in this unit is insufficient.**

CareFlow may support quality management by showing patterns, but it does not replace quality management judgement, internal review, external audit or professional assessment.

Quality-related reporting must use careful language such as:

* quality-relevant signal,
* review point,
* pattern requiring attention,
* possible structural issue,
* QM-relevant observation.

---

## No Individual Performance Ranking

Statistical reporting must not be used to rank individual employees or assign blame.

The primary reporting unit should be the operational situation, shift, residential unit, home, time period or leadership-relevant pattern.

Where employee-related data is required for operational reasons, it must be purpose-bound, role-bound and handled with data minimisation.

CareFlow’s statistical reporting is designed to show organisational pressure, not individual failure.

---

## Data Provenance and Assumption Marking

Every statistical report should make clear what kind of data it uses.

Where applicable, reports should indicate:

* reporting period,
* organisational unit,
* data source,
* included signals,
* excluded signals if relevant,
* applied rules or thresholds,
* whether the report is based on real, imported, demo or simulated data.

Statistical statements must be clearly marked as observations, patterns or assumptions.

Example:

**Observation:** Two late shifts were marked as tense in the current week.
**Pattern:** Late-shift pressure has occurred repeatedly in the last four weeks.
**Assumption:** The pattern is based on current demo rules and available planning data.

This protects CareFlow from false certainty.

---

## Relationship to Simulation and Sensitivity Analysis

Statistical reporting is connected to simulation and sensitivity analysis.

Simulation produces conditional what-if results.
Sensitivity analysis identifies fragility, robustness and tipping points.
Statistical reporting can summarise how often certain simulated or sensitivity patterns appear.

Example:

If Wohnbereich A repeatedly becomes critical in simulation when one key qualification is removed, statistical reporting can show this as a recurring sensitivity pattern.

If several units repeatedly become tense under increased resident workload, statistical reporting can identify this as a strategic planning signal.

Statistical reporting therefore helps move from individual scenario testing to organisational learning.

---

## Relationship to AI and RAG

Statistical reporting provides the structured factual basis for future AI- and RAG-supported reports.

AI may later transform statistical findings into readable leadership summaries.

RAG may later connect statistical patterns to organisational rules, QM standards, escalation pathways or internal guidance documents.

However, AI and RAG must not alter the statistical basis.

A future report must distinguish between:

* statistical observation,
* AI-generated summary,
* RAG-retrieved organisational context,
* human leadership decision.

The statistical layer remains the factual reporting foundation.

---

## Output Requirements

A statistical leadership report should include:

* reporting scope,
* reporting period,
* relevant unit or leadership level,
* key observed signals,
* repeated patterns,
* comparison where appropriate,
* quality-relevant or support-relevant markers,
* interpretation boundary,
* suggested review points,
* data and assumption markers.

Example:

**Reporting period:** Rolling 28 days
**Unit:** Wohnbereich A
**Observation:** Late-shift pressure appeared in 6 of 28 days.
**Pattern:** Qualification coverage was the main recurring constraint.
**Leadership signal:** Review late-shift qualification planning.
**Boundary:** This is a statistical pattern, not an automatic quality assessment.

---

## Demo Implications

The demo may introduce statistical reporting in a simple way.

A possible first demo report could show:

* number of tense days in the rolling view,
* number of critical shifts,
* most frequent deviation type,
* recurring qualification issue,
* intervention most often suggested,
* sensitivity factor most likely to create a tipping point.

The demo should use clear language and avoid mathematical overclaiming.

A good demo label would be:

**Statistical Leadership Summary**

or in German:

**Statistische Führungslage**

The demo should not present statistical reporting as AI-powered forecasting or automatic quality scoring.

---

## Non-Goals

This ADR does not define AI-generated report language.

This ADR does not define RAG-based organisational context retrieval.

This ADR does not define predictive forecasting.

This ADR does not introduce automatic quality scoring.

This ADR does not introduce employee performance ranking.

This ADR does not define a full data warehouse or business intelligence architecture.

This ADR does not define all possible statistical indicators.

This ADR does not replace local leadership judgement, quality management review or professional care assessment.

---

## Design Boundaries

The following boundaries are binding.

Statistical reporting must remain explainable and traceable.

Statistical reporting must distinguish observation, pattern, assumption and interpretation.

Statistical reporting must not be presented as automatic prediction.

Statistical reporting must not produce automatic quality judgements.

Statistical reporting must not rank individual employees.

Aggregated reporting must respect the three-level leadership model.

Statistical patterns should trigger review, not automatic decisions.

---

## Risks

The first risk is false objectivity. Numbers may appear more certain than they are. This must be addressed by clear wording, provenance and assumption markers.

The second risk is small-sample overinterpretation. Short reporting periods or limited data may produce misleading patterns. Reports must indicate their period and basis.

The third risk is control misuse. Statistical reporting could be used to pressure teams or individuals if not properly framed.

The fourth risk is quality overclaiming. Quality-relevant signals may be mistaken for quality judgements.

The fifth risk is dashboard overload. Too many indicators may obscure the leadership signal. The first version should remain focused.

---

## Implementation Notes

The first implementation may use simple configured metrics based on the existing demo data model.

Potential initial indicators include:

* number of stable, tense and critical days,
* number of tense or critical shifts,
* most frequent deviation type,
* repeated qualification coverage gap,
* number of intervention review paths,
* recurring simulated tipping point,
* unit with lowest reserve,
* short explanatory leadership summary.

The first implementation should remain qualitative and explanatory.

Later implementation stages may introduce:

* tenant-specific reporting periods,
* trend comparison,
* historical pattern detection,
* configurable thresholds,
* role-specific report views,
* exportable leadership reports,
* AI-generated narrative summaries,
* RAG-supported contextual references,
* audit trail and report versioning.

---

## Accepted Decision

CareFlow-Swiss will use statistical leadership reporting as a descriptive, explainable and leadership-oriented reporting layer.

Statistics will be used to identify recurring patterns, compare situations, show pressure accumulation and support organisational learning.

The MVP and early demo phase will focus on simple descriptive indicators rather than predictive models or complex statistical scoring.

CareFlow will not use statistical reporting for automatic forecasting, automatic quality assessment, employee ranking or automated decision-making.

The guiding principle is:

**CareFlow statistics describe leadership-relevant patterns. They do not decide, predict with certainty, judge quality or assign blame.**
