import { describe, expect, it } from "vitest";
import { deriveLeadershipGapSeverity } from "./leadership-gap-severity";
import type { LeadershipGapSeverityInput } from "./leadership-gap-severity";

function gap(
  input: Partial<LeadershipGapSeverityInput>
): LeadershipGapSeverityInput {
  return {
    primaryCause: "none",
    effectiveCoverageGap: 0,
    effectiveQualificationGap: 0,
    ...input,
  };
}

describe("deriveLeadershipGapSeverity", () => {
  it("returns none for a gap without cause or effective gaps", () => {
    expect(deriveLeadershipGapSeverity(gap({ primaryCause: "none" }))).toBe(
      "none"
    );
  });

  it("returns critical for an operational coverage gap", () => {
    expect(
      deriveLeadershipGapSeverity(
        gap({
          primaryCause: "operational",
          effectiveCoverageGap: 1,
        })
      )
    ).toBe("critical");
  });

  it("returns critical for an absence-driven coverage gap", () => {
    expect(
      deriveLeadershipGapSeverity(
        gap({
          primaryCause: "absence",
          effectiveCoverageGap: 1,
        })
      )
    ).toBe("critical");
  });

  it("returns critical for an operational qualification gap", () => {
    expect(
      deriveLeadershipGapSeverity(
        gap({
          primaryCause: "operational",
          effectiveQualificationGap: 1,
        })
      )
    ).toBe("critical");
  });

  it("returns attention for request context without effective gaps", () => {
    expect(
      deriveLeadershipGapSeverity(gap({ primaryCause: "request_context" }))
    ).toBe("attention");
  });

  it("returns critical for mixed causes with an effective coverage gap", () => {
    expect(
      deriveLeadershipGapSeverity(
        gap({
          primaryCause: "mixed",
          effectiveCoverageGap: 1,
        })
      )
    ).toBe("critical");
  });

  it("returns attention for mixed causes without effective gaps", () => {
    expect(deriveLeadershipGapSeverity(gap({ primaryCause: "mixed" }))).toBe(
      "attention"
    );
  });
});
