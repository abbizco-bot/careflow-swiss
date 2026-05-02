import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type LeadershipViewTestContext = {
  employeeIds: number[];
  planningMonthIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
  absenceIds: number[];
  availabilityRequestIds: number[];
  dailySituationIds: number[];
};

const testContexts: LeadershipViewTestContext[] = [];
const app = createApp({ includeValidations: true });

function buildExpectedWeekDates(dateInput: string): string[] {
  const anchorDate = new Date(`${dateInput}T00:00:00.000Z`);
  const dayOfWeek = anchorDate.getUTCDay();
  const dayOffsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(anchorDate);
  weekStart.setUTCDate(weekStart.getUTCDate() + dayOffsetToMonday);
  const dates: string[] = [];

  for (let index = 0; index < 7; index += 1) {
    const currentDate = new Date(weekStart);
    currentDate.setUTCDate(currentDate.getUTCDate() + index);
    dates.push(currentDate.toISOString().slice(0, 10));
  }

  return dates;
}

function buildExpectedDateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const currentDate = new Date(`${from}T00:00:00.000Z`);
  const endDate = new Date(`${to}T00:00:00.000Z`);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
}

describe("Leadership day view integration", () => {
  afterEach(async () => {
    while (testContexts.length > 0) {
      const context = testContexts.pop();

      if (!context) {
        continue;
      }

      await prisma.assignment.deleteMany({
        where: {
          id: {
            in: context.assignmentIds,
          },
        },
      });

      await prisma.absence.deleteMany({
        where: {
          id: {
            in: context.absenceIds,
          },
        },
      });

      await prisma.shift.deleteMany({
        where: {
          id: {
            in: context.shiftIds,
          },
        },
      });

      await prisma.availabilityRequest.deleteMany({
        where: {
          id: {
            in: context.availabilityRequestIds,
          },
        },
      });

      await prisma.dailySituation.deleteMany({
        where: {
          id: {
            in: context.dailySituationIds,
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

      await prisma.employee.deleteMany({
        where: {
          id: {
            in: context.employeeIds,
          },
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns a read-only leadership day view composed from existing read models", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2040 + (Date.now() % 40);
    const date = `${uniqueYear}-04-23`;

    const qualifiedEmployee = await prisma.employee.create({
      data: {
        name: `Leadership Qualified ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    const nonQualifiedEmployee = await prisma.employee.create({
      data: {
        name: `Leadership NonQualified ${suffix}`,
        role: "assistant",
        workload: 80,
        qualified: false,
      },
    });

    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: uniqueYear,
        month: 4,
        status: "active",
      },
    });

    const planningDay = await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date(`${date}T00:00:00.000Z`),
        isSpecialDay: false,
        note: null,
      },
    });

    await prisma.planningShiftTemplate.createMany({
      data: [
        {
          planningDayId: planningDay.id,
          type: "early",
          requiredCount: 3,
          requiredQualifiedCount: 1,
          isCritical: true,
        },
        {
          planningDayId: planningDay.id,
          type: "late",
          requiredCount: 2,
          requiredQualifiedCount: 1,
          isCritical: false,
        },
      ],
    });

    const earlyShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });

    const lateShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const earlyAssignment = await prisma.assignment.create({
      data: {
        employeeId: nonQualifiedEmployee.id,
        shiftId: earlyShift.id,
        status: "planned",
      },
    });

    const lateAssignment = await prisma.assignment.create({
      data: {
        employeeId: qualifiedEmployee.id,
        shiftId: lateShift.id,
        status: "planned",
      },
    });

    const lateAbsence = await prisma.absence.create({
      data: {
        employeeId: qualifiedEmployee.id,
        type: "sick",
        scope: "full_day",
        startDate: new Date(`${date}T00:00:00.000Z`),
        endDate: new Date(`${date}T00:00:00.000Z`),
        status: "active",
      },
    });

    const firstRequest = await prisma.availabilityRequest.create({
      data: {
        employeeId: qualifiedEmployee.id,
        type: "wish_free",
        startDate: new Date(`${uniqueYear}-04-23T00:00:00.000Z`),
        endDate: new Date(`${uniqueYear}-04-23T00:00:00.000Z`),
        isFullDay: true,
        priority: "medium",
        status: "submitted",
      },
    });

    const secondRequest = await prisma.availabilityRequest.create({
      data: {
        employeeId: nonQualifiedEmployee.id,
        type: "absence",
        startDate: new Date(`${uniqueYear}-04-22T00:00:00.000Z`),
        endDate: new Date(`${uniqueYear}-04-23T00:00:00.000Z`),
        isFullDay: true,
        priority: "high",
        status: "reviewed",
      },
    });

    const historyDays = await Promise.all([
      prisma.dailySituation.create({
        data: {
          date: new Date(`${uniqueYear}-04-21T00:00:00.000Z`),
          situation: "stabil",
        },
      }),
      prisma.dailySituation.create({
        data: {
          date: new Date(`${uniqueYear}-04-22T00:00:00.000Z`),
          situation: "stabil",
        },
      }),
    ]);

    testContexts.push({
      employeeIds: [qualifiedEmployee.id, nonQualifiedEmployee.id],
      planningMonthIds: [planningMonth.id],
      shiftIds: [earlyShift.id, lateShift.id],
      assignmentIds: [earlyAssignment.id, lateAssignment.id],
      absenceIds: [lateAbsence.id],
      availabilityRequestIds: [firstRequest.id, secondRequest.id],
      dailySituationIds: historyDays.map((entry) => entry.id),
    });

    const planningDayCountBefore = await prisma.planningDay.count({
      where: {
        planningMonthId: planningMonth.id,
      },
    });
    const templateCountBefore = await prisma.planningShiftTemplate.count({
      where: {
        planningDay: {
          planningMonthId: planningMonth.id,
        },
      },
    });
    const shiftRecordsBefore = await prisma.shift.findMany({
      where: {
        id: {
          in: [earlyShift.id, lateShift.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const requestRecordsBefore = await prisma.availabilityRequest.findMany({
      where: {
        id: {
          in: [firstRequest.id, secondRequest.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date,
      day: {
        headline: {
          title: "Unterdeckung",
          detail: "2 Schichten betroffen",
          contextLine: "keine aktuelle Veraenderung",
          visibilityContext: "publication_relevant_context",
        },
        shifts: [
          {
            type: "early",
            label: "Fruehdienst",
            plannedCount: 3,
            actualCount: 1,
            qualification: {
              status: "underqualified",
            },
            gap: {
              primaryCause: "operational",
              signals: [
                "operational_coverage_gap",
                "operational_qualification_gap",
              ],
              effectiveCoverageGap: 2,
              effectiveQualificationGap: 1,
              severity: "critical",
            },
          },
          {
            type: "late",
            label: "Spaetdienst",
            plannedCount: 2,
            actualCount: 0,
            qualification: {
              status: "underqualified",
            },
            gap: {
              primaryCause: "mixed",
              signals: [
                "operational_coverage_gap",
                "absence_driven_qualification_gap",
              ],
              effectiveCoverageGap: 2,
              effectiveQualificationGap: 1,
              severity: "critical",
            },
          },
        ],
      },
    });

    const planningDayCountAfter = await prisma.planningDay.count({
      where: {
        planningMonthId: planningMonth.id,
      },
    });
    const templateCountAfter = await prisma.planningShiftTemplate.count({
      where: {
        planningDay: {
          planningMonthId: planningMonth.id,
        },
      },
    });
    const shiftRecordsAfter = await prisma.shift.findMany({
      where: {
        id: {
          in: [earlyShift.id, lateShift.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const requestRecordsAfter = await prisma.availabilityRequest.findMany({
      where: {
        id: {
          in: [firstRequest.id, secondRequest.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    expect(planningDayCountAfter).toBe(planningDayCountBefore);
    expect(templateCountAfter).toBe(templateCountBefore);
    expect(shiftRecordsAfter).toEqual(shiftRecordsBefore);
    expect(requestRecordsAfter).toEqual(requestRecordsBefore);
  });

  it("returns 'stabil' as the only day headline when no relevant deviation exists", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2060 + (Date.now() % 20);
    const date = `${uniqueYear}-05-12`;

    const employee = await prisma.employee.create({
      data: {
        name: `Leadership Stable ${suffix}`,
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

    testContexts.push({
      employeeIds: [employee.id],
      planningMonthIds: [],
      shiftIds: [shift.id],
      assignmentIds: [assignment.id],
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "stabil",
      detail: null,
      contextLine: null,
      visibilityContext: "no_visibility_action",
    });
    expect(response.body.day.shifts).toEqual([
      {
        type: "early",
        label: "Fruehdienst",
        plannedCount: 1,
        actualCount: 1,
        qualification: {
          status: "ok",
        },
        gap: {
          primaryCause: "none",
          signals: [],
          effectiveCoverageGap: 0,
          effectiveQualificationGap: 0,
          severity: "none",
        },
      },
    ]);
  });

  it("shows qualification-function warnings as calm leadership context", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2061 + (Date.now() % 19);
    const date = `${uniqueYear}-05-15`;

    const employee = await prisma.employee.create({
      data: {
        name: `Leadership Function Warning ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
        baseQualification: "FAGE",
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
        assignedFunction: "Hausverantwortung",
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      planningMonthIds: [],
      shiftIds: [shift.id],
      assignmentIds: [assignment.id],
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Funktionshinweis",
      detail: "1 Schicht betroffen",
      contextLine:
        "Hausverantwortung passt nicht zur Stammqualifikation FAGE",
      visibilityContext: "internal_leadership_context",
    });
    expect(response.body.day.shifts).toEqual([
      {
        type: "early",
        label: "Fruehdienst",
        plannedCount: 1,
        actualCount: 1,
        qualification: {
          status: "ok",
        },
        gap: {
          primaryCause: "none",
          signals: [],
          effectiveCoverageGap: 0,
          effectiveQualificationGap: 0,
          severity: "none",
        },
      },
    ]);
  });

  it("returns 'unsichere Besetzung im [Schichtname]' when requested is the highest priority signal", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2065 + (Date.now() % 15);
    const date = `${uniqueYear}-05-13`;

    const employee = await prisma.employee.create({
      data: {
        name: `Leadership Requested ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    const shift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 0,
        requiredQualifiedCount: 0,
      },
    });

    const assignment = await prisma.assignment.create({
      data: {
        employeeId: employee.id,
        shiftId: shift.id,
        status: "requested",
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      planningMonthIds: [],
      shiftIds: [shift.id],
      assignmentIds: [assignment.id],
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "unsichere Besetzung im Fruehdienst",
      detail: null,
      contextLine: null,
      visibilityContext: "internal_leadership_context",
    });
    expect(response.body.day.shifts).toEqual([
      {
        type: "early",
        label: "Fruehdienst",
        plannedCount: 0,
        actualCount: 0,
        qualification: {
          status: "ok",
        },
        gap: {
          primaryCause: "request_context",
          signals: ["request_context_only"],
          effectiveCoverageGap: 0,
          effectiveQualificationGap: 0,
          severity: "attention",
        },
      },
    ]);
  });

  it("returns 'Krankmeldung im [Schichtname]' when sick is the highest priority signal", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2070 + (Date.now() % 10);
    const date = `${uniqueYear}-05-14`;

    const employee = await prisma.employee.create({
      data: {
        name: `Leadership Sick ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    const shift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "late",
        requiredCount: 0,
        requiredQualifiedCount: 0,
      },
    });

    const assignment = await prisma.assignment.create({
      data: {
        employeeId: employee.id,
        shiftId: shift.id,
        status: "sick",
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      planningMonthIds: [],
      shiftIds: [shift.id],
      assignmentIds: [assignment.id],
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Krankmeldung im Spaetdienst",
      detail: null,
      contextLine: null,
    });
  });

  it("shows 2 besetzt and no longer appears stable when one assignment is sick", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2050 + (Date.now() % 30);
    const date = `${uniqueYear}-05-05`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership E01 ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership E05 ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership E11 ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
    ]);

    const [employeeOne, employeeTwo, employeeThree] = employees;

    const shift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: employeeOne.id,
          shiftId: shift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeTwo.id,
          shiftId: shift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeThree.id,
          shiftId: shift.id,
          status: "sick",
        },
      }),
    ]);

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [shift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.shifts).toEqual([
      {
        type: "early",
        label: "Fruehdienst",
        plannedCount: 3,
        actualCount: 2,
        qualification: {
          status: "ok",
        },
        gap: {
          primaryCause: "operational",
          signals: ["operational_coverage_gap"],
          effectiveCoverageGap: 1,
          effectiveQualificationGap: 0,
          severity: "critical",
        },
      },
    ]);
    expect(response.body.day.headline).toEqual({
      title: "Unterdeckung",
      detail: "1 Schicht betroffen",
      contextLine: "Krankmeldung im Fruehdienst",
      visibilityContext: "publication_relevant_context",
    });
  });

  it("exposes an absence-driven day shift gap when active absence reduces sufficient planning", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2055 + (Date.now() % 25);
    const date = `${uniqueYear}-05-16`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership Absence Gap A ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Absence Gap B ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
    ]);

    const [employeeA, employeeB] = employees;

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
          employeeId: employeeA.id,
          shiftId: shift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeB.id,
          shiftId: shift.id,
          status: "planned",
        },
      }),
    ]);

    const absence = await prisma.absence.create({
      data: {
        employeeId: employeeA.id,
        type: "sick",
        scope: "full_day",
        startDate: new Date(`${date}T00:00:00.000Z`),
        endDate: new Date(`${date}T00:00:00.000Z`),
        status: "active",
      },
    });

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [shift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [absence.id],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Unterdeckung",
      detail: "1 Schicht betroffen",
      contextLine: "keine aktuelle Veraenderung",
      visibilityContext: "publication_relevant_context",
    });
    expect(response.body.day.shifts).toEqual([
      {
        type: "early",
        label: "Fruehdienst",
        plannedCount: 2,
        actualCount: 1,
        qualification: {
          status: "ok",
        },
        gap: {
          primaryCause: "absence",
          signals: ["absence_driven_coverage_gap"],
          effectiveCoverageGap: 1,
          effectiveQualificationGap: 0,
          severity: "critical",
        },
      },
    ]);
  });

  it("shows a requested context line under understaffing when the shift was planned sufficiently before requested", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2060 + (Date.now() % 20);
    const date = `${uniqueYear}-05-06`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership Requested A ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Requested B ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Requested C ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
    ]);

    const [plannedEmployeeOne, plannedEmployeeTwo, requestedEmployee] = employees;

    const shift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "late",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: plannedEmployeeOne.id,
          shiftId: shift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: plannedEmployeeTwo.id,
          shiftId: shift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: requestedEmployee.id,
          shiftId: shift.id,
          status: "requested",
        },
      }),
    ]);

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [shift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Unterdeckung",
      detail: "1 Schicht betroffen",
      contextLine: "unsichere Besetzung im Spaetdienst",
      visibilityContext: "publication_relevant_context",
    });
  });

  it("shows a combined context line when sick and requested both drive affected shifts", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2062 + (Date.now() % 18);
    const date = `${uniqueYear}-05-07`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership Combined A ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Combined B ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Combined C ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Combined D ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
    ]);

    const [employeeA, employeeB, employeeC, employeeD] = employees;

    const earlyShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });
    const lateShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: earlyShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeB.id,
          shiftId: earlyShift.id,
          status: "sick",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeC.id,
          shiftId: lateShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeD.id,
          shiftId: lateShift.id,
          status: "requested",
        },
      }),
    ]);

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [earlyShift.id, lateShift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Unterdeckung",
      detail: "2 Schichten betroffen",
      contextLine: "Krankmeldung und unsichere Besetzung in mehreren Schichten",
      visibilityContext: "publication_relevant_context",
    });
  });

  it("keeps contextLine at 'keine aktuelle Veraenderung' when planning was already too tight before a sick absence", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2064 + (Date.now() % 12);
    const date = `${uniqueYear}-05-08`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership Tight Sick A ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Tight Sick B ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
    ]);

    const [employeeA, employeeB] = employees;

    const shift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: shift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeB.id,
          shiftId: shift.id,
          status: "planned",
        },
      }),
    ]);

    const absence = await prisma.absence.create({
      data: {
        employeeId: employeeA.id,
        type: "sick",
        scope: "full_day",
        startDate: new Date(`${date}T00:00:00.000Z`),
        endDate: new Date(`${date}T00:00:00.000Z`),
        status: "active",
      },
    });

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [shift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [absence.id],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Unterdeckung",
      detail: "1 Schicht betroffen",
      contextLine: "keine aktuelle Veraenderung",
      visibilityContext: "publication_relevant_context",
    });
  });

  it("does not derive a requested context when requested exists without a tipping effect", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2100 + Math.floor(Math.random() * 100);
    const date = `${uniqueYear}-05-09`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership Stable Request A ${suffix}`,
          role: "assistant",
          workload: 80,
          qualified: false,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Stable Request B ${suffix}`,
          role: "assistant",
          workload: 80,
          qualified: false,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Stable Request C ${suffix}`,
          role: "assistant",
          workload: 80,
          qualified: false,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Stable Request D ${suffix}`,
          role: "assistant",
          workload: 80,
          qualified: false,
        },
      }),
    ]);

    const [employeeA, employeeB, employeeC, employeeD] = employees;

    const lateShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "late",
        requiredCount: 3,
        requiredQualifiedCount: 0,
      },
    });
    const earlyShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: lateShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeB.id,
          shiftId: lateShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeC.id,
          shiftId: lateShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeD.id,
          shiftId: lateShift.id,
          status: "requested",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: earlyShift.id,
          status: "planned",
        },
      }),
    ]);

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [lateShift.id, earlyShift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Qualifikation unzureichend",
      detail: "1 Schicht betroffen",
      contextLine: "keine aktuelle Veraenderung",
      visibilityContext: "publication_relevant_context",
    });
  });

  it("shows only a sick context when requested also exists but is not tipping", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2068 + (Date.now() % 8);
    const date = `${uniqueYear}-05-10`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership Sick Only A ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Sick Only B ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Sick Only C ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Sick Only D ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
    ]);

    const [employeeA, employeeB, employeeC, employeeD] = employees;

    const earlyShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });
    const lateShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: earlyShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeB.id,
          shiftId: earlyShift.id,
          status: "sick",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeC.id,
          shiftId: lateShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeD.id,
          shiftId: lateShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: lateShift.id,
          status: "requested",
        },
      }),
    ]);

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [earlyShift.id, lateShift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Unterdeckung",
      detail: "1 Schicht betroffen",
      contextLine: "Krankmeldung im Fruehdienst",
      visibilityContext: "publication_relevant_context",
    });
  });

  it("shows only an uncertain staffing context when sick also exists but is not tipping", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2072 + (Date.now() % 6);
    const date = `${uniqueYear}-05-11`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership Request Only A ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Request Only B ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Request Only C ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Request Only D ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
    ]);

    const [employeeA, employeeB, employeeC, employeeD] = employees;

    const earlyShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });
    const lateShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: earlyShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeB.id,
          shiftId: earlyShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeC.id,
          shiftId: earlyShift.id,
          status: "requested",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeC.id,
          shiftId: lateShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: lateShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeD.id,
          shiftId: lateShift.id,
          status: "sick",
        },
      }),
    ]);

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [earlyShift.id, lateShift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Unterdeckung",
      detail: "1 Schicht betroffen",
      contextLine: "unsichere Besetzung im Fruehdienst",
      visibilityContext: "publication_relevant_context",
    });
  });

  it("does not aggregate non-event-driven shifts into the context line when only one shift is tipping", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2074 + (Date.now() % 4);
    const date = `${uniqueYear}-05-12`;

    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          name: `Leadership Single Event A ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Single Event B ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Single Event C ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
      prisma.employee.create({
        data: {
          name: `Leadership Single Event D ${suffix}`,
          role: "nurse",
          workload: 80,
          qualified: true,
        },
      }),
    ]);

    const [employeeA, employeeB, employeeC, employeeD] = employees;

    const earlyShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });
    const nightShift = await prisma.shift.create({
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        type: "night",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: employeeA.id,
          shiftId: earlyShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeB.id,
          shiftId: earlyShift.id,
          status: "sick",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeC.id,
          shiftId: nightShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeD.id,
          shiftId: nightShift.id,
          status: "planned",
        },
      }),
    ]);

    const absence = await prisma.absence.create({
      data: {
        employeeId: employeeC.id,
        type: "sick",
        scope: "full_day",
        startDate: new Date(`${date}T00:00:00.000Z`),
        endDate: new Date(`${date}T00:00:00.000Z`),
        status: "active",
      },
    });

    testContexts.push({
      employeeIds: employees.map((employee) => employee.id),
      planningMonthIds: [],
      shiftIds: [earlyShift.id, nightShift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [absence.id],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/day").query({ date });

    expect(response.status).toBe(200);
    expect(response.body.day.headline).toEqual({
      title: "Unterdeckung",
      detail: "2 Schichten betroffen",
      contextLine: "Krankmeldung im Fruehdienst",
      visibilityContext: "publication_relevant_context",
    });
  });

  it("returns a read-only leadership week view as a calm sequence of daily situations", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2080 + (Date.now() % 10);
    const weekDate = `${uniqueYear}-04-23`;

    const qualifiedEmployee = await prisma.employee.create({
      data: {
        name: `Leadership Week Qualified ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    const nonQualifiedEmployee = await prisma.employee.create({
      data: {
        name: `Leadership Week NonQualified ${suffix}`,
        role: "assistant",
        workload: 80,
        qualified: false,
      },
    });

    const earlyShift = await prisma.shift.create({
      data: {
        date: new Date(`${uniqueYear}-04-22T00:00:00.000Z`),
        type: "early",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });

    const lateShift = await prisma.shift.create({
      data: {
        date: new Date(`${uniqueYear}-04-23T00:00:00.000Z`),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const lateAssignment = await prisma.assignment.create({
      data: {
        employeeId: nonQualifiedEmployee.id,
        shiftId: lateShift.id,
        status: "planned",
      },
    });

    const earlyAssignment = await prisma.assignment.create({
      data: {
        employeeId: qualifiedEmployee.id,
        shiftId: earlyShift.id,
        status: "planned",
      },
    });

    const availabilityRequest = await prisma.availabilityRequest.create({
      data: {
        employeeId: qualifiedEmployee.id,
        type: "wish_free",
        startDate: new Date(`${uniqueYear}-04-21T00:00:00.000Z`),
        endDate: new Date(`${uniqueYear}-04-21T00:00:00.000Z`),
        isFullDay: true,
        priority: "medium",
        status: "submitted",
      },
    });
    const historyDay = await prisma.dailySituation.create({
      data: {
        date: new Date(`${uniqueYear}-04-21T00:00:00.000Z`),
        situation: "stabil",
      },
    });

    testContexts.push({
      employeeIds: [qualifiedEmployee.id, nonQualifiedEmployee.id],
      planningMonthIds: [],
      shiftIds: [earlyShift.id, lateShift.id],
      assignmentIds: [lateAssignment.id, earlyAssignment.id],
      absenceIds: [],
      availabilityRequestIds: [availabilityRequest.id],
      dailySituationIds: [historyDay.id],
    });

    const response = await request(app).get("/leadership/week").query({
      date: weekDate,
    });
    const weekDates = buildExpectedWeekDates(weekDate);
    const earlyShiftDate = `${uniqueYear}-04-22`;
    const lateShiftDate = `${uniqueYear}-04-23`;

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: weekDate,
      week: {
        range: {
          from: weekDates[0],
          to: weekDates[6],
        },
        summary: {
          situation: "angespannt",
        },
        days: weekDates.map((date) => {
          if (date === earlyShiftDate) {
            return {
              date,
              situation: "angespannt",
              note: "Fruehdienst betroffen",
            };
          }

          if (date === `${uniqueYear}-04-21`) {
            return {
              date,
              situation: "stabil",
              note: "1 Anfrage",
            };
          }

          if (date === lateShiftDate) {
            return {
              date,
              situation: "angespannt",
              note: "Spaetdienst betroffen",
            };
          }

          return {
            date,
            situation: null,
            note: null,
          };
        }),
      },
    });
  });

  it("returns a read-only leadership month view with fixed date groups", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2090 + (Date.now() % 5);
    const monthDate = `${uniqueYear}-04-23`;

    const firstEmployee = await prisma.employee.create({
      data: {
        name: `Leadership Month First ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    const secondEmployee = await prisma.employee.create({
      data: {
        name: `Leadership Month Second ${suffix}`,
        role: "assistant",
        workload: 80,
        qualified: false,
      },
    });

    const tenseShift = await prisma.shift.create({
      data: {
        date: new Date(`${uniqueYear}-04-03T00:00:00.000Z`),
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const criticalLateShift = await prisma.shift.create({
      data: {
        date: new Date(`${uniqueYear}-04-09T00:00:00.000Z`),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const criticalNightShift = await prisma.shift.create({
      data: {
        date: new Date(`${uniqueYear}-04-09T00:00:00.000Z`),
        type: "night",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const criticalDayShift = await prisma.shift.create({
      data: {
        date: new Date(`${uniqueYear}-04-09T00:00:00.000Z`),
        type: "day",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const tenseAssignment = await prisma.assignment.create({
      data: {
        employeeId: firstEmployee.id,
        shiftId: tenseShift.id,
        status: "planned",
      },
    });

    const criticalLateAssignment = await prisma.assignment.create({
      data: {
        employeeId: secondEmployee.id,
        shiftId: criticalLateShift.id,
        status: "planned",
      },
    });

    const criticalNightAssignment = await prisma.assignment.create({
      data: {
        employeeId: secondEmployee.id,
        shiftId: criticalNightShift.id,
        status: "planned",
      },
    });

    const criticalDayAssignment = await prisma.assignment.create({
      data: {
        employeeId: secondEmployee.id,
        shiftId: criticalDayShift.id,
        status: "planned",
      },
    });
    const historyDays = await Promise.all([
      prisma.dailySituation.create({
        data: {
          date: new Date(`${uniqueYear}-04-18T00:00:00.000Z`),
          situation: "stabil",
        },
      }),
      prisma.dailySituation.create({
        data: {
          date: new Date(`${uniqueYear}-04-24T00:00:00.000Z`),
          situation: "angespannt",
        },
      }),
    ]);

    testContexts.push({
      employeeIds: [firstEmployee.id, secondEmployee.id],
      planningMonthIds: [],
      shiftIds: [
        tenseShift.id,
        criticalLateShift.id,
        criticalNightShift.id,
        criticalDayShift.id,
      ],
      assignmentIds: [
        tenseAssignment.id,
        criticalLateAssignment.id,
        criticalNightAssignment.id,
        criticalDayAssignment.id,
      ],
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: historyDays.map((entry) => entry.id),
    });

    const response = await request(app).get("/leadership/month").query({
      date: monthDate,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: monthDate,
      month: {
        year: uniqueYear,
        month: 4,
        summary: {
          situation: "angespannt",
        },
        groups: [
          {
            from: `${uniqueYear}-04-01`,
            to: `${uniqueYear}-04-07`,
            situation: "angespannt",
            days: [
              {
                date: `${uniqueYear}-04-03`,
                situation: "angespannt",
              },
            ],
          },
          {
            from: `${uniqueYear}-04-08`,
            to: `${uniqueYear}-04-14`,
            situation: "kritisch",
            days: [
              {
                date: `${uniqueYear}-04-09`,
                situation: "kritisch",
              },
            ],
          },
          {
            from: `${uniqueYear}-04-15`,
            to: `${uniqueYear}-04-21`,
            situation: "stabil",
            days: [],
          },
          {
            from: `${uniqueYear}-04-22`,
            to: `${uniqueYear}-04-30`,
            situation: "angespannt",
            days: [
              {
                date: `${uniqueYear}-04-24`,
                situation: "angespannt",
              },
            ],
          },
        ],
      },
    });
  });

  it("returns the week view for an explicit month-group date range", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2095 + (Date.now() % 4);
    const rangeStart = `${uniqueYear}-04-22`;
    const rangeEnd = `${uniqueYear}-04-30`;

    const qualifiedEmployee = await prisma.employee.create({
      data: {
        name: `Leadership Range Qualified ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    const nonQualifiedEmployee = await prisma.employee.create({
      data: {
        name: `Leadership Range NonQualified ${suffix}`,
        role: "assistant",
        workload: 80,
        qualified: false,
      },
    });

    const tenseShift = await prisma.shift.create({
      data: {
        date: new Date(`${uniqueYear}-04-24T00:00:00.000Z`),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const criticalShift = await prisma.shift.create({
      data: {
        date: new Date(`${uniqueYear}-04-28T00:00:00.000Z`),
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const tenseAssignment = await prisma.assignment.create({
      data: {
        employeeId: qualifiedEmployee.id,
        shiftId: tenseShift.id,
        status: "planned",
      },
    });

    const criticalAssignment = await prisma.assignment.create({
      data: {
        employeeId: nonQualifiedEmployee.id,
        shiftId: criticalShift.id,
        status: "planned",
      },
    });

    testContexts.push({
      employeeIds: [qualifiedEmployee.id, nonQualifiedEmployee.id],
      planningMonthIds: [],
      shiftIds: [tenseShift.id, criticalShift.id],
      assignmentIds: [tenseAssignment.id, criticalAssignment.id],
      absenceIds: [],
      availabilityRequestIds: [],
      dailySituationIds: [],
    });

    const response = await request(app).get("/leadership/week").query({
      start: rangeStart,
      end: rangeEnd,
    });
    const rangeDates = buildExpectedDateRange(rangeStart, rangeEnd);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: rangeStart,
      week: {
        range: {
          from: rangeStart,
          to: rangeEnd,
        },
        summary: {
          situation: "angespannt",
        },
        days: rangeDates.map((date) => {
          if (date === `${uniqueYear}-04-24`) {
            return {
              date,
              situation: "angespannt",
              note: "Spaetdienst betroffen",
            };
          }

          if (date === `${uniqueYear}-04-28`) {
            return {
              date,
              situation: "angespannt",
              note: "Fruehdienst betroffen",
            };
          }

          return {
            date,
            situation: null,
            note: null,
          };
        }),
      },
    });
  });
});
