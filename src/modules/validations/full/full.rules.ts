import type { ShiftCoverageResult } from "../coverage/coverage.types";
import type { ShiftQualificationResult } from "../qualification/qualification.types";
import type {
  FullValidationIssue,
  FullValidationOverallStatus,
} from "./full.types";

export function calculateOverallStatus(
  coverage: ShiftCoverageResult,
  qualification: ShiftQualificationResult,
  issues: FullValidationIssue[] = []
): FullValidationOverallStatus {
  if (
    coverage.status === "understaffed" ||
    qualification.status === "underqualified"
  ) {
    return "critical";
  }

  if (coverage.status === "overstaffed") {
    return "warning";
  }

  if (issues.some((issue) => issue.severity === "warning")) {
    return "warning";
  }

  return "ok";
}

export function aggregateFullValidationIssues(
  coverage: ShiftCoverageResult,
  qualification: ShiftQualificationResult,
  qualificationFunctionIssues: FullValidationIssue[] = []
): FullValidationIssue[] {
  const coverageIssues: FullValidationIssue[] = coverage.issues.map((issue) => ({
    ...issue,
    source: "coverage",
  }));

  const qualificationIssues: FullValidationIssue[] = qualification.issues.map(
    (issue) => ({
      ...issue,
      source: "qualification",
    })
  );

  return [
    ...coverageIssues,
    ...qualificationIssues,
    ...qualificationFunctionIssues,
  ];
}

function getSeverityPriority(severity: string): number {
  switch (severity) {
    case "critical":
      return 1;
    case "warning":
      return 2;
    case "info":
      return 3;
    default:
      return 99;
  }
}

export function sortIssuesBySeverity(
  issues: FullValidationIssue[]
): FullValidationIssue[] {
  return [...issues].sort(
    (a, b) => getSeverityPriority(a.severity) - getSeverityPriority(b.severity)
  );
}

export function calculateIssueCount(issues: FullValidationIssue[]): number {
  return issues.length;
}

export function calculateHasCriticalIssues(
  issues: FullValidationIssue[]
): boolean {
  return issues.some((issue) => issue.severity === "critical");
}
