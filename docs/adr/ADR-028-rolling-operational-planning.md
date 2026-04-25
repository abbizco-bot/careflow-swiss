# ADR-028: Rolling Operational Planning

## Status

Accepted

## Context

CareFlow is positioned as a leadership and decision layer for long-term care institutions, not as an ERP system or a classical duty planning system.

Most long-term care institutions work with monthly plans. These monthly plans are important because they provide structure, predictability, and a stable planning reference for leadership and operations.

However, operational reality changes continuously. Sickness, absences, availability changes, open requests, short-term shift changes, function changes, qualification gaps, and undercoverage can affect the plan on a daily basis.

A static monthly plan is therefore not sufficient as a leadership view. Leadership needs a dynamic operational view that shows how the plan is developing in reality and what risks are emerging in the near future.

CareFlow therefore needs a concept that respects the monthly planning logic of care institutions while adding a rolling operational leadership perspective.

## Decision

CareFlow will introduce the concept of a rolling operational plan.

The rolling operational plan does not replace the monthly reference plan. It is a dynamic leadership view derived from the current planning and operational data.

The rolling operational plan shows the current operational planning reality across a rolling horizon. It may cross month boundaries and include a proportional part of the next reference plan or draft reference plan.

The default rolling horizon is 35 days.

The rolling operational plan is initially understood as a calculated view, not necessarily as a fully persisted plan object.

## Definitions

### Reference Plan

The reference plan is the released monthly plan. It represents the stable planning baseline for a given month.

### Operational Rolling Plan

The operational rolling plan is the dynamic operational view of the plan. It includes actualized past data, current operational adjustments, future plan parts, and known risks.

### Rolling Horizon

The rolling horizon defines how far the operational rolling plan looks ahead. The default value is 35 days.

### Plan Reality

Plan reality refers to the operational state that emerges when a released reference plan is affected by absences, requests, short-term changes, qualification gaps, function changes, and leadership interventions.

## Rules

1. The reference plan remains the stable baseline.
2. The operational rolling plan must not overwrite the reference plan.
3. The operational rolling plan may cross month boundaries.
4. The operational rolling plan includes the relevant part of the next month if it falls within the rolling horizon.
5. The operational rolling plan is generated from the latest available operational information.
6. The operational rolling plan is used for leadership visibility, risk detection, and operational steering.
7. The operational rolling plan must distinguish between past, current, and future planning states.

## Planning States

The operational rolling plan should distinguish at least the following planning states:

- `actual` — completed or confirmed past state.
- `operational` — current valid operational planning state.
- `planned` — future state derived from the reference plan.
- `uncertain` — future state affected by open requests, unclear availability, or pending confirmation.
- `critical` — state affected by undercoverage, qualification gaps, invalid function assignment, or another high-risk condition.

## Operational Composition

At a given date, the operational rolling plan may contain:

- actualized data up to the current date,
- the remaining part of the current month,
- known operational adjustments,
- absences and availability changes,
- open requests,
- function assignments,
- qualification and coverage validation results,
- a proportional part of the next reference plan or draft reference plan,
- already known changes affecting the next planning period.

## Consequences

CareFlow can support leadership beyond static monthly planning.

The monthly reference plan remains compatible with the planning practice of care institutions.

The operational rolling plan becomes the primary leadership view for current and near-future operational steering.

Risks in the current and following planning period can be detected earlier.

CareFlow strengthens its position as a leadership and decision layer rather than becoming a replacement for existing planning systems.

## Implementation Notes

For the MVP, the rolling operational plan should initially be implemented as a calculated view generated on demand.

The default rolling horizon should be 35 days.

The horizon should be configurable in a later version.

The rolling operational plan should reuse existing validation logic wherever possible, especially coverage validation, qualification validation, function validation, absence context, and request context.

The initial implementation should avoid unnecessary persistence of the full rolling plan.

Persistence should be introduced later through monthly closing snapshots.