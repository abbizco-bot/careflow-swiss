import { availabilityRequestsRepository } from "../availability-requests/availability-requests.repository";
import { interpretOperationalGap } from "../shared/gap-interpretation/gap-interpretation";
import { buildShiftOperationalAvailabilityMap } from "../validations/availability/availability.service";
import { rollingPlanningViewRepository } from "./rolling-planning-view.repository";
import type {
  RollingPlanningView,
  RollingPlanningDay,
  RollingDaySeverity,
  RollingGapSummary,
  RollingPlanningSummary,
} from "./rolling-planning-view.types";

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export const rollingPlanningViewService = {
  async getRollingPlanningWindow(
    startDate: Date,
    windowDays: number
  ): Promise<RollingPlanningView> {
    const startDateUtc = startOfUtcDay(startDate);
    const endDate = new Date(startDateUtc);
    endDate.setUTCDate(endDate.getUTCDate() + windowDays);

    const [operationalShifts, availabilityRequests, planningDays] =
      await Promise.all([
        rollingPlanningViewRepository.findOperationalShiftsByDateRange(
          startDateUtc,
          endDate
        ),
        availabilityRequestsRepository.findByDateRange(startDateUtc, endDate),
        rollingPlanningViewRepository.findPlanningDaysWithMonthStatusByDateRange(
          startDateUtc,
          endDate
        ),
      ]);

    const availabilityByShiftId =
      await buildShiftOperationalAvailabilityMap(operationalShifts);

    const dayMap = new Map<string, RollingPlanningDay>();

    for (
      let d = new Date(startDateUtc);
      d < endDate;
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dayMap.set(dateStr, {
        date: dateStr,
        daySeverity: "none",
        hasReferencePlan: false,
        dataStatus: "operational_only",
      });
    }

    const planningDayStatusByDate = new Map<string, string>();
    const planningDayTemplateCountByDate = new Map<string, number>();

    for (const planningDay of planningDays) {
  const dateStr = planningDay.date.toISOString().split("T")[0];
  const shiftTypes = planningDay.shiftTemplates.map((template) => template.type);

  planningDayStatusByDate.set(dateStr, planningDay.planningMonth.status);
  planningDayTemplateCountByDate.set(dateStr, planningDay.shiftTemplates.length);

  const day = dayMap.get(dateStr);

  if (day && planningDay.shiftTemplates.length > 0) {
    day.plannedShiftSummary = {
      shiftTemplateCount: planningDay.shiftTemplates.length,
      shiftTypes,
    };
  }
}

    for (const [dateStr, day] of dayMap) {
      const planningMonthStatus = planningDayStatusByDate.get(dateStr);
      const planningDayTemplateCount =
        planningDayTemplateCountByDate.get(dateStr);

      if (planningDayTemplateCount === 0) {
        day.hasReferencePlan = false;
        day.dataStatus = "incomplete";
      } else if (planningMonthStatus === "draft") {
        day.hasReferencePlan = false;
        day.dataStatus = "draft_plan";
      } else if (
        planningMonthStatus === "published" ||
        planningMonthStatus === "reference"
      ) {
        day.hasReferencePlan = true;
        day.dataStatus = "reference_plan";
      }
    }

    const shiftsGroupedByDate = new Map<string, typeof operationalShifts>();
    for (const shift of operationalShifts) {
      const dateStr = shift.date.toISOString().split("T")[0];
      if (!shiftsGroupedByDate.has(dateStr)) {
        shiftsGroupedByDate.set(dateStr, []);
      }
      shiftsGroupedByDate.get(dateStr)!.push(shift);
    }

    const requestsByDate = new Map<string, typeof availabilityRequests>();
    for (const request of availabilityRequests) {
      const dateStr = request.startDate.toISOString().split("T")[0];
      if (!requestsByDate.has(dateStr)) {
        requestsByDate.set(dateStr, []);
      }
      requestsByDate.get(dateStr)!.push(request);
    }

    for (const [dateStr, shifts] of shiftsGroupedByDate) {
      const dayRequests = requestsByDate.get(dateStr) || [];
      const hasRequest = dayRequests.length > 0;

      const gaps: RollingGapSummary = {
        effectiveCoverageGapTotal: 0,
        effectiveQualificationGapTotal: 0,
        affectedShiftTypes: [],
      };

      let maxSeverity: RollingDaySeverity = "none";
      const affectedShiftTypes = new Set<string>();

      for (const shift of shifts) {
        const availability = availabilityByShiftId.get(shift.id);

        if (!availability) {
          continue;
        }

        const gapResult = interpretOperationalGap({
          requiredCount: shift.requiredCount,
          requiredQualifiedCount: shift.requiredQualifiedCount,
          assignedCount: availability.assignedCount,
          availableAssignedCount: availability.availableAssignedCount,
          absentAssignedCount: availability.absentAssignedCount,
          qualifiedAssignedCount: availability.assignedQualifiedCount,
          availableQualifiedCount: availability.availableQualifiedCount,
          hasRequestContext: hasRequest,
        });

        gaps.effectiveCoverageGapTotal! += gapResult.effectiveCoverageGap;
        gaps.effectiveQualificationGapTotal! +=
          gapResult.effectiveQualificationGap;
        affectedShiftTypes.add(shift.type);

        if (
          gapResult.effectiveCoverageGap > 0 ||
          gapResult.effectiveQualificationGap > 0
        ) {
          maxSeverity = "attention";

          if (
            gapResult.effectiveCoverageGap > 2 ||
            gapResult.effectiveQualificationGap > 2
          ) {
            maxSeverity = "critical";
          }
        }
      }

      if (affectedShiftTypes.size > 0) {
        gaps.affectedShiftTypes = Array.from(affectedShiftTypes);
      }

      const day = dayMap.get(dateStr)!;
      day.daySeverity = maxSeverity;
      
      day.operationalDaySummary = {
        shiftCount: shifts.length,
        assignmentCount: shifts.reduce(
          (sum, shift) => sum + shift.assignments.length,
          0
        ),
      };

      if (
        gaps.effectiveCoverageGapTotal! > 0 ||
        gaps.effectiveQualificationGapTotal! > 0
      ) {
        day.gapSummary = gaps;
      }
    }

    const days = Array.from(dayMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const summary = buildRollingPlanningSummary(days);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      days,
      summary,
    };
  },
};

function buildRollingPlanningSummary(
  days: RollingPlanningDay[]
): RollingPlanningSummary {
  let criticalDayCount = 0;
  let attentionDayCount = 0;

  for (const day of days) {
    if (day.daySeverity === "critical") {
      criticalDayCount++;
    } else if (day.daySeverity === "attention") {
      attentionDayCount++;
    }
  }

  return {
    criticalDayCount,
    attentionDayCount,
  };
}