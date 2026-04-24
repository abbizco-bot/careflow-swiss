import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../../app";
import { prisma } from "../../../lib/prisma";

type SituationTestContext = {
  situationIds: number[];
  dates: string[];
  employeeIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
  absenceIds: number[];
};

const testContexts: SituationTestContext[] = [];
const app = createApp({ includeValidations: true });

describe("Situation trend integration", () => {
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

  it("returns 400 when date is missing", async () => {
    const response = await request(app).get("/validations/situation/trend");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_INVALID_DATE",
        message:
          "Der Query-Parameter 'date' ist erforderlich und muss ein gültiges Datum sein.",
      },
    });
  });

  it("returns unzureichende_daten with fewer than 2 data points", async () => {
    const context = await seedSituations([
      { date: "2026-07-10", situation: "stabil" },
    ]);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/trend")
      .query({ date: "2026-07-10", days: "7" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      trend: "unzureichende_daten",
      current: "stabil",
      first: "stabil",
      history: [{ date: "2026-07-10", situation: "stabil" }],
    });
  });

  it("detects a worsening trend from stabil to angespannt", async () => {
    const context = await seedSituations([
      { date: "2026-07-20", situation: "stabil" },
      { date: "2026-07-21", situation: "angespannt" },
    ]);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/trend")
      .query({ date: "2026-07-21", days: "7" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      trend: "verschlechtert_sich",
      current: "angespannt",
      first: "stabil",
    });
  });

  it("detects an improving trend from kritisch to angespannt", async () => {
    const context = await seedSituations([
      { date: "2026-08-01", situation: "kritisch" },
      { date: "2026-08-02", situation: "angespannt" },
    ]);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/trend")
      .query({ date: "2026-08-02", days: "7" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      trend: "verbessert_sich",
      current: "angespannt",
      first: "kritisch",
    });
  });

  it("detects an unchanged trend for equal values", async () => {
    const context = await seedSituations([
      { date: "2026-08-15", situation: "angespannt" },
      { date: "2026-08-16", situation: "angespannt" },
    ]);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/trend")
      .query({ date: "2026-08-16", days: "7" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      trend: "unverändert",
      current: "angespannt",
      first: "angespannt",
    });
  });

  it("returns history in chronological order", async () => {
    const context = await seedSituations([
      { date: "2026-08-27", situation: "angespannt" },
      { date: "2026-08-25", situation: "stabil" },
      { date: "2026-08-26", situation: "kritisch" },
    ]);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/trend")
      .query({ date: "2026-08-27", days: "7" });

    expect(response.status).toBe(200);
    expect(response.body.history).toEqual([
      { date: "2026-08-25", situation: "stabil" },
      { date: "2026-08-26", situation: "kritisch" },
      { date: "2026-08-27", situation: "angespannt" },
    ]);
  });

  it("writes DailySituation on overview requests", async () => {
    const context = await createSituationFromShiftsScenario("2026-05-28", 1);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/shifts/overview")
      .query({ date: "2026-05-28" });

    expect(response.status).toBe(200);

    const storedSituation = await prisma.dailySituation.findUnique({
      where: {
        date: new Date("2026-05-28T00:00:00.000Z"),
      },
    });

    expect(storedSituation).toMatchObject({
      situation: "angespannt",
    });
  });

  it("writes DailySituation on full requests and overwrites an existing entry cleanly", async () => {
    const context = await createSituationFromShiftsScenario("2026-05-29", 0);
    const existingSituation = await prisma.dailySituation.create({
      data: {
        date: new Date("2026-05-29T00:00:00.000Z"),
        situation: "kritisch",
      },
    });
    context.situationIds.push(existingSituation.id);
    context.dates.push("2026-05-29");
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/shifts/full")
      .query({ date: "2026-05-29" });

    expect(response.status).toBe(200);

    const storedSituations = await prisma.dailySituation.findMany({
      where: {
        date: new Date("2026-05-29T00:00:00.000Z"),
      },
    });

    expect(storedSituations).toHaveLength(1);
    expect(storedSituations[0]).toMatchObject({
      situation: "stabil",
    });
  });

  it("stores kritisch when three or more critical shifts exist", async () => {
    const context = await createSituationFromShiftsScenario("2026-05-30", 3);
    testContexts.push(context);

    await request(app).get("/validations/shifts/full").query({ date: "2026-05-30" });

    const storedSituation = await prisma.dailySituation.findUnique({
      where: {
        date: new Date("2026-05-30T00:00:00.000Z"),
      },
    });

    expect(storedSituation).toMatchObject({
      situation: "kritisch",
    });
  });

  it("does not create duplicates on repeated requests", async () => {
    const context = await createSituationFromShiftsScenario("2026-05-31", 1);
    testContexts.push(context);

    await request(app)
      .get("/validations/shifts/overview")
      .query({ date: "2026-05-31" });
    await request(app)
      .get("/validations/shifts/overview")
      .query({ date: "2026-05-31" });

    const storedSituations = await prisma.dailySituation.findMany({
      where: {
        date: new Date("2026-05-31T00:00:00.000Z"),
      },
    });

    expect(storedSituations).toHaveLength(1);
    expect(storedSituations[0]).toMatchObject({
      situation: "angespannt",
    });
  });

  it("does not write DailySituation for an empty day", async () => {
    const response = await request(app)
      .get("/validations/shifts/overview")
      .query({ date: "2026-06-01" });

    expect(response.status).toBe(200);

    const storedSituation = await prisma.dailySituation.findUnique({
      where: {
        date: new Date("2026-06-01T00:00:00.000Z"),
      },
    });

    expect(storedSituation).toBeNull();
  });

  it("returns stored days in ascending order for the history endpoint", async () => {
    const context = await seedSituations([
      { date: "2026-06-03", situation: "kritisch" },
      { date: "2026-06-01", situation: "stabil" },
      { date: "2026-06-02", situation: "angespannt" },
    ]);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/history")
      .query({ from: "2026-06-01", to: "2026-06-03" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      from: "2026-06-01",
      to: "2026-06-03",
      days: [
        { date: "2026-06-01", situation: "stabil" },
        { date: "2026-06-02", situation: "angespannt" },
        { date: "2026-06-03", situation: "kritisch" },
      ],
    });
  });

  it("returns an empty history list when no entries exist", async () => {
    const response = await request(app)
      .get("/validations/situation/history")
      .query({ from: "2026-06-10", to: "2026-06-12" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      from: "2026-06-10",
      to: "2026-06-12",
      days: [],
    });
  });

  it("respects the requested date range for history", async () => {
    const context = await seedSituations([
      { date: "2026-06-11", situation: "stabil" },
      { date: "2026-06-12", situation: "angespannt" },
      { date: "2026-06-13", situation: "kritisch" },
      { date: "2026-06-14", situation: "stabil" },
    ]);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/history")
      .query({ from: "2026-06-12", to: "2026-06-13" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      from: "2026-06-12",
      to: "2026-06-13",
      days: [
        { date: "2026-06-12", situation: "angespannt" },
        { date: "2026-06-13", situation: "kritisch" },
      ],
    });
  });

  it("returns a clean error for invalid from/to parameters", async () => {
    const missingFromResponse = await request(app)
      .get("/validations/situation/history")
      .query({ to: "2026-06-03" });

    const invalidRangeResponse = await request(app)
      .get("/validations/situation/history")
      .query({ from: "2026-06-04", to: "2026-06-03" });

    expect(missingFromResponse.status).toBe(400);
    expect(missingFromResponse.body).toEqual({
      error: {
        code: "VALIDATION_INVALID_DATE",
        message:
          "Der Query-Parameter 'from' ist erforderlich und muss ein gültiges Datum sein.",
      },
    });

    expect(invalidRangeResponse.status).toBe(400);
    expect(invalidRangeResponse.body).toEqual({
      error: {
        code: "VALIDATION_INVALID_DATE_RANGE",
        message: "Der Query-Parameter 'from' darf nicht nach 'to' liegen.",
      },
    });
  });

  it("returns a daily summary with the correct situation and counts", async () => {
    const context = await createCoverageDominantSummaryScenario("2026-09-10");
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/summary")
      .query({ date: "2026-09-10" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      date: "2026-09-10",
      situation: "kritisch",
      criticalCount: 3,
      warningCount: 1,
      shiftCount: 4,
      mainIssue: "coverage",
      dominantProblemType: "distributed_risk",
    affectedShiftTypes: ["early", "late", "night", "day"],
    });
  });

  it("returns mainIssue=qualification for a qualification-dominant day", async () => {
    const context = await createQualificationDominantSummaryScenario("2026-09-11");
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/summary")
      .query({ date: "2026-09-11" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      mainIssue: "qualification",
      dominantProblemType: "distributed_risk",
      affectedShiftTypes: ["late", "night"],
    });
  });

  it("returns mixed when coverage and qualification are equally relevant", async () => {
    const context = await createMixedSummaryScenario("2026-09-12");
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/summary")
      .query({ date: "2026-09-12" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      mainIssue: "mixed",
      dominantProblemType: "distributed_risk",
      affectedShiftTypes: ["early", "late"],
    });
  });

  it("returns no relevant issue signals for a stable day", async () => {
    const context = await createNoIssueSummaryScenario("2026-09-13");
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/summary")
      .query({ date: "2026-09-13" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: "2026-09-13",
      situation: "stabil",
      criticalCount: 0,
      warningCount: 0,
      shiftCount: 1,
      criticalShifts: [],
      warningShifts: [],
      mainIssue: null,
      dominantProblemType: null,
      affectedShiftTypes: [],
    });
  });

  it("deduplicates affected shift types in the summary", async () => {
    const context = await createCoverageSingleTypeSummaryScenario("2026-09-14");
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/summary")
      .query({ date: "2026-09-14" });

    expect(response.status).toBe(200);
    expect(response.body.affectedShiftTypes).toEqual(["early", "late"]);
    expect(response.body.dominantProblemType).toBe("distributed_risk");
  });

  it("returns an empty daily summary for a day without shifts", async () => {
    const response = await request(app)
      .get("/validations/situation/summary")
      .query({ date: "2026-09-15" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: "2026-09-15",
      situation: null,
      criticalCount: 0,
      warningCount: 0,
      shiftCount: 0,
      criticalShifts: [],
      warningShifts: [],
      mainIssue: null,
      dominantProblemType: null,
      affectedShiftTypes: [],
    });
  });

  it("returns a clean error for an invalid summary date", async () => {
    const response = await request(app)
      .get("/validations/situation/summary")
      .query({ date: "2026-13-40" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_INVALID_DATE",
        message:
          "Der Query-Parameter 'date' ist erforderlich und muss ein gültiges Datum sein.",
      },
    });
  });

  it("returns a dashboard payload with extended summary signals", async () => {
    const context = await createCoverageDominantSummaryScenario("2026-09-20");
    const historyContext = await seedSituations([
      { date: "2026-09-18", situation: "stabil" },
      { date: "2026-09-19", situation: "angespannt" },
      { date: "2026-09-20", situation: "kritisch" },
    ]);
    mergeContext(context, historyContext);
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/dashboard")
      .query({ date: "2026-09-20", days: "3" });

    expect(response.status).toBe(200);
    expect(response.body.date).toBe("2026-09-20");
    expect(response.body.summary).toMatchObject({
      date: "2026-09-20",
      situation: "kritisch",
      criticalCount: 3,
      warningCount: 1,
      shiftCount: 4,
      mainIssue: "coverage",
      dominantProblemType: "distributed_risk",
      affectedShiftTypes: ["early", "late", "night", "day"],
    });
    expect(response.body.trend).toMatchObject({
      trend: "verschlechtert_sich",
      current: "kritisch",
      first: "stabil",
    });
    expect(response.body.trend.history).toBeUndefined();
    expect(response.body.history).toEqual([
      { date: "2026-09-18", situation: "stabil" },
      { date: "2026-09-19", situation: "angespannt" },
      { date: "2026-09-20", situation: "kritisch" },
    ]);
  });

  it("returns a dashboard payload with empty history when no DailySituation entries exist", async () => {
    const context = await createCoverageDominantSummaryScenario("2026-09-21");
    testContexts.push(context);

    const response = await request(app)
      .get("/validations/situation/dashboard")
      .query({ date: "2026-09-21", days: "3" });

    expect(response.status).toBe(200);
    expect(response.body.summary).toMatchObject({
      date: "2026-09-21",
      situation: "kritisch",
      mainIssue: "coverage",
    });
    expect(response.body.trend).toEqual({
      trend: "unzureichende_daten",
      current: null,
      first: null,
    });
    expect(response.body.history).toEqual([]);
  });

  it("returns a clean dashboard error for invalid parameters", async () => {
    const missingDateResponse = await request(app)
      .get("/validations/situation/dashboard")
      .query({ days: "7" });

    const invalidDaysResponse = await request(app)
      .get("/validations/situation/dashboard")
      .query({ date: "2026-09-20", days: "0" });

    expect(missingDateResponse.status).toBe(400);
    expect(missingDateResponse.body).toEqual({
      error: {
        code: "VALIDATION_INVALID_DATE",
        message:
          "Der Query-Parameter 'date' ist erforderlich und muss ein gültiges Datum sein.",
      },
    });

    expect(invalidDaysResponse.status).toBe(400);
    expect(invalidDaysResponse.body).toEqual({
      error: {
        code: "VALIDATION_INVALID_PARAMETER",
        message: "Der Query-Parameter 'days' muss eine positive Ganzzahl sein.",
      },
    });
  });
});

async function seedSituations(
  entries: Array<{ date: string; situation: "stabil" | "angespannt" | "kritisch" }>
): Promise<SituationTestContext> {
  const created = await Promise.all(
    entries.map((entry) =>
      prisma.dailySituation.create({
        data: {
          date: new Date(`${entry.date}T00:00:00.000Z`),
          situation: entry.situation,
        },
      })
    )
  );

  return {
    situationIds: created.map((entry) => entry.id),
    dates: entries.map((entry) => entry.date),
    employeeIds: [],
    shiftIds: [],
    assignmentIds: [],
    absenceIds: [],
  };
}

async function createSituationFromShiftsScenario(
  date: string,
  criticalShiftCount: number
): Promise<SituationTestContext> {
  await resetOperationalDataForDate(date);

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const employee = await prisma.employee.create({
    data: {
      name: `Situation Employee ${suffix}`,
      role: "nurse",
      workload: 80,
      qualified: true,
    },
  });

  const shifts = await Promise.all(
    Array.from({ length: Math.max(criticalShiftCount, 1) }).map((_, index) =>
      prisma.shift.create({
        data: {
          date: new Date(`${date}T00:00:00.000Z`),
          type: ["early", "late", "night"][index] ?? `extra-${index}`,
          requiredCount: criticalShiftCount > 0 ? 2 : 1,
          requiredQualifiedCount: 1,
        },
      })
    )
  );

  const assignments =
    criticalShiftCount > 0
      ? []
      : await Promise.all(
          shifts.map((shift) =>
            prisma.assignment.create({
              data: {
                employeeId: employee.id,
                shiftId: shift.id,
                status: "planned",
              },
            })
          )
        );

  return {
    situationIds: [],
    dates: [date],
    employeeIds: [employee.id],
    shiftIds: shifts.map((shift) => shift.id),
    assignmentIds: assignments.map((assignment) => assignment.id),
    absenceIds: [],
  };
}

async function createCoverageDominantSummaryScenario(
  date: string
): Promise<SituationTestContext> {
  await resetOperationalDataForDate(date);

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const employees = await Promise.all(
    ["A", "B"].map((label) =>
      prisma.employee.create({
        data: {
          name: `Situation Coverage ${label} ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      })
    )
  );

  const criticalShifts = await Promise.all(
    Array.from({ length: 3 }).map((_, index) =>
      prisma.shift.create({
        data: {
          date: new Date(`${date}T00:00:00.000Z`),
          type: ["early", "late", "night"][index],
          requiredCount: 2,
          requiredQualifiedCount: 0,
        },
      })
    )
  );

  const warningShift = await prisma.shift.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      type: "day",
      requiredCount: 1,
      requiredQualifiedCount: 0,
    },
  });

  const warningAssignments = await Promise.all(
    employees.map((employee) =>
      prisma.assignment.create({
        data: {
          employeeId: employee.id,
          shiftId: warningShift.id,
          status: "planned",
        },
      })
    )
  );

  return {
    situationIds: [],
    dates: [date],
    employeeIds: employees.map((employee) => employee.id),
    shiftIds: [...criticalShifts.map((shift) => shift.id), warningShift.id],
    assignmentIds: warningAssignments.map((assignment) => assignment.id),
    absenceIds: [],
  };
}

async function createQualificationDominantSummaryScenario(
  date: string
): Promise<SituationTestContext> {
  await resetOperationalDataForDate(date);

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const employees = await Promise.all(
    Array.from({ length: 2 }).map((_, index) =>
      prisma.employee.create({
        data: {
          name: `Situation Qualification ${index} ${suffix}`,
          role: "assistant",
          workload: 80,
          qualified: false,
        },
      })
    )
  );

  const shifts = await Promise.all(
    Array.from({ length: 2 }).map((_, index) =>
      prisma.shift.create({
        data: {
          date: new Date(`${date}T00:00:00.000Z`),
          type: ["late", "night"][index],
          requiredCount: 1,
          requiredQualifiedCount: 1,
        },
      })
    )
  );

  const assignments = await Promise.all(
    shifts.map((shift, index) =>
      prisma.assignment.create({
        data: {
          employeeId: employees[index].id,
          shiftId: shift.id,
          status: "planned",
        },
      })
    )
  );

  return {
    situationIds: [],
    dates: [date],
    employeeIds: employees.map((employee) => employee.id),
    shiftIds: shifts.map((shift) => shift.id),
    assignmentIds: assignments.map((assignment) => assignment.id),
    absenceIds: [],
  };
}

async function createMixedSummaryScenario(
  date: string
): Promise<SituationTestContext> {
  await resetOperationalDataForDate(date);

  const coverageShift = await prisma.shift.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      type: "early",
      requiredCount: 2,
      requiredQualifiedCount: 0,
    },
  });

  const employee = await prisma.employee.create({
    data: {
      name: `Situation Mixed ${Date.now()}`,
      role: "assistant",
      workload: 80,
      qualified: false,
    },
  });

  const qualificationShift = await prisma.shift.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      type: "late",
      requiredCount: 1,
      requiredQualifiedCount: 1,
    },
  });

  const assignment = await prisma.assignment.create({
    data: {
      employeeId: employee.id,
      shiftId: qualificationShift.id,
      status: "planned",
    },
  });

  return {
    situationIds: [],
    dates: [date],
    employeeIds: [employee.id],
    shiftIds: [coverageShift.id, qualificationShift.id],
    assignmentIds: [assignment.id],
    absenceIds: [],
  };
}

async function createNoIssueSummaryScenario(
  date: string
): Promise<SituationTestContext> {
  await resetOperationalDataForDate(date);

  const employee = await prisma.employee.create({
    data: {
      name: `Situation Stable ${Date.now()}`,
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
      status: "planned",
    },
  });

  return {
    situationIds: [],
    dates: [date],
    employeeIds: [employee.id],
    shiftIds: [shift.id],
    assignmentIds: [assignment.id],
    absenceIds: [],
  };
}

async function createCoverageSingleTypeSummaryScenario(
  date: string
): Promise<SituationTestContext> {
  await resetOperationalDataForDate(date);

  const shifts = await Promise.all(
    Array.from({ length: 2 }).map((_, index) =>
      prisma.shift.create({
        data: {
          date: new Date(`${date}T00:00:00.000Z`),
          type: ["early", "late"][index],
          requiredCount: 1,
          requiredQualifiedCount: 0,
        },
      })
    )
  );

  return {
    situationIds: [],
    dates: [date],
    employeeIds: [],
    shiftIds: shifts.map((shift) => shift.id),
    assignmentIds: [],
    absenceIds: [],
  };
}

async function resetOperationalDataForDate(date: string): Promise<void> {
  const shiftDate = new Date(`${date}T00:00:00.000Z`);

  await prisma.assignment.deleteMany({
    where: {
      shift: {
        date: shiftDate,
      },
    },
  });

  await prisma.shift.deleteMany({
    where: {
      date: shiftDate,
    },
  });

  await prisma.dailySituation.deleteMany({
    where: {
      date: shiftDate,
    },
  });
}

function mergeContext(
  target: SituationTestContext,
  source: SituationTestContext
): SituationTestContext {
  target.situationIds.push(...source.situationIds);
  target.dates.push(...source.dates);
  target.employeeIds.push(...source.employeeIds);
  target.shiftIds.push(...source.shiftIds);
  target.assignmentIds.push(...source.assignmentIds);
  target.absenceIds.push(...source.absenceIds);
  return target;
}

async function cleanupScenario(context: SituationTestContext): Promise<void> {
  await prisma.dailySituation.deleteMany({
    where: {
      OR: [
        {
          id: {
            in: context.situationIds,
          },
        },
        {
          date: {
            in: context.dates.map((date) => new Date(`${date}T00:00:00.000Z`)),
          },
        },
      ],
    },
  });

  await prisma.absence.deleteMany({
    where: {
      employeeId: {
        in: context.employeeIds,
      },
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
