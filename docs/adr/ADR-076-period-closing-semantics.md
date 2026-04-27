# ADR-076 Period Closing Semantics

## Status

Accepted

## Context

There is currently no `ClosedPeriod`, `PeriodClosing`, Retrospective, Review, or Learning model in the code.

There is no route, service, database persistence, or API for period closing.

`PlanningMonth.status` currently supports `"draft"`, `"active"`, and `"finalized"`.

`PlanningMonth.status = "finalized"` is currently not interpreted as period close, reference-plan freeze, or review.

`derivePlanningState(...)` knows `closedPeriod` only explicitly through `isClosedPeriod === true`.

Planning Comparison currently sets `isClosedPeriod: false`.

ADR-030 and ADR-031 contain older monthly-closing and learning directions.

ADR-052 states that final reference comparison serves learning, not blame.

ADR-058 defines `ClosedPeriod` as its own planning state.

ADR-063 states that `PlanningMonth.status = "finalized"` means neither `ReferencePlan` nor `ClosedPeriod`.

ADR-066 and ADR-068 through ADR-070 separate Rolling View and Rolling Snapshot from period close.

ADR-075 states that type sketches and target shapes are not API contracts or database models.

## Decision

`ClosedPeriod` is a future dedicated review and snapshot artifact.

It is explicitly not:

- `PlanningMonth.status = "finalized"`
- `ReferencePlan`
- Rolling Snapshot
- `OperationalPlan`
- `ActualState`
- Planning Comparison
- Leadership View
- only a report
- a plan change
- automatic optimization
- a person-related performance evaluation

This ADR defines semantics and governance only. It introduces no code changes, database migrations, types, services, routes, tests, API extensions, `PlanningMonth.status` reinterpretation, PeriodClosing implementation, Planning Comparison changes, Leadership View changes, frontend work, or stash integration.

## Purpose of Period Close

A future period close may:

- compare the reference plan with operative development
- compare Rolling Snapshots with the `ReferencePlan`
- surface recurring gaps
- document deviations
- evaluate approved decisions and open points
- evaluate aggregated `SpecialNeed` and `SpecialCompetence` findings, if later implemented
- provide learning notes for future planning
- support management and leadership review

The goal is system and planning learning.

The goal is not individual blame.

The goal is not HR or performance control.

## Boundaries

Period close must not:

- automatically create new planning
- trigger operative plan changes
- overwrite `ReferencePlan` data
- automatically close open `DecisionOption` records
- derive person-related performance evaluation
- create sanctions or performance judgments
- contain resident details
- evaluate detailed sickness or absence reasons in a person-related way

## Relationship to PlanningMonth.status

`PlanningMonth.status = "finalized"` does not automatically mean `ClosedPeriod`.

`PlanningMonth.status = "finalized"` does not automatically mean `ReferencePlan`.

`PlanningMonth.status` must not be interpreted as a complete planning-state model.

A future `ClosedPeriod` mechanism needs its own decision.

Existing status values must not be reinterpreted without a separate ADR and implementation step.

## Relationship to ReferencePlan

`ClosedPeriod` may later use `ReferencePlan` as comparison baseline.

`ClosedPeriod` does not create a `ReferencePlan`.

`ClosedPeriod` does not change a `ReferencePlan`.

`ClosedPeriod` does not replace `ReferencePlan` freeze.

If no `ReferencePlan` exists, this must be visible as data status, not as a technical error.

## Relationship to Rolling Snapshot

Rolling Snapshot may later be a frozen rolling view.

`ClosedPeriod` may evaluate Rolling Snapshots.

`ClosedPeriod` is not identical to Rolling Snapshot.

Rolling Snapshot does not replace period close.

Rolling Snapshot must not automatically become `ClosedPeriod`.

## Relationship to OperationalPlan and ActualState

`OperationalPlan` describes the running operative planning state.

`ActualState` describes the calculated effective actual or daily state.

`ClosedPeriod` may evaluate both.

`ClosedPeriod` is not identical to either.

`ClosedPeriod` is a review and snapshot artifact.

## Relationship to Planning Comparison and Leadership View

Planning Comparison may provide data for `ClosedPeriod`.

Leadership Views may provide aggregated situation information.

`ClosedPeriod` does not replace these views.

`ClosedPeriod` is not daily steering.

`ClosedPeriod` is not a live view.

## Relationship to Decisions and Human-in-the-Loop

Later approved decisions may be part of the review.

Open `DecisionOption` records are not completed decisions.

`ClosedPeriod` must not automatically close open options.

Decision history later needs an audit trail.

Review may evaluate decision history, but must not automatically judge it after the fact.

## Relationship to People

`ClosedPeriod` must not be a person-related performance evaluation.

Person-related details should remain aggregated, anonymized, or strongly limited.

Sickness and absence reasons are especially sensitive.

The focus is system and planning learning, not individual blame.

`PersonGapContext` must not be reinterpreted as person-related controlling.

## Relationship to SpecialNeed and SpecialCompetence

`SpecialNeed` may only flow in as aggregated information.

There must be no resident details.

There must be no medical detail data.

`SpecialCompetence` may later be evaluated as a Skill-Mix dimension.

`SpecialCompetence` must not be interpreted as individual performance evaluation.

`SpecialNeed` and `SpecialCompetence` evaluation remains future perspective while not implemented.

## Possible Future Shape

A possible later target shape could look like this:

```ts
ClosedPeriodReview {
  period: {
    startDate: string;
    endDate: string;
  };
  referencePlanStatus: "available" | "missing";
  rollingSnapshotStatus?: "available" | "missing";
  summary: {
    criticalDayCount?: number;
    attentionDayCount?: number;
    totalCoverageGap?: number;
    totalQualificationGap?: number;
    openDecisionCount?: number;
    approvedDecisionCount?: number;
    specialNeedDayCount?: number;
    specialCompetenceGapCount?: number;
  };
  learningNotes?: string[];
  dataLimitations?: string[];
}
```

This structure is a target shape.

It is not an API contract.

It is not a database model.

It creates no effect.

## Risks

The main risks are:

- `PlanningMonth.status = "finalized"` is misunderstood as `ClosedPeriod`
- period close becomes controlling against employees
- absences are evaluated in a person-related way
- resident details enter reviews through `SpecialNeed`
- review is read as an automatic improvement directive
- missing `ReferencePlan` is interpreted as an error instead of data status
- Rolling Snapshot is confused with `ClosedPeriod`
- period close creates new planning without approval
- CareFlow drifts from decision layer to HR or performance control

## Consequences

ADR-076 is semantics and governance only. It introduces no implementation.

The next technical step may at most be a `ClosedPeriodReview` type sketch.

There should be no database migration yet.

There should be no `ClosedPeriod` tables yet.

There should be no PeriodClosing service yet.

There should be no route yet.

There should be no API extension yet.

There should be no `PlanningMonth.status` reinterpretation.

There should be no person-related evaluation.

There should be no stash integration without a separate boundary review.

## Summary

Period close in CareFlow is a future review and learning artifact.

It must remain separate from `PlanningMonth.status`, `ReferencePlan`, Rolling Snapshot, operative plan state, live leadership views, and person-related evaluation.
