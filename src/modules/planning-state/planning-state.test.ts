import { describe, expect, it } from "vitest";
import { derivePlanningState } from "./planning-state";

describe("derivePlanningState", () => {
  it("returns unavailable states for empty input", () => {
    expect(derivePlanningState({})).toEqual({
      importedPlan: { state: "not_available" },
      draftPlan: { state: "not_available" },
      referencePlan: { state: "not_available" },
      operationalPlan: { state: "not_available" },
      actualState: { state: "not_computed" },
      closedPeriod: { state: "not_closed" },
    });
  });

  it("does not mark a planning month without days or templates as draft plan", () => {
    expect(
      derivePlanningState({
        hasPlanningMonth: true,
        planningDayCount: 0,
        planningShiftTemplateCount: 0,
      }).draftPlan
    ).toEqual({ state: "not_available" });
  });

  it("marks a planning month with planning days as draft plan", () => {
    expect(
      derivePlanningState({
        hasPlanningMonth: true,
        planningDayCount: 1,
      }).draftPlan
    ).toEqual({ state: "available" });
  });

  it("marks a planning month with shift templates as draft plan", () => {
    expect(
      derivePlanningState({
        hasPlanningMonth: true,
        planningShiftTemplateCount: 1,
      }).draftPlan
    ).toEqual({ state: "available" });
  });

  it("marks operational shifts as operational plan and actual state as computable", () => {
    const planningState = derivePlanningState({
      operationalShiftCount: 2,
    });

    expect(planningState.operationalPlan).toEqual({ state: "available" });
    expect(planningState.actualState).toEqual({ state: "computable" });
  });

  it("marks actual state as computed when explicitly provided", () => {
    expect(
      derivePlanningState({
        hasComputedActualState: true,
      }).actualState
    ).toEqual({ state: "computed" });
  });

  it("marks reference plan as frozen only when explicitly provided", () => {
    expect(
      derivePlanningState({
        hasFrozenReferencePlan: true,
      }).referencePlan
    ).toEqual({ state: "frozen" });
  });

  it("marks closed period only when explicitly provided", () => {
    expect(
      derivePlanningState({
        isClosedPeriod: true,
      }).closedPeriod
    ).toEqual({ state: "closed" });
  });

  it("does not interpret shift templates as a frozen reference plan", () => {
    const planningState = derivePlanningState({
      hasPlanningMonth: true,
      planningShiftTemplateCount: 3,
    });

    expect(planningState.draftPlan).toEqual({ state: "available" });
    expect(planningState.referencePlan).toEqual({ state: "not_available" });
  });

  it("has no finalized status input and does not infer closed period implicitly", () => {
    expect(
      derivePlanningState({
        hasPlanningMonth: true,
        planningDayCount: 31,
      }).closedPeriod
    ).toEqual({ state: "not_closed" });
  });
});
