import type { GapPrimaryCause } from "../shared/gap-interpretation/gap-interpretation";

export type LeadershipGapSeverity = "none" | "attention" | "critical";

export interface LeadershipGapSeverityInput {
  primaryCause: GapPrimaryCause;
  effectiveCoverageGap: number;
  effectiveQualificationGap: number;
}

export function deriveLeadershipGapSeverity(
  gap: LeadershipGapSeverityInput
): LeadershipGapSeverity {
  if (gap.effectiveCoverageGap > 0 || gap.effectiveQualificationGap > 0) {
    return "critical";
  }

  if (gap.primaryCause === "none") {
    return "none";
  }

  return "attention";
}
