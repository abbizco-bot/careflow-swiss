# ADR-029: Reference Plan Versioning

## Status

Accepted

## Context

CareFlow needs a stable baseline for comparing the originally intended monthly plan with the operational reality that develops during the month.

If a released monthly plan is silently changed after release, meaningful evaluation becomes impossible. CareFlow would no longer be able to distinguish between the original plan, an officially revised plan, and daily operational adjustments.

This distinction is important because CareFlow is intended to support leadership, traceability, and organisational learning. The system must be able to answer what was originally planned, what changed, and what actually happened.

## Decision

CareFlow will treat a released monthly reference plan as a stable baseline.

A released reference plan must not be overwritten silently.

If an officially released reference plan needs to be changed after release, CareFlow shall create a new version instead of modifying the existing version in place.

Evaluations, snapshots, and leadership reports must refer to a specific reference plan version.

## Definitions

### Draft Reference Plan

A monthly plan that is still being prepared and has not yet been released as the official planning baseline.

### Released Reference Plan

A monthly plan that has been approved, imported, or accepted as the official planning baseline for a given period.

### Active Reference Plan

The released reference plan for the currently running planning period.

### Revised Reference Plan

A later official version of the same monthly reference plan.

### Closed Reference Plan

A reference plan whose planning period has ended.

### Evaluated Reference Plan

A closed reference plan that has been compared with the corresponding closed operational plan.

## Lifecycle States

Reference plans shall support the following lifecycle states:

- `draft`
- `released`
- `active`
- `closed`
- `evaluated`

## Versioning Rules

1. A draft reference plan may be edited.
2. A released reference plan must not be overwritten silently.
3. Any official change after release must create a new version.
4. Each reference plan version must preserve its release timestamp.
5. Each reference plan version must preserve its origin or import context where available.
6. Evaluations must explicitly state which reference plan version was used.
7. Historical evaluations must remain reproducible.
8. The operational rolling plan may use the latest relevant released version, but historical comparisons must remain tied to their original reference plan version.

## Example

For June, CareFlow may distinguish:

- `ReferencePlan June v1` — originally released monthly plan.
- `ReferencePlan June v2` — officially revised monthly plan, if the institution makes a formal correction.
- `OperationalRollingPlan` — dynamic operational reality and leadership view.
- `ClosedOperationalPlan June` — frozen operational state of June at month end.
- `Evaluation June` — comparison between the closed operational plan and the selected reference plan version.

## Consequences

CareFlow preserves a clean distinction between the official planning baseline and operational reality.

Monthly evaluation becomes more meaningful because deviations can be traced back to a stable baseline.

The system becomes more audit-friendly and explainable.

Leadership can distinguish between planning changes, operational changes, and real deviations.

The reference plan becomes a reliable anchor for learning and evaluation.

## Implementation Notes

The MVP may start with a minimal reference plan concept.

At minimum, a reference plan should have:

- id
- period start
- period end
- version
- status
- release timestamp
- created timestamp
- updated timestamp

A later version may add:

- import source
- imported file reference
- created by
- released by
- release note
- revision note
- previous version reference

Suggested conceptual model:

```ts
ReferencePlan {
  id: string
  periodStart: Date
  periodEnd: Date
  version: number
  status: "draft" | "released" | "active" | "closed" | "evaluated"
  releasedAt?: Date
  createdAt: Date
  updatedAt: Date
}