const API_BASE_URL =
  import.meta.env.VITE_CAREFLOW_API_BASE_URL ?? "http://localhost:3001";

export type GapSeverity = "none" | "attention" | "critical";

export type GapPrimaryCause =
  | "none"
  | "operational"
  | "absence"
  | "request_context"
  | "mixed";

export type LeadershipDayResponse = {
  date: string;
  day: {
    headline: {
      title: string;
      detail: string | null;
      contextLine: string | null;
    };
    shifts: LeadershipDayShift[];
  };
};

export type LeadershipDayShift = {
  type: string;
  label: string;
  plannedCount: number;
  actualCount: number;
  qualification: {
    status: string;
  };
  gap: {
    primaryCause: GapPrimaryCause;
    signals: string[];
    effectiveCoverageGap: number;
    effectiveQualificationGap: number;
    severity: GapSeverity;
  };
};

export async function fetchLeadershipDay(
  date: string
): Promise<LeadershipDayResponse> {
  const response = await fetch(
    `${API_BASE_URL}/leadership/day?date=${encodeURIComponent(date)}`
  );

  if (!response.ok) {
    throw new Error(`Leadership Day konnte nicht geladen werden (${response.status})`);
  }

  return response.json() as Promise<LeadershipDayResponse>;
}
