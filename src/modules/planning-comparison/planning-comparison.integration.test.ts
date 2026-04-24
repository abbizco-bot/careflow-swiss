import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type PlanningComparisonTestContext = {
  employeeIds: number[];
  planningMonthIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
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
      gapSignalsTotal: 6,
      daysWithGapSignals: 4,
      daysWithSpecialDays: 1,
      daysWithPlanningNotes: 1,
      gapSignalsByCode: {
        planned_shift_missing: 2,
        unplanned_operational_shift: 1,
        planned_count_not_reached: 1,
        operational_count_exceeds_plan: 0,
        request_present: 2,
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
          gapSignalCount: 1,
          affectedShiftTypes: [],
          isSpecialDay: false,
          planningNote: null,
          comparisonStatus: "aligned",
          gapSignals: expect.arrayContaining([
            expect.objectContaining({
              code: "request_present",
              requestCount: 1,
            }),
          ]),
        }),
        expect.objectContaining({
          date: "2026-11-03",
          relevantAvailabilityRequestCount: 1,
          requestCount: 1,
          gapSignalCount: 3,
          affectedShiftTypes: ["early", "night"],
          isSpecialDay: false,
          planningNote: null,
          comparisonStatus: "mismatch",
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
          ]),
        }),
        expect.objectContaining({
          date: "2026-11-04",
          relevantAvailabilityRequestCount: 0,
          requestCount: 0,
          gapSignalCount: 1,
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
});
