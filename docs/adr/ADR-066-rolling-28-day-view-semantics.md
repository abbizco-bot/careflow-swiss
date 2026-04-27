# ADR-066 Rolling 28-Day View Semantics

## Status

Accepted

## Context

CareFlow currently provides Leadership Day, Week, and Month Views.

There is no true Rolling 28-Day View yet.

`leadership-view.routes.ts` currently exposes `/day`, `/week`, and `/month`.

`getLeadershipWeek(...)` can evaluate a date range, but it is semantically not a rolling planning or early-warning view.

ADR-045, ADR-046, and ADR-047 already describe earlier Rolling View directions.

ADR-028 historically mentions a 35-day horizon.

The current roadmap uses 28 days as the rolling leadership period.

ADR-053, ADR-058, ADR-063, ADR-064, and ADR-065 define newer boundaries for CareFlow as a decision layer, planning states, reference plans, person-related context, and Human-in-the-Loop decisions.

## Decision

CareFlow will treat the future Rolling View as a read-only leadership and observation view with a 28-day horizon.

This ADR defines semantics and governance only. It does not introduce code changes, database migrations, types, services, routes, tests, API extensions, Leadership View changes, Planning Comparison changes, frontend work, or stash integration.

## Basic Decision

The Rolling View is a read-only leadership and observation view.

It is explicitly not:

- duty planning
- calendar planning
- an operative plan change
- automatic optimization
- a recommendation engine
- a `ReferencePlan` freeze
- period close
- a person-related detail view
- an approval workflow

## 28-Day Horizon

The future rolling leadership period is 28 days.

ADR-028 used a historical 35-day horizon. In this point, ADR-028 is fachlich superseded and consolidated by this ADR.

28 days represent a manageable four-week early-warning horizon.

The Rolling View may cross month boundaries.

Calendar weeks may later be used as grouping, but they do not define the fachliche boundary of the view.

The view should later be able to accept a start date.

The default may later be "from today", but the exact default is not an implementation decision in this ADR.

## Fachliche Function

The Rolling View should later make visible:

- which days are critical
- which days need attention
- where operative gaps are visible
- where a `ReferencePlan` exists or is missing
- where data is only draft, operational, or incomplete
- where open decisions could exist

It must not make automatic decisions or plan changes.

## Relationship to Leadership Day View

The Rolling View must not duplicate the Leadership Day View.

It aggregates daily situations.

Detailed shift-level information remains in the Day View.

`day.shifts[].gap` and severity may later be inputs for daily severity.

There should be no names in the Rolling View.

There should be no person-related details in the Rolling View.

There should be no change to `headline` or `contextLine` of the Day View.

## Relationship to Planning Comparison

Planning Comparison may later provide plan-to-operational deviations.

The Rolling View must not replace Planning Comparison.

The Rolling View must not automatically interpret `PlanningShiftTemplate` as `ReferencePlan`.

While no true `ReferencePlan` exists, `dataStatus` must make visible that only draft or operational data is available.

## Relationship to Planning State

`derivePlanningState(...)` may later help describe data status per period or day.

The Rolling View must not misunderstand `planningState` as freeze mechanics.

Possible future `dataStatus` values are:

- `reference_plan`
- `draft_plan`
- `operational_only`
- `incomplete`

These values are a target shape only. They are not an API contract.

## Relationship to ReferencePlan

The Rolling View may later show whether a `ReferencePlan` exists for a day or period.

The Rolling View does not create a `ReferencePlan`.

The Rolling View does not replace `ReferencePlan` freeze.

The Rolling View does not change a `ReferencePlan`.

The Rolling View must not interpret `PlanningMonth.status` as `ReferencePlan`.

## Relationship to DecisionOptions and Human-in-the-Loop

The Rolling View may later count open options or decisions.

`openDecisionCount` is only a possible target shape.

`openDecisionCount` must not be misunderstood as an automatic task list.

The Rolling View does not execute a `DecisionOption`.

The Rolling View approves nothing.

The Rolling View writes nothing.

## Relationship to PersonGapContext

There should be no names in the Rolling View.

There should be no person-related details in the Rolling View.

`PersonGapContext` may at most flow into the Rolling View in aggregated or indirect form.

There should be no named to-dos.

There should be no absence reasons in the rolling overview.

There should be no person-related evaluation.

## Possible Future Shape

A possible later target shape could look like this:

```ts
RollingPlanningView {
  startDate: string;
  endDate: string;
  days: RollingPlanningDay[];
  summary?: RollingPlanningSummary;
}

RollingPlanningDay {
  date: string;
  daySeverity: "none" | "attention" | "critical";
  gapSummary?: {
    effectiveCoverageGapTotal?: number;
    effectiveQualificationGapTotal?: number;
    affectedShiftTypes?: string[];
  };
  planningState?: unknown;
  openDecisionCount?: number;
  hasReferencePlan?: boolean;
  dataStatus?: "reference_plan" | "draft_plan" | "operational_only" | "incomplete";
}

RollingPlanningSummary {
  criticalDayCount: number;
  attentionDayCount: number;
  missingReferencePlanDayCount?: number;
  openDecisionCount?: number;
}
```

This structure is a target shape.

It is not a final API contract.

It creates no effect.

## Risks

The main risks are:

- the Rolling View is misunderstood as a duty roster calendar
- the Rolling View becomes an API contract too early
- daily severity is read as automatic prioritization
- a missing `ReferencePlan` is read as an error instead of a planning state
- `PlanningShiftTemplate` is accidentally interpreted as `ReferencePlan`
- the view integrates too many concepts too early
- person-related details slip into an overview
- `openDecisionCount` reads like an automatic to-do list
- the Rolling View drifts toward an operative planning system instead of a decision layer
- the 28-day versus 35-day horizon remains ambiguous if not consolidated

## Consequences

ADR-066 defines semantics and governance only. It introduces no implementation.

The rolling horizon is set to 28 days going forward.

ADR-028 with its 35-day horizon is fachlich superseded and consolidated by this ADR in that specific point.

The next technical step may at most be a `RollingPlanningView` type sketch.

There should be no route yet.

There should be no service yet.

There should be no API extension yet.

There should be no frontend work yet.

There should be no integration into Leadership View or Planning Comparison yet.

There should be no person-related details.

There should be no `DecisionOption` execution.

There should be no stash integration without a separate boundary review.

## Summary

The future Rolling 28-Day View is a read-only, aggregated leadership observation layer.

It may make operational risk, planning data status, reference-plan availability, and open decision context visible, but it must not become duty planning, automatic recommendation, reference-plan freeze, period close, or person-related supervision.
