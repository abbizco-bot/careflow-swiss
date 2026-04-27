# ADR-077 Planning Intelligence Architecture Checkpoint

## Status

Accepted

## Context

The recent roadmap phases prepared several Planning Intelligence and decision-layer concepts in CareFlow.

The work covered import dry-run, mapping profiles, reference plans, person-related gap context, decision option previews, rolling planning views, special need and special competence, and period closing.

ADR-075 states that type sketches and ADR target shapes are not API contracts, database models, or finished features.

CareFlow now needs a checkpoint that clearly separates productive behavior from internal helpers, preparatory type sketches, ADR-only target shapes, and intentionally not implemented features.

This ADR is documentation and governance only. It introduces no code changes, database migration, types, services, routes, tests, API extension, or stash integration.

## Productive and API-Effective Functions

Leadership View is API-effective through:

- `/leadership/day`
- `/leadership/week`
- `/leadership/month`

Leadership Day View returns `day.shifts[].gap` with:

- `primaryCause`
- `signals`
- `effectiveCoverageGap`
- `effectiveQualificationGap`
- `severity`

`gap.severity` is productively derived through `deriveLeadershipGapSeverity(...)`.

Planning Comparison is API-effective through:

- `GET /planning-months/:id/comparison`

The Gap Interpretation Helper is actively used in Leadership View and Planning Comparison.

`PlanningMonth`, `PlanningDay`, and `PlanningShiftTemplate` are productively present, including routes, controller, service, and repository.

`PlanningMonth.status` exists with:

- `draft`
- `active`
- `finalized`

`PlanningMonth.status` is not interpreted as a complete planning-state model.

`finalized` means neither `ReferencePlan` nor `ClosedPeriod`.

## Internally Prepared, Not API-Effective

`derivePlanningState(...)` is implemented and tested.

Planning Comparison derives `planningState` internally, but intentionally does not return it in the API response.

`buildImportDryRunResult(...)` is implemented as a pure function and tested, but is not integrated anywhere.

These helpers create no API extension, no persistence, and no operative effect.

## Type Sketches Without Product Function

The following type sketches exist only as preparation:

- `ImportDryRun`, `ImportDryRunResult`, and `ImportDryRunIssue`
- `MappingProfile`
- `ReferencePlanSnapshot`
- `PersonGapContext`
- `DecisionOptionPreview`
- `RollingPlanningView`
- `ClosedPeriodReview`

These types are not API contracts.

These types are not database models.

These types are not finished features.

These types create no effect.

These types must not be publicly exposed or persisted without a separate decision.

## ADR and Target Shapes Without Implementation

The following topics exist only as ADR or target shape without implementation:

- Open incidents without known end date
- Rolling Snapshot
- Rolling Snapshot and `ReferencePlan` comparison
- `SpecialCompetence`
- `SpecialNeed`
- Authorized `SpecialNeed` entry
- `SpecialCompetence` coverage
- Period Closing Semantics

These topics are fachlich prepared.

There is no productive implementation.

There is no API.

There is no database structure.

There are no services or routes.

## Intentionally Not Implemented

The following are intentionally not implemented:

- productive import
- parser
- import route
- mapping service
- `DraftPlanCandidate` builder
- `ReferencePlan` freeze
- freeze service
- Rolling View service
- `DecisionOption` engine
- Human-in-the-Loop workflow
- person-related gap output
- PeriodClosing service
- `ClosedPeriod` persistence
- frontend integration
- deployment

## Architecture Risks

The main risks are:

- type sketches are read as finished features
- ADR target shapes are read as API contracts
- `PlanningMonth.status` is overinterpreted
- `PlanningShiftTemplate` is read as `ReferencePlan`
- `RollingPlanningView` is read as duty planning
- `DecisionOptionPreview` is read as a recommendation
- `PersonGapContext` becomes person-related output too early
- `ImportDryRun` is read as productive import
- `SpecialNeed` and `SpecialCompetence` are used operatively too early
- `ClosedPeriodReview` is read as PeriodClosing implementation

## Governance Decision

Every new API output needs a separate API contract step.

Every database persistence step needs a separate data-model or migration ADR.

Every integration of a type sketch into existing services needs a boundary review.

Every person-related output needs a separate data-protection and authorization decision.

Every productive plan change needs Human-in-the-Loop and auditability.

Stash blocks must not be integrated without a separate boundary review.

## Recommendation for Next Steps

Short-term useful steps are:

- add a short architecture-status section to `README` or `docs/governance`
- perform an MVP scope review
- decide which prepared strands are truly MVP-relevant

Not useful yet:

- import, parsers, or routes
- `ReferencePlan` freeze
- Rolling View service
- `DecisionOption` engine
- person-related output
- PeriodClosing persistence
- database migrations

## Summary

Planning Intelligence currently has a productive read-only core around Leadership View, gap interpretation, Planning Comparison, and planning-month structures.

Several helpers and type sketches prepare future work, but they are not public contracts, persisted models, or finished product features.

The next phase should preserve this distinction before any new implementation step.
