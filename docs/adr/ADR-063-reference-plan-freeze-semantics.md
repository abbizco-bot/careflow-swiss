# ADR-063 Reference Plan Freeze Semantics

## Status

Accepted

## Context

`PlanningMonth`, `PlanningDay`, and `PlanningShiftTemplate` currently form a planning frame.

`PlanningMonth.status` currently supports `"draft"`, `"active"`, and `"finalized"`.

`PlanningShiftTemplate` does not create operative `Shift` records.

`Shift` represents operative shift reality.

Planning Comparison currently compares `PlanningShiftTemplate` records against operative `Shift` records.

`derivePlanningState(...)` knows `hasFrozenReferencePlan`, but there is currently no real `ReferencePlan` artifact.

ADR-034 and ADR-049 already describe the approval and freeze direction.

ADR-058 separates `ImportedPlan`, `DraftPlan`, `ReferencePlan`, `OperationalPlan`, `ActualState`, and `ClosedPeriod`.

ADR-059 through ADR-062 clarify that import dry runs, mapping, and preview artifacts do not create a `ReferencePlan`.

ADR-053 keeps CareFlow within its decision-layer boundary.

## Decision

CareFlow will treat `ReferencePlan` freeze as an explicit snapshot and approval concept, not as a simple status change on existing planning-frame records.

This ADR defines semantics only. It does not introduce database migrations, types, services, routes, parsers, tests, freeze logic, reference-plan tables, Planning Comparison changes, or stash integration.

## Basic Decision

A `ReferencePlan` is a released, intentionally frozen comparison baseline.

A `ReferencePlan` emerges only after:

- fachliche checking
- explicit approval
- intentional snapshot creation
- versioning or revision context

A `ReferencePlan` later becomes the basis for:

- reference-to-operational comparison
- deviation analysis
- rolling plan observation
- period review

## What ReferencePlan Is Not

A `ReferencePlan` is not:

- `ImportedPlan`
- `ImportDryRunResult`
- `DraftPlan`
- `DraftPlanCandidatePreview`
- `PlanningShiftTemplate` alone
- `PlanningMonth.status = "finalized"`
- `OperationalPlan`
- `ActualState`
- `ClosedPeriod`
- operative `Shift` reality
- the automatic result of an import
- the automatic result of a mapping profile

## Freeze Semantics

Freeze does not only mean a status change.

Freeze means at least:

- snapshot of the released plan structure
- approval or release event
- approval timestamp
- approving person or responsible actor
- version or revision
- traceability of which draft or planning state the snapshot came from

The freeze boundary exists so operative changes can be compared against a stable, auditable baseline.

## Future Frozen Contents

A future `ReferencePlan` snapshot should preserve at least:

- period
- plan structure per day
- shift templates
- target staffing counts
- qualification requirements
- daily-function requirements, once modeled
- plan metadata
- approval timestamp
- approving person or responsible actor
- version or revision context
- source or derivation context, if the plan came from import or `DraftPlan`

This is a future target structure only. It is not implemented by this ADR.

## Boundaries to Existing Models

`PlanningMonth` remains a planning frame for now.

`PlanningMonth.status` must not be interpreted as a full planning-state model.

`PlanningMonth.status = "finalized"` does not automatically mean `ReferencePlan`.

`PlanningMonth.status = "finalized"` does not automatically mean `ClosedPeriod`.

`PlanningShiftTemplate` remains a target or template structure. It is not a real `ReferencePlan`.

`Shift` remains operative shift reality and must not be overloaded with `ReferencePlan` semantics.

Planning Comparison is not yet a real reference-plan comparison while no freeze artifact exists.

## Possible Future Technical Options

Possible later implementation options include:

- `ReferencePlanSnapshot` as its own artifact
- `ReferencePlanApproval` as an event
- `ReferencePlanVersion`
- separate tables such as `ReferencePlan`, `ReferencePlanDay`, and `ReferencePlanShift`
- `PlanningMonth.referencePlanId` as a later connection
- internal read model for `referencePlan: frozen | not_available`
- snapshot and approval type sketch before database migration

A database migration is not part of this ADR.

A status change on `PlanningMonth` alone is not sufficient.

A later snapshot approach is likely cleaner than reusing `PlanningMonth.status` as hidden reference-plan semantics.

## Boundaries to Import and Mapping

Import dry run does not create a `ReferencePlan`.

`MappingProfile` does not create a `ReferencePlan`.

`DraftPlanCandidatePreview` does not create a `ReferencePlan`.

`ImportedPlan` becomes usable for later planning only through checking and explicit downstream steps.

Reference-plan freeze is its own deliberate step after checking and approval.

## Boundaries to OperationalPlan and ActualState

`OperationalPlan` is the running operative planning state.

`ActualState` is the calculated effective daily or actual state.

Both may differ from the `ReferencePlan`.

This difference is the basis for later CareFlow analysis.

`ReferencePlan` must not be overwritten by operative changes.

## Boundaries to ClosedPeriod

`ClosedPeriod` is period close.

`ClosedPeriod` is not `ReferencePlan`.

`ClosedPeriod` may later use `ReferencePlan`, `OperationalPlan`, and `ActualState` for review, learning, and evaluation.

`PlanningMonth.status = "finalized"` must not automatically mean `ClosedPeriod`.

## Risks

The main risks are:

- `PlanningMonth.status = "finalized"` is incorrectly read as `ReferencePlan`
- `PlanningShiftTemplate` silently becomes reference truth
- `Shift` is overloaded with `ReferencePlan` semantics
- import dry run or `DraftPlanCandidatePreview` is misunderstood as `ReferencePlan`
- `OperationalPlan` and `ReferencePlan` are mixed
- Planning Comparison is described as a real reference-plan comparison even though no freeze artifact exists
- a premature database design freezes the wrong vocabulary
- CareFlow drifts from decision layer toward roster-planning system

## Consequences

ADR-063 defines semantics only. It introduces no implementation.

The next technical step may at most be a snapshot or approval type sketch.

There should be no database migration yet.

There should be no `ReferencePlan` tables yet.

There should be no freeze service yet.

There should be no route yet.

There should be no reinterpretation of `PlanningMonth.status`.

There should be no change to Planning Comparison yet.

There should be no stash integration without a separate boundary review.

## Summary

Reference-plan freeze in CareFlow should be explicit, auditable, version-aware, and separate from imported data, draft planning, planning templates, operative shifts, actual-state interpretation, and period close.
