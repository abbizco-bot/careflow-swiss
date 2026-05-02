import { describe, expect, it } from "vitest";
import {
  deriveLeadershipVisibilityContext,
  type LeadershipVisibilityContextInput,
} from "./visibility-context";

type PartialContextInput = Partial<LeadershipVisibilityContextInput>;

function input(overrides: PartialContextInput = {}): LeadershipVisibilityContextInput {
  return {
    gapSeverity: "none",
    hasRequestContext: false,
    hasAbsenceDrivenGap: false,
    hasQualificationWarning: false,
    ...overrides,
  };
}

describe("deriveLeadershipVisibilityContext", () => {
  it("returns no_visibility_action for stable days without requests or warnings", () => {
    expect(deriveLeadershipVisibilityContext(input())).toBe(
      "no_visibility_action"
    );
  });

  it("returns internal_leadership_context for tense or attention-level situations", () => {
    expect(
      deriveLeadershipVisibilityContext(input({ gapSeverity: "attention" }))
    ).toBe("internal_leadership_context");
  });

  it("returns publication_relevant_context for critical situations", () => {
    expect(
      deriveLeadershipVisibilityContext(input({ gapSeverity: "critical" }))
    ).toBe("publication_relevant_context");
  });

  it("returns internal_leadership_context for absence-driven warning without gap severity", () => {
    expect(
      deriveLeadershipVisibilityContext(
        input({ hasAbsenceDrivenGap: true, gapSeverity: "none" })
      )
    ).toBe("internal_leadership_context");
  });

  it("returns internal_leadership_context for qualification warning without gap severity", () => {
    expect(
      deriveLeadershipVisibilityContext(
        input({ hasQualificationWarning: true, gapSeverity: "none" })
      )
    ).toBe("internal_leadership_context");
  });

  it("returns employee_visible_context for request-related visibility without actual gaps", () => {
    expect(
      deriveLeadershipVisibilityContext(
        input({ hasRequestContext: true, gapSeverity: "none" })
      )
    ).toBe("employee_visible_context");
  });
});
