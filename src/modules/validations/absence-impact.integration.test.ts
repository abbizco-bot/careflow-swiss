import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type AbsenceImpactTestContext = {
  employeeIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
  absenceIds: number[];
};

const testContexts: AbsenceImpactTestContext[] = [];
const app = createApp({ includeValidations: true });

describe("Absence impact integration", () => {
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

  it("keeps a planned shift stable when no active absence applies", async () => {
    const scenario = await createStableShiftScenario();

    const response = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "ok",
      coverage: {
        assignedCount: 1,
        availableAssignedCount: 1,
        absentAssignedCount: 0,
        status: "ok",
      },
      qualification: {
        assignedQualifiedCount: 1,
        availableQualifiedCount: 1,
        absentQualifiedCount: 0,
        status: "ok",
      },
    });
  });

  it("marks a previously stable shift as understaffed when one assigned employee is absent", async () => {
    const scenario = await createUnderstaffedByAbsenceScenario();

    const beforeResponse = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(beforeResponse.status).toBe(200);
    expect(beforeResponse.body.overallStatus).toBe("ok");

    const absence = await createActiveAbsence(
      scenario.absentEmployee.id,
      scenario.date
    );
    scenario.context.absenceIds.push(absence.id);

    const coverageResponse = await request(app).get(
      `/validations/coverage/shifts/${scenario.shift.id}`
    );
    const fullResponse = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(coverageResponse.status).toBe(200);
    expect(coverageResponse.body).toMatchObject({
      shiftId: scenario.shift.id,
      assignedCount: 2,
      availableAssignedCount: 1,
      absentAssignedCount: 1,
      gap: 1,
      status: "understaffed",
    });

    expect(fullResponse.status).toBe(200);
    expect(fullResponse.body).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "critical",
    });
    expect(fullResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "SHIFT_UNDERSTAFFED",
          source: "coverage",
        }),
      ])
    );
  });

  it("marks qualification as critical when the assigned qualified employee is absent", async () => {
    const scenario = await createUnderqualifiedByAbsenceScenario();

    const beforeResponse = await request(app).get(
      `/validations/qualification/shifts/${scenario.shift.id}`
    );

    expect(beforeResponse.status).toBe(200);
    expect(beforeResponse.body).toMatchObject({
      shiftId: scenario.shift.id,
      assignedQualifiedCount: 1,
      availableQualifiedCount: 1,
      absentQualifiedCount: 0,
      status: "ok",
    });

    const absence = await createActiveAbsence(
      scenario.qualifiedEmployee.id,
      scenario.date
    );
    scenario.context.absenceIds.push(absence.id);

    const qualificationResponse = await request(app).get(
      `/validations/qualification/shifts/${scenario.shift.id}`
    );
    const fullResponse = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(qualificationResponse.status).toBe(200);
    expect(qualificationResponse.body).toMatchObject({
      shiftId: scenario.shift.id,
      assignedQualifiedCount: 1,
      availableQualifiedCount: 0,
      absentQualifiedCount: 1,
      gap: 1,
      status: "underqualified",
    });

    expect(fullResponse.status).toBe(200);
    expect(fullResponse.body).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "critical",
    });
    expect(fullResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "SHIFT_UNDERQUALIFIED",
          source: "qualification",
        }),
      ])
    );
  });

  it("keeps qualification ok when two qualified employees are planned and only one is absent", async () => {
    const scenario = await createQualificationStillOkScenario();

    const absence = await createActiveAbsence(
      scenario.absentQualifiedEmployee.id,
      scenario.date
    );
    scenario.context.absenceIds.push(absence.id);

    const qualificationResponse = await request(app).get(
      `/validations/qualification/shifts/${scenario.shift.id}`
    );
    const fullResponse = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(qualificationResponse.status).toBe(200);
    expect(qualificationResponse.body).toMatchObject({
      shiftId: scenario.shift.id,
      assignedQualifiedCount: 2,
      availableQualifiedCount: 1,
      absentQualifiedCount: 1,
      gap: 0,
      status: "ok",
      issues: [],
    });

    expect(fullResponse.status).toBe(200);
    expect(fullResponse.body.overallStatus).toBe("ok");
  });

  it("does not reduce qualification when only a non-qualified assigned employee is absent", async () => {
    const scenario = await createNonQualifiedAbsenceScenario();

    const absence = await createActiveAbsence(
      scenario.absentSupportEmployee.id,
      scenario.date
    );
    scenario.context.absenceIds.push(absence.id);

    const qualificationResponse = await request(app).get(
      `/validations/qualification/shifts/${scenario.shift.id}`
    );
    const fullResponse = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(qualificationResponse.status).toBe(200);
    expect(qualificationResponse.body).toMatchObject({
      shiftId: scenario.shift.id,
      assignedQualifiedCount: 1,
      availableQualifiedCount: 1,
      absentQualifiedCount: 0,
      gap: 0,
      status: "ok",
      issues: [],
    });

    expect(fullResponse.status).toBe(200);
    expect(fullResponse.body.overallStatus).toBe("critical");
    expect(fullResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "SHIFT_UNDERSTAFFED",
          source: "coverage",
          availableAssignedCount: 1,
          absentAssignedCount: 1,
        }),
      ])
    );
    expect(fullResponse.body.issues).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "SHIFT_UNDERQUALIFIED",
        }),
      ])
    );
  });

  it("reprioritizes the shift overview when absence reduces operational capacity", async () => {
    const scenario = await createOverviewAbsenceImpactScenario();

    const absence = await createActiveAbsence(
      scenario.impactedEmployee.id,
      scenario.date
    );
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app)
      .get("/validations/shifts/overview")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      date: scenario.date,
      shiftCount: 2,
      criticalCount: 1,
      warningCount: 0,
      okCount: 1,
    });

    expect(response.body.shifts).toHaveLength(2);
    expect(response.body.shifts.map((shift: { overallStatus: string }) => shift.overallStatus)).toEqual([
      "critical",
      "ok",
    ]);

    expect(response.body.shifts[0]).toMatchObject({
      shiftId: scenario.impactedShift.id,
      overallStatus: "critical",
      assignedCount: 2,
      availableAssignedCount: 1,
      absentAssignedCount: 1,
    });
    expect(response.body.shifts[0].issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "SHIFT_UNDERSTAFFED",
          source: "coverage",
        }),
      ])
    );
  });

  it("does not let an early-scope absence affect a late shift", async () => {
    const scenario = await createScopedShiftScenario("late", "early", "2026-05-04");

    const absence = await createActiveAbsence(
      scenario.employee.id,
      scenario.date,
      scenario.absenceScope
    );
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "ok",
      coverage: {
        availableAssignedCount: 1,
        absentAssignedCount: 0,
      },
    });
  });

  it("does not let a late-scope absence affect an early shift", async () => {
    const scenario = await createScopedShiftScenario("early", "late", "2026-05-05");

    const absence = await createActiveAbsence(
      scenario.employee.id,
      scenario.date,
      scenario.absenceScope
    );
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "ok",
      coverage: {
        availableAssignedCount: 1,
        absentAssignedCount: 0,
      },
    });
  });

  it("does not let a night-scope absence affect an early shift", async () => {
    const scenario = await createScopedShiftScenario("early", "night", "2026-05-06");

    const absence = await createActiveAbsence(
      scenario.employee.id,
      scenario.date,
      scenario.absenceScope
    );
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      shiftId: scenario.shift.id,
      overallStatus: "ok",
      coverage: {
        availableAssignedCount: 1,
        absentAssignedCount: 0,
      },
    });
  });

  it("lets a full_day absence affect all shift types of the day", async () => {
    const scenario = await createFullDayMultiShiftScenario();

    const absence = await createActiveAbsence(
      scenario.employee.id,
      scenario.date,
      "full_day"
    );
    scenario.context.absenceIds.push(absence.id);

    const response = await request(app)
      .get("/validations/shifts/overview")
      .query({ date: scenario.date });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      date: scenario.date,
      shiftCount: 3,
      criticalCount: 3,
      warningCount: 0,
      okCount: 0,
    });
    expect(response.body.shifts).toHaveLength(3);
    for (const shift of response.body.shifts) {
      expect(shift).toMatchObject({
        overallStatus: "critical",
        assignedCount: 1,
        availableAssignedCount: 0,
        absentAssignedCount: 1,
      });
    }
  });

  it("keeps assignment records unchanged while only the operational evaluation changes", async () => {
    const scenario = await createUnderstaffedByAbsenceScenario();
    const assignmentsBefore = await prisma.assignment.findMany({
      where: {
        shiftId: scenario.shift.id,
      },
      orderBy: {
        id: "asc",
      },
    });

    const absence = await createActiveAbsence(
      scenario.absentEmployee.id,
      scenario.date
    );
    scenario.context.absenceIds.push(absence.id);

    const validationResponse = await request(app).get(
      `/validations/full/shifts/${scenario.shift.id}`
    );

    const assignmentsAfter = await prisma.assignment.findMany({
      where: {
        shiftId: scenario.shift.id,
      },
      orderBy: {
        id: "asc",
      },
    });

    expect(validationResponse.status).toBe(200);
    expect(validationResponse.body.overallStatus).toBe("critical");
    expect(assignmentsAfter).toHaveLength(assignmentsBefore.length);
    expect(assignmentsAfter).toEqual(assignmentsBefore);
  });
});

async function createStableShiftScenario() {
  const suffix = uniqueSuffix();
  const date = "2026-04-28";
  const employee = await createEmployee(`Absence Impact Stable ${suffix}`, true);
  const shift = await createShift(date, "day", 1, 1);
  const assignment = await createAssignment(employee.id, shift.id);

  const context = trackContext({
    employeeIds: [employee.id],
    shiftIds: [shift.id],
    assignmentIds: [assignment.id],
    absenceIds: [],
  });

  return {
    date,
    employee,
    shift,
    context,
  };
}

async function createUnderstaffedByAbsenceScenario() {
  const suffix = uniqueSuffix();
  const date = "2026-04-29";
  const qualifiedEmployee = await createEmployee(
    `Absence Impact Qualified ${suffix}`,
    true
  );
  const absentEmployee = await createEmployee(
    `Absence Impact Absent ${suffix}`,
    false
  );
  const shift = await createShift(date, "day", 2, 1);
  const qualifiedAssignment = await createAssignment(
    qualifiedEmployee.id,
    shift.id
  );
  const absentAssignment = await createAssignment(absentEmployee.id, shift.id);

  const context = trackContext({
    employeeIds: [qualifiedEmployee.id, absentEmployee.id],
    shiftIds: [shift.id],
    assignmentIds: [qualifiedAssignment.id, absentAssignment.id],
    absenceIds: [],
  });

  return {
    date,
    shift,
    absentEmployee,
    context,
  };
}

async function createUnderqualifiedByAbsenceScenario() {
  const suffix = uniqueSuffix();
  const date = "2026-04-30";
  const qualifiedEmployee = await createEmployee(
    `Absence Impact Qualification Qualified ${suffix}`,
    true
  );
  const supportEmployee = await createEmployee(
    `Absence Impact Qualification Support ${suffix}`,
    false
  );
  const shift = await createShift(date, "evening", 1, 1);
  const qualifiedAssignment = await createAssignment(
    qualifiedEmployee.id,
    shift.id
  );
  const supportAssignment = await createAssignment(supportEmployee.id, shift.id);

  const context = trackContext({
    employeeIds: [qualifiedEmployee.id, supportEmployee.id],
    shiftIds: [shift.id],
    assignmentIds: [qualifiedAssignment.id, supportAssignment.id],
    absenceIds: [],
  });

  return {
    date,
    shift,
    qualifiedEmployee,
    context,
  };
}

async function createQualificationStillOkScenario() {
  const suffix = uniqueSuffix();
  const date = "2026-05-07";
  const availableQualifiedEmployee = await createEmployee(
    `Absence Impact Qualification Backup ${suffix}`,
    true
  );
  const absentQualifiedEmployee = await createEmployee(
    `Absence Impact Qualification Absent ${suffix}`,
    true
  );
  const shift = await createShift(date, "early", 1, 1);
  const assignments = await Promise.all([
    createAssignment(availableQualifiedEmployee.id, shift.id),
    createAssignment(absentQualifiedEmployee.id, shift.id),
  ]);

  const context = trackContext({
    employeeIds: [availableQualifiedEmployee.id, absentQualifiedEmployee.id],
    shiftIds: [shift.id],
    assignmentIds: assignments.map((assignment) => assignment.id),
    absenceIds: [],
  });

  return {
    date,
    shift,
    absentQualifiedEmployee,
    context,
  };
}

async function createNonQualifiedAbsenceScenario() {
  const suffix = uniqueSuffix();
  const date = "2026-05-08";
  const qualifiedEmployee = await createEmployee(
    `Absence Impact NonQualified Qualified ${suffix}`,
    true
  );
  const absentSupportEmployee = await createEmployee(
    `Absence Impact NonQualified Support ${suffix}`,
    false
  );
  const shift = await createShift(date, "late", 2, 1);
  const assignments = await Promise.all([
    createAssignment(qualifiedEmployee.id, shift.id),
    createAssignment(absentSupportEmployee.id, shift.id),
  ]);

  const context = trackContext({
    employeeIds: [qualifiedEmployee.id, absentSupportEmployee.id],
    shiftIds: [shift.id],
    assignmentIds: assignments.map((assignment) => assignment.id),
    absenceIds: [],
  });

  return {
    date,
    shift,
    absentSupportEmployee,
    context,
  };
}

async function createOverviewAbsenceImpactScenario() {
  const suffix = uniqueSuffix();
  const date = "2026-05-03";
  const stableEmployee = await createEmployee(
    `Absence Impact Overview Stable ${suffix}`,
    true
  );
  const impactedQualifiedEmployee = await createEmployee(
    `Absence Impact Overview Qualified ${suffix}`,
    true
  );
  const impactedEmployee = await createEmployee(
    `Absence Impact Overview Absent ${suffix}`,
    false
  );

  const impactedShift = await createShift(date, "day", 2, 1);
  const stableShift = await createShift(date, "night", 1, 1);

  const assignments = await Promise.all([
    createAssignment(impactedQualifiedEmployee.id, impactedShift.id),
    createAssignment(impactedEmployee.id, impactedShift.id),
    createAssignment(stableEmployee.id, stableShift.id),
  ]);

  const context = trackContext({
    employeeIds: [
      stableEmployee.id,
      impactedQualifiedEmployee.id,
      impactedEmployee.id,
    ],
    shiftIds: [impactedShift.id, stableShift.id],
    assignmentIds: assignments.map((assignment) => assignment.id),
    absenceIds: [],
  });

  return {
    date,
    impactedShift,
    stableShift,
    impactedEmployee,
    context,
  };
}

async function createScopedShiftScenario(
  shiftType: string,
  absenceScope: "early" | "late" | "night",
  date: string
) {
  const suffix = uniqueSuffix();
  const employee = await createEmployee(
    `Absence Impact Scoped ${shiftType} ${absenceScope} ${suffix}`,
    true
  );
  const shift = await createShift(date, shiftType, 1, 1);
  const assignment = await createAssignment(employee.id, shift.id);

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
    absenceScope,
    context,
  };
}

async function createFullDayMultiShiftScenario() {
  const suffix = uniqueSuffix();
  const date = "2026-05-09";
  const employee = await createEmployee(
    `Absence Impact FullDay ${suffix}`,
    true
  );
  const shifts = await Promise.all([
    createShift(date, "early", 1, 1),
    createShift(date, "late", 1, 1),
    createShift(date, "night", 1, 1),
  ]);
  const assignments = await Promise.all(
    shifts.map((shift) => createAssignment(employee.id, shift.id))
  );

  const context = trackContext({
    employeeIds: [employee.id],
    shiftIds: shifts.map((shift) => shift.id),
    assignmentIds: assignments.map((assignment) => assignment.id),
    absenceIds: [],
  });

  return {
    date,
    employee,
    shifts,
    context,
  };
}

async function createEmployee(name: string, qualified: boolean) {
  return prisma.employee.create({
    data: {
      name,
      role: "nurse",
      workload: 80,
      qualified,
    },
  });
}

async function createShift(
  date: string,
  type: string,
  requiredCount: number,
  requiredQualifiedCount: number
) {
  const shiftDate = new Date(`${date}T00:00:00.000Z`);

  await prisma.assignment.deleteMany({
    where: {
      shift: {
        date: shiftDate,
        type,
      },
    },
  });
  await prisma.shift.deleteMany({
    where: {
      date: shiftDate,
      type,
    },
  });

  return prisma.shift.create({
    data: {
      date: shiftDate,
      type,
      requiredCount,
      requiredQualifiedCount,
    },
  });
}

async function createAssignment(employeeId: number, shiftId: number) {
  return prisma.assignment.create({
    data: {
      employeeId,
      shiftId,
      status: "planned",
    },
  });
}

async function createActiveAbsence(
  employeeId: number,
  date: string,
  scope: "full_day" | "early" | "late" | "night" = "full_day"
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

function trackContext(context: AbsenceImpactTestContext): AbsenceImpactTestContext {
  testContexts.push(context);
  return context;
}

async function cleanupScenario(context: AbsenceImpactTestContext): Promise<void> {
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
