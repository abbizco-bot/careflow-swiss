# ADR-062 Mapping Profile Semantics

## Status

Accepted

## Context

`MappingProfilePreview` currently exists only as a minimal placeholder in `src/modules/import-dry-run/import-dry-run.types.ts`.

It currently contains only:

- `id`
- `name`
- `sourceType`
- `mappingDimensions`

It is used only as optional `inlineMappingProfile` context in `ImportDryRunInput`.

There is no productive `MappingProfile` implementation.

There is no mapping service.

There is no route.

There is no database persistence.

There is no import logic.

ADR-033 already describes mapping profiles fachlich, but it is historically closer to CSV and Polypoint language.

ADR-059, ADR-060, and ADR-061 define the newer system-neutral dry-run boundary.

## Decision

CareFlow will treat a future `MappingProfile` as a system-neutral translation artifact between external planning language and CareFlow concepts.

This ADR consolidates mapping-profile semantics before any stronger type sketch, mapping service, parser, route, database persistence, import integration, or stash integration is introduced.

## Basic Decision

A `MappingProfile` translates external planning language into CareFlow concepts.

A `MappingProfile` is explicitly:

- not an import result
- not a `DraftPlan`
- not a `ReferencePlan`
- not an operative plan state
- not an approval
- not write logic
- not a mechanism for creating `Shift` records
- not a mechanism for creating `Assignment` records
- not a mechanism for persisting absences

Mapping is preparation for interpretation and validation. It is not acceptance of imported data as truth.

## System Neutrality

`MappingProfile` remains system-neutral.

`sourceSystemName` may be descriptive, but it must not control core behavior.

Polypoint may be used as an example of an external planning system. It is not a standard, prerequisite, or reference model for CareFlow.

CSV may be one possible input format. It is not the core model.

Excel-like exports, API exports, `structured_json`, and other structured sources must remain equally possible.

Source-specific fields belong in source fields or metadata, not in CareFlow core type names.

## Mapping Dimensions

Future mapping profiles may use the following neutral mapping dimensions:

- `employee`
- `shift_type`
- `qualification`
- `daily_function`
- `absence`
- `status`
- `area`
- `date_time`
- `source_metadata`

### employee

Employee mapping can relate external personnel numbers, names, abbreviations, or pseudonyms to CareFlow employees.

This dimension may involve sensitive identity questions and must be handled carefully.

### shift_type

Shift-type mapping translates external shift labels into CareFlow shift types.

### qualification

Qualification mapping translates external qualification language into CareFlow qualification concepts.

### daily_function

Daily-function mapping translates external daily roles or operational functions into CareFlow daily-function concepts.

### absence

Absence mapping translates external absence types into CareFlow absence concepts.

### status

Status mapping translates external plan, row, or assignment statuses into CareFlow-understandable status concepts.

### area

Area mapping translates area, team, ward, living-unit, or organizational-unit information.

### date_time

Date-time mapping describes date, time, and period logic.

### source_metadata

Source-metadata mapping describes source information and technical context fields.

## Possible Future Target Shape

A possible later target shape could look like this:

```ts
mappingProfile: {
  id?: string;
  name: string;
  sourceType?: ImportSourceType;
  sourceSystemName?: string;
  version?: string;
  dimensions: {
    employees?: unknown;
    shiftTypes?: unknown;
    qualifications?: unknown;
    dailyFunctions?: unknown;
    absences?: unknown;
    statuses?: unknown;
    areas?: unknown;
    dateTime?: unknown;
    sourceMetadata?: unknown;
  };
  metadata?: Record<string, unknown>;
}
```

`unknown` is intentional in this target shape.

The concrete structure of each mapping dimension must be decided separately later.

`MappingProfilePreview` remains minimal for now.

There should be no stronger type sketch without a separate implementation step.

This target shape is not a final API contract.

## Boundary to ImportDryRunResult

`MappingProfile` is an input and context artifact.

`ImportDryRunResult` is a result artifact.

`MappingProfile` must not be confused with mapped rows, issues, or summaries.

`MappingProfile` does not validate by itself. It enables later validation.

## Boundary to DraftPlanCandidate

`MappingProfile` does not create a `DraftPlanCandidate`.

It may later be used to translate external data into a `DraftPlanCandidatePreview`.

Creating a `DraftPlanCandidatePreview` is a separate step and not a property of the `MappingProfile` itself.

## Boundary to ReferencePlan

`MappingProfile` never directly creates a `ReferencePlan`.

`MappingProfile` contains no approval or freeze logic.

A `ReferencePlan` emerges only after separate checking and explicit approval.

## Data Protection and Identification

Employee mapping can involve sensitive identification questions.

External personnel numbers, names, abbreviations, or pseudonyms must not be treated uncritically as stable identity.

Future mapping implementation must make ambiguities, duplicates, and unmapped people visible.

`MappingProfile` must not contain hidden employee evaluation.

## Risks

The main risks are:

- `MappingProfile` is understood too early as a stable API contract
- `MappingProfile` becomes source-specific
- Polypoint or CSV terms leak into the CareFlow core model
- `MappingProfile` takes over operative planning logic
- `MappingProfile` is confused with `DraftPlanCandidate`
- `MappingProfile` indirectly becomes approval or `ReferencePlan` logic
- employee mapping creates data-protection or identification risks

## Consequences

ADR-062 defines semantics only. It introduces no implementation.

`MappingProfilePreview` remains minimal for now.

The next technical step may at most be a small type sketch.

There should be no mapping service yet.

There should be no parser yet.

There should be no route yet.

There should be no database persistence yet.

There should be no import integration yet.

There should be no stash integration without a separate boundary review.

## Summary

Future mapping profiles in CareFlow translate external planning language into CareFlow concepts while preserving the distinction between import context, dry-run results, draft planning, reference planning, and operative plan state.
