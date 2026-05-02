export type PlanningPublicationState =
  | "working_draft"
  | "published_reference"
  | "unknown_status";

export function derivePlanningPublicationState(
  status: string
): PlanningPublicationState {
  if (status === "draft") {
    return "working_draft";
  }

  if (status === "published" || status === "reference") {
    return "published_reference";
  }

  return "unknown_status";
}