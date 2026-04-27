# ADR-070 Rolling Snapshot and Reference Plan Comparison

## Status

Accepted

## Context

CareFlow needs to help leadership understand how an originally valid reference plan develops under real operational conditions.

ADR-063 defines `ReferencePlan` as the approved and frozen comparison baseline.

ADR-069 defines a future Rolling Snapshot as an immutable capture of the operative Rolling View.

A later comparison between these two artifacts can support plan deviation analysis.

This ADR defines semantics only. It introduces no code, database migration, model, route, service, test, API extension, or implementation.

## Decision

CareFlow should later be able to compare a frozen Rolling Snapshot with the valid `ReferencePlan`.

The purpose is plan deviation analysis.

The comparison must distinguish between:

- risks already present in the original reference plan
- risks caused or revealed by later operative events
- uncertainties that remain open at snapshot time
- approved changes after reference-plan freeze

## Visible Comparison Topics

A future comparison may show:

- absences
- undercoverage
- qualification gaps
- function gaps
- open incidents
- uncertain effective staffing
- approved operative changes
- risk patterns already present in the reference plan
- risk patterns created by later events

The exact output shape is not decided by this ADR.

## Stable Plan Versus Later Criticality

The comparison must make a central distinction:

- a plan that was already tight or risky when approved
- a plan that was originally stable but became critical through later events

This distinction matters because the leadership interpretation is different.

A tight original plan may indicate planning quality or structural staffing concerns.

A stable original plan that becomes critical may indicate operational volatility, absence impact, late requests, or other later events.

## Boundary Rules

The comparison is read-only.

It must not mutate the `ReferencePlan`.

It must not mutate the Rolling Snapshot.

It must not generate assignments or shifts.

It must not approve changes.

It must not become a recommendation engine.

## Risks

The main risks are:

- deviations are interpreted as fault
- original plan weakness and later events are mixed
- open incidents are treated as confirmed full-period absences
- Rolling Snapshot is mistaken for a new reference plan
- comparison output becomes an automatic action list
- sensitive person or absence details leak into aggregated analysis

## Consequences

Future implementation should keep comparison semantics explicit and read-only.

Any technical design must preserve the difference between reference baseline, operative snapshot, uncertainty, and approved change.

This ADR does not implement comparison logic.

## Summary

CareFlow should later compare Rolling Snapshots with ReferencePlans to explain plan deviations, especially the difference between an initially tight plan and a stable plan that became critical later.
