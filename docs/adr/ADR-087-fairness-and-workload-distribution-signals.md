# ADR-087: Fairness and Workload Distribution Signals

## Status

Accepted

## Date

2026-05-04

## Context

CareFlow-Swiss currently focuses on making planning deviations, operational risks, coverage gaps and qualification gaps visible to leadership.

During roadmap development, fairness and workload distribution were identified as strategically important future analytical dimensions.

A plan can be formally correct and still create perceived or real imbalance.

Examples:

- the same employees repeatedly work weekends;
- a small group frequently covers short-term gaps;
- certain qualification groups carry disproportionate responsibility;
- part-time employees may be burdened disproportionately relative to their employment level;
- employee requests may be approved unevenly;
- some teams or units may repeatedly stabilise other teams or units;
- external staff may be used structurally in some areas;
- short-term changes may concentrate on a small number of people.

These patterns may affect motivation, trust, retention, fatigue risk, team climate and organisational stability.

CareFlow should be able to surface such patterns in the future.

However, fairness is sensitive. It must not become a blame mechanism, employee evaluation system or automated judgement tool.

## Decision

CareFlow may include a Fairness and Workload Distribution Module as a future analytical module.

This module may surface patterns related to workload distribution, shift burden, short-term changes, weekend work, night work, late shifts, employee requests, qualification-based responsibility and repeated operational stabilisation.

The module shall remain read-only unless a future ADR explicitly decides otherwise.

The module shall not automatically judge individual employees, managers or teams.

Initial fairness signals shall be aggregated, cautious and carefully worded.

The central principle is:

CareFlow may show distribution patterns. CareFlow shall not impose fairness judgements.

## Possible Analytical Dimensions

The Fairness and Workload Distribution Module may include the following dimensions.

### Workload Distribution

Analyse how demanding or undesirable shifts are distributed.

Examples:

- weekend shifts;
- night shifts;
- late shifts;
- split shifts;
- short-notice assignments;
- repeated operational changes.

### Request Fairness

Analyse how employee requests are handled over time.

Examples:

- approved requests;
- rejected requests;
- requests still under review;
- requests not plannable due to coverage or qualification requirements.

### Qualification Responsibility

Analyse whether certain qualification groups carry disproportionate operational responsibility.

Examples:

- FaGe repeatedly taking Tagesverantwortung;
- dipl. Pflege repeatedly covering responsible functions;
- few qualified employees stabilising many shifts.

### Short-Term Change Burden

Analyse whether certain employees or teams are repeatedly affected by operational changes.

Examples:

- frequent reassignment;
- repeated shift changes after publication;
- repeated requests to cover gaps;
- frequent movement between units.

### Team or Unit Imbalance

Analyse whether certain teams, units or houses carry disproportionate pressure.

Examples:

- one unit repeatedly operates in tense or critical status;
- one team repeatedly stabilises another team;
- one house relies more heavily on external resources.

## Product Principle

The module shall avoid accusatory language.

Examples of unacceptable wording:

- Employee X is treated unfairly.
- Manager Y distributes shifts unfairly.
- Team A is responsible for unfair planning.

Examples of acceptable wording:

- Weekend burden is unevenly distributed in the selected period.
- Short-term changes are concentrated on a small group of employees.
- Qualification-based responsibility is repeatedly carried by few employees.
- Team A shows repeated workload concentration compared with the selected reference period.

CareFlow shall surface signals for leadership reflection, not verdicts.

## Privacy and Governance

The Fairness and Workload Distribution Module is sensitive.

Before implementation, the following must be clarified:

- role-based visibility;
- employee-level versus aggregated output;
- period length;
- anonymisation or aggregation thresholds;
- wording rules;
- data protection requirements;
- organisational acceptance;
- employee representation or staff council considerations where relevant;
- whether and how employees can see fairness-related information.

Employee-level fairness views require especially careful governance.

The first implementation should prefer aggregated or team-level signals.

## Non-Goals

The module shall not evaluate employee performance.

The module shall not rank employees.

The module shall not automatically accuse leadership of unfairness.

The module shall not automatically change assignments.

The module shall not replace leadership judgement.

The module shall not create legally binding fairness conclusions.

The module shall not diagnose burnout, fatigue, illness or psychological stress.

## Relationship to Workload and Fatigue Risk

Fairness and fatigue risk are related but not identical.

Fairness asks:

Is burden distributed in a balanced and professionally justifiable way?

Workload or fatigue risk asks:

Where may repeated burden create organisational risk?

The Fairness and Workload Distribution Module may later connect to a separate Workload and Fatigue Risk Module, but this ADR does not implement such a module.

## Phase 10 Boundary

The Fairness and Workload Distribution Module is not part of Phase 10 implementation.

Phase 10 remains focused on the pilot-ready Rolling Leadership View frontend.

Fairness may be mentioned as a future analytical dimension in product positioning or roadmap material, but no fairness scoring, employee-level analysis or fairness dashboard shall be implemented in Phase 10.

## Future Implementation Guidance

A future implementation should follow this sequence:

1. Define fairness dimensions and vocabulary.
2. Define aggregation levels and visibility rules.
3. Define safe wording.
4. Define backend signal types.
5. Implement read-only analysis.
6. Add tests with synthetic data.
7. Expose aggregated API signals.
8. Integrate only minimal leadership-facing hints.
9. Validate with pilot feedback before expanding.

Potential backend concepts:

- fairnessSignalType;
- workloadDistributionSignal;
- weekendBurdenDistribution;
- shortNoticeChangeCount;
- requestApprovalDistribution;
- qualificationResponsibilityDistribution;
- teamBurdenIndex;
- periodStart;
- periodEnd;
- aggregationLevel.

Potential frontend output:

- calm summary signal;
- period comparison;
- team-level distribution hint;
- leadership reflection note;
- no accusatory individual judgement.

## Relationship to Other ADRs

This ADR is related to:

- ADR-084 Analytical Module Boundary and Leadership Surface Principle
- ADR-085 Communication and Interaction Module Boundary
- ADR-086 Multilingual Rendering and Swiss Localization

It may later be connected to future ADRs on:

- Plan Resilience and Fragility Signals
- Workload and Fatigue Risk
- Leadership Decision Log and Traceability
- Historical Pattern Recognition and Organisational Learning

## Summary

CareFlow may analyse fairness and workload distribution in the future, but only as a careful, read-only leadership reflection layer.

The guiding phrase is:

CareFlow shows patterns of burden. It does not blame people.