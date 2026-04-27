# ADR-061 Import Dry-Run Issue Code Semantics

## Status

Accepted

## Context

ADR-059 defines import mapping as a system-neutral dry-run process without productive writes.

ADR-060 defines the planned `ImportDryRunResult` shape with row-related and mapping-related issues.

Since commit `2130d40`, CareFlow has neutral import dry-run TypeScript types.

Since commit `0db1c72`, CareFlow has `buildImportDryRunResult(...)` as a pure helper for assembling read-only dry-run results.

There are still no import parsers, routes, services, database persistence, or productive import integration.

## Decision

CareFlow will use system-neutral issue-code semantics for future import dry-run results.

This ADR defines categories, an MVP issue-code catalog, mapping-dimension guidance, severity semantics, blocking semantics, and boundaries.

It does not introduce validation logic, TypeScript unions, parsers, routes, services, database changes, productive import integration, or stash integration.

## Issue-Code Categories

Future import dry-run issue codes should fit one of these neutral categories.

### source

Format, source, metadata, and input readability.

Examples include unknown source formats, unreadable input, missing source metadata, or fields that cannot be understood before mapping.

### period / date_time

Dates, times, and period boundaries.

Examples include invalid dates, unsupported time formats, or rows outside the requested import period.

### employee

Employee mapping.

Examples include external employee identifiers that cannot be mapped to CareFlow employees or duplicate employee matches.

### shift_type

Shift-type mapping.

Examples include external shift labels that cannot be mapped to CareFlow shift types.

### qualification

Qualification mapping.

Examples include external qualification labels that cannot be mapped to CareFlow qualification concepts.

### daily_function

Daily-function mapping.

Examples include external role or function labels that cannot be mapped to CareFlow daily functions.

### absence

Absence type or absence reference.

Examples include external absence labels that cannot be mapped to CareFlow absence concepts.

### status

External plan, row, or assignment status.

Examples include external status values that are not understood or not clearly mappable.

### area

Area, team, ward, or living-unit mapping.

Examples include external location or organizational-unit labels that cannot be mapped to CareFlow areas.

### mapping_profile

Missing or incomplete mapping.

Examples include absent mapping profiles, missing mapping dimensions, or incomplete mapping definitions.

### consistency

Duplicates, conflicts, and contradictory rows.

Examples include duplicate imported rows or conflicting assignment-like information within the import source.

### boundary

Blocked productive effects.

Examples include attempted creation of operative shifts, assignments, `PlanningMonth` overwrites, or `ReferencePlan` creation during a dry run.

## MVP Issue-Code Catalog

The initial MVP code catalog should remain small and neutral.

The following codes are sufficient as a first semantic set:

- `source_format_unknown`
- `required_field_missing`
- `invalid_date`
- `date_outside_period`
- `employee_unmapped`
- `employee_duplicate_match`
- `shift_type_unmapped`
- `qualification_unmapped`
- `daily_function_unmapped`
- `absence_type_unmapped`
- `status_unmapped`
- `area_unmapped`
- `mapping_profile_missing`
- `mapping_profile_incomplete`
- `duplicate_row`
- `conflicting_assignment`
- `import_would_create_operational_shift_blocked`
- `import_would_create_reference_plan_blocked`

This catalog is not a final public API contract.

It is a controlled vocabulary for future type and validation design.

## Mapping Dimensions

Issue codes should use ADR-060 mapping dimensions where that helps explain the issue.

- `employee_unmapped` and `employee_duplicate_match` map to `employee`
- `shift_type_unmapped` maps to `shift_type`
- `qualification_unmapped` maps to `qualification`
- `daily_function_unmapped` maps to `daily_function`
- `absence_type_unmapped` maps to `absence`
- `status_unmapped` maps to `status`
- `area_unmapped` maps to `area`
- `invalid_date` and `date_outside_period` map to `date_time`
- `source_format_unknown` and `required_field_missing` map to `source_metadata`
- `mapping_profile_missing` and `mapping_profile_incomplete` map to `source_metadata` or mapping-profile context
- boundary codes intentionally have no mapping dimension because they protect the dry-run boundary

Mapping dimensions must remain system-neutral.

They must not be named after one external system, vendor, or CSV layout.

## Severity and Blocking Semantics

### Blocking error

A blocking error means no next planning step may be derived from this dry-run result.

Typical blocking errors include:

- `mapping_profile_missing`
- hard required fields are missing
- `invalid_date` when a date cannot be interpreted
- `date_outside_period` when a row lies outside the requested import period
- productive write effects would be required or were requested
- boundary codes such as `import_would_create_operational_shift_blocked`
- boundary codes such as `import_would_create_reference_plan_blocked`

### Non-blocking error

A non-blocking error indicates a technically faulty or incompletely mappable single row that can still be represented in the review result.

It may prevent that row from becoming part of a later preview, but it does not necessarily invalidate the whole dry run.

### Warning

A warning is review-relevant but not necessarily blocking.

Typical warnings include:

- unclear mapping
- duplicate candidate
- incomplete mapping
- ambiguous external status

### Info

An info issue supports traceability.

Typical info cases include:

- source recognized
- field ignored
- normalization performed
- optional metadata missing

## Blocking Boundary

`blocking` means only that no next planning step may be derived from the dry-run result.

`blocking` does not mean fachliche approval.

`blocking` does not mean fachliche rejection.

`blocking` does not mean a leadership recommendation.

Import issues are not leadership gap signals.

Import issues are not operative alerts.

Import issues must not be confused with `ReferencePlan` freeze, `DraftPlan` approval, or period close.

## System Neutrality

Issue codes must remain system-neutral.

There must be no Polypoint-specific issue codes.

There must be no CSV-specific core issue codes.

Concrete source names belong in `sourceSystemName` or metadata, not in issue-code names.

CSV can be one source type. It must not become the fachliche standard of the import model.

## Risks

The main risks are:

- too many codes create a stable API contract too early
- system-specific issue codes weaken the import boundary
- `blocking` is misunderstood as fachliche approval or rejection
- import issues become operative alerts or leadership gap signals
- boundary codes are misunderstood as freeze, draft-plan, or reference-plan mechanics

## Consequences

ADR-061 defines semantics only. It introduces no validation logic.

The next technical step may at most be a TypeScript union sketch for `ImportDryRunIssueCode`.

There should be no parser yet.

There should be no route yet.

There should be no service yet.

There should be no database persistence yet.

There should be no productive import integration yet.

There should be no stash integration without a separate boundary review.

## Summary

Future import dry-run issue codes should be small, neutral, explainable, and clearly separated from operational alerts, leadership gap semantics, draft-plan approval, reference-plan freeze, and productive import behavior.
