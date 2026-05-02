import type { LeadershipGapSeverity } from "./leadership-gap-severity";

export type LeadershipVisibilityContext =
  | "no_visibility_action"
  | "internal_leadership_context"
  | "employee_visible_context"
  | "publication_relevant_context";

export interface LeadershipVisibilityContextInput {
  gapSeverity: LeadershipGapSeverity;
  hasRequestContext: boolean;
  hasAbsenceDrivenGap: boolean;
  hasQualificationWarning: boolean;
}

export function deriveLeadershipVisibilityContext(
  input: LeadershipVisibilityContextInput
): LeadershipVisibilityContext {
  if (input.gapSeverity === "critical") {
    return "publication_relevant_context";
  }

  if (input.hasRequestContext && input.gapSeverity === "none") {
    return "employee_visible_context";
  }

  if (
    input.hasAbsenceDrivenGap ||
    input.hasQualificationWarning ||
    input.gapSeverity === "attention"
  ) {
    return "internal_leadership_context";
  }

  return "no_visibility_action";
}
