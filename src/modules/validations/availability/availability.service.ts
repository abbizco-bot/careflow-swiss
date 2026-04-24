import { assignmentRepository } from "../../assignments/assignment.repository";
import { absenceRepository } from "../../absences/absence.repository";

type ShiftAssignmentSnapshot = {
  id: number;
  date: Date;
  type: string;
  assignments: Array<{
    employeeId: number;
    status: string;
    employee: {
      qualified: boolean;
    } | null;
  }>;
};

export interface ShiftOperationalAvailability {
  shiftId: number;
  assignedCount: number;
  availableAssignedCount: number;
  absentAssignedCount: number;
  assignedQualifiedCount: number;
  availableQualifiedCount: number;
  absentQualifiedCount: number;
}

export interface AssignmentOperationalAvailability {
  assignmentId: number;
  employeeId: number;
  employeeName: string;
  employeeRole: string;
  shiftId: number;
  shiftType: string;
  planned: true;
  available: boolean;
  absenceReason: string | null;
}

type ActiveAbsenceSnapshot = {
  employeeId: number;
  type: string;
  scope: string;
  startDate: Date;
  endDate: Date | null;
};

export async function buildShiftOperationalAvailabilityMap(
  shifts: ShiftAssignmentSnapshot[]
): Promise<Map<number, ShiftOperationalAvailability>> {
  if (shifts.length === 0) {
    return new Map();
  }

  const shiftDays = shifts.map((shift) => startOfUtcDay(shift.date));
  const rangeStart = new Date(
    Math.min(...shiftDays.map((shiftDate) => shiftDate.getTime()))
  );
  const rangeEnd = new Date(
    Math.max(...shiftDays.map((shiftDate) => shiftDate.getTime()))
  );

  const employeeIds = [...new Set(
    shifts.flatMap((shift) =>
      shift.assignments.map((assignment) => assignment.employeeId)
    )
  )];

  const activeAbsences = await absenceRepository.findActiveByEmployeeIdsAndDateRange(
    employeeIds,
    rangeStart,
    rangeEnd
  );

  const absencesByEmployeeId = groupAbsencesByEmployeeId(activeAbsences);

  return new Map(
    shifts.map((shift) => {
      const shiftDay = startOfUtcDay(shift.date);
      const effectiveAssignments = shift.assignments.filter((assignment) =>
        isEffectiveAssignmentStatus(assignment.status)
      );
      const absentAssignments = effectiveAssignments.filter((assignment) =>
        employeeIsAbsentOnShiftDay(
          absencesByEmployeeId.get(assignment.employeeId) ?? [],
          shiftDay,
          shift.type
        )
      );
      const availableAssignments = effectiveAssignments.filter(
        (assignment) =>
          !absentAssignments.some(
            (absentAssignment) =>
              absentAssignment.employeeId === assignment.employeeId
          )
      );

      const assignedQualifiedCount = effectiveAssignments.filter(
        (assignment) => assignment.employee?.qualified === true
      ).length;
      const availableQualifiedCount = availableAssignments.filter(
        (assignment) => assignment.employee?.qualified === true
      ).length;

      return [
        shift.id,
        {
          shiftId: shift.id,
          assignedCount: effectiveAssignments.length,
          availableAssignedCount: availableAssignments.length,
          absentAssignedCount: absentAssignments.length,
          assignedQualifiedCount,
          availableQualifiedCount,
          absentQualifiedCount:
            assignedQualifiedCount - availableQualifiedCount,
        },
      ];
    })
  );
}

type AssignmentAvailabilityEntry = Awaited<
  ReturnType<typeof assignmentRepository.findAssignmentsWithEmployeeAndShiftByDateRange>
>[number];

export async function getAssignmentOperationalAvailabilityByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AssignmentOperationalAvailability[]> {
  const assignments =
    await assignmentRepository.findAssignmentsWithEmployeeAndShiftByDateRange(
      startDate,
      endDate
    );

  if (assignments.length === 0) {
    return [];
  }

  const employeeIds = [...new Set(assignments.map((assignment) => assignment.employeeId))];
  const activeAbsences = await absenceRepository.findActiveByEmployeeIdsAndDateRange(
    employeeIds,
    startDate,
    endDate
  );
  const absencesByEmployeeId = groupAbsencesByEmployeeId(activeAbsences);

  return assignments.map((assignment) =>
    buildAssignmentOperationalAvailability(
      assignment,
      absencesByEmployeeId.get(assignment.employeeId) ?? []
    )
  );
}

function groupAbsencesByEmployeeId(absences: ActiveAbsenceSnapshot[]) {
  const groupedAbsences = new Map<number, ActiveAbsenceSnapshot[]>();

  for (const absence of absences) {
    const existingAbsences = groupedAbsences.get(absence.employeeId) ?? [];
    existingAbsences.push(absence);
    groupedAbsences.set(absence.employeeId, existingAbsences);
  }

  return groupedAbsences;
}

function employeeIsAbsentOnShiftDay(
  absences: ActiveAbsenceSnapshot[],
  shiftDay: Date,
  shiftType: string
): boolean {
  return absences.some((absence) =>
    absenceCoversShiftDay(absence, shiftDay, shiftType)
  );
}

function absenceCoversShiftDay(
  absence: ActiveAbsenceSnapshot,
  shiftDay: Date,
  shiftType: string
): boolean {
  const absenceStart = startOfUtcDay(absence.startDate);
  const absenceEnd = absence.endDate ? startOfUtcDay(absence.endDate) : null;

  return (
    absenceStart <= shiftDay &&
    (absenceEnd === null || absenceEnd >= shiftDay) &&
    absenceScopeMatchesShiftType(absence.scope, shiftType)
  );
}

function absenceScopeMatchesShiftType(
  scope: string,
  shiftType: string
): boolean {
  if (scope === "full_day") {
    return true;
  }

  return scope === shiftType;
}

function buildAssignmentOperationalAvailability(
  assignment: AssignmentAvailabilityEntry,
  absences: ActiveAbsenceSnapshot[]
): AssignmentOperationalAvailability {
  if (!assignment.employee) {
    throw new Error("Missing employee relation for assignment availability.");
  }

  if (!assignment.shift) {
    throw new Error("Missing shift relation for assignment availability.");
  }

  const matchingAbsence = absences.find((absence) =>
    absenceCoversShiftDay(absence, startOfUtcDay(assignment.shift.date), assignment.shift.type)
  );

  return {
    assignmentId: assignment.id,
    employeeId: assignment.employeeId,
    employeeName: assignment.employee.name,
    employeeRole: assignment.employee.role,
    shiftId: assignment.shiftId,
    shiftType: assignment.shift.type,
    planned: true,
    available: matchingAbsence === undefined,
    absenceReason: matchingAbsence?.type ?? null,
  };
}

function isEffectiveAssignmentStatus(status: string): boolean {
  return status === "planned";
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}
