import { describe, expect, it } from "vitest";
import { buildLeadershipDayHeadline } from "./leadership-view.service";
import type { GapInterpretationResult } from "../shared/gap-interpretation/gap-interpretation";
import type { QualificationStatus } from "../validations/qualification/qualification.types";

type HeadlineValidationFixture = {
  coverage: { status: string };
  qualification: { status: QualificationStatus };
  issues: [];
};

type ShiftSignalFixture = {
  shiftId: number;
  shiftType: string;
  requiredCount: number;
  assignedPlanned: number;
  assignedEffective: number;
  sickCount: number;
  requestedCount: number;
  gapContext: GapInterpretationResult;
};

function baselineValidation(): HeadlineValidationFixture {
  return {
    coverage: { status: "ok" },
    qualification: { status: "ok" },
    issues: [],
  };
}

function baselineShiftSignal(): ShiftSignalFixture {
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
          qualification: { status: "ok" },
          issues: [],
        },
      ],
    });

    expect(headline.visibilityContext).toBe("publication_relevant_context");
  });
});
