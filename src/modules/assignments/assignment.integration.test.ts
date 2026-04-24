import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type TestContext = {
  employeeIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
};

const testContexts: TestContext[] = [];
const app = createApp({ includeValidations: false });

describe("Assignment guardrails integration", () => {
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

  it("creates a valid assignment", async () => {
    const scenario = await createScenario();

    const response = await request(app)
      .post("/assignments")
      .send({
        employeeId: scenario.employee.id,
        shiftId: scenario.primaryShift.id,
        assignedFunction: "Tagesverantwortung",
        status: "planned",
      });

    scenario.context.assignmentIds.push(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      employeeId: scenario.employee.id,
      shiftId: scenario.primaryShift.id,
      assignedFunction: "Tagesverantwortung",
      status: "planned",
    });
    expect(response.body.error).toBeUndefined();
  });

  it("rejects a duplicate assignment", async () => {
    const scenario = await createScenario();

    const firstResponse = await request(app)
      .post("/assignments")
      .send({
        employeeId: scenario.employee.id,
        shiftId: scenario.primaryShift.id,
        status: "planned",
      });

    scenario.context.assignmentIds.push(firstResponse.body.id);

    const secondResponse = await request(app)
      .post("/assignments")
      .send({
        employeeId: scenario.employee.id,
        shiftId: scenario.primaryShift.id,
        status: "planned",
      });

    expect(firstResponse.status).toBe(201);
    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toMatchObject({
      error: {
        code: "ASSIGNMENT_DUPLICATE",
      },
    });
  });

  it("allows another shift type on the same date for the same employee", async () => {
    const scenario = await createScenario();

    const firstResponse = await request(app)
      .post("/assignments")
      .send({
        employeeId: scenario.employee.id,
        shiftId: scenario.primaryShift.id,
        status: "planned",
      });

    scenario.context.assignmentIds.push(firstResponse.body.id);

    const secondShiftResponse = await request(app)
      .post("/assignments")
      .send({
        employeeId: scenario.employee.id,
        shiftId: scenario.conflictingShift.id,
        status: "planned",
      });

    scenario.context.assignmentIds.push(secondShiftResponse.body.id);

    expect(firstResponse.status).toBe(201);
    expect(secondShiftResponse.status).toBe(201);
    expect(secondShiftResponse.body).toMatchObject({
      employeeId: scenario.employee.id,
      shiftId: scenario.conflictingShift.id,
      status: "planned",
    });
  });
});

async function createScenario() {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  const employee = await prisma.employee.create({
    data: {
      name: `Assignment Test Employee ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: true,
    },
  });

  const secondaryEmployee = await prisma.employee.create({
    data: {
      name: `Assignment Test Employee Backup ${suffix}`,
      role: "nurse",
      workload: 60,
      qualified: false,
    },
  });

  const shiftDate = new Date(
    Date.UTC(2026, 3, 20, 6, 0, 0) + Date.now() + Math.floor(Math.random() * 1000)
  );

  const primaryShift = await prisma.shift.create({
    data: {
      date: shiftDate,
      type: "day",
      requiredCount: 2,
      requiredQualifiedCount: 1,
    },
  });

  const conflictingShift = await prisma.shift.create({
    data: {
      date: shiftDate,
      type: "late",
      requiredCount: 2,
      requiredQualifiedCount: 1,
    },
  });

  const context: TestContext = {
    employeeIds: [employee.id, secondaryEmployee.id],
    shiftIds: [primaryShift.id, conflictingShift.id],
    assignmentIds: [],
  };

  testContexts.push(context);

  return {
    employee,
    secondaryEmployee,
    primaryShift,
    conflictingShift,
    context,
  };
}

async function cleanupScenario(context: TestContext): Promise<void> {
  await prisma.assignment.deleteMany({
    where: {
      OR: [
        context.assignmentIds.length > 0
          ? {
              id: {
                in: context.assignmentIds,
              },
            }
          : undefined,
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
      ].filter(isDefined),
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

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
