import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../../app";
import { prisma } from "../../../lib/prisma";

type FullTestContext = {
  employeeIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
  absenceIds: number[];
};

const testContexts: FullTestContext[] = [];
const app = createApp({ includeValidations: true });

describe("Full shift detail integration", () => {
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

  it("returns 200 for a valid date", async () => {
    const scenario = await createFullScenario("2026-05-20");

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body.date).toBe(scenario.date);
    expect(response.body.shifts).toHaveLength(1);
  });

  it("returns an empty shift list for a day without shifts", async () => {
    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: "2026-05-21" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: "2026-05-21",
      shifts: [],
    });
  });

  it("returns coverage and qualification fields in the full response", async () => {
    const scenario = await createFullScenario("2026-05-22");

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body.shifts[0]).toMatchObject({
      shiftId: scenario.shift.id,
      shiftType: "early",
      requiredCount: 2,
      assignedCount: 2,
      availableAssignedCount: 2,
      absentAssignedCount: 0,
      requiredQualifiedCount: 1,
      assignedQualifiedCount: 1,
      availableQualifiedCount: 1,
      absentQualifiedCount: 0,
    });
  });

  it("aggregates issues from coverage and qualification and prioritizes overallStatus", async () => {
    const scenario = await createCriticalFullScenario("2026-05-23");

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body.shifts[0]).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "critical",
    });
    expect(response.body.shifts[0].issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "SHIFT_UNDERSTAFFED",
          source: "coverage",
        }),
        expect.objectContaining({
          code: "SHIFT_UNDERQUALIFIED",
          source: "qualification",
        }),
      ])
    );
  });

  it("shows absence impact indirectly through available counts", async () => {
    const scenario = await createAbsenceImpactFullScenario("2026-05-24");
    const absence = await prisma.absence.create({
      data: {
        employeeId: scenario.qualifiedEmployee.id,
        type: "sick",
        scope: "full_day",
        startDate: new Date(`${scenario.date}T00:00:00.000Z`),
        status: "active",
      },
    });
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body.shifts[0]).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "critical",
      assignedCount: 2,
      availableAssignedCount: 1,
      absentAssignedCount: 1,
      assignedQualifiedCount: 1,
      availableQualifiedCount: 0,
      absentQualifiedCount: 1,
    });
  });

  it("counts planned assignments as effective staffing", async () => {
    const scenario = await createFullScenario("2026-05-25");

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body.shifts[0]).toMatchObject({
      assignedCount: 2,
      availableAssignedCount: 2,
      overallStatus: "ok",
    });
  });

  it("does not count sick assignments as effective staffing", async () => {
    const scenario = await createSingleStatusScenario("2026-05-26", "sick");

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body.shifts[0]).toMatchObject({
      assignedCount: 0,
      availableAssignedCount: 0,
      overallStatus: "critical",
    });
  });

  it("does not count requested assignments as effective staffing", async () => {
    const scenario = await createSingleStatusScenario("2026-05-27", "requested");

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body.shifts[0]).toMatchObject({
      assignedCount: 0,
      availableAssignedCount: 0,
      overallStatus: "critical",
    });
  });

  it("reports assigned function mismatches as warning findings", async () => {
    const scenario = await createQualificationFunctionScenario("2026-05-28");

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body.shifts[0]).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "warning",
    });
    expect(response.body.shifts[0].issues).toHaveLength(1);
    expect(response.body.shifts[0].issues).toEqual([
      expect.objectContaining({
        code: "ASSIGNMENT_FUNCTION_BASE_QUALIFICATION_MISMATCH",
        source: "qualification-function",
        severity: "warning",
        assignmentId: scenario.assignment.id,
        employeeId: scenario.employee.id,
        baseQualification: "FAGE",
        assignedFunction: "Hausverantwortung",
        message:
          "Die zugewiesene Funktion Hausverantwortung passt nicht zur Stammqualifikation FAGE.",
      }),
    ]);
  });

  it("returns a german validation error when date is missing", async () => {
    const response = await request(app).get("/validations/shifts/full");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_INVALID_DATE",
        message:
          "Der Query-Parameter 'date' ist erforderlich und muss ein gültiges Datum sein.",
      },
    });
  });
});

async function createFullScenario(date: string) {
  const suffix = uniqueSuffix();
  const qualifiedEmployee = await prisma.employee.create({
    data: {
      name: `Full Qualified ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: true,
    },
  });
  const supportEmployee = await prisma.employee.create({
    data: {
      name: `Full Support ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: false,
    },
  });
  const shift = await prisma.shift.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      type: "early",
      requiredCount: 2,
      requiredQualifiedCount: 1,
    },
  });
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        employeeId: qualifiedEmployee.id,
        shiftId: shift.id,
        status: "planned",
      },
    }),
    prisma.assignment.create({
      data: {
        employeeId: supportEmployee.id,
        shiftId: shift.id,
        status: "planned",
      },
    }),
  ]);

  const context = trackContext({
    employeeIds: [qualifiedEmployee.id, supportEmployee.id],
    shiftIds: [shift.id],
    assignmentIds: assignments.map((assignment) => assignment.id),
    absenceIds: [],
  });

  return {
    date,
    shift,
    qualifiedEmployee,
    context,
  };
}

async function createCriticalFullScenario(date: string) {
  const suffix = uniqueSuffix();
  const supportEmployee = await prisma.employee.create({
    data: {
      name: `Full Critical Support ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: false,
    },
  });
  const shift = await prisma.shift.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      type: "late",
      requiredCount: 2,
      requiredQualifiedCount: 1,
    },
  });
  const assignment = await prisma.assignment.create({
    data: {
      employeeId: supportEmployee.id,
      shiftId: shift.id,
      status: "planned",
    },
  });

  const context = trackContext({
    employeeIds: [supportEmployee.id],
    shiftIds: [shift.id],
    assignmentIds: [assignment.id],
    absenceIds: [],
  });

  return {
    date,
    shift,
    context,
  };
}

async function createAbsenceImpactFullScenario(date: string) {
  const scenario = await createFullScenario(date);

  return scenario;
}

async function createSingleStatusScenario(
  date: string,
  status: string
) {
  const suffix = uniqueSuffix();
  const employee = await prisma.employee.create({
    data: {
      name: `Full Status ${status} ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: true,
    },
  });
  const shift = await prisma.shift.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      type: "early",
      requiredCount: 1,
      requiredQualifiedCount: 1,
    },
  });
  const assignment = await prisma.assignment.create({
    data: {
      employeeId: employee.id,
      shiftId: shift.id,
      status,
    },
  });

  const context = trackContext({
    employeeIds: [employee.id],
    shiftIds: [shift.id],
    assignmentIds: [assignment.id],
    absenceIds: [],
  });

  return {
    date,
    shift,
    context,
  };
}

async function createQualificationFunctionScenario(date: string) {
  const suffix = uniqueSuffix();
  const employee = await prisma.employee.create({
    data: {
      name: `Full Function Mismatch ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: true,
      baseQualification: "FAGE",
    },
  });
  const shift = await prisma.shift.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      type: "night",
      requiredCount: 1,
      requiredQualifiedCount: 1,
    },
  });
  const assignment = await prisma.assignment.create({
    data: {
      employeeId: employee.id,
      shiftId: shift.id,
      status: "planned",
      assignedFunction: "Hausverantwortung",
    },
  });

  const context = trackContext({
    employeeIds: [employee.id],
    shiftIds: [shift.id],
    assignmentIds: [assignment.id],
    absenceIds: [],
  });

  return {
    date,
    shift,
    employee,
    assignment,
    context,
  };
}

function trackContext(context: FullTestContext): FullTestContext {
  testContexts.push(context);
  return context;
}

async function cleanupScenario(context: FullTestContext): Promise<void> {
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

function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
