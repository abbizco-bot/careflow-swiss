# ADR-060 Import Dry-Run Result Shape

## Status

Accepted

## Context

ADR-059 defines import mapping as a system-neutral dry-run process.

An import dry run:

- must not create operative `Shift` records
- must not create `Assignment` records
- must not create a `ReferencePlan`
- must not overwrite a `PlanningMonth`
- must not change the operative plan state
- only supports normalization, mapping checks, and validation of external data

Polypoint is one possible example of an external system. It is not the standard or reference model for CareFlow.

The current codebase still has no productive import implementation. This ADR documents the planned result shape before technical import types, parsers, routes, services, or persistence are introduced.

## Decision

CareFlow defines a system-neutral target shape for future import dry-run inputs, results, issues, and optional draft-plan previews.

This shape is a fachliches target model. It is not yet a final public API contract.

This ADR does not introduce code, database changes, types, services, parsers, routes, tests, or stash integration.

## ImportDryRunInput

A future dry run needs at least source information, a period, mapping context, data rows, and optional metadata.

```ts
importDryRunInput: {
  source: {
    sourceType: "csv" | "excel" | "api_export" | "structured_json" | "unknown";
    sourceSystemName?: string;
    sourceFileName?: string;
    sourceFormatVersion?: string;
    importedAt?: string;
  };
  period: {
    startDate: string;
    endDate: string;
  };
  mapping: {
    mappingProfileId?: string;
    inlineMappingProfile?: MappingProfilePreview;
  };
  data: {
    rawRows?: unknown[];
    normalizedRows?: unknown[];
  };
  metadata?: Record<string, unknown>;
}
```

`sourceSystemName` is descriptive, not controlling.

No external system receives special status in the CareFlow core model.

CSV is one possible format, but it is not the standard of the fachliches model.

`structured_json` and `api_export` remain system-neutral source types.

## ImportDryRunResult

The result must be read-only and explicitly non-productive.

```ts
importDryRunResult: {
  status: "valid" | "valid_with_warnings" | "invalid";
  source: {...};
  period: {...};
  summary: {
    rowCount: number;
    mappedRowCount: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
    unmappedEmployeeCount?: number;
    unmappedShiftTypeCount?: number;
  };
  rows: ImportDryRunRow[];
  issues: ImportDryRunIssue[];
  draftPlanCandidate?: DraftPlanCandidatePreview;
  writes: {
    createsOperationalShifts: false;
    createsAssignments: false;
    createsReferencePlan: false;
    overwritesPlanningMonth: false;
    writesAbsences: false;
    changesOperationalPlan: false;
  };
}
```

The `writes` object is mandatory.

All values in the `writes` object are `false` in a dry run.

This keeps visible that no operative effect has occurred.

`status: "valid"` means technically and fachlich checkable. It does not mean approved.

`status: "valid_with_warnings"` does not mean approved.

`status: "invalid"` means blocking problems exist.

## ImportDryRunIssue

Issues should be explainable, row-related, and mapping-related.

```ts
issue: {
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
  blocking: boolean;
  rowRef?: {
    rowIndex?: number;
    externalRowId?: string;
  };
  fieldRef?: {
    rawFieldName?: string;
    normalizedFieldName?: string;
    careflowField?: string;
  };
  rawValue?: unknown;
  mappedValue?: unknown;
  mappingDimension?:
    | "employee"
    | "shift_type"
    | "qualification"
    | "daily_function"
    | "absence"
    | "status"
    | "area"
    | "date_time"
    | "source_metadata";
}
```

An `error` may be blocking.

A `warning` is review-relevant, but not necessarily blocking.

An `info` supports traceability.

The `blocking` flag determines whether a later `DraftPlanCandidate` may be produced from the result.

## Mapping Dimensions

Mapping dimensions must remain system-neutral:

- `employee`
- `shift_type`
- `qualification`
- `daily_function`
- `absence`
- `status`
- `area`
- `date_time`
- `source_metadata`

These dimensions must not be named after a single external system or one CSV layout.

## DraftPlanCandidatePreview

`DraftPlanCandidatePreview` is optional.

The first technical dry run does not need to produce it.

The safest first technical step is `mappedRows`, `issues`, and `summary`.

If `DraftPlanCandidatePreview` is later included, it must be clear that:

- `isPersisted` is `false`
- `isApproved` is `false`
- `isReferencePlan` is `false`
- it creates no operative `Shift` records
- it creates no `Assignment` records
- it creates no `ReferencePlan`

`DraftPlanCandidatePreview` is a preview. It is not a real `DraftPlan`.

## Example

```json
{
  "status": "valid_with_warnings",
  "source": {
    "sourceType": "csv",
    "sourceSystemName": "ExampleRosterSystem",
    "sourceFileName": "june-plan.csv"
  },
  "period": {
    "startDate": "2026-06-01",
    "endDate": "2026-06-30"
  },
  "summary": {
    "rowCount": 42,
    "mappedRowCount": 41,
    "errorCount": 0,
    "warningCount": 1,
    "infoCount": 0,
    "unmappedEmployeeCount": 1
  },
  "rows": [],
  "issues": [
    {
      "severity": "warning",
      "code": "IMPORT_UNMAPPED_EMPLOYEE",
      "message": "External employee could not be mapped to a CareFlow employee.",
      "blocking": false,
      "rowRef": {
        "rowIndex": 17,
        "externalRowId": "row-18"
      },
      "fieldRef": {
        "rawFieldName": "employee_code",
        "careflowField": "employeeId"
      },
      "rawValue": "EXT-441",
      "mappingDimension": "employee"
    }
  ],
  "writes": {
    "createsOperationalShifts": false,
    "createsAssignments": false,
    "createsReferencePlan": false,
    "overwritesPlanningMonth": false,
    "writesAbsences": false,
    "changesOperationalPlan": false
  }
}
```

This example is illustrative documentation. It is not a final API contract.

## Boundaries

`ImportDryRunResult` is not a productive import.

`ImportDryRunResult` is not a `DraftPlan`.

`ImportDryRunResult` is not a `ReferencePlan`.

`ImportDryRunResult` is not an operative plan change.

`ImportDryRunResult` is not an approval.

`ImportDryRunResult` is not a recommendation.

`ImportDryRunResult` must not imply a database mutation.

## Risks

The main risks are:

- dry run appears in UI or API like a productive import
- `DraftPlanCandidate` is read as a real `DraftPlan`
- validations are misunderstood as automatic approval
- source-specific fields leak into core models
- CSV or one external system accidentally becomes the standard
- the result model is frozen too early as a stable public API contract
- the result becomes too large if raw data, normalization, mapping, and issues are returned without filtering

## Consequences

ADR-060 is a target model for a later result shape, not a final API contract.

The next technical step may be at most a type or helper sketch.

There should be no parser yet.

There should be no upload route yet.

There should be no database persistence yet.

There should be no operative `Shift` creation.

There should be no `DraftPlan` creation.

There should be no `ReferencePlan` creation.

There should be no stash integration without a separate boundary review.

## Summary

The future import dry-run result should make mapping, validation, warnings, and non-write semantics explicit.

The mandatory `writes` object protects the boundary between read-only import review and productive planning changes.
