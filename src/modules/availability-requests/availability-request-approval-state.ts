import type { AvailabilityRequestStatus } from "./availability-requests.types";

export type AvailabilityRequestApprovalState =
  | "open_for_leadership_review"
  | "reviewed_by_leadership"
  | "decision_made";

export function deriveAvailabilityRequestApprovalState(
  status: AvailabilityRequestStatus
): AvailabilityRequestApprovalState {
  switch (status) {
    case "submitted":
      return "open_for_leadership_review";
    case "reviewed":
      return "reviewed_by_leadership";
    case "approved":
    case "rejected":
      return "decision_made";
    default:
      // Keep exhaustive switch for future status values.
      return "open_for_leadership_review";
  }
}
