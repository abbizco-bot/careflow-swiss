# ADR-064 Person-Related Gap Context Semantics

## Status

Accepted

## Context

Leadership Day View currently does not expose names.

`day.shifts[].gap` is aggregated and contains `primaryCause`, `signals`, `effectiveCoverageGap`, `effectiveQualificationGap`, and `severity`.

Planning Comparison exposes aggregated counts and gaps, not names.

Person-related data already exists technically in `Employee`, `Assignment`, `Absence`, and `AvailabilityRequest`.

Availability and Employee Overview logic can already process person-related information such as `employeeName`, `employeeRole`, or `absenceReason`.

There is currently no person-related gap context in Leadership View or Planning Comparison.

The roadmap may later include cause logic and named messages.

## Decision

Person-related gap context in CareFlow must be treated as sensitive leadership context.

It may support understanding an operational situation, but it must not become blame, evaluation, surveillance, automatic decision-making, or sanctioning logic.

This ADR defines semantics and governance only. It introduces no implementation, database migration, types, services, routes, tests, API extension, Leadership View change, person-related logic, or stash integration.

## Basic Decision

Person-related gap contexts may only provide leadership context.

They are explicitly not:

- blame
- performance evaluation
- behavior evaluation
- automatic decision
- surveillance
- sanctioning logic
- a replacement for labor-law or care-leadership processes

CareFlow remains a decision layer. Human responsibility remains outside the system.

## Separating Event and Responsibility

CareFlow may describe events, availability, and operational effects.

CareFlow must not attribute personal responsibility for a gap.

Good wording:

- "Mitarbeitende Person ist geplant, aber nicht wirksam verfügbar."
- "Geplante Besetzung ist aufgrund einer Abwesenheitskategorie nicht wirksam."

Wording to avoid:

- "Mitarbeiter verursacht Unterdeckung."
- "Person X ist schuld an der Lücke."
- "Person X ist unzuverlässig."

The system may describe that an assignment is not effective. It must not infer fault.

## Data Minimization

A first person-related read model should be data-minimal.

Initially preferred fields:

- `employeeId`
- `role`
- `assignmentStatus`
- `availabilityStatus`
- `reasonCategory`

Initially not preferred:

- full name
- detailed sickness reason
- sensitive absence details
- person-related evaluation text

Names are not required for the first internal model.

## Absences and Sensitive Reasons

Sickness and sensitive absences must not be shown in unnecessary detail.

Technical values such as `absenceReason: "sick"` must not automatically be emitted as detailed gap-context reasons.

For Leadership Gap Context, a coarse `reasonCategory` such as `"absence"` should be preferred initially.

Detailed absence reasons belong, if at all, only in clearly authorized detail views.

Requests must not be interpreted as unreliability.

## Possible Future Internal Shape

A possible later internal read model could look like this:

```ts
PersonGapContext {
  shiftId: number;
  shiftType: string;
  affectedEmployees?: PersonContextEntry[];
  absentEmployees?: PersonContextEntry[];
  requestedEmployees?: PersonContextEntry[];
  unavailableEmployees?: PersonContextEntry[];
  assignedButNotEffectiveEmployees?: PersonContextEntry[];
  missingFunctionContext?: unknown;
  qualificationGapContext?: unknown;
  assignmentConflictContext?: unknown;
}

PersonContextEntry {
  employeeId: number;
  role?: string;
  assignmentStatus?: string;
  availabilityStatus?: "available" | "absent" | "requested" | "not_effective";
  reasonCategory?: "absence" | "request" | "assignment_status" | "qualification" | "function";
}
```

Name is optional and is not part of the first internal minimal model.

This structure is a possible target shape. It is not an API contract.

## Output Boundaries

There should be no named output in `headline`.

There should be no named output in `contextLine`.

There should be no named output in aggregated gap rows as a first step.

If names are later shown, they should appear in a separate authorized detail view.

Named output requires a separate decision and potentially its own ADR or API contract.

The initial person-related structure should remain internal and person-reduced.

## Technical Boundary

`PersonGapContext` would be a read model, not a mutation.

`PersonGapContext` must not create plan changes.

`PersonGapContext` must not create recommendations.

`PersonGapContext` must not create sanctions.

`PersonGapContext` must not change assignments.

`PersonGapContext` must not change absences.

`PersonGapContext` must not change shifts.

`PersonGapContext` must not change validations.

`PersonGapContext` is not part of import, reference-plan freeze, or period close.

## Relationship to Existing Views

Employee Overview and Absence Views may contain person-related information.

Leadership Gap Context should intentionally be more restrictive.

Aggregated Leadership Day View remains primarily situation-oriented.

Person-related details, if later needed, belong in clearly separated detail views.

## Risks

The main risks are:

- names in gap contexts are read as blame
- sickness becomes too visible
- requests are interpreted as unreliability
- leadership sees more person-related data than necessary
- CareFlow appears to be a surveillance system
- gap signals are confused with individual performance
- absence reasons can be labor-law or health-sensitive
- person-related context data is used outside its original purpose

## Consequences

ADR-064 defines semantics and governance only. It introduces no implementation.

The next technical step may at most be an internal, person-reduced type or read-model sketch.

There should be no API extension yet.

There should be no names in Leadership View yet.

There should be no change to `headline` or `contextLine`.

There should be no person-related recommendation.

There should be no person-related alerts.

There should be no stash integration without a separate boundary review.

## Summary

CareFlow may later provide person-related gap context only as careful, data-minimal leadership context.

It must preserve the distinction between operational events, availability effects, and personal responsibility.
