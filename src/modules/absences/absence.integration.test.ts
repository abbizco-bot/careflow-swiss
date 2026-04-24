import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type AbsenceTestContext = {
  employeeIds: number[];
  absenceIds: number[];
};

const testContexts: AbsenceTestContext[] = [];
const app = createApp({ includeValidations: false });

describe("Absence v0.1 integration", () => {
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

  it("creates a valid open sick absence", async () => {
    const employee = await createEmployee("Absence Open");

    const response = await request(app).post("/absences").send({
      employeeId: employee.id,
      type: "sick",
      startDate: "2026-04-23",
      endDate: null,
      note: "telefonisch gemeldet",
    });

    trackContext({
      employeeIds: [employee.id],
      absenceIds: [response.body.id],
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      employeeId: employee.id,
      type: "sick",
      scope: "full_day",
      status: "active",
      endDate: null,
      note: "telefonisch gemeldet",
    });
  });

  it("accepts an explicit absence scope for partial-day operational availability", async () => {
    const employee = await createEmployee("Absence Scoped");

    const response = await request(app).post("/absences").send({
      employeeId: employee.id,
      type: "sick",
      scope: "early",
      startDate: "2026-04-23",
      endDate: null,
    });

    trackContext({
      employeeIds: [employee.id],
      absenceIds: [response.body.id],
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      employeeId: employee.id,
      type: "sick",
      scope: "early",
      status: "active",
    });
  });

  it("rejects an invalid date range", async () => {
    const employee = await createEmployee("Absence Invalid Range");

    const response = await request(app).post("/absences").send({
      employeeId: employee.id,
      type: "sick",
      startDate: "2026-04-23",
      endDate: "2026-04-22",
    });

    trackContext({
      employeeIds: [employee.id],
      absenceIds: [],
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: {
        code: "ABSENCE_INVALID_DATE_RANGE",
      },
    });
  });

  it("rejects an unknown employee", async () => {
    const response = await request(app).post("/absences").send({
      employeeId: 999999,
      type: "sick",
      startDate: "2026-04-23",
      endDate: null,
    });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: {
        code: "ABSENCE_EMPLOYEE_NOT_FOUND",
      },
    });
  });

  it("lists active absences with the administrative signal", async () => {
    const employee = await createEmployee("Absence Active List");
    const absence = await prisma.absence.create({
      data: {
        employeeId: employee.id,
        type: "sick",
        startDate: new Date("2026-04-23T00:00:00.000Z"),
        status: "active",
        note: "telefonisch gemeldet",
      },
    });

    trackContext({
      employeeIds: [employee.id],
      absenceIds: [absence.id],
    });

    const response = await request(app)
      .get("/absences/active")
      .query({ date: "2026-04-23" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: absence.id,
      employeeId: employee.id,
      type: "sick",
      scope: "full_day",
      status: "active",
      employee: {
        id: employee.id,
        name: employee.name,
      },
      administrativeSignal: {
        medicalCertificateStatus: "not_required_yet",
      },
    });
  });

  it("keeps the medical certificate status at not_required_yet before the threshold", async () => {
    const employee = await createEmployee("Absence Not Required Yet");
    const today = utcDateOnly(new Date());
    const absence = await prisma.absence.create({
      data: {
        employeeId: employee.id,
        type: "sick",
        startDate: new Date(`${today}T00:00:00.000Z`),
        status: "active",
      },
    });

    trackContext({
      employeeIds: [employee.id],
      absenceIds: [absence.id],
    });

    const response = await request(app)
      .get("/absences/active")
      .query({ date: today });

    expect(response.status).toBe(200);
    expect(response.body[0].administrativeSignal).toMatchObject({
      medicalCertificateStatus: "not_required_yet",
    });
  });

  it("marks the medical certificate as due once the regular threshold is reached", async () => {
    const employee = await createEmployee("Absence Due");
    const today = startOfUtcDay(new Date());
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - 2);
    const absence = await prisma.absence.create({
      data: {
        employeeId: employee.id,
        type: "sick",
        startDate,
        status: "active",
      },
    });

    trackContext({
      employeeIds: [employee.id],
      absenceIds: [absence.id],
    });

    const response = await request(app)
      .get("/absences/active")
      .query({ date: utcDateOnly(today) });

    const dueDate = new Date(startDate);
    dueDate.setUTCDate(dueDate.getUTCDate() + 2);

    expect(response.status).toBe(200);
    expect(response.body[0].administrativeSignal).toMatchObject({
      medicalCertificateStatus: "due",
      medicalCertificateDueDate: dueDate.toISOString(),
    });
  });
});

async function createEmployee(namePrefix: string) {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  return prisma.employee.create({
    data: {
      name: `${namePrefix} ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: true,
    },
  });
}

function trackContext(context: AbsenceTestContext): void {
  testContexts.push(context);
}

async function cleanupScenario(context: AbsenceTestContext): Promise<void> {
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

  await prisma.employee.deleteMany({
    where: {
      id: {
        in: context.employeeIds,
      },
    },
  });
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

function utcDateOnly(date: Date): string {
  return startOfUtcDay(date).toISOString().slice(0, 10);
}
