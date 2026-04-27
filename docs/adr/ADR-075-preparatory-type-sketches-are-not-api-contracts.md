# ADR-075 Preparatory Type Sketches Are Not API Contracts

## Status

Accepted

## Context

Recent Phase 8 work introduced several ADRs and TypeScript type sketches, including:

- `ImportDryRunInput`, `ImportDryRunResult`, and `ImportDryRunIssue`
- `MappingProfile`
- `ReferencePlanSnapshot`
- `PersonGapContext`
- `DecisionOptionPreview`
- `RollingPlanningView`
- Rolling Snapshot and Rolling View target shapes
- `SpecialCompetence` and `SpecialNeed` target shapes

These structures were intentionally created without parsers, services, routes, database persistence, API extensions, frontend work, or productive integration.

CareFlow needs an explicit governance rule so preparatory sketches are not mistaken for finished product behavior.

## Decision

Preparatory type sketches and ADR target shapes are architecture preparation.

They are explicitly not:

- API contracts
- database models
- productive features
- services
- workflows
- UI contracts
- persisted artifacts
- automatic decision logic
- approval processes
- operative plan changes

## Affected Structures

### ImportDryRun Types

Import dry-run types define the shape of a possible later dry-run result.

They do not create an import.

They do not write data.

They do not create shifts, assignments, draft plans, or reference plans.

### MappingProfile

`MappingProfile` is a translation artifact between external planning language and CareFlow terms.

It is not an import result.

It is not a draft plan.

It is not a reference plan.

It contains no approval or write logic.

### ReferencePlanSnapshot

`ReferencePlanSnapshot` describes a possible later snapshot structure.

It does not create a reference plan.

It freezes nothing.

It persists nothing.

It does not change `PlanningMonth`.

### PersonGapContext

`PersonGapContext` describes a possible person-reduced internal context structure.

It contains no names.

It contains no detailed absence reasons.

It creates no blame or evaluation logic.

It is not Leadership View output.

### DecisionOptionPreview

`DecisionOptionPreview` describes a possible later reviewable option.

It is not a recommendation.

It does not write automatically.

It requires human review.

It is not a plan change.

### RollingPlanningView

`RollingPlanningView` describes a possible later rolling overview.

It is not a route.

It is not a service.

It is not an API.

It is not duty planning.

It contains no person-related details.

### Rolling Snapshot and Rolling View Target Shapes

Rolling Snapshot and Rolling View target shapes describe possible later plan-state or comparison logic.

They do not create a reference plan.

They do not replace period close.

They are not automatic plan approval.

### SpecialCompetence and SpecialNeed Target Shapes

`SpecialCompetence` and `SpecialNeed` target shapes describe possible later Skill-Mix extensions.

They do not create staffing rules yet.

They contain no resident details.

They contain no medical detail data.

They create no person-related evaluation.

## No Implicit API Contract

A type sketch or ADR target shape must not automatically be understood as an API response.

A type sketch must not be exposed publicly without its own ADR or API contract decision.

Every later API extension needs a separate decision.

Field names in type sketches may still change before an API contract exists.

## No Implicit Persistence

Type sketches do not create database structures.

Type sketches do not imply Prisma migrations.

ADR target shapes do not imply table models.

Persistence requires a later explicit decision.

No type-sketch structure may automatically be copied into a database model.

## No Implicit Effect

Type sketches do not write data.

Type sketches do not create plan changes.

Type sketches do not create approvals.

Type sketches do not create recommendations.

Type sketches do not create person-related evaluations.

Type sketches do not create automatic decisions.

Type sketches do not create operative duty planning.

## Relationship to the Decision-Layer Principle

CareFlow remains a decision layer.

Type sketches support controlled architecture preparation.

They protect CareFlow from premature coupling to operative duty planning, ERP systems, HR systems, import persistence, or automatic optimization.

## Risks

The main risks are:

- a type sketch is misunderstood as a finished feature
- a type sketch is published as an API contract too early
- a type sketch is translated directly into a database migration
- a preview structure is read as a productive workflow
- `DecisionOptionPreview` is understood as a recommendation
- `ReferencePlanSnapshot` is understood as a real freeze
- `PersonGapContext` becomes person-related output too early
- `RollingPlanningView` is interpreted as a duty roster calendar
- `SpecialNeed` is confused with resident data too early
- `SpecialCompetence` is treated as a hard staffing rule too early

## Consequences

ADR-075 is governance only. It introduces no implementation.

Before productive use of any type sketch, CareFlow needs a separate implementation step.

Before any API output, CareFlow needs an API contract step.

Before any database persistence, CareFlow needs a data-model or migration ADR.

Before any integration into existing services, CareFlow needs a boundary review.

There should be no stash integration without a separate boundary review.

## Summary

Preparatory type sketches and ADR target shapes are useful architecture scaffolding.

They are not API contracts, database models, completed workflows, productive features, or hidden operational behavior.
