import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";

const app = createApp({ includeValidations: false });

describe("Rolling Planning View API Integration Smoke Test", () => {
  it("returns a rolling planning window with 28 days", async () => {
    const response = await request(app)
      .get("/rolling-planning/window?startDate=2026-05-01&windowDays=28");

    expect(response.status).toBe(200);
    expect(response.body.days).toBeDefined();
    expect(Array.isArray(response.body.days)).toBe(true);
    expect(response.body.days).toHaveLength(28);

    // Verify days are sorted by date ascending
    for (let i = 0; i < response.body.days.length - 1; i++) {
      expect(response.body.days[i].date <= response.body.days[i + 1].date).toBe(true);
    }

    // Boundary contract: first and last day
    expect(response.body.days[0].date).toBe("2026-05-01");
    expect(response.body.days[27].date).toBe("2026-05-28");
  });
});