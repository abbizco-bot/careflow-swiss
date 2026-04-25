import type { PlanningShiftTemplate } from "../../generated/prisma/client";
import { availabilityRequestsRepository } from "../availability-requests/availability-requests.repository";
import { assignmentRepository } from "../assignments/assignment.repository";
import {
  interpretOperationalGap,
  type GapInterpretationResult,
} from "../shared/gap-interpretation/gap-interpretation";
import { leadershipViewRepository } from "./leadership-view.repository";
import type {
  LeadershipDayHeadlineView,
  LeadershipDayResponse,
  LeadershipDayShiftView,
  LeadershipMonthGroupView,
  LeadershipMonthDayView,
  LeadershipMonthResponse,
  LeadershipWeekDayView,
  LeadershipWeekResponse,
} from "./leadership-view.types";
import { getFullValidationsByDateRange } from "../validations/full/full.service";
import {
  getShiftOverviewSnapshotByDate,
  parseOverviewDate,
} from "../validations/overview/overview.service";
import { ConflictValidationError } from "../validations/conflicts/conflict.service";
import {
  getSituationHistoryRange,
  getSituationSummary,
} from "../validations/situation/situation.service";
import type { QualificationStatus } from "../validations/qualification/qualification.types";
import type { FullValidationIssue } from "../validations/full/full.types";
import type {
  SituationLevel,
  SituationSummaryResult,
} from "../validations/situation/situation.types";

type LeadershipActualShiftAggregate = {
  actualCount: number;
  plannedCount: number;
  qualificationStatus: QualificationStatus | null;
};

type LeadershipDayAssignmentSnapshot = {
  shiftId: number;
  status: string;
  shift: {
    type: string;
  } | null;
};

type LeadershipDayShiftSignal = {
  shiftId: number;
  shiftType: string;
  requiredCount: number;
  assignedPlanned: number;
  assignedEffective: number;
  sickCount: number;
  requestedCount: number;
  gapContext: LeadershipDayGapContext;
};

type LeadershipDayGapContext = GapInterpretationResult;

type RequestDateRangeEntry = {
  type: string;
  startDate: Date;
  endDate: Date | null;
  note?: string | null;
  constraintType?: string | null;
};

// Display-only mapping for the leadership UI.
// This is a presentation label, not a new planning or validation concept.
const shiftLabelByType: Record<string, string> = {
  early: "Fruehdienst",
  mid: "Mitteldienst",
  day: "Tagdienst",
  late: "Spaetdienst",
  night: "Nachtdienst",
};

const shiftOrder = ["early", "mid", "day", "late", "night"];

export const leadershipViewService = {
  async getLeadershipDay(dateInput: string): Promise<LeadershipDayResponse> {
    const { normalizedDate, startDate, endDate } = parseOverviewDate(dateInput);

    const [
      planningDay,
      shiftOverview,
      fullValidations,
      dayAssignments,
    ] = await Promise.all([
      leadershipViewRepository.findPlanningDayByDate(startDate),
      getShiftOverviewSnapshotByDate(normalizedDate),
      getFullValidationsByDateRange(startDate, endDate),
      assignmentRepository.findAssignmentsWithEmployeeAndShiftByDateRange(
        startDate,
        endDate
      ),
    ]);

    const plannedCountByType = buildPlannedCountByType(
      planningDay?.shiftTemplates ?? []
    );
    const actualShiftByType = buildActualShiftByType(
      shiftOverview.shifts,
      fullValidations
    );

    return {
      date: normalizedDate,
      day: {
        headline: buildLeadershipDayHeadline({
          assignments: dayAssignments,
          shiftOverview: shiftOverview.shifts,
          fullValidations,
        }),
        shifts: buildShiftRows(plannedCountByType, actualShiftByType),
      },
    };
  },

  async getLeadershipWeek(input: {
    date?: string;
    start?: string;
    end?: string;
  }): Promise<LeadershipWeekResponse> {
    const weekRange = resolveLeadershipWeekRange(input);
    const weekDates = buildDateKeysInRange(weekRange.from, weekRange.to);
    const weekStartDate = new Date(`${weekRange.from}T00:00:00.000Z`);
    const weekEndExclusive = new Date(`${weekRange.to}T00:00:00.000Z`);
    weekEndExclusive.setUTCDate(weekEndExclusive.getUTCDate() + 1);

    const [history, overlappingRequests, summaries] = await Promise.all([
      getSituationHistoryRange(weekRange.from, weekRange.to),
      availabilityRequestsRepository.findByDateRange(
        weekStartDate,
        weekEndExclusive
      ),
      Promise.all(weekDates.map((date) => getSituationSummary(date))),
    ]);

    const situationByDate = buildLeadershipSituationByDate({
      dates: weekDates,
      summaries,
      historyDays: history.days,
    });
    const requestCountByDate = buildRequestCountByDate(
      weekDates,
      overlappingRequests
    );
    const days = weekDates.map((date, index) =>
      buildLeadershipWeekDay({
        date,
        summary: summaries[index],
        situation: situationByDate.get(date) ?? null,
        requestCount: requestCountByDate.get(date) ?? 0,
      })
    );

    return {
      date: input.date ?? weekRange.from,
      week: {
        range: weekRange,
        summary: {
          situation: deriveWeeklySituation(days),
        },
        days,
      },
    };
  },

  async getLeadershipMonth(dateInput: string): Promise<LeadershipMonthResponse> {
    const { normalizedDate } = parseOverviewDate(dateInput);
    const monthRange = buildCalendarMonthRange(normalizedDate);
    const monthDates = buildDateKeysInRange(monthRange.from, monthRange.to);
    const [summaries, history] = await Promise.all([
      Promise.all(monthDates.map((date) => getSituationSummary(date))),
      getSituationHistoryRange(monthRange.from, monthRange.to),
    ]);
    const monthDays = buildLeadershipMonthDays({
      dates: monthDates,
      summaries,
      historyDays: history.days,
    });
    const monthGroups = buildLeadershipMonthGroups(monthDates, monthDays);
    const [yearValue, monthValue] = normalizedDate.split("-").map(Number);

    return {
      date: normalizedDate,
      month: {
        year: yearValue,
        month: monthValue,
        summary: {
          situation: derivePredominantSituation(
            monthDays.map((day) => day.situation)
          ),
        },
        groups: monthGroups,
      },
    };
  },
};

function buildCalendarMonthRange(dateKey: string): { from: string; to: string } {
  const [yearValue, monthValue] = dateKey.split("-").map(Number);
  const firstDay = new Date(Date.UTC(yearValue, monthValue - 1, 1));
  const lastDay = new Date(Date.UTC(yearValue, monthValue, 0));

  return {
    from: firstDay.toISOString().slice(0, 10),
    to: lastDay.toISOString().slice(0, 10),
  };
}

function buildLeadershipMonthDays(input: {
  dates: string[];
  summaries: SituationSummaryResult[];
  historyDays: Array<{ date: string; situation: SituationLevel }>;
}): LeadershipMonthDayView[] {
  const situationByDate = buildLeadershipSituationByDate(input);

  return input.dates
    .map((date) => {
      const situation = situationByDate.get(date) ?? null;

      if (!situation) {
        return null;
      }

      return {
        date,
        situation,
      };
    })
    .filter((day): day is LeadershipMonthDayView => day !== null);
}

function buildLeadershipSituationByDate(input: {
  dates: string[];
  summaries: SituationSummaryResult[];
  historyDays: Array<{ date: string; situation: SituationLevel }>;
}): Map<string, SituationLevel | null> {
  const historySituationByDate = new Map(
    input.historyDays.map((day) => [day.date, day.situation])
  );

  return new Map(
    input.dates.map((date, index) => [
      date,
      input.summaries[index].situation ?? historySituationByDate.get(date) ?? null,
    ])
  );
}

function buildWeekRange(dateKey: string): { from: string; to: string } {
  const currentDate = new Date(`${dateKey}T00:00:00.000Z`);
  const dayOfWeek = currentDate.getUTCDay();
  const dayOffsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(currentDate);
  weekStart.setUTCDate(weekStart.getUTCDate() + dayOffsetToMonday);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);

  return {
    from: weekStart.toISOString().slice(0, 10),
    to: weekEnd.toISOString().slice(0, 10),
  };
}

function resolveLeadershipWeekRange(input: {
  date?: string;
  start?: string;
  end?: string;
}): { from: string; to: string } {
  if (input.start && input.end) {
    const { normalizedDate: normalizedStart, startDate } = parseOverviewDate(
      input.start
    );
    const { normalizedDate: normalizedEnd, startDate: endDate } =
      parseOverviewDate(input.end);

    if (startDate > endDate) {
      throw new ConflictValidationError(
        "VALIDATION_INVALID_DATE_RANGE",
        "Der Query-Parameter 'start' darf nicht nach 'end' liegen.",
        400
      );
    }

    return {
      from: normalizedStart,
      to: normalizedEnd,
    };
  }

  if (!input.date) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      "Der Query-Parameter 'date' ist erforderlich und muss ein gueltiges Datum sein.",
      400
    );
  }

  const { normalizedDate } = parseOverviewDate(input.date);
  return buildWeekRange(normalizedDate);
}

function buildLeadershipMonthGroups(
  monthDates: string[],
  monthDays: LeadershipMonthDayView[]
): LeadershipMonthGroupView[] {
  const ranges = [
    { startDay: 1, endDay: 7 },
    { startDay: 8, endDay: 14 },
    { startDay: 15, endDay: 21 },
    { startDay: 22, endDay: 31 },
  ];
  const situationByDate = new Map(monthDays.map((day) => [day.date, day.situation]));

  return ranges
    .map((range) => {
      const groupDates = monthDates.filter((date) => {
        const dayNumber = Number(date.slice(8, 10));
        return dayNumber >= range.startDay && dayNumber <= range.endDay;
      });

      if (groupDates.length === 0) {
        return null;
      }

      const groupDays = groupDates
        .map((date) => {
          const situation = situationByDate.get(date);

          if (!situation) {
            return null;
          }

          return {
            date,
            situation,
          };
        })
        .filter(
          (day): day is { date: string; situation: SituationLevel } => day !== null
        );

      return {
        from: groupDates[0],
        to: groupDates[groupDates.length - 1],
        situation: derivePredominantSituation(
          groupDays.map((day) => day.situation)
        ),
        days: groupDays
          .filter(
            (day): day is { date: string; situation: SituationLevel } =>
              day.situation === "angespannt" || day.situation === "kritisch"
          )
          .map((day) => ({
            date: day.date,
            situation: day.situation,
          })),
      };
    })
    .filter((group): group is LeadershipMonthGroupView => group !== null);
}

function buildDateKeysInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const currentDate = new Date(`${from}T00:00:00.000Z`);
  const endDate = new Date(`${to}T00:00:00.000Z`);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
}

function buildPlannedCountByType(
  templates: Array<Pick<PlanningShiftTemplate, "type" | "requiredCount">>
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const template of templates) {
    counts.set(
      template.type,
      (counts.get(template.type) ?? 0) + template.requiredCount
    );
  }

  return counts;
}

function buildLeadershipWeekDay(input: {
  date: string;
  summary: SituationSummaryResult;
  situation: SituationLevel | null;
  requestCount: number;
}): LeadershipWeekDayView {
  return {
    date: input.date,
    situation: input.situation,
    note: buildLeadershipWeekNote({
      situation: input.situation,
      summary: input.summary,
      requestCount: input.requestCount,
    }),
  };
}

function buildLeadershipWeekNote(input: {
  situation: SituationLevel | null;
  summary: SituationSummaryResult;
  requestCount: number;
}): string | null {
  if (input.situation === null) {
    if (input.requestCount > 0) {
      return formatRequestNote(input.requestCount);
    }

    return null;
  }

  if (input.situation === "stabil") {
    if (input.requestCount > 0) {
      return formatRequestNote(input.requestCount);
    }

    return null;
  }

  if (input.summary.mainIssue === "qualification") {
    return buildQualificationNote(input.summary.affectedShiftTypes.length);
  }

  if (input.summary.affectedShiftTypes.length > 0) {
    return buildAffectedShiftTypesNote(input.summary.affectedShiftTypes);
  }

  if (input.requestCount > 0) {
    return formatRequestNote(input.requestCount);
  }

  return null;
}

function buildQualificationNote(affectedShiftTypeCount: number): string {
  if (affectedShiftTypeCount <= 1) {
    return "Qualifikation in einer Schicht nicht erfuellt";
  }

  return `Qualifikation in ${affectedShiftTypeCount} Schichten nicht erfuellt`;
}

function buildAffectedShiftTypesNote(shiftTypes: string[]): string | null {
  const labels = shiftTypes
    .slice()
    .sort(compareShiftTypes)
    .map((shiftType) => formatShiftLabel(shiftType));

  if (labels.length === 0) {
    return null;
  }

  if (labels.length === 1) {
    return `${labels[0]} betroffen`;
  }

  if (labels.length === 2) {
    return `${labels[0]} und ${labels[1]} betroffen`;
  }

  return `${labels.slice(0, -1).join(", ")} und ${
    labels[labels.length - 1]
  } betroffen`;
}

function formatRequestNote(requestCount: number): string {
  return `${requestCount} ${requestCount === 1 ? "Anfrage" : "Anfragen"}`;
}

function buildRequestCountByDate(
  weekDates: string[],
  requests: RequestDateRangeEntry[]
): Map<string, number> {
  const counts = new Map<string, number>(weekDates.map((date) => [date, 0]));

  for (const request of requests) {
    for (const date of weekDates) {
      if (requestOverlapsDateKey(request, date)) {
        counts.set(date, (counts.get(date) ?? 0) + 1);
      }
    }
  }

  return counts;
}

function requestOverlapsDateKey(
  request: RequestDateRangeEntry,
  dateKey: string
): boolean {
  const comparisonDate = new Date(`${dateKey}T00:00:00.000Z`);
  const startDate = startOfUtcDay(request.startDate);
  const endDate = request.endDate
    ? startOfUtcDay(request.endDate)
    : startDate;

  return startDate <= comparisonDate && endDate >= comparisonDate;
}

function deriveWeeklySituation(
  days: LeadershipWeekDayView[]
): SituationLevel | null {
  return derivePredominantSituation(days.map((day) => day.situation));
}

function derivePredominantSituation(
  situations: Array<SituationLevel | null>
): SituationLevel | null {
  const counts = new Map<SituationLevel, number>([
    ["stabil", 0],
    ["angespannt", 0],
    ["kritisch", 0],
  ]);

  for (const situation of situations) {
    if (!situation) {
      continue;
    }

    counts.set(situation, (counts.get(situation) ?? 0) + 1);
  }

  const criticalCount = counts.get("kritisch") ?? 0;
  const tenseCount = counts.get("angespannt") ?? 0;
  const stableCount = counts.get("stabil") ?? 0;

  if (criticalCount === 0 && tenseCount === 0 && stableCount === 0) {
    return null;
  }

  if (criticalCount >= tenseCount && criticalCount >= stableCount) {
    return "kritisch";
  }

  if (tenseCount >= stableCount) {
    return "angespannt";
  }

  return "stabil";
}

function buildActualShiftByType(
  shifts: Array<{
    shiftId: number;
    type: string;
    requiredCount: number;
    availableAssignedCount: number;
  }>,
  fullValidations: Array<{
    shiftId: number;
    qualification: {
      status: QualificationStatus;
    };
  }>
): Map<string, LeadershipActualShiftAggregate> {
  const qualificationStatusByShiftId = new Map(
    fullValidations.map((validation) => [
      validation.shiftId,
      validation.qualification.status,
    ])
  );
  const actualShiftByType = new Map<string, LeadershipActualShiftAggregate>();

  for (const shift of shifts) {
    const existingAggregate = actualShiftByType.get(shift.type) ?? {
      actualCount: 0,
      plannedCount: 0,
      qualificationStatus: null,
    };
    const qualificationStatus =
      qualificationStatusByShiftId.get(shift.shiftId) ?? null;

    // The existing overview snapshot exposes availableAssignedCount as the
    // operationally available staffing reality for the day. The leadership view
    // reuses that read model directly instead of recounting assignments itself.
    existingAggregate.actualCount += shift.availableAssignedCount;
    existingAggregate.plannedCount += shift.requiredCount;
    existingAggregate.qualificationStatus = mergeQualificationStatus(
      existingAggregate.qualificationStatus,
      qualificationStatus
    );

    actualShiftByType.set(shift.type, existingAggregate);
  }

  return actualShiftByType;
}

function mergeQualificationStatus(
  currentStatus: QualificationStatus | null,
  nextStatus: QualificationStatus | null
): QualificationStatus | null {
  if (currentStatus === "underqualified" || nextStatus === "underqualified") {
    return "underqualified";
  }

  if (currentStatus === "ok" || nextStatus === "ok") {
    return "ok";
  }

  return null;
}

function buildShiftRows(
  plannedCountByType: Map<string, number>,
  actualShiftByType: Map<string, LeadershipActualShiftAggregate>
): LeadershipDayShiftView[] {
  const shiftTypes = new Set([
    ...plannedCountByType.keys(),
    ...actualShiftByType.keys(),
  ]);

  return [...shiftTypes]
    .sort(compareShiftTypes)
    .map((type) => {
      const actualShift = actualShiftByType.get(type);

      return {
        type,
        label: formatShiftLabel(type),
        plannedCount:
          plannedCountByType.get(type) ?? actualShift?.plannedCount ?? 0,
        actualCount: actualShift?.actualCount ?? 0,
        qualification: {
          status: actualShift?.qualificationStatus ?? null,
        },
      };
    });
}

function buildLeadershipDayHeadline(input: {
  assignments: LeadershipDayAssignmentSnapshot[];
  shiftOverview: Array<{
    shiftId: number;
    type: string;
    requiredCount: number;
    requiredQualifiedCount: number;
    assignedCount: number;
    availableAssignedCount: number;
    absentAssignedCount: number;
    assignedQualifiedCount: number;
    availableQualifiedCount: number;
  }>;
  fullValidations: Array<{
    coverage: {
      status: string;
    };
    qualification: {
      status: QualificationStatus;
    };
    issues: FullValidationIssue[];
  }>;
}): LeadershipDayHeadlineView {
  const shiftSignals = buildLeadershipDayShiftSignals({
    assignments: input.assignments,
    shiftOverview: input.shiftOverview,
  });
  const eventDrivenShiftSignals = shiftSignals.filter(
    (shiftSignal) =>
      shiftSignal.assignedPlanned >= shiftSignal.requiredCount &&
      shiftSignal.assignedEffective < shiftSignal.requiredCount
  );
  const contextLine = deriveContextLine(eventDrivenShiftSignals);
  const coverageShiftCount = input.fullValidations.filter(
    (validation) => validation.coverage.status === "understaffed"
  ).length;

  if (coverageShiftCount > 0) {
    return {
      title: "Unterdeckung",
      detail: buildHeadlineAffectedShiftsDetail(coverageShiftCount),
      contextLine,
    };
  }

  const qualificationShiftCount = input.fullValidations.filter(
    (validation) => validation.qualification.status === "underqualified"
  ).length;

  if (qualificationShiftCount > 0) {
    return {
      title: "Qualifikation unzureichend",
      detail: buildHeadlineAffectedShiftsDetail(qualificationShiftCount),
      contextLine,
    };
  }

  const qualificationFunctionIssues = input.fullValidations.flatMap(
    (validation) =>
      validation.issues.filter(
        (issue) => issue.source === "qualification-function"
      )
  );

  if (qualificationFunctionIssues.length > 0) {
    return {
      title: "Funktionshinweis",
      detail: buildHeadlineAffectedShiftsDetail(
        countAffectedShifts(qualificationFunctionIssues)
      ),
      contextLine: buildQualificationFunctionContextLine(
        qualificationFunctionIssues[0]
      ),
    };
  }

  const sickHeadline = buildSickText(
    shiftSignals.filter((shiftSignal) => shiftSignal.sickCount > 0)
  );

  if (sickHeadline) {
    return {
      title: sickHeadline,
      detail: null,
      contextLine: null,
    };
  }

  const requestedHeadline = buildRequestedText(
    shiftSignals.filter((shiftSignal) => shiftSignal.requestedCount > 0)
  );

  if (requestedHeadline) {
    return {
      title: requestedHeadline,
      detail: null,
      contextLine: null,
    };
  }

  return {
    title: "stabil",
    detail: null,
    contextLine: null,
  };
}

function countAffectedShifts(issues: FullValidationIssue[]): number {
  return new Set(
    issues
      .map((issue) => issue.shiftId)
      .filter((shiftId): shiftId is number => shiftId !== undefined)
  ).size;
}

function buildQualificationFunctionContextLine(
  issue: FullValidationIssue
): string {
  if (issue.assignedFunction && issue.baseQualification) {
    return `${issue.assignedFunction} passt nicht zur Stammqualifikation ${issue.baseQualification}`;
  }

  return "Funktion passt nicht zur Stammqualifikation";
}

function buildHeadlineAffectedShiftsDetail(
  affectedShiftCount: number
): string | null {
  if (affectedShiftCount <= 0) {
    return null;
  }

  if (affectedShiftCount === 1) {
    return "1 Schicht betroffen";
  }

  return `${affectedShiftCount} Schichten betroffen`;
}

function buildLeadershipDayShiftSignals(input: {
  assignments: LeadershipDayAssignmentSnapshot[];
  shiftOverview: Array<{
    shiftId: number;
    type: string;
    requiredCount: number;
    requiredQualifiedCount: number;
    assignedCount: number;
    availableAssignedCount: number;
    absentAssignedCount: number;
    assignedQualifiedCount: number;
    availableQualifiedCount: number;
  }>;
}): LeadershipDayShiftSignal[] {
  const shiftSignalById = new Map<number, LeadershipDayShiftSignal>();
  const shiftOverviewById = new Map(
    input.shiftOverview.map((shift) => [shift.shiftId, shift])
  );

  for (const shift of input.shiftOverview) {
    shiftSignalById.set(shift.shiftId, {
      shiftId: shift.shiftId,
      shiftType: shift.type,
      requiredCount: shift.requiredCount,
      assignedPlanned: 0,
      assignedEffective: 0,
      sickCount: 0,
      requestedCount: 0,
      gapContext: interpretLeadershipDayGapContext(shift, false),
    });
  }

  for (const assignment of input.assignments) {
    const shiftType = assignment.shift?.type;

    if (!shiftType) {
      continue;
    }

    const shiftSignal = shiftSignalById.get(assignment.shiftId);

    if (!shiftSignal) {
      continue;
    }

    shiftSignal.assignedPlanned += 1;

    if (assignment.status === "planned") {
      shiftSignal.assignedEffective += 1;
    }

    if (assignment.status === "sick") {
      shiftSignal.sickCount += 1;
    }

    if (assignment.status === "requested") {
      shiftSignal.requestedCount += 1;
    }
  }

  return [...shiftSignalById.values()]
    .map((shiftSignal) => {
      const shift = shiftOverviewById.get(shiftSignal.shiftId);

      if (!shift) {
        return shiftSignal;
      }

      return {
        ...shiftSignal,
        gapContext: interpretLeadershipDayGapContext(
          shift,
          shiftSignal.requestedCount > 0
        ),
      };
    })
    .sort((left, right) => compareShiftTypes(left.shiftType, right.shiftType));
}

function interpretLeadershipDayGapContext(shift: {
  requiredCount: number;
  requiredQualifiedCount: number;
  assignedCount: number;
  availableAssignedCount: number;
  absentAssignedCount: number;
  assignedQualifiedCount: number;
  availableQualifiedCount: number;
}, hasRequestContext: boolean): LeadershipDayGapContext {
  return interpretOperationalGap({
    requiredCount: shift.requiredCount,
    requiredQualifiedCount: shift.requiredQualifiedCount,
    assignedCount: shift.assignedCount,
    availableAssignedCount: shift.availableAssignedCount,
    absentAssignedCount: shift.absentAssignedCount,
    qualifiedAssignedCount: shift.assignedQualifiedCount,
    availableQualifiedCount: shift.availableQualifiedCount,
    hasRequestContext,
  });
}

function deriveContextLine(
  eventDrivenShiftSignals: LeadershipDayShiftSignal[]
): string | null {
  if (eventDrivenShiftSignals.length === 0) {
    return "keine aktuelle Veraenderung";
  }

  const sickSignals = eventDrivenShiftSignals.filter(
    (shiftSignal) => shiftSignal.sickCount > 0
  );
  const requestedSignals = eventDrivenShiftSignals.filter(
    (shiftSignal) => shiftSignal.requestedCount > 0
  );

  if (sickSignals.length > 0 && requestedSignals.length > 0) {
    return buildCombinedText(eventDrivenShiftSignals);
  }

  if (sickSignals.length > 0) {
    return buildSickText(sickSignals);
  }

  if (requestedSignals.length > 0) {
    return buildRequestedText(requestedSignals);
  }

  return "keine aktuelle Veraenderung";
}

function buildSickText(
  shiftSignals: LeadershipDayShiftSignal[]
): string | null {
  if (shiftSignals.length === 0) {
    return null;
  }

  if (shiftSignals.length === 1) {
    return `Krankmeldung im ${formatShiftLabel(shiftSignals[0].shiftType)}`;
  }

  return `Krankmeldungen in ${shiftSignals.length} Schichten`;
}

function buildRequestedText(
  shiftSignals: LeadershipDayShiftSignal[]
): string | null {
  if (shiftSignals.length === 0) {
    return null;
  }

  if (shiftSignals.length === 1) {
    return `unsichere Besetzung im ${formatShiftLabel(shiftSignals[0].shiftType)}`;
  }

  return `unsichere Besetzung in ${shiftSignals.length} Schichten`;
}

function buildCombinedText(
  shiftSignals: LeadershipDayShiftSignal[]
): string {
  if (shiftSignals.length === 1) {
    return `Krankmeldung und unsichere Besetzung im ${formatShiftLabel(
      shiftSignals[0].shiftType
    )}`;
  }

  return "Krankmeldung und unsichere Besetzung in mehreren Schichten";
}

function compareShiftTypes(left: string, right: string): number {
  const leftPriority = shiftOrder.indexOf(left);
  const rightPriority = shiftOrder.indexOf(right);

  if (leftPriority !== -1 || rightPriority !== -1) {
    if (leftPriority === -1) {
      return 1;
    }

    if (rightPriority === -1) {
      return -1;
    }

    return leftPriority - rightPriority;
  }

  return left.localeCompare(right);
}

function formatShiftLabel(type: string): string {
  return shiftLabelByType[type] ?? type;
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export async function getLeadershipDay(dateInput: string) {
  return leadershipViewService.getLeadershipDay(dateInput);
}

export async function getLeadershipWeek(input: {
  date?: string;
  start?: string;
  end?: string;
}) {
  return leadershipViewService.getLeadershipWeek(input);
}

export async function getLeadershipMonth(dateInput: string) {
  return leadershipViewService.getLeadershipMonth(dateInput);
}
