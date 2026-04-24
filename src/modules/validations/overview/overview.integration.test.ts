import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../../app";
import { prisma } from "../../../lib/prisma";

type OverviewTestContext = {
  employeeIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
};

const testContexts: OverviewTestContext[] = [];
const app = createApp({ includeValidations: true });

describe("Shift overview integration", () => {
  afterEach(async () => {
    while (testContexts.length > 0) {
      const context = testContexts.pop();

      if (!context) {
        continue;
      }

      await cleanupScenario(context);
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns a sorted mixed overview with critical, warning and ok shifts", async () => {
    const scenario = await createMixedOverviewScenario();

    const response = await request(app)
      .get("/validations/shifts/overview")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      date: scenario.date,
      shiftCount: 3,
      criticalCount: 1,
      warningCount: 1,
      okCount: 1,
    });

    expect(response.body.shifts).toHaveLength(3);

    const [criticalShift, warningShift, okShift] = response.body.shifts;

    expect(criticalShift).toMatchObject({
      shiftId: scenario.criticalShift.id,
      type: "day",
      overallStatus: "critical",
    });
    expect(criticalShift.issueCount).toBeGreaterThan(0);
    expect(criticalShift.issues[0]).toMatchObject({
      code: "SHIFT_UNDERSTAFFED",
      source: "coverage",
    });

    expect(warningShift).toMatchObject({
      shiftId: scenario.warningShift.id,
      type: "evening",
      overallStatus: "warning",
    });
    expect(warningShift.issueCount).toBeGreaterThan(0);

    expect(okShift).toMatchObject({
      shiftId: scenario.okShift.id,
      type: "night",
      overallStatus: "ok",
      issueCount: 0,
      issues: [],
    });

    expect(response.body.shifts.map((shift: { overallStatus: string }) => shift.overallStatus)).toEqual([
      "critical",
      "warning",
      "ok",
    ]);
  });

  it("returns an empty overview for a day without shifts", async () => {
    const response = await request(app)
      .get("/validations/shifts/overview")
      .query({ date: "2026-05-01" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: "2026-05-01",
      shiftCount: 0,
      criticalCount: 0,
      warningCount: 0,
      okCount: 0,
      shifts: [],
    });
  });

  it("rejects missing or invalid date parameters", async () => {
    const missingDateResponse = await request(app).get(
      "/validations/shifts/overview"
    );

    const invalidDateResponse = await request(app)
      .get("/validations/shifts/overview")
      .query({ date: "2026-02-30" });

    expect(missingDateResponse.status).toBe(400);
    expect(missingDateResponse.body).toMatchObject({
      error: {
        code: "VALIDATION_INVALID_DATE",
      },
    });

    expect(invalidDateResponse.status).toBe(400);
    expect(invalidDateResponse.body).toMatchObject({
      error: {
        code: "VALIDATION_INVALID_DATE",
      },
    });
  });
});

async function createMixedOverviewScenario() {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const date = "2026-04-22";
  const shiftDate = new Date(`${date}T00:00:00.000Z`);

  const qualifiedEmployee = await prisma.employee.create({
    data: {
      name: `Overview Qualified ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: true,
    },
  });

  const nonQualifiedOne = await prisma.employee.create({
    data: {
      name: `Overview NonQualified 1 ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: false,
    },
  });

  const nonQualifiedTwo = await prisma.employee.create({
    data: {
      name: `Overview NonQualified 2 ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: false,
    },
  });

  const criticalShift = await prisma.shift.create({
    data: {
      date: shiftDate,
      type: "day",
      requiredCount: 3,
      requiredQualifiedCount: 1,
    },
  });

  const warningShift = await prisma.shift.create({
    data: {
      date: shiftDate,
      type: "evening",
      requiredCount: 1,
      requiredQualifiedCount: 0,
    },
  });

  const okShift = await prisma.shift.create({
    data: {
      date: shiftDate,
      type: "night",
      requiredCount: 1,
      requiredQualifiedCount: 1,
    },
  });

  const criticalAssignment = await prisma.assignment.create({
    data: {
      employeeId: qualifiedEmployee.id,
      shiftId: criticalShift.id,
      status: "planned",
    },
  });

  const warningAssignmentOne = await prisma.assignment.create({
    data: {
      employeeId: nonQualifiedOne.id,
      shiftId: warningShift.id,
      status: "planned",
    },
  });

  const warningAssignmentTwo = await prisma.assignment.create({
    data: {
      employeeId: nonQualifiedTwo.id,
      shiftId: warningShift.id,
      status: "planned",
    },
  });

  const okAssignment = await prisma.assignment.create({
    data: {
      employeeId: qualifiedEmployee.id,
      shiftId: okShift.id,
      status: "planned",
    },
  });

  testContexts.push({
    employeeIds: [
      qualifiedEmployee.id,
      nonQualifiedOne.id,
      nonQualifiedTwo.id,
    ],
    shiftIds: [criticalShift.id, warningShift.id, okShift.id],
    assignmentIds: [
      criticalAssignment.id,
      warningAssignmentOne.id,
      warningAssignmentTwo.id,
      okAssignment.id,
    ],
  });

  return {
    date,
    criticalShift,
    warningShift,
    okShift,
  };
}

async function cleanupScenario(context: OverviewTestContext): Promise<void> {
  await prisma.assignment.deleteMany({
    where: {
      OR: [
        {
          id: {
            in: context.assignmentIds,
          },
        },
        {
          shiftId: {
            in: context.shiftIds,
          },
        },
        {
          employeeId: {
            in: context.employeeIds,
          },
        },
      ],
    },
  });

  await prisma.shift.deleteMany({
    where: {
      id: {
        in: context.shiftIds,
      },
    },
  });

  await prisma.employee.deleteMany({
    where: {
      id: {
        in: context.employeeIds,
      },
    },
  });
}
