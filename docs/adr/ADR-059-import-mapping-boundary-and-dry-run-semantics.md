# ADR-059 Import Mapping Boundary and Dry-Run Semantics

## Status

Accepted

## Context

CareFlow needs a clear boundary for future import mapping before any technical import implementation is added.

Existing decisions already define the direction:

- ADR-032 states that import must not create a reference plan.
- ADR-033 describes mapping profiles for external planning systems.
- ADR-034 states that a `ReferencePlan` only emerges after checking and explicit approval.
- ADR-058 separates `ImportedPlan`, `DraftPlan`, `ReferencePlan`, `OperationalPlan`, `ActualState`, and `ClosedPeriod`.

The current codebase does not contain productive import code. There are no import routes, parsers, mapping profile types, import batch structures, upload mechanisms, or productive import workflows.

Older stash work must not be integrated without a boundary review against the current CareFlow domain model.

## Decision

CareFlow will treat future import mapping as a system-neutral read and validation boundary first.

The first technical import step must be a dry run. It must not create operational planning records, reference plans, approvals, freezes, or period-close effects.

This ADR documents a fachliche and technical boundary. It does not introduce a database migration, implementation, route, parser, type, service, or test.

## ImportedPlan

`ImportedPlan` is an external raw-data basis.

It may originate from:

- CSV files
- Excel-like exports
- API exports
- other structured data sources
- roster-planning systems
- ERP systems
- HR systems
- other planning or operational systems

`ImportedPlan` is system-neutral. Polypoint may be used as an example of an external planning system, but it is not a standard, requirement, or reference model for CareFlow.

An `ImportedPlan` is:

- not a `DraftPlan`
- not a `ReferencePlan`
- not an `OperationalPlan`
- not operational truth
- not business truth without checking
- a source that must be mapped, normalized, validated, and reviewed

## Import Mapping

Import mapping translates external data into CareFlow concepts.

It must remain system-neutral and must not be coupled to a single CSV structure, one vendor format, or one external planning system.

Future mapping dimensions may include:

- column mapping
- date and time mapping
- shift type mapping
- employee mapping
- qualification mapping
- daily function mapping
- absence mapping
- status mapping
- area, team, or living-unit mapping
- source metadata
- validation errors and warnings

Mapping is not approval. Mapping is not reference-plan creation. Mapping is not operational plan mutation.

## Dry-Run Principle

The first technical import step should be implemented as a dry run.

Dry run means:

- import data is read or accepted
- raw data is normalized
- mapping is applied
- validation errors and warnings are produced
- an import result is returned read-only
- no operative `Shift` records are created
- no `Assignment` records are created
- no `PlanningMonth` is overwritten
- no `ReferencePlan` is created
- no approval is simulated
- no plan change is performed automatically
- no absences are productively written

The dry-run result may support human review, correction, and future draft preparation. It must not be treated as accepted plan truth.

## Possible Future Technical Artifacts

The following artifacts may become useful later. They are not introduced by this ADR:

- `ImportedPlanArtifact`
- `ImportBatch`
- `ImportRow`
- `MappingProfile`
- `ImportValidationIssue`
- `DraftPlanCandidate`
- `DraftPlanPreview`

These artifacts should preserve the distinction between raw external data, mapped preview data, validation output, editable draft planning, and approved reference planning.

## Boundary to DraftPlan

A `DraftPlan` may later be created from a mapped and validated import.

An import dry run does not create a `DraftPlan`.

A future `DraftPlanCandidate` or `DraftPlanPreview` may serve as an intermediate review stage before an actual editable draft is created.

The transition from imported data to draft planning requires a separate explicit implementation decision.

## Boundary to ReferencePlan

A `ReferencePlan` is never created directly from import.

A `ReferencePlan` emerges only after fachliche checking and explicit approval.

Import mapping must not contain reference-plan freeze logic.

Import mapping must not mark data as approved, released, frozen, active, closed, or evaluated.

## Boundary to Operational Planning

An import dry run must not create operative `Shift` records.

An import dry run must not change existing operative `Shift` records.

An import dry run must not create or change `Assignment` records.

An import dry run must not productively write absences.

An import dry run must not mutate planning, validation, leadership, or operational records.

## Decision-Layer Boundary

CareFlow remains a decision layer.

Import supports interpretation, checking, mapping, and preparation of planning information.

CareFlow does not become a full roster-planning system through import mapping.

External planning systems remain possible data sources. They are not the fachliche center of CareFlow.

Human responsibility remains required before imported information can influence draft planning, reference planning, or operational planning.

## Risks

The main risks are:

- import is incorrectly read as a `ReferencePlan`
- CSV is accidentally treated as the standard import model
- Polypoint is accidentally treated as the standard external system
- unchecked data creates operative `Shift` records
- mapping creates a `ReferencePlan` too early
- old stash code is integrated without boundary review
- CareFlow drifts toward a roster-planning system
- external data is treated as truth instead of a source that must be checked

## Consequences

The next technical step may only be an import dry-run concept or a small read-only mapping sketch.

No productive import integration should be added without a separate decision.

No `ReferencePlan` creation should be added without a later dedicated ADR or implementation step.

No database migration is introduced by this ADR.

No import route, parser, service, type, or test is introduced by this ADR.

## Summary

Future import mapping in CareFlow begins as a system-neutral dry-run boundary.

Imported data remains unchecked external source material until it is mapped, validated, reviewed, and explicitly accepted into a later planning step.

This protects the distinction between import, draft planning, reference planning, operational planning, and leadership interpretation.
