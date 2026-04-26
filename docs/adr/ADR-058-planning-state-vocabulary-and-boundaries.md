# ADR-058 Planning State Vocabulary and Boundaries

## Status

Accepted

## Context

CareFlow returns to the broader planning roadmap after the Planning Intelligence, Gap, and Severity work.

The next planning steps include plan draft handling, import mapping, reference plan freeze, operational plan state, rolling leadership views, and period close. Before these steps are implemented, CareFlow needs a shared vocabulary for planning states and boundaries.

The current repository already contains:

- `PlanningMonth`, `PlanningDay`, and `PlanningShiftTemplate` as planning frame structures.
- `PlanningMonth.status` with the current values `"draft"`, `"active"`, and `"finalized"`.
- `PlanningShiftTemplate` records that do not create operational `Shift` records.
- `Shift` records that currently represent operative shifts with `date`, `type`, `requiredCount`, and `requiredQualifiedCount`.
- `Assignment.status`, which exists but is not a clean planning-state status.
- Planning Comparison that compares `PlanningShiftTemplate` against operative `Shift` records in the month range.
- Reference plan, import, and mapping concepts described in ADRs, but not yet implemented as separate technical plan artifacts.

CareFlow must preserve the distinction between planning frame, imported data, draft plan, reference plan, operational plan, actual state, and closed period.

## Decision

CareFlow defines the following planning-state vocabulary as the future fachliche baseline.

This ADR is a fachliche and architectural boundary decision. It does not implement new models, migrations, services, types, routes, tests, or import behavior.

## Vocabulary

### ImportedPlan

`ImportedPlan` is the external raw or import basis from an upstream planning, roster, ERP, HR, or other operational system.

It may come from CSV, Excel, an API export, or another structured export format.

Concrete systems such as Polypoint are examples only. They must not be treated as a fachlicher standard, prerequisite, or reference model for CareFlow.

An `ImportedPlan` is:

- not approved
- not a reference plan
- not business truth by itself
- subject to mapping, technical checks, and fachliche validation
- system-neutral by design

Import mapping must not treat unchecked external data as truth.

### DraftPlan

`DraftPlan` is an editable plan draft.

It may originate from an `ImportedPlan` or from manual creation inside CareFlow.

A `DraftPlan`:

- may still be changed
- is not yet a reference plan
- is a reviewable intermediate state
- can be corrected, enriched, rejected, or prepared for approval

The draft stage is necessary because imported planning data can be incomplete, locally coded, ambiguous, or in conflict with known operational information.

### ReferencePlan

`ReferencePlan` is the released comparison baseline.

It is intentionally frozen and becomes the basis for target/actual and reference/operational comparison.

A `ReferencePlan`:

- is created only after checking and explicit approval
- must not be created automatically from an import
- must not be created automatically from `PlanningShiftTemplate`
- must not be overwritten silently by operative events
- should later preserve approval and snapshot context

`PlanningShiftTemplate` is currently a planning frame or target template. It is not yet a true frozen `ReferencePlan`.

A later `ReferencePlan` should preferably emerge through an explicit snapshot and approval structure, not by reinterpreting existing `Shift` or `PlanningMonth` fields.

### OperationalPlan

`OperationalPlan` is the running operative planning state.

It includes operative shifts, assignments, absences, requests, and day-level changes.

An `OperationalPlan`:

- may differ from the `ReferencePlan`
- describes the current steering-relevant planning state
- is affected by sickness, absences, requests, replacements, function changes, and leadership decisions
- must not overwrite the frozen reference baseline

`Shift` remains the current representation of operative shift reality. It should not be overloaded prematurely with planning-state semantics.

### ActualState

`ActualState` is the calculated effective daily or actual state.

It emerges from the `OperationalPlan` plus availability, absences, requests, validation results, and gap interpretation.

`ActualState`:

- is not a separate plan draft
- is not a reference plan
- is a calculated leadership view on operative reality
- supports readable operational decision context

The current Leadership Day View and Planning Comparison already move in this direction by exposing effective coverage gaps, effective qualification gaps, primary causes, signals, and severity.

### ClosedPeriod

`ClosedPeriod` is a completed planning period.

It provides the basis for review, period close, learning, later evaluation, and planning quality analysis.

`ClosedPeriod` must not be equated with `PlanningMonth.status = "finalized"` until the fachliche meaning of period close has been explicitly decided and implemented.

## Boundary Rules

CareFlow remains a decision layer. It is not an ERP, payroll system, HR suite, or classical roster-planning system.

CareFlow must not be narrowed to one external planning system. Polypoint may be mentioned as an example of an external planning system, but it is neither a requirement nor the reference model.

Import mapping must remain system-neutral.

An imported plan is not automatically a reference plan.

`PlanningShiftTemplate` is currently a planning frame and target template. It is not yet a frozen `ReferencePlan`.

`Shift` remains operative shift reality for now and must not be prematurely overloaded with plan-state semantics.

`PlanningMonth.status = "draft" | "active" | "finalized"` remains in place for now. These values must not be interpreted uncritically as a complete planning-state model.

Reference plan creation should later use explicit snapshot and approval semantics.

Unchecked import data must remain visible as external or draft data until mapped, checked, validated, and approved.

Old stash blocks must not be integrated uncontrolled. Any older work must be reviewed against this vocabulary and the current CareFlow boundaries before integration.

## Consequences

Future implementation work should preserve the distinction between:

- imported external raw data
- editable draft planning
- released and frozen reference baseline
- running operational planning state
- calculated actual state
- closed historical period

Planning Comparison may continue to compare the current planning frame against operative shifts, but it should not be described as a full reference-plan comparison until a real `ReferencePlan` artifact exists.

The current `PlanningMonth`, `PlanningDay`, and `PlanningShiftTemplate` structures can remain useful as planning frame structures, but they should not be silently promoted into reference-plan truth.

The current `Assignment.status` may continue to support operational availability semantics, but it should not become the main planning-state model without a separate decision.

This ADR consolidates the direction from ADR-032, ADR-033, ADR-034, and the Planning Intelligence ADRs. It also supports the later direction of reference plan freeze, rolling operational views, and period close.

## Non-Goals

This ADR does not introduce:

- a database migration
- a new Prisma model
- a new TypeScript type
- new routes or services
- import implementation
- mapping profile implementation
- reference plan snapshot implementation
- period close implementation
- tests

## Summary

CareFlow separates imported data, draft planning, reference baseline, operational planning state, calculated actual state, and closed period.

This vocabulary protects CareFlow from mixing Dienstplanung with the decision layer, prevents unchecked imports from becoming business truth, and keeps the path open for a controlled reference-plan and period-close implementation.
