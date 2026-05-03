import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type RollingPlanningViewTestContext = {
  planningMonthIds: number[];
};

const testContexts: RollingPlanningViewTestContext[] = [];
const app = createApp({ includeValidations: false });

describe("Rolling Planning View API Integration Smoke Test", () => {
  afterEach(async () => {
    while (testContexts.length > 0) {
      const context = testContexts.pop();

      if (!context) {
        continue;
      }

      await prisma.planningShiftTemplate.deleteMany({
        where: {
          planningDay: {
            planningMonthId: {
              in: context.planningMonthIds,
            },
          },
        },
      });

      await prisma.planningDay.deleteMany({
        where: {
          planningMonthId: {
            in: context.planningMonthIds,
          },
        },
      });

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
    const response = await request(app).get(
      "/rolling-planning/window?startDate=2026-05-01"
    );

    expect(response.status).toBe(200);
    expect(response.body.startDate).toBe("2026-05-01");
    expect(response.body.endDate).toBe("2026-05-29");
    expect(response.body.days).toHaveLength(28);
    expect(response.body.days[0].date).toBe("2026-05-01");
    expect(response.body.days[27].date).toBe("2026-05-28");

    const firstDay = response.body.days[0];
    expect(firstDay).toHaveProperty("daySeverity");
    expect(firstDay).toHaveProperty("hasReferencePlan");
    expect(firstDay).toHaveProperty("dataStatus");
  });

  it("returns operational day summary for shifts with assignments", async () => {
    const employee = await prisma.employee.create({
      data: {
        name: "Test",
        role: "Pflege",
        qualified: true,
        workload: 100,
      },
    });

    const shift = await prisma.shift.create({
      data: {
        date: new Date("2040-01-15T00:00:00.000Z"),
        type: "night",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });

    await prisma.assignment.create({
      data: {
        shiftId: shift.id,
        employeeId: employee.id,
      },
    });

    const response = await request(app).get(
      "/rolling-planning/window?startDate=2040-01-15&windowDays=1"
    );

    expect(response.status).toBe(200);
    expect(response.body.days[0].operationalDaySummary).toEqual({
      shiftCount: 1,
      assignmentCount: 1,
    });
  });
  
  it("signals a reference planning day as a reference plan", async () => {
    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: 2026,
        month: 7,
        status: "reference",
      },
    });

    const planningDay = await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date("2026-07-01T00:00:00.000Z"),
      },
    });

    await prisma.planningShiftTemplate.create({
      data: {
        planningDayId: planningDay.id,
        type: "early",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });

    testContexts.push({ planningMonthIds: [planningMonth.id] });

    const response = await request(app).get(
      "/rolling-planning/window?startDate=2026-07-01&windowDays=7"
    );

    expect(response.status).toBe(200);
    expect(response.body.days[0]).toMatchObject({
      date: "2026-07-01",
      hasReferencePlan: true,
      dataStatus: "reference_plan",
      plannedShiftSummary: {
        shiftTemplateCount: 1,
        shiftTypes: ["early"],
    },
  });
    expect(response.body.days[1]).toMatchObject({
      date: "2026-07-02",
      hasReferencePlan: false,
      dataStatus: "operational_only",
    });
  });

    it("returns planned shift summary for multiple shift templates", async () => {
      const planningMonth = await prisma.planningMonth.create({
        data: {
          year: 2026,
          month: 8,
          status: "reference",
        },
      });

    const planningDay = await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date("2026-08-01T00:00:00.000Z"),
      },
    });

    await prisma.planningShiftTemplate.createMany({
      data: [
        {
          planningDayId: planningDay.id,
          type: "early",
          requiredCount: 1,
          requiredQualifiedCount: 1,
        },
        {
          planningDayId: planningDay.id,
          type: "late",
          requiredCount: 1,
          requiredQualifiedCount: 1,
        },
      ],
    });

    testContexts.push({ planningMonthIds: [planningMonth.id] });

    const response = await request(app).get(
      "/rolling-planning/window?startDate=2026-08-01&windowDays=7"
    );

    expect(response.status).toBe(200);
    expect(response.body.days[0]).toMatchObject({
      date: "2026-08-01",
      plannedShiftSummary: {
        shiftTemplateCount: 2,
        shiftTypes: ["early", "late"],
      },
    });
  });
  
  it("signals a draft planning day with draft plan status", async () => {
    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: 2026,
        month: 6,
        status: "draft",
      },
    });

    const planningDay = await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date("2026-06-01T00:00:00.000Z"),
      },
    });

    await prisma.planningShiftTemplate.create({
      data: {
        planningDayId: planningDay.id,
        type: "early",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });

    testContexts.push({ planningMonthIds: [planningMonth.id] });

    const response = await request(app).get(
      "/rolling-planning/window?startDate=2026-06-01&windowDays=7"
    );

    expect(response.status).toBe(200);
    expect(response.body.days[0]).toMatchObject({
      date: "2026-06-01",
      hasReferencePlan: false,
      dataStatus: "draft_plan",
    });
  });

  it("signals an incomplete planning day without shift templates", async () => {
  const planningMonth = await prisma.planningMonth.create({
    data: {
      year: 2026,
      month: 8,
      status: "reference",
    },
  });

  await prisma.planningDay.create({
    data: {
      planningMonthId: planningMonth.id,
      date: new Date("2026-08-01T00:00:00.000Z"),
    },
  });

  testContexts.push({ planningMonthIds: [planningMonth.id] });

  const response = await request(app).get(
    "/rolling-planning/window?startDate=2026-08-01&windowDays=7"
  );

  expect(response.status).toBe(200);
  expect(response.body.days[0]).toMatchObject({
    date: "2026-08-01",
    hasReferencePlan: false,
    dataStatus: "incomplete",
  });
});

  it("rejects missing startDate", async () => {
    const response = await request(app).get(
      "/rolling-planning/window?windowDays=28"
    );

    expect(response.status).toBe(400);
  });

  it("rejects invalid startDate format", async () => {
    const response = await request(app).get(
      "/rolling-planning/window?startDate=invalid-date&windowDays=28"
    );

    expect(response.status).toBe(400);
  });

  it("rejects windowDays below allowed range", async () => {
    const response = await request(app).get(
      "/rolling-planning/window?startDate=2026-05-01&windowDays=0"
    );

    expect(response.status).toBe(400);
  });

  it("returns a rolling planning window with 7 days", async () => {
    const response = await request(app).get(
      "/rolling-planning/window?startDate=2026-05-01&windowDays=7"
    );

    expect(response.status).toBe(200);
    expect(response.body.startDate).toBe("2026-05-01");
    expect(response.body.endDate).toBe("2026-05-08");
    expect(response.body.days).toHaveLength(7);
    expect(response.body.days[0].date).toBe("2026-05-01");
    expect(response.body.days[6].date).toBe("2026-05-07");
  });
});