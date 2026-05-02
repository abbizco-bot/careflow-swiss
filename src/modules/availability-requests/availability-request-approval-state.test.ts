import { describe, expect, it } from "vitest";
import {
  deriveAvailabilityRequestApprovalState,
  type AvailabilityRequestApprovalState,
} from "./availability-request-approval-state";

describe("deriveAvailabilityRequestApprovalState", () => {
  it("maps submitted to open_for_leadership_review", () => {
    expect(deriveAvailabilityRequestApprovalState("submitted")).toBe(
      "open_for_leadership_review"
    );
  });

  it("maps reviewed to reviewed_by_leadership", () => {
    expect(deriveAvailabilityRequestApprovalState("reviewed")).toBe(
      "reviewed_by_leadership"
    );
  });

  it("maps approved to decision_made", () => {
    expect(deriveAvailabilityRequestApprovalState("approved")).toBe(
      "decision_made"
    );
  });

  it("maps rejected to decision_made", () => {
    expect(deriveAvailabilityRequestApprovalState("rejected")).toBe(
      "decision_made"
    );
  });
});
