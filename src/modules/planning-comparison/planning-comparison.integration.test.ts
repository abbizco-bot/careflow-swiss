import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type PlanningComparisonTestContext = {
  employeeIds: number[];
  planningMonthIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
  absenceIds: number[];
  availabilityRequestIds: number[];
};

const testContexts: PlanningComparisonTestContext[] = [];
const app = createApp({ includeValidations: false });

describe("Planning comparison read-only integration", () => {
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

  it("returns read-only comparison statuses and explicit gap signals", async () => {
    const employee = await prisma.employee.create({
      data: {
        name: `Planning Comparison Employee ${Date.now()}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: 2026,
        month: 11,
        status: "draft",
      },
    });

    const firstDay = await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date("2026-11-01T00:00:00.000Z"),
        isSpecialDay: true,
        note: "Holiday coverage note",
      },
    });

    const secondDay = await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date("2026-11-02T00:00:00.000Z"),
      },
    });

    const thirdDay = await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date("2026-11-03T00:00:00.000Z"),
      },
    });

    const fourthDay = await prisma.planningDay.create({
      data: {
        planningMonthId: planningMonth.id,
        date: new Date("2026-11-04T00:00:00.000Z"),
      },
    });

    await prisma.planningShiftTemplate.create({
      data: {
        planningDayId: firstDay.id,
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    await prisma.planningShiftTemplate.create({
      data: {
        planningDayId: secondDay.id,
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    await prisma.planningShiftTemplate.create({
      data: {
        planningDayId: thirdDay.id,
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    await prisma.planningShiftTemplate.create({
      data: {
        planningDayId: fourthDay.id,
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const alignedShift = await prisma.shift.create({
      data: {
        date: new Date("2026-11-02T00:00:00.000Z"),
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const mismatchShift = await prisma.shift.create({
      data: {
        date: new Date("2026-11-03T00:00:00.000Z"),
        type: "night",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });

    const partialShift = await prisma.shift.create({
      data: {
        date: new Date("2026-11-04T00:00:00.000Z"),
        type: "early",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });

    const assignment = await prisma.assignment.create({
      data: {
        employeeId: employee.id,
        shiftId: alignedShift.id,
        status: "planned",
      },
    });

    const availabilityRequest = await prisma.availabilityRequest.create({
      data: {
        employeeId: employee.id,
        type: "wish_free",
        startDate: new Date("2026-11-02T00:00:00.000Z"),
        endDate: new Date("2026-11-03T00:00:00.000Z"),
        isFullDay: true,
        priority: "medium",
        status: "submitted",
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      planningMonthIds: [planningMonth.id],
      shiftIds: [alignedShift.id, mismatchShift.id, partialShift.id],
      assignmentIds: [assignment.id],
      absenceIds: [],
      availabilityRequestIds: [availabilityRequest.id],
    });

    const dayCountBefore = await prisma.planningDay.count({
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
    const shiftIdsBefore = await prisma.shift.findMany({
      where: {
        id: {
          in: [alignedShift.id, mismatchShift.id, partialShift.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const assignmentBefore = await prisma.assignment.findUnique({
      where: { id: assignment.id },
    });
    const requestBefore = await prisma.availabilityRequest.findUnique({
      where: { id: availabilityRequest.id },
    });
    const dailySituationCountBefore = await prisma.dailySituation.count({
      where: {
          date: {
            gte: new Date("2026-11-01T00:00:00.000Z"),
          lt: new Date("2026-11-05T00:00:00.000Z"),
        },
      },
    });

    const response = await request(app).get(
      `/planning-months/${planningMonth.id}/comparison`
    );

    expect(response.status).toBe(200);
    expect(response.body.planningMonth).toMatchObject({
      id: planningMonth.id,
      year: 2026,
      month: 11,
      status: "draft",
    });
    expect(response.body.summary).toEqual({
      daysTotal: 4,
      daysAligned: 1,
      daysPartiallyAligned: 1,
      daysMismatch: 1,
      daysNotStarted: 1,
      daysWithRequests: 2,
      requestsTotal: 2,
      gapSignalsTotal: 11,
      daysWithGapSignals: 4,
      daysWithSpecialDays: 1,
      daysWithPlanningNotes: 1,
      gapSignalsByCode: {
        planned_shift_missing: 2,
        unplanned_operational_shift: 1,
        planned_count_not_reached: 1,
        operational_count_exceeds_plan: 0,
        request_present: 2,
        effective_coverage_gap: 3,
        effective_qualification_gap: 2,
      },
    });

    expect(response.body.days).toHaveLength(4);
    expect(response.body.days).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: "2026-11-01",
          relevantAvailabilityRequestCount: 0,
          requestCount: 0,
          gapSignalCount: 1,
          affectedShiftTypes: ["early"],
          isSpecialDay: true,
          planningNote: "Holiday coverage note",
          comparisonStatus: "not_started",
          gapSignals: expect.arrayContaining([
            expect.objectContaining({
              code: "planned_shift_missing",
              shiftType: "early",
              plannedCount: 2,
              operationalCount: 0,
            }),
          ]),
        }),
        expect.objectContaining({
          date: "2026-11-02",
          relevantAvailabilityRequestCount: 1,
          requestCount: 1,
          gapSignalCount: 2,
          affectedShiftTypes: ["early"],
          isSpecialDay: false,
          planningNote: null,
          comparisonStatus: "aligned",
          operationalShifts: [
            expect.objectContaining({
              id: alignedShift.id,
              type: "early",
              requiredCount: 2,
              requiredQualifiedCount: 1,
              assignedCount: 1,
              availableAssignedCount: 1,
              absentAssignedCount: 0,
              qualifiedAssignedCount: 1,
              availableQualifiedCount: 1,
              effectiveCoverageGap: 1,
              effectiveQualificationGap: 0,
            }),
          ],
          gapSignals: expect.arrayContaining([
            expect.objectContaining({
              code: "request_present",
              requestCount: 1,
            }),
            expect.objectContaining({
              code: "effective_coverage_gap",
              shiftType: "early",
              requiredCount: 2,
              assignedCount: 1,
              availableAssignedCount: 1,
              absentAssignedCount: 0,
              effectiveCoverageGap: 1,
            }),
          ]),
        }),
        expect.objectContaining({
          date: "2026-11-03",
          relevantAvailabilityRequestCount: 1,
          requestCount: 1,
          gapSignalCount: 5,
          affectedShiftTypes: ["early", "night"],
          isSpecialDay: false,
          planningNote: null,
          comparisonStatus: "mismatch",
          operationalShifts: [
            expect.objectContaining({
              id: mismatchShift.id,
              type: "night",
              assignedCount: 0,
              availableAssignedCount: 0,
              absentAssignedCount: 0,
              qualifiedAssignedCount: 0,
              availableQualifiedCount: 0,
              effectiveCoverageGap: 1,
              effectiveQualificationGap: 1,
            }),
          ],
          gapSignals: expect.arrayContaining([
            expect.objectContaining({
              code: "planned_shift_missing",
              shiftType: "early",
              plannedCount: 2,
              operationalCount: 0,
            }),
            expect.objectContaining({
              code: "unplanned_operational_shift",
              shiftType: "night",
              plannedCount: 0,
              operationalCount: 1,
            }),
            expect.objectContaining({
              code: "request_present",
              requestCount: 1,
            }),
            expect.objectContaining({
              code: "effective_coverage_gap",
              shiftType: "night",
              effectiveCoverageGap: 1,
            }),
            expect.objectContaining({
              code: "effective_qualification_gap",
              shiftType: "night",
              effectiveQualificationGap: 1,
            }),
          ]),
        }),
        expect.objectContaining({
          date: "2026-11-04",
          relevantAvailabilityRequestCount: 0,
          requestCount: 0,
          gapSignalCount: 3,
          affectedShiftTypes: ["early"],
          isSpecialDay: false,
          planningNote: null,
          comparisonStatus: "partially_aligned",
          gapSignals: expect.arrayContaining([
            expect.objectContaining({
              code: "planned_count_not_reached",
              shiftType: "early",
              plannedCount: 2,
              operationalCount: 1,
            }),
            expect.objectContaining({
              code: "effective_coverage_gap",
              shiftType: "early",
              effectiveCoverageGap: 1,
            }),
            expect.objectContaining({
              code: "effective_qualification_gap",
              shiftType: "early",
              effectiveQualificationGap: 1,
            }),
          ]),
        }),
      ])
    );

    const dayCountAfter = await prisma.planningDay.count({
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
    const shiftIdsAfter = await prisma.shift.findMany({
      where: {
        id: {
          in: [alignedShift.id, mismatchShift.id, partialShift.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const assignmentAfter = await prisma.assignment.findUnique({
      where: { id: assignment.id },
    });
    const requestAfter = await prisma.availabilityRequest.findUnique({
      where: { id: availabilityRequest.id },
    });
    const dailySituationCountAfter = await prisma.dailySituation.count({
      where: {
          date: {
            gte: new Date("2026-11-01T00:00:00.000Z"),
          lt: new Date("2026-11-05T00:00:00.000Z"),
        },
      },
    });

    expect(dayCountAfter).toBe(dayCountBefore);
    expect(templateCountAfter).toBe(templateCountBefore);
    expect(shiftIdsAfter).toEqual(shiftIdsBefore);
    expect(assignmentAfter).toEqual(assignmentBefore);
    expect(requestAfter).toEqual(requestBefore);
    expect(dailySituationCountAfter).toBe(dailySituationCountBefore);
  });

  it("adds effective staffing counts and gaps without mutating operational records", async () => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const uniqueYear = 2030 + (Date.now() % 50);
    const employeeQualifiedAvailable = await prisma.employee.create({
      data: {
        name: `Planning Effective Qualified Available ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });
    const employeeSupportAvailable = await prisma.employee.create({
      data: {
        name: `Planning Effective Support Available ${suffix}`,
        role: "assistant",
        workload: 80,
        qualified: false,
      },
    });
    const employeeSupportAbsent = await prisma.employee.create({
      data: {
        name: `Planning Effective Support Absent ${suffix}`,
        role: "assistant",
        workload: 80,
        qualified: false,
      },
    });
    const employeeQualifiedAbsent = await prisma.employee.create({
      data: {
        name: `Planning Effective Qualified Absent ${suffix}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: uniqueYear,
        month: 12,
        status: "draft",
      },
    });

    const [completeDay, coverageGapDay, qualificationGapDay] =
      await Promise.all([
        prisma.planningDay.create({
          data: {
            planningMonthId: planningMonth.id,
            date: new Date(`${uniqueYear}-12-10T00:00:00.000Z`),
          },
        }),
        prisma.planningDay.create({
          data: {
            planningMonthId: planningMonth.id,
            date: new Date(`${uniqueYear}-12-11T00:00:00.000Z`),
          },
        }),
        prisma.planningDay.create({
          data: {
            planningMonthId: planningMonth.id,
            date: new Date(`${uniqueYear}-12-12T00:00:00.000Z`),
          },
        }),
      ]);

    await prisma.planningShiftTemplate.createMany({
      data: [
        {
          planningDayId: completeDay.id,
          type: "early",
          requiredCount: 2,
          requiredQualifiedCount: 1,
        },
        {
          planningDayId: coverageGapDay.id,
          type: "late",
          requiredCount: 2,
          requiredQualifiedCount: 1,
        },
        {
          planningDayId: qualificationGapDay.id,
          type: "night",
          requiredCount: 1,
          requiredQualifiedCount: 1,
        },
      ],
    });

    const [completeShift, coverageGapShift, qualificationGapShift] =
      await Promise.all([
        prisma.shift.create({
          data: {
            date: new Date(`${uniqueYear}-12-10T00:00:00.000Z`),
            type: "early",
            requiredCount: 2,
            requiredQualifiedCount: 1,
          },
        }),
        prisma.shift.create({
          data: {
            date: new Date(`${uniqueYear}-12-11T00:00:00.000Z`),
            type: "late",
            requiredCount: 2,
            requiredQualifiedCount: 1,
          },
        }),
        prisma.shift.create({
          data: {
            date: new Date(`${uniqueYear}-12-12T00:00:00.000Z`),
            type: "night",
            requiredCount: 1,
            requiredQualifiedCount: 1,
          },
        }),
      ]);

    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          employeeId: employeeQualifiedAvailable.id,
          shiftId: completeShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeSupportAvailable.id,
          shiftId: completeShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeQualifiedAvailable.id,
          shiftId: coverageGapShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeSupportAbsent.id,
          shiftId: coverageGapShift.id,
          status: "planned",
        },
      }),
      prisma.assignment.create({
        data: {
          employeeId: employeeQualifiedAbsent.id,
          shiftId: qualificationGapShift.id,
          status: "planned",
        },
      }),
    ]);

    const [supportAbsence, qualifiedAbsence] = await Promise.all([
      prisma.absence.create({
        data: {
          employeeId: employeeSupportAbsent.id,
          type: "sick",
          scope: "full_day",
          startDate: new Date(`${uniqueYear}-12-11T00:00:00.000Z`),
          endDate: new Date(`${uniqueYear}-12-11T00:00:00.000Z`),
          status: "active",
        },
      }),
      prisma.absence.create({
        data: {
          employeeId: employeeQualifiedAbsent.id,
          type: "sick",
          scope: "full_day",
          startDate: new Date(`${uniqueYear}-12-12T00:00:00.000Z`),
          endDate: new Date(`${uniqueYear}-12-12T00:00:00.000Z`),
          status: "active",
        },
      }),
    ]);

    const availabilityRequest = await prisma.availabilityRequest.create({
      data: {
        employeeId: employeeSupportAvailable.id,
        type: "wish_free",
        startDate: new Date(`${uniqueYear}-12-10T00:00:00.000Z`),
        endDate: new Date(`${uniqueYear}-12-10T00:00:00.000Z`),
        isFullDay: true,
        priority: "high",
        status: "submitted",
      },
    });

    testContexts.push({
      employeeIds: [
        employeeQualifiedAvailable.id,
        employeeSupportAvailable.id,
        employeeSupportAbsent.id,
        employeeQualifiedAbsent.id,
      ],
      planningMonthIds: [planningMonth.id],
      shiftIds: [completeShift.id, coverageGapShift.id, qualificationGapShift.id],
      assignmentIds: assignments.map((assignment) => assignment.id),
      absenceIds: [supportAbsence.id, qualifiedAbsence.id],
      availabilityRequestIds: [availabilityRequest.id],
    });

    const shiftsBefore = await prisma.shift.findMany({
      where: {
        id: {
          in: [completeShift.id, coverageGapShift.id, qualificationGapShift.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const assignmentsBefore = await prisma.assignment.findMany({
      where: {
        id: {
          in: assignments.map((assignment) => assignment.id),
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const absencesBefore = await prisma.absence.findMany({
      where: {
        id: {
          in: [supportAbsence.id, qualifiedAbsence.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const requestBefore = await prisma.availabilityRequest.findUnique({
      where: {
        id: availabilityRequest.id,
      },
    });

    const response = await request(app).get(
      `/planning-months/${planningMonth.id}/comparison`
    );

    expect(response.status).toBe(200);
    expect(response.body.days).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: `${uniqueYear}-12-10`,
          requestCount: 1,
          operationalShifts: [
            expect.objectContaining({
              id: completeShift.id,
              type: "early",
              assignedCount: 2,
              availableAssignedCount: 2,
              absentAssignedCount: 0,
              qualifiedAssignedCount: 1,
              availableQualifiedCount: 1,
              effectiveCoverageGap: 0,
              effectiveQualificationGap: 0,
            }),
          ],
          gapSignals: [
            expect.objectContaining({
              code: "request_present",
              requestCount: 1,
            }),
          ],
        }),
        expect.objectContaining({
          date: `${uniqueYear}-12-11`,
          operationalShifts: [
            expect.objectContaining({
              id: coverageGapShift.id,
              type: "late",
              assignedCount: 2,
              availableAssignedCount: 1,
              absentAssignedCount: 1,
              qualifiedAssignedCount: 1,
              availableQualifiedCount: 1,
              effectiveCoverageGap: 1,
              effectiveQualificationGap: 0,
            }),
          ],
          gapSignals: expect.arrayContaining([
            expect.objectContaining({
              code: "effective_coverage_gap",
              shiftType: "late",
              requiredCount: 2,
              assignedCount: 2,
              availableAssignedCount: 1,
              absentAssignedCount: 1,
              effectiveCoverageGap: 1,
            }),
          ]),
        }),
        expect.objectContaining({
          date: `${uniqueYear}-12-12`,
          operationalShifts: [
            expect.objectContaining({
              id: qualificationGapShift.id,
              type: "night",
              assignedCount: 1,
              availableAssignedCount: 0,
              absentAssignedCount: 1,
              qualifiedAssignedCount: 1,
              availableQualifiedCount: 0,
              effectiveCoverageGap: 1,
              effectiveQualificationGap: 1,
            }),
          ],
          gapSignals: expect.arrayContaining([
            expect.objectContaining({
              code: "effective_coverage_gap",
              shiftType: "night",
              effectiveCoverageGap: 1,
            }),
            expect.objectContaining({
              code: "effective_qualification_gap",
              shiftType: "night",
              requiredQualifiedCount: 1,
              qualifiedAssignedCount: 1,
              availableQualifiedCount: 0,
              effectiveQualificationGap: 1,
            }),
          ]),
        }),
      ])
    );

    const shiftsAfter = await prisma.shift.findMany({
      where: {
        id: {
          in: [completeShift.id, coverageGapShift.id, qualificationGapShift.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const assignmentsAfter = await prisma.assignment.findMany({
      where: {
        id: {
          in: assignments.map((assignment) => assignment.id),
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const absencesAfter = await prisma.absence.findMany({
      where: {
        id: {
          in: [supportAbsence.id, qualifiedAbsence.id],
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    const requestAfter = await prisma.availabilityRequest.findUnique({
      where: {
        id: availabilityRequest.id,
      },
    });

    expect(shiftsAfter).toEqual(shiftsBefore);
    expect(assignmentsAfter).toEqual(assignmentsBefore);
    expect(absencesAfter).toEqual(absencesBefore);
    expect(requestAfter).toEqual(requestBefore);
  });
});
