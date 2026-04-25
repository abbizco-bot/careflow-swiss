import { describe, expect, it } from "vitest";
import { interpretOperationalGap } from "./gap-interpretation";

const stableInput = {
  requiredCount: 2,
  requiredQualifiedCount: 1,
  assignedCount: 2,
  availableAssignedCount: 2,
  absentAssignedCount: 0,
  qualifiedAssignedCount: 1,
  availableQualifiedCount: 1,
  hasRequestContext: false,
};

describe("interpretOperationalGap", () => {
  it("returns no primary cause for a fully covered shift without request context", () => {
    const result = interpretOperationalGap(stableInput);

    expect(result).toMatchObject({
      effectiveCoverageGap: 0,
      effectiveQualificationGap: 0,
      primaryGapCause: "none",
      primaryGapSignals: [],
      gapSignals: [],
    });
  });

  it("separates operational coverage gaps from absence-driven coverage gaps", () => {
    const result = interpretOperationalGap({
      ...stableInput,
      assignedCount: 1,
      availableAssignedCount: 1,
    });

    expect(result.primaryGapCause).toBe("operational");
    expect(result.primaryGapSignals).toEqual(["operational_coverage_gap"]);
    expect(result.gapSignals.map((signal) => signal.code)).toEqual([
      "effective_coverage_gap",
      "operational_coverage_gap",
    ]);
  });

  it("marks an absence-driven coverage gap only when planned staffing would have met demand", () => {
    const result = interpretOperationalGap({
      ...stableInput,
      assignedCount: 2,
      availableAssignedCount: 1,
      absentAssignedCount: 1,
    });

    expect(result.primaryGapCause).toBe("absence");
    expect(result.primaryGapSignals).toEqual(["absence_driven_coverage_gap"]);
    expect(result.gapSignals.map((signal) => signal.code)).toEqual([
      "effective_coverage_gap",
      "absence_driven_coverage_gap",
    ]);
  });

  it("marks absence-driven qualification gaps without treating effective state as cause", () => {
    const result = interpretOperationalGap({
      ...stableInput,
      assignedCount: 2,
      availableAssignedCount: 1,
      absentAssignedCount: 1,
      qualifiedAssignedCount: 1,
      availableQualifiedCount: 0,
    });

    expect(result.primaryGapCause).toBe("absence");
    expect(result.primaryGapSignals).toEqual([
      "absence_driven_coverage_gap",
      "absence_driven_qualification_gap",
    ]);
    expect(result.gapSignals.map((signal) => signal.code)).toEqual([
      "effective_coverage_gap",
      "absence_driven_coverage_gap",
      "effective_qualification_gap",
      "absence_driven_qualification_gap",
    ]);
  });

  it("keeps request context read-only and marks it as mixed with operational causes", () => {
    const result = interpretOperationalGap({
      ...stableInput,
      assignedCount: 1,
      availableAssignedCount: 1,
      hasRequestContext: true,
    });

    expect(result.primaryGapCause).toBe("mixed");
    expect(result.primaryGapSignals).toEqual([
      "operational_coverage_gap",
      "request_context_only",
    ]);
    expect(result.gapSignals.map((signal) => signal.code)).toContain(
      "request_context_only"
    );
  });

  it("uses request_context as the primary cause only when no other cause exists", () => {
    const result = interpretOperationalGap({
      ...stableInput,
      hasRequestContext: true,
    });

    expect(result).toMatchObject({
      effectiveCoverageGap: 0,
      effectiveQualificationGap: 0,
      primaryGapCause: "request_context",
      primaryGapSignals: ["request_context_only"],
    });
    expect(result.gapSignals.map((signal) => signal.code)).toEqual([
      "request_context_only",
    ]);
  });
});
