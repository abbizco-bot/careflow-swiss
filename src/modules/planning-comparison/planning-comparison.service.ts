import type {
  AvailabilityRequest,
  PlanningMonth,
  PlanningShiftTemplate,
  Shift,
} from "../../generated/prisma/client";
import { availabilityRequestsRepository } from "../availability-requests/availability-requests.repository";
import { planningComparisonRepository } from "./planning-comparison.repository";
import type {
  PlanningComparisonDay,
  PlanningComparisonGapSignal,
  PlanningComparisonStatus,
  PlanningMonthComparison,
  PlanningMonthComparisonSummary,
} from "./planning-comparison.types";

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

    const days = planningMonth.planningDays.map((planningDay) =>
      buildPlanningComparisonDay(
        planningDay,
        operationalShifts,
        availabilityRequests
      )
    );

    return {
      planningMonth: {
        id: planningMonth.id,
        year: planningMonth.year,
        month: planningMonth.month,
        status: planningMonth.status,
      },
      summary: buildPlanningMonthComparisonSummary(days),
      days,
    };
  },
};

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
  operationalShifts: Shift[],
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
    operationalShifts: dayOperationalShifts.map((shift) => ({
      id: shift.id,
      type: shift.type,
      requiredCount: shift.requiredCount,
      requiredQualifiedCount: shift.requiredQualifiedCount,
    })),
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
  operationalShifts: Shift[]
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
  operationalShifts: Shift[],
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

  if (relevantAvailabilityRequestCount > 0) {
    gapSignals.push({
      code: "request_present",
      requestCount: relevantAvailabilityRequestCount,
    });
  }

  return gapSignals;
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
