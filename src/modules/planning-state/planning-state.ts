export type ImportedPlanState = "not_available" | "available";
export type DraftPlanState = "not_available" | "available";
export type ReferencePlanState = "not_available" | "frozen";
export type OperationalPlanState = "not_available" | "available";
export type ActualStateState = "not_computed" | "computable" | "computed";
export type ClosedPeriodState = "not_closed" | "closed";

export interface PlanningStateReadModel {
  importedPlan: { state: ImportedPlanState };
  draftPlan: { state: DraftPlanState };
  referencePlan: { state: ReferencePlanState };
  operationalPlan: { state: OperationalPlanState };
  actualState: { state: ActualStateState };
  closedPeriod: { state: ClosedPeriodState };
}

export interface DerivePlanningStateInput {
  hasImportedPlan?: boolean;
  hasPlanningMonth?: boolean;
  planningDayCount?: number;
  planningShiftTemplateCount?: number;
  operationalShiftCount?: number;
  hasFrozenReferencePlan?: boolean;
  hasComputedActualState?: boolean;
  isClosedPeriod?: boolean;
}

export function derivePlanningState(
  input: DerivePlanningStateInput
): PlanningStateReadModel {
  const planningDayCount = input.planningDayCount ?? 0;
  const planningShiftTemplateCount = input.planningShiftTemplateCount ?? 0;
  const operationalShiftCount = input.operationalShiftCount ?? 0;
  const hasDraftStructure =
    input.hasPlanningMonth === true &&
    (planningDayCount > 0 || planningShiftTemplateCount > 0);

  return {
    importedPlan: {
      state: input.hasImportedPlan === true ? "available" : "not_available",
    },
    draftPlan: {
      state: hasDraftStructure ? "available" : "not_available",
    },
    referencePlan: {
      state: input.hasFrozenReferencePlan === true ? "frozen" : "not_available",
    },
    operationalPlan: {
      state: operationalShiftCount > 0 ? "available" : "not_available",
    },
    actualState: {
      state: deriveActualState({
        operationalShiftCount,
        hasComputedActualState: input.hasComputedActualState,
      }),
    },
    closedPeriod: {
      state: input.isClosedPeriod === true ? "closed" : "not_closed",
    },
  };
}

function deriveActualState(input: {
  operationalShiftCount: number;
  hasComputedActualState?: boolean;
}): ActualStateState {
  if (input.hasComputedActualState === true) {
    return "computed";
  }

  if (input.operationalShiftCount > 0) {
    return "computable";
  }

  return "not_computed";
}
