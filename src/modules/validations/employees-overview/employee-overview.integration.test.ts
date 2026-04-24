import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../../app";
import { prisma } from "../../../lib/prisma";

type EmployeeOverviewTestContext = {
  employeeIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
  absenceIds: number[];
};

const testContexts: EmployeeOverviewTestContext[] = [];
const app = createApp({ includeValidations: true });

describe("Employee overview availability integration", () => {
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

  it("shows an employee as fully available when no absence applies", async () => {
    const scenario = await createEmployeeAvailabilityScenario("2026-05-14");

    const response = await request(app)
      .get("/validations/employees/overview")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      employeeId: scenario.employee.id,
      name: scenario.employee.name,
      role: scenario.employee.role,
      plannedAssignments: 2,
      availableAssignments: 2,
      absentAssignments: 0,
      status: "available",
    });
    expect(response.body[0].shifts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          shiftId: scenario.earlyShift.id,
          shiftType: "early",
          planned: true,
          available: true,
          absenceReason: null,
        }),
        expect.objectContaining({
          shiftId: scenario.lateShift.id,
          shiftType: "late",
          planned: true,
          available: true,
          absenceReason: null,
        }),
      ])
    );
  });

  it("marks all assignments as absent for a full_day absence", async () => {
    const scenario = await createEmployeeAvailabilityScenario("2026-05-15");
    const absence = await createAbsence(scenario.employee.id, scenario.date, "full_day");
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app)
      .get("/validations/employees/overview")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      employeeId: scenario.employee.id,
      plannedAssignments: 2,
      availableAssignments: 0,
      absentAssignments: 2,
      status: "absent",
    });
    expect(response.body[0].shifts.every((shift: { available: boolean; absenceReason: string }) => !shift.available && shift.absenceReason === "sick")).toBe(true);
  });

  it("marks only the early shift as absent for an early absence", async () => {
    const scenario = await createEmployeeAvailabilityScenario("2026-05-16");
    const absence = await createAbsence(scenario.employee.id, scenario.date, "early");
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app)
      .get("/validations/employees/overview")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      plannedAssignments: 2,
      availableAssignments: 1,
      absentAssignments: 1,
      status: "partially_available",
    });
    expect(response.body[0].shifts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          shiftId: scenario.earlyShift.id,
          available: false,
          absenceReason: "sick",
        }),
        expect.objectContaining({
          shiftId: scenario.lateShift.id,
          available: true,
          absenceReason: null,
        }),
      ])
    );
  });

  it("marks only the late shift as absent for a late absence", async () => {
    const scenario = await createEmployeeAvailabilityScenario("2026-05-17");
    const absence = await createAbsence(scenario.employee.id, scenario.date, "late");
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app)
      .get("/validations/employees/overview")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      plannedAssignments: 2,
      availableAssignments: 1,
      absentAssignments: 1,
      status: "partially_available",
    });
    expect(response.body[0].shifts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          shiftId: scenario.earlyShift.id,
          available: true,
          absenceReason: null,
        }),
        expect.objectContaining({
          shiftId: scenario.lateShift.id,
          available: false,
          absenceReason: "sick",
        }),
      ])
    );
  });

  it("returns an empty overview for a day without assignments", async () => {
    const response = await request(app)
      .get("/validations/employees/overview")
      .query({ date: "2026-05-18" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("uses today as default date when no query is provided", async () => {
    const today = utcDateOnly(new Date());
    const scenario = await createEmployeeAvailabilityScenario(today);

    const response = await request(app).get("/validations/employees/overview");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      employeeId: scenario.employee.id,
      status: "available",
    });
  });

  it("keeps assignments unchanged while employee overview only changes operational availability", async () => {
    const scenario = await createEmployeeAvailabilityScenario("2026-05-19");
    const assignmentsBefore = await prisma.assignment.findMany({
      where: {
        employeeId: scenario.employee.id,
      },
      orderBy: {
        id: "asc",
      },
    });
    const absence = await createAbsence(scenario.employee.id, scenario.date, "full_day");
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app)
      .get("/validations/employees/overview")
      .query({ date: scenario.date });

    const assignmentsAfter = await prisma.assignment.findMany({
      where: {
        employeeId: scenario.employee.id,
      },
      orderBy: {
        id: "asc",
      },
    });

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      status: "absent",
      availableAssignments: 0,
      absentAssignments: 2,
    });
    expect(assignmentsAfter).toEqual(assignmentsBefore);
  });
});

async function createEmployeeAvailabilityScenario(date: string) {
  const suffix = uniqueSuffix();
  const employee = await prisma.employee.create({
    data: {
      name: `Employee Overview ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: true,
    },
  });

  const [earlyShift, lateShift] = await Promise.all([
    prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    }),
    prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "late",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    }),
  ]);

  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        employeeId: employee.id,
        shiftId: earlyShift.id,
        status: "planned",
      },
    }),
    prisma.assignment.create({
      data: {
        employeeId: employee.id,
        shiftId: lateShift.id,
        status: "planned",
      },
    }),
  ]);

  const context = trackContext({
    employeeIds: [employee.id],
    shiftIds: [earlyShift.id, lateShift.id],
    assignmentIds: assignments.map((assignment) => assignment.id),
    absenceIds: [],
  });

  return {
    date,
    employee,
    earlyShift,
    lateShift,
    context,
  };
}

async function createAbsence(
  employeeId: number,
  date: string,
  scope: "full_day" | "early" | "late" | "night"
) {
  return prisma.absence.create({
    data: {
      employeeId,
      type: "sick",
      scope,
      startDate: new Date(`${date}T00:00:00.000Z`),
      status: "active",
    },
  });
}

function trackContext(
  context: EmployeeOverviewTestContext
): EmployeeOverviewTestContext {
  testContexts.push(context);
  return context;
}

async function cleanupScenario(context: EmployeeOverviewTestContext): Promise<void> {
  await prisma.absence.deleteMany({
    where: {
      OR: [
        {
          id: {
            in: context.absenceIds,
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

  await prisma.assignment.deleteMany({
    where: {
      OR: [
        {
          id: {
            in: context.assignmentIds,
          },
        },
        {
          employeeId: {
            in: context.employeeIds,
          },
        },
        {
          shiftId: {
            in: context.shiftIds,
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

function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function utcDateOnly(date: Date): string {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
    .toISOString()
    .slice(0, 10);
}
