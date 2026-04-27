# ADR-065 Alternatives and Human-in-the-Loop Semantics

## Status

Accepted

## Context

The current codebase contains no recommendation, alternative, `DecisionOption`, `DecisionLog`, or approval models.

There are no services that suggest replacement staffing or plan changes.

Leadership Day View provides Gap and Severity as read-only situation context.

Planning Comparison provides read-only comparison and gap signals.

`PersonGapContext` exists only as a person-reduced type sketch and is not integrated.

`ReferencePlan` exists only as a snapshot type sketch and is not a workflow.

ADR-004 describes Human-in-the-Loop as a foundational principle.

ADR-026, ADR-039, ADR-043, ADR-044, and ADR-046 contain earlier decision and alternative directions.

ADR-053 keeps CareFlow as a decision layer, not roster optimization.

ADR-056 and ADR-057 state that Severity is not a recommendation.

ADR-064 states that person-related context must not create blame or evaluation logic.

## Decision

CareFlow may later make alternatives visible, but it must not make automatic decisions.

Alternatives are decision-support context. They are not instructions, obligations, hidden optimizations, or automatic plan changes.

This ADR defines semantics and governance only. It introduces no implementation, database migration, types, services, routes, tests, API extension, alternative suggestions, recommendation service, approval workflow, Leadership View change, person-related integration, or stash integration.

## Basic Decision

An alternative is:

- an option for review
- structured decision context
- a simulation-like or preview-like possibility
- a basis for human judgment

An alternative is explicitly not:

- an automatic decision
- an instruction
- a mandatory measure
- a productive plan change
- a person-related evaluation
- blame
- duty to work
- hidden optimization
- automatic roster planning

## Human-in-the-Loop as Governance

Human-in-the-Loop is not only a UI button.

The decision remains with the responsible leadership person.

CareFlow may explain options, but it must not approve them itself.

CareFlow must not perform automatic assignments.

Every later effective plan change requires explicit human confirmation.

Every confirmed decision must later be traceable and loggable.

Human-in-the-Loop includes transparency, reviewability, reasoning, and auditability.

## Relationship to Gap and Severity

Gap and Severity provide situation context.

Gap and Severity are not recommendations.

`critical` does not automatically mean "execute alternative X".

`attention` does not automatically mean "change the plan".

Severity must not be translated into automatic plan decisions.

## Relationship to PersonGapContext

`PersonGapContext` must not directly become "who should step in?".

Person-related alternatives are especially sensitive.

`affectedEmployeeIds` or names may only become visible later after a separate authorization and data-protection decision.

Availability does not mean duty to work.

Requests must not be interpreted as unreliability.

Absences must not be used with unnecessary detail as reasons for alternatives.

## Relationship to ReferencePlan and Import

`ReferencePlan` may later provide a comparison baseline. It does not provide an automatic solution.

Import dry run does not provide an operative alternative.

`MappingProfile` does not create a decision.

`DraftPlanCandidatePreview` is not an approved alternative.

Alternatives must not contain reference-plan freeze logic.

## Possible Future Alternative Types

Possible later alternative types include:

- `coverage_alternative`
- `qualification_alternative`
- `function_alternative`
- `shift_reassignment_option`
- `request_resolution_option`
- `external_staffing_option`
- `no_action_but_monitor_option`
- `escalate_to_leadership_option`

`no_action_but_monitor_option` is intentionally allowed so CareFlow does not always imply plan change.

`escalate_to_leadership_option` is not an automatic escalation. It is an option to review.

## Possible Future Shape

A possible later target shape could look like this:

```ts
DecisionOptionPreview {
  id: string;
  type:
    | "coverage_alternative"
    | "qualification_alternative"
    | "function_alternative"
    | "shift_reassignment_option"
    | "request_resolution_option"
    | "external_staffing_option"
    | "no_action_but_monitor_option"
    | "escalate_to_leadership_option";
  explanation: string;
  expectedEffect?: {
    coverageGapDelta?: number;
    qualificationGapDelta?: number;
  };
  isRecommendation: false;
  requiresHumanApproval: true;
  writesPlanAutomatically: false;
  affectedEmployeeIds?: number[];
  riskNotes?: string[];
}
```

`isRecommendation` remains `false`.

`requiresHumanApproval` remains `true`.

`writesPlanAutomatically` remains `false`.

`affectedEmployeeIds` is sensitive and should not be publicly visible initially.

This target shape is not a final API contract.

## Simulation Instead of Effect

Alternatives remain preview or simulation first.

An option may describe expected effect, but it must not execute that effect.

`expectedEffect` is an estimate or preview, not a guarantee.

No alternative may change `Shift`, `Assignment`, `Absence`, `AvailabilityRequest`, or `PlanningMonth` records without a later explicit approval step.

## Risks

The main risks are:

- a recommendation service drifts into automatic roster planning
- an API field reads like an instruction
- an option is confused with a decision
- Human-in-the-Loop is reduced to a button instead of treated as governance
- plan changes occur without audit trail
- person-related alternatives are read as performance or blame logic
- availability is incorrectly read as duty to work
- requests are interpreted as unreliability
- absences are explained in too much detail
- CareFlow drifts from decision layer toward optimization or control system

## Consequences

ADR-065 defines semantics and governance only. It introduces no implementation.

The next technical step may at most be a `DecisionOptionPreview` type sketch.

There should be no recommendation service yet.

There should be no approval workflow yet.

There should be no API extension yet.

There should be no plan mutation yet.

There should be no person-related alternatives in Leadership View yet.

There should be no automatic decision yet.

There should be no stash integration without a separate boundary review.

## Summary

CareFlow may later support alternatives as transparent, reviewable decision options.

Those options must remain previews until a human decision explicitly accepts, changes, rejects, defers, escalates, or documents them.
