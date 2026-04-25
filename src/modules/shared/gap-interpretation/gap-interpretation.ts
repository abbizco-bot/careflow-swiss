export type GapInterpretationSignalCode =
  | "effective_coverage_gap"
  | "effective_qualification_gap"
  | "absence_driven_coverage_gap"
  | "absence_driven_qualification_gap"
  | "operational_coverage_gap"
  | "operational_qualification_gap"
  | "request_context_only";

export type GapPrimaryCause =
  | "none"
  | "operational"
  | "absence"
  | "request_context"
  | "mixed";

export interface GapInterpretationInput {
  requiredCount: number;
  requiredQualifiedCount: number;
  assignedCount: number;
  availableAssignedCount: number;
  absentAssignedCount: number;
  qualifiedAssignedCount: number;
  availableQualifiedCount: number;
  hasRequestContext: boolean;
}

export interface GapInterpretationSignal {
  code: GapInterpretationSignalCode;
  requiredCount?: number;
  assignedCount?: number;
  availableAssignedCount?: number;
  absentAssignedCount?: number;
  requiredQualifiedCount?: number;
  qualifiedAssignedCount?: number;
  availableQualifiedCount?: number;
  effectiveCoverageGap?: number;
  effectiveQualificationGap?: number;
}

export interface GapInterpretationResult {
  gapSignals: GapInterpretationSignal[];
  effectiveCoverageGap: number;
  effectiveQualificationGap: number;
  primaryGapCause: GapPrimaryCause;
  primaryGapSignals: GapInterpretationSignalCode[];
}

export function interpretOperationalGap(
  input: GapInterpretationInput
): GapInterpretationResult {
  const effectiveCoverageGap = Math.max(
    0,
    input.requiredCount - input.availableAssignedCount
  );
  const effectiveQualificationGap = Math.max(
    0,
    input.requiredQualifiedCount - input.availableQualifiedCount
  );
  const gapSignals: GapInterpretationSignal[] = [];

  if (effectiveCoverageGap > 0) {
    gapSignals.push({
      code: "effective_coverage_gap",
      requiredCount: input.requiredCount,
      assignedCount: input.assignedCount,
      availableAssignedCount: input.availableAssignedCount,
      absentAssignedCount: input.absentAssignedCount,
      effectiveCoverageGap,
    });

    if (input.assignedCount < input.requiredCount) {
      gapSignals.push({
        code: "operational_coverage_gap",
        requiredCount: input.requiredCount,
        assignedCount: input.assignedCount,
        availableAssignedCount: input.availableAssignedCount,
        effectiveCoverageGap,
      });
    } else if (input.absentAssignedCount > 0) {
      gapSignals.push({
        code: "absence_driven_coverage_gap",
        requiredCount: input.requiredCount,
        assignedCount: input.assignedCount,
        availableAssignedCount: input.availableAssignedCount,
        absentAssignedCount: input.absentAssignedCount,
        effectiveCoverageGap,
      });
    }
  }

  if (effectiveQualificationGap > 0) {
    gapSignals.push({
      code: "effective_qualification_gap",
      requiredQualifiedCount: input.requiredQualifiedCount,
      qualifiedAssignedCount: input.qualifiedAssignedCount,
      availableQualifiedCount: input.availableQualifiedCount,
      effectiveQualificationGap,
    });

    if (input.qualifiedAssignedCount < input.requiredQualifiedCount) {
      gapSignals.push({
        code: "operational_qualification_gap",
        requiredQualifiedCount: input.requiredQualifiedCount,
        qualifiedAssignedCount: input.qualifiedAssignedCount,
        availableQualifiedCount: input.availableQualifiedCount,
        effectiveQualificationGap,
      });
    } else if (input.absentAssignedCount > 0) {
      gapSignals.push({
        code: "absence_driven_qualification_gap",
        requiredQualifiedCount: input.requiredQualifiedCount,
        qualifiedAssignedCount: input.qualifiedAssignedCount,
        availableQualifiedCount: input.availableQualifiedCount,
        effectiveQualificationGap,
      });
    }
  }

  if (input.hasRequestContext) {
    gapSignals.push({
      code: "request_context_only",
    });
  }

  return {
    gapSignals,
    effectiveCoverageGap,
    effectiveQualificationGap,
    ...derivePrimaryGapInterpretation(gapSignals),
  };
}

function derivePrimaryGapInterpretation(
  gapSignals: GapInterpretationSignal[]
): Pick<GapInterpretationResult, "primaryGapCause" | "primaryGapSignals"> {
  const primaryGapSignals: GapInterpretationSignalCode[] = [];
  const causeClasses = new Set<Exclude<GapPrimaryCause, "none" | "mixed">>();

  if (
    gapSignals.some((gapSignal) =>
      isOperationalPrimaryGapSignal(gapSignal.code)
    )
  ) {
    causeClasses.add("operational");
    addPrimaryGapSignals(
      primaryGapSignals,
      gapSignals,
      isOperationalPrimaryGapSignal
    );
  }

  if (gapSignals.some((gapSignal) => isAbsencePrimaryGapSignal(gapSignal.code))) {
    causeClasses.add("absence");
    addPrimaryGapSignals(
      primaryGapSignals,
      gapSignals,
      isAbsencePrimaryGapSignal
    );
  }

  if (gapSignals.some((gapSignal) => gapSignal.code === "request_context_only")) {
    causeClasses.add("request_context");
    primaryGapSignals.push("request_context_only");
  }

  return {
    primaryGapCause: derivePrimaryGapCause(causeClasses),
    primaryGapSignals: [...new Set(primaryGapSignals)],
  };
}

function addPrimaryGapSignals(
  target: GapInterpretationSignalCode[],
  gapSignals: GapInterpretationSignal[],
  predicate: (code: GapInterpretationSignalCode) => boolean
): void {
  for (const gapSignal of gapSignals) {
    if (predicate(gapSignal.code)) {
      target.push(gapSignal.code);
    }
  }
}

function derivePrimaryGapCause(
  causeClasses: Set<Exclude<GapPrimaryCause, "none" | "mixed">>
): GapPrimaryCause {
  if (causeClasses.size === 0) {
    return "none";
  }

  if (causeClasses.size > 1) {
    return "mixed";
  }

  return [...causeClasses][0];
}

function isOperationalPrimaryGapSignal(
  code: GapInterpretationSignalCode
): boolean {
  return (
    code === "operational_coverage_gap" ||
    code === "operational_qualification_gap"
  );
}

function isAbsencePrimaryGapSignal(code: GapInterpretationSignalCode): boolean {
  return (
    code === "absence_driven_coverage_gap" ||
    code === "absence_driven_qualification_gap"
  );
}
