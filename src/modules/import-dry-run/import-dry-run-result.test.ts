import { describe, expect, it } from "vitest";
import { buildImportDryRunResult } from "./import-dry-run-result";
import type {
  DraftPlanCandidatePreview,
  ImportDryRunIssue,
  ImportDryRunPeriod,
  ImportDryRunRow,
  ImportDryRunSource,
} from "./import-dry-run.types";

const source: ImportDryRunSource = {
  sourceType: "structured_json",
  sourceSystemName: "ExampleRosterSystem",
};

const period: ImportDryRunPeriod = {
  startDate: "2026-06-01",
  endDate: "2026-06-30",
};

const rows: ImportDryRunRow[] = [
  {
    rowIndex: 0,
    externalRowId: "row-1",
    rawRow: { employee: "E-1" },
    mappedRow: { employeeId: 1 },
  },
];

function buildIssue(
  severity: ImportDryRunIssue["severity"],
  blocking: boolean
): ImportDryRunIssue {
  return {
    severity,
    code: `IMPORT_${severity.toUpperCase()}`,
    message: `${severity} issue`,
    blocking,
  };
}

describe("buildImportDryRunResult", () => {
  it("returns valid when there are no issues", () => {
    const result = buildImportDryRunResult({
      source,
      period,
      rows,
      issues: [],
    });

    expect(result.status).toBe("valid");
  });

  it("keeps info-only issues valid", () => {
    const result = buildImportDryRunResult({
      source,
      period,
      rows,
      issues: [buildIssue("info", false)],
    });

    expect(result.status).toBe("valid");
  });

  it("marks warning issues as valid with warnings", () => {
    const result = buildImportDryRunResult({
      source,
      period,
      rows,
      issues: [buildIssue("warning", false)],
    });

    expect(result.status).toBe("valid_with_warnings");
  });

  it("marks blocking errors as invalid", () => {
    const result = buildImportDryRunResult({
      source,
      period,
      rows,
      issues: [buildIssue("error", true)],
    });

    expect(result.status).toBe("invalid");
  });

  it("marks non-blocking errors as valid with warnings", () => {
    const result = buildImportDryRunResult({
      source,
      period,
      rows,
      issues: [buildIssue("error", false)],
    });

    expect(result.status).toBe("valid_with_warnings");
  });

  it("always returns non-writing dry-run effects", () => {
    const result = buildImportDryRunResult({
      source,
      period,
      rows,
      issues: [],
    });

    expect(result.writes).toEqual({
      createsOperationalShifts: false,
      createsAssignments: false,
      createsReferencePlan: false,
      overwritesPlanningMonth: false,
      writesAbsences: false,
      changesOperationalPlan: false,
    });
  });

  it("keeps rows and issues unchanged", () => {
    const issues = [buildIssue("warning", false)];
    const result = buildImportDryRunResult({
      source,
      period,
      rows,
      issues,
    });

    expect(result.rows).toBe(rows);
    expect(result.issues).toBe(issues);
  });

  it("keeps draft plan candidate as a non-persisted preview", () => {
    const draftPlanCandidate: DraftPlanCandidatePreview = {
      isPersisted: false,
      isApproved: false,
      isReferencePlan: false,
      period,
      summary: {
        plannedRows: 1,
      },
    };

    const result = buildImportDryRunResult({
      source,
      period,
      rows,
      issues: [],
      draftPlanCandidate,
    });

    expect(result.draftPlanCandidate).toBe(draftPlanCandidate);
    expect(result.draftPlanCandidate).toMatchObject({
      isPersisted: false,
      isApproved: false,
      isReferencePlan: false,
    });
  });
});
