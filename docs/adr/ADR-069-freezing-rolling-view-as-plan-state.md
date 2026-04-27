# ADR-069 Freezing Rolling View as Plan State

## Status

Accepted

## Context

ADR-066 defines the Rolling 28-Day View as a read-only leadership and observation view.

ADR-068 separates the reference plan, operative Rolling View, and Rolling Snapshot.

CareFlow may later need to freeze the Rolling View at defined points to document the operative planning state known at that time.

This ADR defines semantics only. It introduces no code, database migration, model, route, service, test, API extension, or implementation.

## Decision

The Rolling View may later be frozen as a snapshot at defined points in time.

Such a snapshot is a separate plan-state layer.

It is not the `ReferencePlan`.

It is not the normal live Day View.

It is not a period close by itself.

It does not mutate operative planning records.

## Snapshot Contents

A future Rolling Snapshot should document:

- covered period
- snapshot creation timestamp
- data state at creation time
- open incidents
- uncertain assignments or deployments
- approved operational changes
- operative situation assessment
- data status per day or relevant segment
- relevant gap and severity interpretation
- source or calculation metadata

The exact technical structure is not decided by this ADR.

## Immutability

Once created, a Rolling Snapshot remains unchanged.

If the operative situation changes, a later snapshot may be created.

Existing snapshots must not be silently updated to reflect newer information.

This preserves traceability of what was known at a specific moment.

## Plan-State Layer

The freeze belongs to a separate rolling plan-state layer.

It must not be implemented by overwriting:

- `ReferencePlan`
- `PlanningMonth`
- `PlanningShiftTemplate`
- `Shift`
- `Assignment`
- Leadership Day View output

## Risks

The main risks are:

- snapshot freeze is mistaken for reference-plan freeze
- the live Rolling View is treated as persisted truth
- snapshots are updated after creation
- uncertainty is lost during freeze
- approved changes and open incidents are merged without traceability
- snapshot creation is misunderstood as approval or period close

## Consequences

A later technical implementation should treat Rolling Snapshot creation as its own explicit operation with immutable output.

No implementation is introduced by this ADR.

## Summary

Freezing the Rolling View means creating an immutable moment-in-time snapshot of the operative 28-day view, not changing the reference plan or the live day view.
