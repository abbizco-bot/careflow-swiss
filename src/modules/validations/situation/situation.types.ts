export type SituationLevel = "stabil" | "angespannt" | "kritisch";

export type DailySituationLevel = SituationLevel;

// Trend remains a simple directional readout in v0.1.
// It describes change only and does not embed its own history semantics.
export type SituationTrend =
  | "verschlechtert_sich"
  | "verbessert_sich"
  | "unverändert"
  | "unzureichende_daten";

export type LeadershipMainIssue = "coverage" | "qualification" | "mixed" | null;

// History is an explicit list of persisted daily states from DailySituation.
export interface SituationHistoryEntry {
  date: string;
  situation: SituationLevel;
}

export interface SituationTrendResult {
  trend: SituationTrend;
  current: SituationLevel | null;
  first: SituationLevel | null;
  history: SituationHistoryEntry[];
}

export interface SituationHistoryResult {
  from: string;
  to: string;
  days: SituationHistoryEntry[];
}

export interface SituationSummaryShiftEntry {
  shiftId: number;
  type: string;
}

// Summary is the current aggregated read-only state for one day.
// Leadership signals stay intentionally simple in v0.1 and are derived
// from existing issue codes instead of using a separate scoring system.
export interface SituationSummary {
  date: string;
  situation: SituationLevel | null;
  criticalCount: number;
  warningCount: number;
  shiftCount: number;
  criticalShifts: SituationSummaryShiftEntry[];
  warningShifts: SituationSummaryShiftEntry[];
  mainIssue: LeadershipMainIssue;
  dominantProblemType: string | null;
  affectedShiftTypes: string[];
}

export type SituationSummaryResult = SituationSummary;

// The dedicated trend endpoint keeps its own response shape.
// Dashboard intentionally returns top-level history separately in v0.1.
export type SituationDashboardTrend = Omit<SituationTrendResult, "history">;

export interface SituationDashboard {
  date: string;
  summary: SituationSummary;
  trend: SituationDashboardTrend;
  history: SituationHistoryEntry[];
}

export type SituationDashboardResult = SituationDashboard;
