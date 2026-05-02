import { describe, expect, it } from "vitest";
import { buildLeadershipDayHeadline } from "./leadership-view.service";

function baselineValidation() {
  return {
    coverage: { status: "ok" },
    qualification: { status: "qualified" },
    issues: [],
  };
}

function baselineShiftSignal() {
  return {
    shiftId: 1,
    shiftType: "early",
    requiredCount: 1,
    assignedPlanned: 1,
    assignedEffective: 1,
    sickCount: 0,
    requestedCount: 0,
    gapContext: {
      gapSignals: [],
      effectiveCoverageGap: 0,
      effectiveQualificationGap: 0,
      primaryGapCause: "none",
      primaryGapSignals: [],
    },
  };
}

describe("buildLeadershipDayHeadline visibility context", () => {
  it("derives no_visibility_action for a stable day", () => {
    const headline = buildLeadershipDayHeadline({
      shiftSignals: [baselineShiftSignal()],
      fullValidations: [baselineValidation()],
    });

    expect(headline.visibilityContext).toBe("no_visibility_action");
  });

  it("derives employee_visible_context for a request-context day", () => {
    const headline = buildLeadershipDayHeadline({
      shiftSignals: [
        {
          ...baselineShiftSignal(),
          requestedCount: 1,
        },
      ],
      fullValidations: [baselineValidation()],
    });

    expect(headline.visibilityContext).toBe("employee_visible_context");
  });

  it("derives publication_relevant_context for a critical day", () => {
    const headline = buildLeadershipDayHeadline({
      shiftSignals: [
        {
          ...baselineShiftSignal(),
          gapContext: {
            gapSignals: [],
            effectiveCoverageGap: 1,
            effectiveQualificationGap: 0,
            primaryGapCause: "operational",
            primaryGapSignals: [],
          },
        },
      ],
      fullValidations: [
        {
          coverage: { status: "understaffed" },
          qualification: { status: "qualified" },
          issues: [],
        },
      ],
    });

    expect(headline.visibilityContext).toBe("publication_relevant_context");
  });
});
