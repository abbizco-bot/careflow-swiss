import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type TestContext = {
  planningMonthIds: number[];
};

const testContexts: TestContext[] = [];
const app = createApp({ includeValidations: false });

describe("Rolling Planning View API Integration Smoke Test", () => {
  afterEach(async () => {
    while (testContexts.length > 0) {
      const context = testContexts.pop();

      if (!context) {
        continue;
      }

      await prisma.planningMonth.deleteMany({
        where: {
          id: {
            in: context.planningMonthIds,
          },
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

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

    const firstDay = response.body.days[0];
    expect(firstDay).toHaveProperty("daySeverity");
    expect(firstDay).toHaveProperty("hasReferencePlan");
    expect(firstDay).toHaveProperty("dataStatus");
  });

  it("signals an active planning day as a reference plan", async () => {
    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: 2026,
        month: 5,
        status: "active",
      },
    });

    await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date(Date.UTC(2026, 4, 1)),
        isSpecialDay: false,
      },
    });

    testContexts.push({ planningMonthIds: [planningMonth.id] });

    const response = await request(app)
      .get("/rolling-planning/window?startDate=2026-05-01&windowDays=7");

    expect(response.status).toBe(200);
    expect(response.body.days[0]).toMatchObject({
      date: "2026-05-01",
      hasReferencePlan: true,
      dataStatus: "reference_plan",
    });
    expect(response.body.days[1]).toMatchObject({
      date: "2026-05-02",
      hasReferencePlan: false,
      dataStatus: "operational_only",
    });
  });

  it("signals a draft planning day with draft plan status", async () => {
    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: 2026,
        month: 5,
        status: "draft",
      },
    });

    await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date(Date.UTC(2026, 4, 1)),
        isSpecialDay: false,
      },
    });

    testContexts.push({ planningMonthIds: [planningMonth.id] });

    const response = await request(app)
      .get("/rolling-planning/window?startDate=2026-05-01&windowDays=7");

    expect(response.status).toBe(200);
    expect(response.body.days[0]).toMatchObject({
      date: "2026-05-01",
      hasReferencePlan: false,
      dataStatus: "draft_plan",
    });
  });

  it("rejects missing startDate", async () => {
    const response = await request(app)
      .get("/rolling-planning/window?windowDays=28");

    expect(response.status).toBe(400);
  });

  it("rejects invalid startDate format", async () => {
    const response = await request(app)
      .get("/rolling-planning/window?startDate=invalid-date&windowDays=28");

    expect(response.status).toBe(400);
  });

  it("rejects windowDays below allowed range", async () => {
    const response = await request(app)
      .get("/rolling-planning/window?startDate=2026-05-01&windowDays=0");

    expect(response.status).toBe(400);
  });

  it("returns a rolling planning window with 7 days", async () => {
    const response = await request(app)
      .get("/rolling-planning/window?startDate=2026-05-01&windowDays=7");

    expect(response.status).toBe(200);
    expect(response.body.days).toBeDefined();
    expect(Array.isArray(response.body.days)).toBe(true);
    expect(response.body.days).toHaveLength(7);
    expect(response.body.days[0].date).toBe("2026-05-01");
    expect(response.body.days[6].date).toBe("2026-05-07");
  });
});