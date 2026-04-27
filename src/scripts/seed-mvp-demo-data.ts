import { prisma } from "../lib/prisma";
import {
  AssignmentFunction,
  BaseQualification,
} from "../generated/prisma/enums";

const DEMO_YEAR = 2088;
const DEMO_PREFIX = `demo-mvp-${DEMO_YEAR}`;
const DEMO_RANGE_START = new Date(`${DEMO_YEAR}-05-01T00:00:00.000Z`);
const DEMO_RANGE_END = new Date(`${DEMO_YEAR}-07-01T00:00:00.000Z`);

const demoDates = {
  operationalGap: `${DEMO_YEAR}-05-05`,
  qualificationGap: `${DEMO_YEAR}-05-06`,
  mixedGap: `${DEMO_YEAR}-05-07`,
  stable: `${DEMO_YEAR}-05-12`,
  attention: `${DEMO_YEAR}-05-13`,
  functionWarning: `${DEMO_YEAR}-05-15`,
  absenceGap: `${DEMO_YEAR}-05-16`,
  planningComparisonStart: `${DEMO_YEAR}-06-01`,
  planningComparisonEnd: `${DEMO_YEAR}-06-04`,
} as const;

type DemoEmployeeKey =
  | "qualifiedA"
  | "qualifiedB"
  | "qualifiedC"
  | "qualifiedD"
  | "assistantA"
  | "assistantB"
  | "functionWarning";

type DemoEmployees = Record<DemoEmployeeKey, { id: number }>;

function utcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

async function resetDemoData() {
  const [demoEmployees, demoShifts] = await Promise.all([
    prisma.employee.findMany({
      where: {
        externalEmployeeId: {
          startsWith: DEMO_PREFIX,
        },
      },
      select: {
        id: true,
      },
    }),
    prisma.shift.findMany({
      where: {
        date: {
          gte: DEMO_RANGE_START,
          lt: DEMO_RANGE_END,
        },
      },
      select: {
        id: true,
      },
    }),
  ]);

  const demoEmployeeIds = demoEmployees.map((employee) => employee.id);
  const demoShiftIds = demoShifts.map((shift) => shift.id);

  await prisma.$transaction(async (tx) => {
    await tx.assignment.deleteMany({
      where: {
        OR: [
          {
            employeeId: {
              in: demoEmployeeIds,
            },
          },
          {
            shiftId: {
              in: demoShiftIds,
            },
          },
        ],
      },
    });

    await tx.absence.deleteMany({
      where: {
        employeeId: {
          in: demoEmployeeIds,
        },
      },
    });

    await tx.availabilityRequest.deleteMany({
      where: {
        employeeId: {
          in: demoEmployeeIds,
        },
      },
    });

    await tx.shift.deleteMany({
      where: {
        date: {
          gte: DEMO_RANGE_START,
          lt: DEMO_RANGE_END,
        },
      },
    });

    await tx.planningMonth.deleteMany({
      where: {
        OR: [
          {
            year: DEMO_YEAR,
            month: 5,
          },
          {
            year: DEMO_YEAR,
            month: 6,
          },
        ],
      },
    });

    await tx.employee.deleteMany({
      where: {
        externalEmployeeId: {
          startsWith: DEMO_PREFIX,
        },
      },
    });
  });
}

async function createDemoEmployees(): Promise<DemoEmployees> {
  const employees = await prisma.$transaction(async (tx) => {
    const qualifiedA = await tx.employee.create({
      data: {
        name: "Demo Pflegefachperson A",
        role: "nurse",
        workload: 80,
        qualified: true,
        baseQualification: BaseQualification.DIPL_PFLEGE,
        externalEmployeeId: `${DEMO_PREFIX}-qualified-a`,
      },
    });

    const qualifiedB = await tx.employee.create({
      data: {
        name: "Demo Pflegefachperson B",
        role: "nurse",
        workload: 80,
        qualified: true,
        baseQualification: BaseQualification.DIPL_PFLEGE,
        externalEmployeeId: `${DEMO_PREFIX}-qualified-b`,
      },
    });

    const qualifiedC = await tx.employee.create({
      data: {
        name: "Demo Pflegefachperson C",
        role: "nurse",
        workload: 80,
        qualified: true,
        baseQualification: BaseQualification.DIPL_PFLEGE,
        externalEmployeeId: `${DEMO_PREFIX}-qualified-c`,
      },
    });

    const qualifiedD = await tx.employee.create({
      data: {
        name: "Demo Pflegefachperson D",
        role: "nurse",
        workload: 80,
        qualified: true,
        baseQualification: BaseQualification.DIPL_PFLEGE,
        externalEmployeeId: `${DEMO_PREFIX}-qualified-d`,
      },
    });

    const assistantA = await tx.employee.create({
      data: {
        name: "Demo Assistenz A",
        role: "assistant",
        workload: 80,
        qualified: false,
        baseQualification: BaseQualification.PFLEGEHILFE,
        externalEmployeeId: `${DEMO_PREFIX}-assistant-a`,
      },
    });

    const assistantB = await tx.employee.create({
      data: {
        name: "Demo Assistenz B",
        role: "assistant",
        workload: 80,
        qualified: false,
        baseQualification: BaseQualification.AGS,
        externalEmployeeId: `${DEMO_PREFIX}-assistant-b`,
      },
    });

    const functionWarning = await tx.employee.create({
      data: {
        name: "Demo Fachperson Funktion",
        role: "nurse",
        workload: 80,
        qualified: true,
        baseQualification: BaseQualification.FAGE,
        externalEmployeeId: `${DEMO_PREFIX}-function-warning`,
      },
    });

    return {
      qualifiedA,
      qualifiedB,
      qualifiedC,
      qualifiedD,
      assistantA,
      assistantB,
      functionWarning,
    };
  });

  return employees;
}

async function createLeadershipDayScenarios(employees: DemoEmployees) {
  await prisma.$transaction(async (tx) => {
    const stableShift = await tx.shift.create({
      data: {
        date: utcDate(demoDates.stable),
        type: "early",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });
    await tx.assignment.create({
      data: {
        employeeId: employees.qualifiedA.id,
        shiftId: stableShift.id,
        status: "planned",
      },
    });

    const attentionShift = await tx.shift.create({
      data: {
        date: utcDate(demoDates.attention),
        type: "early",
        requiredCount: 0,
        requiredQualifiedCount: 0,
      },
    });
    await tx.assignment.create({
      data: {
        employeeId: employees.qualifiedB.id,
        shiftId: attentionShift.id,
        status: "requested",
      },
    });

    const operationalGapShift = await tx.shift.create({
      data: {
        date: utcDate(demoDates.operationalGap),
        type: "early",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });
    await tx.assignment.createMany({
      data: [
        {
          employeeId: employees.qualifiedA.id,
          shiftId: operationalGapShift.id,
          status: "planned",
        },
        {
          employeeId: employees.qualifiedB.id,
          shiftId: operationalGapShift.id,
          status: "planned",
        },
        {
          employeeId: employees.qualifiedC.id,
          shiftId: operationalGapShift.id,
          status: "sick",
        },
      ],
    });

    const qualificationGapShift = await tx.shift.create({
      data: {
        date: utcDate(demoDates.qualificationGap),
        type: "late",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });
    await tx.assignment.create({
      data: {
        employeeId: employees.assistantA.id,
        shiftId: qualificationGapShift.id,
        status: "planned",
      },
    });

    const absenceGapShift = await tx.shift.create({
      data: {
        date: utcDate(demoDates.absenceGap),
        type: "early",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });
    await tx.assignment.createMany({
      data: [
        {
          employeeId: employees.qualifiedA.id,
          shiftId: absenceGapShift.id,
          status: "planned",
        },
        {
          employeeId: employees.qualifiedB.id,
          shiftId: absenceGapShift.id,
          status: "planned",
        },
      ],
    });
    await tx.absence.create({
      data: {
        employeeId: employees.qualifiedA.id,
        type: "sick",
        scope: "full_day",
        startDate: utcDate(demoDates.absenceGap),
        endDate: utcDate(demoDates.absenceGap),
        status: "active",
        note: `${DEMO_PREFIX} absence-driven gap`,
      },
    });

    const mixedEarlyShift = await tx.shift.create({
      data: {
        date: utcDate(demoDates.mixedGap),
        type: "early",
        requiredCount: 3,
        requiredQualifiedCount: 1,
      },
    });
    const mixedLateShift = await tx.shift.create({
      data: {
        date: utcDate(demoDates.mixedGap),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });
    await tx.assignment.createMany({
      data: [
        {
          employeeId: employees.qualifiedA.id,
          shiftId: mixedEarlyShift.id,
          status: "planned",
        },
        {
          employeeId: employees.assistantA.id,
          shiftId: mixedEarlyShift.id,
          status: "planned",
        },
        {
          employeeId: employees.qualifiedB.id,
          shiftId: mixedLateShift.id,
          status: "planned",
        },
      ],
    });
    await tx.absence.create({
      data: {
        employeeId: employees.qualifiedB.id,
        type: "sick",
        scope: "full_day",
        startDate: utcDate(demoDates.mixedGap),
        endDate: utcDate(demoDates.mixedGap),
        status: "active",
        note: `${DEMO_PREFIX} mixed gap`,
      },
    });

    const functionWarningShift = await tx.shift.create({
      data: {
        date: utcDate(demoDates.functionWarning),
        type: "early",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });
    await tx.assignment.create({
      data: {
        employeeId: employees.functionWarning.id,
        shiftId: functionWarningShift.id,
        status: "planned",
        assignedFunction: AssignmentFunction.Hausverantwortung,
      },
    });
  });
}

async function createPlanningComparisonScenario(employees: DemoEmployees) {
  return prisma.$transaction(async (tx) => {
    const planningMonth = await tx.planningMonth.create({
      data: {
        year: DEMO_YEAR,
        month: 6,
        status: "draft",
      },
    });

    const [completeDay, coverageGapDay, qualificationGapDay, stableDay] =
      await Promise.all([
        tx.planningDay.create({
          data: {
            planningMonthId: planningMonth.id,
            date: utcDate("2088-06-01"),
            note: `${DEMO_PREFIX} comparison complete day`,
          },
        }),
        tx.planningDay.create({
          data: {
            planningMonthId: planningMonth.id,
            date: utcDate("2088-06-02"),
            note: `${DEMO_PREFIX} comparison coverage gap day`,
          },
        }),
        tx.planningDay.create({
          data: {
            planningMonthId: planningMonth.id,
            date: utcDate("2088-06-03"),
            note: `${DEMO_PREFIX} comparison qualification gap day`,
          },
        }),
        tx.planningDay.create({
          data: {
            planningMonthId: planningMonth.id,
            date: utcDate("2088-06-04"),
            note: `${DEMO_PREFIX} comparison stable day`,
          },
        }),
      ]);

    await tx.planningShiftTemplate.createMany({
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
        {
          planningDayId: stableDay.id,
          type: "early",
          requiredCount: 1,
          requiredQualifiedCount: 1,
        },
      ],
    });

    const [completeShift, coverageGapShift, qualificationGapShift, stableShift] =
      await Promise.all([
        tx.shift.create({
          data: {
            date: utcDate("2088-06-01"),
            type: "early",
            requiredCount: 2,
            requiredQualifiedCount: 1,
          },
        }),
        tx.shift.create({
          data: {
            date: utcDate("2088-06-02"),
            type: "late",
            requiredCount: 2,
            requiredQualifiedCount: 1,
          },
        }),
        tx.shift.create({
          data: {
            date: utcDate("2088-06-03"),
            type: "night",
            requiredCount: 1,
            requiredQualifiedCount: 1,
          },
        }),
        tx.shift.create({
          data: {
            date: utcDate("2088-06-04"),
            type: "early",
            requiredCount: 1,
            requiredQualifiedCount: 1,
          },
        }),
      ]);

    await tx.assignment.createMany({
      data: [
        {
          employeeId: employees.qualifiedA.id,
          shiftId: completeShift.id,
          status: "planned",
        },
        {
          employeeId: employees.assistantA.id,
          shiftId: completeShift.id,
          status: "planned",
        },
        {
          employeeId: employees.qualifiedA.id,
          shiftId: coverageGapShift.id,
          status: "planned",
        },
        {
          employeeId: employees.assistantB.id,
          shiftId: coverageGapShift.id,
          status: "planned",
        },
        {
          employeeId: employees.qualifiedD.id,
          shiftId: qualificationGapShift.id,
          status: "planned",
        },
        {
          employeeId: employees.qualifiedA.id,
          shiftId: stableShift.id,
          status: "planned",
        },
      ],
    });

    await tx.absence.createMany({
      data: [
        {
          employeeId: employees.assistantB.id,
          type: "sick",
          scope: "full_day",
          startDate: utcDate("2088-06-02"),
          endDate: utcDate("2088-06-02"),
          status: "active",
          note: `${DEMO_PREFIX} comparison coverage gap`,
        },
        {
          employeeId: employees.qualifiedD.id,
          type: "sick",
          scope: "full_day",
          startDate: utcDate("2088-06-03"),
          endDate: utcDate("2088-06-03"),
          status: "active",
          note: `${DEMO_PREFIX} comparison qualification gap`,
        },
      ],
    });

    await tx.availabilityRequest.create({
      data: {
        employeeId: employees.assistantA.id,
        type: "wish_free",
        startDate: utcDate("2088-06-01"),
        endDate: utcDate("2088-06-01"),
        isFullDay: true,
        priority: "high",
        status: "submitted",
        note: `${DEMO_PREFIX} comparison request context`,
      },
    });

    return planningMonth.id;
  });
}

function printSeedSummary(planningMonthId: number) {
  console.log("");
  console.log("MVP demo seed completed.");
  console.log("");
  console.log(`Demo-Year: ${DEMO_YEAR}`);
  console.log("");
  console.log("Leadership Day:");
  console.log(`GET /leadership/day?date=${demoDates.stable}`);
  console.log(`GET /leadership/day?date=${demoDates.attention}`);
  console.log(`GET /leadership/day?date=${demoDates.operationalGap}`);
  console.log(`GET /leadership/day?date=${demoDates.qualificationGap}`);
  console.log(`GET /leadership/day?date=${demoDates.absenceGap}`);
  console.log(`GET /leadership/day?date=${demoDates.mixedGap}`);
  console.log(`GET /leadership/day?date=${demoDates.functionWarning}`);
  console.log("");
  console.log("Planning Comparison:");
  console.log(`PlanningMonth.id: ${planningMonthId}`);
  console.log(`GET /planning-months/${planningMonthId}/comparison`);
  console.log("");
}

async function main() {
  await resetDemoData();
  const employees = await createDemoEmployees();
  await createLeadershipDayScenarios(employees);
  const planningMonthId = await createPlanningComparisonScenario(employees);
  printSeedSummary(planningMonthId);
}

main()
  .catch((error) => {
    console.error("MVP demo seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
