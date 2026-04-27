# ADR-068 Reference Plan, Operational Rolling View, and Rolling Snapshot Separation

## Status

Accepted

## Context

CareFlow distinguishes planned baselines from operative reality and calculated leadership views.

ADR-058 separates `ReferencePlan`, `OperationalPlan`, `ActualState`, and `ClosedPeriod`.

ADR-066 defines a future Rolling 28-Day View as read-only leadership observation.

The roadmap also needs a clear distinction between a monthly reference plan, the live operational rolling view, and frozen rolling snapshots.

This ADR defines semantics only. It introduces no code, database migration, model, route, service, test, API extension, or implementation.

## Decision

CareFlow separates three concepts:

- `ReferencePlan`
- operative Rolling View
- `RollingSnapshot`

These concepts must not be collapsed into one field, status, table, or response without a separate architectural decision.

## ReferencePlan

The `ReferencePlan` is the originally valid and approved monthly plan baseline.

It is the stable comparison basis.

It is not overwritten by operative events.

Absences, requests, open incidents, short-term changes, and leadership decisions may create deviations from the reference plan, but they do not rewrite it.

## Operative Rolling View

The operative Rolling View is a continuously calculated read-only view of the next 28 days.

It reflects the currently known operative situation, including:

- operative shifts
- assignments
- absences
- requests
- open incidents
- known operational changes
- current gap and severity interpretation
- data status

It is not itself a persisted plan artifact unless later explicitly snapshot.

It does not create, approve, or change planning records.

## RollingSnapshot

A `RollingSnapshot` is a frozen moment-in-time capture of the Rolling View.

It documents what CareFlow knew and calculated at a defined timestamp.

It is different from the live Rolling View because it does not continue changing after creation.

It is different from the `ReferencePlan` because it captures operative state, uncertainty, and current interpretation rather than the original approved monthly baseline.

## Boundary Rules

The `ReferencePlan` remains stable.

The Rolling View remains calculated and read-only.

The `RollingSnapshot` remains immutable after creation.

Operative events must not overwrite the `ReferencePlan`.

Snapshot creation must not imply reference-plan freeze.

Rolling View calculation must not imply monthly period close.

## Risks

The main risks are:

- operative changes are written back into the reference plan
- the Rolling View is mistaken for a new plan
- a RollingSnapshot is mistaken for a `ReferencePlan`
- live calculated state is confused with frozen evidence
- data status and uncertainty disappear in summaries
- CareFlow drifts toward a classical planning system instead of remaining a decision layer

## Consequences

Later implementation must preserve explicit separation between baseline, live calculated view, and frozen snapshot.

Any persistence of RollingSnapshot requires a separate implementation decision.

This ADR does not introduce persistence or API behavior.

## Summary

The reference plan is the original approved baseline, the operative Rolling View is the live calculated 28-day leadership view, and a RollingSnapshot is a frozen capture of that view at a defined time.
