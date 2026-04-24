import type {
  FullValidationIssue,
  FullValidationOverallStatus,
} from "../full/full.types";
import { ConflictValidationError } from "../conflicts/conflict.service";
import {
  getShiftOverviewSnapshotByDate,
  parseOverviewDate,
} from "../overview/overview.service";
import { situationRepository } from "./situation.repository";
import type {
  DailySituationLevel,
  LeadershipMainIssue,
  SituationDashboardResult,
  SituationHistoryEntry,
  SituationHistoryResult,
  SituationLevel,
  SituationSummary,
  SituationSummaryResult,
  SituationTrend,
  SituationTrendResult,
} from "./situation.types";

export async function getSituationHistory(
  dateInput: string,
  days = 7
): Promise<SituationHistoryEntry[]> {
  const parsedDays = ensureValidDays(days);
  const { startDate, endDate } = parseOverviewDate(dateInput);
  const rangeStart = new Date(startDate);
  rangeStart.setUTCDate(rangeStart.getUTCDate() - (parsedDays - 1));

  const history = await situationRepository.getRange(rangeStart, endDate);
  return mapHistoryEntries(history);
}

export async function deriveSituationTrend(
  dateInput: string,
  days = 7
): Promise<SituationTrendResult> {
  const history = await getSituationHistory(dateInput, days);
  return deriveTrendFromHistory(history);
}

// DailySituation stays intentionally simple in v0.1.
// It is a derived daily classification based on current shift conditions only.
export function deriveDailySituation(
  statuses: FullValidationOverallStatus[]
): DailySituationLevel {
  const criticalCount = statuses.filter((status) => status === "critical").length;

  if (criticalCount >= 3) {
    return "kritisch";
  }

  if (criticalCount >= 1) {
    return "angespannt";
  }

  return "stabil";
}

export async function storeSituation(
  normalizedDate: string,
  situation: DailySituationLevel
) {
  const date = new Date(`${normalizedDate}T00:00:00.000Z`);
  return situationRepository.upsert(date, situation);
}

export async function getSituationHistoryRange(
  fromInput: string,
  toInput: string
): Promise<SituationHistoryResult> {
  const { normalizedDate: fromDate, startDate: fromStartDate } =
    parseOverviewDate(fromInput);
  const { normalizedDate: toDate, startDate: toStartDate } =
    parseOverviewDate(toInput);

  if (fromStartDate > toStartDate) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE_RANGE",
      "Der Query-Parameter 'from' darf nicht nach 'to' liegen.",
      400
    );
  }

  const entries = await situationRepository.getRangeInclusive(
    fromStartDate,
    toStartDate
  );

  return {
    from: fromDate,
    to: toDate,
    days: mapHistoryEntries(entries),
  };
}

export async function getSituationSummary(
  dateInput: string
): Promise<SituationSummaryResult> {
  const overview = await getShiftOverviewSnapshotByDate(dateInput);
  return buildSituationSummary(overview);
}

export async function getSituationDashboard(
  dateInput: string,
  days = 7
): Promise<SituationDashboardResult> {
  // Dashboard keeps top-level history in v0.1 as a tolerated response shape.
  // Reuse the single loaded history for trend derivation instead of reading twice.
  const [summary, history] = await Promise.all([
    getSituationSummary(dateInput),
    getSituationHistory(dateInput, days),
  ]);
  const trend = deriveTrendFromHistory(history);

  return {
    date: summary.date,
    summary,
    trend: {
      trend: trend.trend,
      current: trend.current,
      first: trend.first,
    },
    history,
  };
}

function buildSituationSummary(overview: {
  date: string;
  criticalCount: number;
  warningCount: number;
  shiftCount: number;
  shifts: Array<{
    shiftId: number;
    type: string;
    overallStatus: string;
    issues: FullValidationIssue[];
  }>;
}): SituationSummary {
  // Summary stays a read-only aggregation of the current day.
  // It intentionally does not add prediction or recommendation logic in v0.1.
  const situation =
    overview.shifts.length > 0
      ? deriveDailySituation(
          overview.shifts.map(
            (shift) => shift.overallStatus as FullValidationOverallStatus
          )
        )
      : null;
  const leadershipSignals = buildLeadershipSignals(overview.shifts);

  return {
    date: overview.date,
    situation,
    criticalCount: overview.criticalCount,
    warningCount: overview.warningCount,
    shiftCount: overview.shiftCount,
    criticalShifts: overview.shifts
      .filter((shift) => shift.overallStatus === "critical")
      .map((shift) => ({
        shiftId: shift.shiftId,
        type: shift.type,
      })),
    warningShifts: overview.shifts
      .filter((shift) => shift.overallStatus === "warning")
      .map((shift) => ({
        shiftId: shift.shiftId,
        type: shift.type,
      })),
    mainIssue: leadershipSignals.mainIssue,
    dominantProblemType: leadershipSignals.dominantProblemType,
    affectedShiftTypes: leadershipSignals.affectedShiftTypes,
  };
}

function buildLeadershipSignals(
  shifts: Array<{
    shiftId: number;
    type: string;
    overallStatus: string;
    issues: FullValidationIssue[];
  }>
): {
  mainIssue: LeadershipMainIssue;
  dominantProblemType: string | null;
  affectedShiftTypes: string[];
} {
  // Leadership signals are intentionally simple in v0.1.
  // They are derived from existing issue codes and do not add forecasting,
  // recommendation logic, or a separate scoring model.
  const relevantShifts = shifts.filter((shift) => shift.overallStatus !== "ok");
  const relevantIssues = relevantShifts.flatMap((shift) => shift.issues);
  const coverageIssues = relevantIssues.filter((issue) => issue.source === "coverage");
  const qualificationIssues = relevantIssues.filter(
    (issue) => issue.source === "qualification"
  );
  const affectedShiftTypes = [...new Set(relevantShifts.map((shift) => shift.type))];

  if (relevantIssues.length === 0) {
    return {
      mainIssue: null,
      dominantProblemType: null,
      affectedShiftTypes: [],
    };
  }

  const mainIssue = deriveMainIssue(coverageIssues.length, qualificationIssues.length);

  return {
    mainIssue,
    dominantProblemType: deriveDominantProblemType(
      mainIssue,
      affectedShiftTypes,
      coverageIssues,
      qualificationIssues
    ),
    affectedShiftTypes,
  };
}

function deriveMainIssue(
  coverageCount: number,
  qualificationCount: number
): LeadershipMainIssue {
  if (coverageCount === 0 && qualificationCount === 0) {
    return null;
  }

  if (coverageCount > qualificationCount) {
    return "coverage";
  }

  if (qualificationCount > coverageCount) {
    return "qualification";
  }

  return "mixed";
}

function deriveDominantProblemType(
  mainIssue: LeadershipMainIssue,
  affectedShiftTypes: string[],
  coverageIssues: FullValidationIssue[],
  qualificationIssues: FullValidationIssue[]
): string | null {
  if (!mainIssue) {
    return null;
  }

  if (affectedShiftTypes.length !== 1) {
    return "distributed_risk";
  }

  const shiftType = affectedShiftTypes[0];

  if (mainIssue === "coverage") {
    const dominantCoverageCode = selectDominantIssueCode(coverageIssues);

    if (dominantCoverageCode === "SHIFT_UNDERSTAFFED") {
      return `understaffed_${shiftType}_shifts`;
    }

    if (dominantCoverageCode === "SHIFT_OVERSTAFFED") {
      return `overstaffed_${shiftType}_shifts`;
    }

    return `coverage_${shiftType}_shift_risk`;
  }

  if (mainIssue === "qualification") {
    return `underqualified_${shiftType}_shifts`;
  }

  // Leadership signals stay intentionally coupled to existing issue codes in v0.1.
  return `mixed_${shiftType}_shift_risk`;
}

function selectDominantIssueCode(issues: FullValidationIssue[]): string | null {
  const counts = new Map<string, number>();

  for (const issue of issues) {
    counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1);
  }

  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}

function mapHistoryEntries(
  entries: Array<{ date: Date; situation: string }>
): SituationHistoryEntry[] {
  return entries.map((entry) => ({
    date: entry.date.toISOString().slice(0, 10),
    situation: entry.situation as SituationLevel,
  }));
}

function deriveTrendFromHistory(
  history: SituationHistoryEntry[]
): SituationTrendResult {
  if (history.length < 2) {
    return {
      trend: "unzureichende_daten",
      current: history[history.length - 1]?.situation ?? null,
      first: history[0]?.situation ?? null,
      history,
    };
  }

  const first = history[0].situation;
  const current = history[history.length - 1]?.situation ?? null;

  return {
    trend: deriveTrend(first, current),
    current,
    first,
    history,
  };
}

function deriveTrend(
  first: SituationLevel,
  current: SituationLevel | null
): SituationTrend {
  if (!current) {
    return "unzureichende_daten";
  }

  const firstValue = mapSituationLevel(first);
  const currentValue = mapSituationLevel(current);

  if (currentValue > firstValue) {
    return "verschlechtert_sich";
  }

  if (currentValue < firstValue) {
    return "verbessert_sich";
  }

  return "unverändert";
}

function mapSituationLevel(situation: SituationLevel): number {
  switch (situation) {
    case "stabil":
      return 0;
    case "angespannt":
      return 1;
    case "kritisch":
      return 2;
    default:
      return 0;
  }
}

function ensureValidDays(days: number): number {
  if (!Number.isInteger(days) || days <= 0) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_PARAMETER",
      "Der Query-Parameter 'days' muss eine positive Ganzzahl sein.",
      400
    );
  }

  return days;
}
