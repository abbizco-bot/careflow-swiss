import type {
  DraftPlanCandidatePreview,
  ImportDryRunIssue,
  ImportDryRunPeriod,
  ImportDryRunResult,
  ImportDryRunRow,
  ImportDryRunSource,
  ImportDryRunStatus,
  ImportDryRunSummary,
  ImportDryRunWrites,
} from "./import-dry-run.types";

export interface BuildImportDryRunResultInput {
  source: ImportDryRunSource;
  period: ImportDryRunPeriod;
  rows: ImportDryRunRow[];
  issues: ImportDryRunIssue[];
  summary?: ImportDryRunSummary;
  draftPlanCandidate?: DraftPlanCandidatePreview;
}

export function buildImportDryRunResult(
  input: BuildImportDryRunResultInput
): ImportDryRunResult {
  return {
    status: deriveImportDryRunStatus(input.issues),
    source: input.source,
    period: input.period,
    summary: input.summary ?? buildImportDryRunSummary(input.rows, input.issues),
    rows: input.rows,
    issues: input.issues,
    ...(input.draftPlanCandidate
      ? { draftPlanCandidate: input.draftPlanCandidate }
      : {}),
    writes: buildImportDryRunWrites(),
  };
}

function deriveImportDryRunStatus(
  issues: ImportDryRunIssue[]
): ImportDryRunStatus {
  if (
    issues.some(
      (issue) => issue.severity === "error" && issue.blocking === true
    )
  ) {
    return "invalid";
  }

  if (
    issues.some(
      (issue) => issue.severity === "warning" || issue.severity === "error"
    )
  ) {
    return "valid_with_warnings";
  }

  return "valid";
}

function buildImportDryRunSummary(
  rows: ImportDryRunRow[],
  issues: ImportDryRunIssue[]
): ImportDryRunSummary {
  return {
    rowCount: rows.length,
    mappedRowCount: rows.filter((row) => row.mappedRow !== undefined).length,
    errorCount: countIssuesBySeverity(issues, "error"),
    warningCount: countIssuesBySeverity(issues, "warning"),
    infoCount: countIssuesBySeverity(issues, "info"),
  };
}

function countIssuesBySeverity(
  issues: ImportDryRunIssue[],
  severity: ImportDryRunIssue["severity"]
): number {
  return issues.filter((issue) => issue.severity === severity).length;
}

function buildImportDryRunWrites(): ImportDryRunWrites {
  return {
    createsOperationalShifts: false,
    createsAssignments: false,
    createsReferencePlan: false,
    overwritesPlanningMonth: false,
    writesAbsences: false,
    changesOperationalPlan: false,
  };
}
