import { derivePlanningPublicationState } from "../planning-months/planning-publication-state";
import type {
  AvailabilityRequest,
  PlanningMonth,
  PlanningShiftTemplate,
} from "../../generated/prisma/client";
import { availabilityRequestsRepository } from "../availability-requests/availability-requests.repository";
import { derivePlanningState } from "../planning-state/planning-state";
import {
  buildShiftOperationalAvailabilityMap,
  type ShiftOperationalAvailability,
} from "../validations/availability/availability.service";
import { interpretOperationalGap } from "../shared/gap-interpretation/gap-interpretation";
import { planningComparisonRepository } from "./planning-comparison.repository";
import type {
  PlanningComparisonDay,
  PlanningComparisonGapSignal,
  PlanningComparisonOperationalShift,
  PlanningComparisonStatus,
  PlanningMonthComparison,
  PlanningMonthComparisonSummary,
} from "./planning-comparison.types";

type OperationalShiftWithAssignments = Awaited<
  ReturnType<typeof planningComparisonRepository.findOperationalShiftsByDateRange>
>[number];

type OperationalShiftComparisonEntry = Omit<
  PlanningComparisonOperationalShift,
  "primaryGapCause" | "primaryGapSignals"
> & {
  date: Date;
};

type PlanningMonthWithDays = PlanningMonth & {
  planningDays: Array<{
    id: number;
    date: Date;
    isSpecialDay: boolean;
    note: string | null;
    shiftTemplates: PlanningShiftTemplate[];
  }>;
};

export const planningComparisonService = {
  async getPlanningMonthComparison(
    planningMonthId: number
  ): Promise<PlanningMonthComparison> {
    const planningMonth =
      await planningComparisonRepository.findPlanningMonthById(planningMonthId);

    if (!planningMonth) {
      throw new Error(`PlanningMonth with id ${planningMonthId} not found`);
    }

    const range = buildMonthRange(planningMonth);
    const [operationalShifts, availabilityRequests] = await Promise.all([
      planningComparisonRepository.findOperationalShiftsByDateRange(
        range.startDate,
        range.endDate
      ),
      availabilityRequestsRepository.findByDateRange(
        range.startDate,
        range.endDate
      ),
    ]);
    const planningState = derivePlanningState({
      hasImportedPlan: false,
      hasPlanningMonth: true,
      planningDayCount: planningMonth.planningDays.length,
      planningShiftTemplateCount: countPlanningShiftTemplates(planningMonth),
      operationalShiftCount: operationalShifts.length,
      hasFrozenReferencePlan: false,
      isClosedPeriod: false,
    });
    const availabilityByShiftId =
      await buildShiftOperationalAvailabilityMap(operationalShifts);
    const operationalShiftsWithAvailability = operationalShifts.map((shift) =>
      buildOperationalShiftComparisonEntry(
        shift,
        availabilityByShiftId.get(shift.id)
      )
    );

    const days = planningMonth.planningDays.map((planningDay) =>
      buildPlanningComparisonDay(
        planningDay,
        operationalShiftsWithAvailability,
        availabilityRequests
      )
    );
    // Internal readiness signal only; intentionally not part of the API response yet.
    void planningState;

    return {
      planningMonth: {
        id: planningMonth.id,
        year: planningMonth.year,
        month: planningMonth.month,
        status: planningMonth.status,
        publicationState: derivePlanningPublicationState(planningMonth.status),
   },
      summary: buildPlanningMonthComparisonSummary(days),
      days,
    };
  },
};

function countPlanningShiftTemplates(planningMonth: PlanningMonthWithDays) {
  return planningMonth.planningDays.reduce(
    (total, planningDay) => total + planningDay.shiftTemplates.length,
    0
  );
}

function buildMonthRange(planningMonth: PlanningMonth) {
  const startDate = new Date(
    Date.UTC(planningMonth.year, planningMonth.month - 1, 1)
  );
  const endDate = new Date(Date.UTC(planningMonth.year, planningMonth.month, 1));

  return {
    startDate,
    endDate,
  };
}

function buildPlanningComparisonDay(
  planningDay: PlanningMonthWithDays["planningDays"][number],
  operationalShifts: OperationalShiftComparisonEntry[],
  availabilityRequests: AvailabilityRequest[]
): PlanningComparisonDay {
  const dateKey = toDateKey(planningDay.date);
  const dayOperationalShifts = operationalShifts.filter(
    (shift) => toDateKey(shift.date) === dateKey
  );
  const relevantAvailabilityRequestCount = availabilityRequests.filter((request) =>
    requestOverlapsDay(request, planningDay.date)
  ).length;
  const gapSignals = deriveGapSignals(
    planningDay.shiftTemplates,
    dayOperationalShifts,
    relevantAvailabilityRequestCount
  );

  return {
    date: dateKey,
    planningShiftTemplates: planningDay.shiftTemplates.map((template) => ({
      id: template.id,
      type: template.type,
      requiredCount: template.requiredCount,
      requiredQualifiedCount: template.requiredQualifiedCount,
      isCritical: template.isCritical,
    })),
    operationalShifts: dayOperationalShifts.map((shift) => {
      const primaryInterpretation = interpretOperationalShift(
        shift,
        relevantAvailabilityRequestCount > 0
      );

      return {
        id: shift.id,
        type: shift.type,
        requiredCount: shift.requiredCount,
        requiredQualifiedCount: shift.requiredQualifiedCount,
        assignedCount: shift.assignedCount,
        availableAssignedCount: shift.availableAssignedCount,
        absentAssignedCount: shift.absentAssignedCount,
        qualifiedAssignedCount: shift.qualifiedAssignedCount,
        availableQualifiedCount: shift.availableQualifiedCount,
        effectiveCoverageGap: shift.effectiveCoverageGap,
        effectiveQualificationGap: shift.effectiveQualificationGap,
        primaryGapCause: primaryInterpretation.primaryGapCause,
        primaryGapSignals: primaryInterpretation.primaryGapSignals,
      };
    }),
    relevantAvailabilityRequestCount,
    requestCount: relevantAvailabilityRequestCount,
    gapSignalCount: gapSignals.length,
    affectedShiftTypes: deriveAffectedShiftTypes(gapSignals),
    isSpecialDay: planningDay.isSpecialDay,
    planningNote: planningDay.note,
    comparisonStatus: deriveComparisonStatus(
      planningDay.shiftTemplates,
      dayOperationalShifts
    ),
    gapSignals,
  };
}

function buildPlanningMonthComparisonSummary(
  days: PlanningComparisonDay[]
): PlanningMonthComparisonSummary {
  const gapSignalsByCode = buildGapSignalsByCode(days);

  return {
    daysTotal: days.length,
    daysAligned: days.filter((day) => day.comparisonStatus === "aligned").length,
    daysPartiallyAligned: days.filter(
      (day) => day.comparisonStatus === "partially_aligned"
    ).length,
    daysMismatch: days.filter((day) => day.comparisonStatus === "mismatch")
      .length,
    daysNotStarted: days.filter(
      (day) => day.comparisonStatus === "not_started"
    ).length,
    daysWithRequests: days.filter((day) => day.requestCount > 0).length,
    requestsTotal: days.reduce((total, day) => total + day.requestCount, 0),
    gapSignalsTotal: days.reduce(
      (total, day) => total + day.gapSignalCount,
      0
    ),
    daysWithGapSignals: days.filter((day) => day.gapSignalCount > 0).length,
    daysWithSpecialDays: days.filter((day) => day.isSpecialDay).length,
    daysWithPlanningNotes: days.filter((day) => day.planningNote !== null)
      .length,
    gapSignalsByCode,
  };
}

function buildGapSignalsByCode(
  days: PlanningComparisonDay[]
): Record<PlanningComparisonGapSignal["code"], number> {
  const counts: Record<PlanningComparisonGapSignal["code"], number> = {
    planned_shift_missing: 0,
    unplanned_operational_shift: 0,
    planned_count_not_reached: 0,
    operational_count_exceeds_plan: 0,
    request_present: 0,
    effective_coverage_gap: 0,
    effective_qualification_gap: 0,
    absence_driven_coverage_gap: 0,
    absence_driven_qualification_gap: 0,
    operational_coverage_gap: 0,
    operational_qualification_gap: 0,
    request_context_only: 0,
  };

  for (const day of days) {
    for (const gapSignal of day.gapSignals) {
      counts[gapSignal.code] += 1;
    }
  }

  return counts;
}

function deriveComparisonStatus(
  planningShiftTemplates: PlanningShiftTemplate[],
  operationalShifts: OperationalShiftComparisonEntry[]
): PlanningComparisonStatus {
  if (planningShiftTemplates.length === 0 && operationalShifts.length === 0) {
    return "not_started";
  }

  if (planningShiftTemplates.length > 0 && operationalShifts.length === 0) {
    return "not_started";
  }

  if (planningShiftTemplates.length === 0 && operationalShifts.length > 0) {
    return "mismatch";
  }

  const planningTotals = buildTotalsMap(planningShiftTemplates);
  const operationalTotals = buildTotalsMap(operationalShifts);

  if (mapsAreEqual(planningTotals, operationalTotals)) {
    return "aligned";
  }

  const overlappingTypes = [...planningTotals.keys()].filter((type) =>
    operationalTotals.has(type)
  );

  if (overlappingTypes.length > 0) {
    return "partially_aligned";
  }

  return "mismatch";
}

function deriveGapSignals(
  planningShiftTemplates: PlanningShiftTemplate[],
  operationalShifts: OperationalShiftComparisonEntry[],
  relevantAvailabilityRequestCount: number
): PlanningComparisonGapSignal[] {
  const planningTotals = buildTotalsMap(planningShiftTemplates);
  const operationalTotals = buildTotalsMap(operationalShifts);
  const gapSignals: PlanningComparisonGapSignal[] = [];

  for (const [shiftType, plannedCount] of planningTotals.entries()) {
    const operationalCount = operationalTotals.get(shiftType) ?? 0;

    if (operationalCount === 0) {
      gapSignals.push({
        code: "planned_shift_missing",
        shiftType,
        plannedCount,
        operationalCount,
      });
      continue;
    }

    if (operationalCount < plannedCount) {
      gapSignals.push({
        code: "planned_count_not_reached",
        shiftType,
        plannedCount,
        operationalCount,
      });
      continue;
    }

    if (operationalCount > plannedCount) {
      gapSignals.push({
        code: "operational_count_exceeds_plan",
        shiftType,
        plannedCount,
        operationalCount,
      });
    }
  }

  for (const [shiftType, operationalCount] of operationalTotals.entries()) {
    if (planningTotals.has(shiftType)) {
      continue;
    }

    gapSignals.push({
      code: "unplanned_operational_shift",
      shiftType,
      plannedCount: 0,
      operationalCount,
    });
  }

  for (const operationalShift of operationalShifts) {
    gapSignals.push(
      ...interpretOperationalShift(operationalShift, false).gapSignals.map(
        (gapSignal) => ({
          ...gapSignal,
          shiftType: operationalShift.type,
        })
      )
    );
  }

  if (relevantAvailabilityRequestCount > 0) {
    gapSignals.push({
      code: "request_present",
      requestCount: relevantAvailabilityRequestCount,
    });
    gapSignals.push({
      code: "request_context_only",
      requestCount: relevantAvailabilityRequestCount,
    });
  }

  return gapSignals;
}

function buildOperationalShiftComparisonEntry(
  shift: OperationalShiftWithAssignments,
  availability?: ShiftOperationalAvailability
): OperationalShiftComparisonEntry {
  if (!availability) {
    throw new Error(`Missing operational availability for shift ${shift.id}`);
  }

  const interpretation = interpretOperationalGap({
    requiredCount: shift.requiredCount,
    requiredQualifiedCount: shift.requiredQualifiedCount,
    assignedCount: availability.assignedCount,
    availableAssignedCount: availability.availableAssignedCount,
    absentAssignedCount: availability.absentAssignedCount,
    qualifiedAssignedCount: availability.assignedQualifiedCount,
    availableQualifiedCount: availability.availableQualifiedCount,
    hasRequestContext: false,
  });

  return {
    id: shift.id,
    date: shift.date,
    type: shift.type,
    requiredCount: shift.requiredCount,
    requiredQualifiedCount: shift.requiredQualifiedCount,
    assignedCount: availability.assignedCount,
    availableAssignedCount: availability.availableAssignedCount,
    absentAssignedCount: availability.absentAssignedCount,
    qualifiedAssignedCount: availability.assignedQualifiedCount,
    availableQualifiedCount: availability.availableQualifiedCount,
    effectiveCoverageGap: interpretation.effectiveCoverageGap,
    effectiveQualificationGap: interpretation.effectiveQualificationGap,
  };
}

function interpretOperationalShift(
  shift: OperationalShiftComparisonEntry,
  hasRequestContext: boolean
) {
  return interpretOperationalGap({
    requiredCount: shift.requiredCount,
    requiredQualifiedCount: shift.requiredQualifiedCount,
    assignedCount: shift.assignedCount,
    availableAssignedCount: shift.availableAssignedCount,
    absentAssignedCount: shift.absentAssignedCount,
    qualifiedAssignedCount: shift.qualifiedAssignedCount,
    availableQualifiedCount: shift.availableQualifiedCount,
    hasRequestContext,
  });
}

function deriveAffectedShiftTypes(
  gapSignals: PlanningComparisonGapSignal[]
): string[] {
  const shiftTypes = new Set<string>();

  for (const gapSignal of gapSignals) {
    if (gapSignal.shiftType) {
      shiftTypes.add(gapSignal.shiftType);
    }
  }

  return [...shiftTypes];
}

function buildTotalsMap(
  entries: Array<{ type: string; requiredCount: number }>
): Map<string, number> {
  const totals = new Map<string, number>();

  for (const entry of entries) {
    totals.set(entry.type, (totals.get(entry.type) ?? 0) + entry.requiredCount);
  }

  return totals;
}

function mapsAreEqual(
  left: Map<string, number>,
  right: Map<string, number>
): boolean {
  if (left.size !== right.size) {
    return false;
  }

  for (const [key, value] of left.entries()) {
    if (right.get(key) !== value) {
      return false;
    }
  }

  return true;
}

function requestOverlapsDay(request: AvailabilityRequest, day: Date): boolean {
  const startDate = startOfUtcDay(request.startDate);
  const endDate = request.endDate ? startOfUtcDay(request.endDate) : startDate;
  const comparisonDay = startOfUtcDay(day);

  return startDate <= comparisonDay && endDate >= comparisonDay;
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

function toDateKey(date: Date): string {
  return startOfUtcDay(date).toISOString().slice(0, 10);
}

export async function getPlanningMonthComparison(planningMonthId: number) {
  return planningComparisonService.getPlanningMonthComparison(planningMonthId);
}
