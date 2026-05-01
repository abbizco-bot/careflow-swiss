import { describe, it, expect } from "vitest";
import { rollingPlanningViewService } from "./rolling-planning-view.service";

describe("rollingPlanningViewService", () => {
  it("returns a rolling window with correct date range", async () => {
    const startDate = new Date("2026-05-01");
    const windowDays = 7;

    const result = await rollingPlanningViewService.getRollingPlanningWindow(
      startDate,
      windowDays
    );

    expect(result.startDate).toBe("2026-05-01");
    expect(result.endDate).toBe("2026-05-08");
    expect(result.days).toHaveLength(7);
    expect(result.days[0].date).toBe("2026-05-01");
    expect(result.days[6].date).toBe("2026-05-07");
  });

  it("initializes all days with 'none' severity when no operational shifts exist", async () => {
    const startDate = new Date("2026-05-01");
    const windowDays = 7;

    const result = await rollingPlanningViewService.getRollingPlanningWindow(
      startDate,
      windowDays
    );

    for (const day of result.days) {
      expect(day.daySeverity).toBe("none");
      expect(day.dataStatus).toBe("operational_only");
      expect(day.hasReferencePlan).toBe(false);
    }
  });

  it("sets summary counters correctly for empty window", async () => {
    const startDate = new Date("2026-05-01");
    const windowDays = 7;

    const result = await rollingPlanningViewService.getRollingPlanningWindow(
      startDate,
      windowDays
    );

    expect(result.summary).toBeDefined();
    expect(result.summary?.criticalDayCount).toBe(0);
    expect(result.summary?.attentionDayCount).toBe(0);
  });

  it("returns days sorted by date", async () => {
    const startDate = new Date("2026-05-01");
    const windowDays = 10;

    const result = await rollingPlanningViewService.getRollingPlanningWindow(
      startDate,
      windowDays
    );

    for (let i = 0; i < result.days.length - 1; i++) {
      expect(result.days[i].date <= result.days[i + 1].date).toBe(true);
    }
  });
});
