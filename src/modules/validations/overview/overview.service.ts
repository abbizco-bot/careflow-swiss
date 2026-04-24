import { shiftsRepository } from "../../shifts/shifts.repository";
import { ConflictValidationError } from "../conflicts/conflict.service";
import { getFullValidationsByDateRange } from "../full/full.service";
import { deriveDailySituation, storeSituation } from "../situation/situation.service";
import type { FullValidationOverallStatus } from "../full/full.types";
import type {
  ShiftOverviewByDateResult,
  ShiftOverviewEntry,
} from "./overview.types";

export async function getShiftOverviewByDate(
  dateInput: string
): Promise<ShiftOverviewByDateResult> {
  return buildShiftOverviewByDate(dateInput, { persistSituation: true });
}

export async function getShiftOverviewSnapshotByDate(
  dateInput: string
): Promise<ShiftOverviewByDateResult> {
  return buildShiftOverviewByDate(dateInput, { persistSituation: false });
}

async function buildShiftOverviewByDate(
  dateInput: string,
  options: { persistSituation: boolean }
): Promise<ShiftOverviewByDateResult> {
  const { normalizedDate, startDate, endDate } = parseOverviewDate(dateInput);

  const [shifts, fullValidations] = await Promise.all([
    shiftsRepository.findManyByDateRangeWithAssignments(startDate, endDate),
    getFullValidationsByDateRange(startDate, endDate),
  ]);

  const fullValidationByShiftId = new Map(
    fullValidations.map((validation) => [validation.shiftId, validation])
  );

  const overviewShifts = sortOverviewShifts(
    shifts.map((shift) => {
      const fullValidation = fullValidationByShiftId.get(shift.id);

      if (!fullValidation) {
        throw new Error(`Missing full validation for shift ${shift.id}`);
      }

      return {
        shiftId: shift.id,
        date: shift.date.toISOString(),
        type: shift.type,
        requiredCount: shift.requiredCount,
        requiredQualifiedCount: shift.requiredQualifiedCount,
        assignedCount: fullValidation.coverage.assignedCount,
        availableAssignedCount: fullValidation.coverage.availableAssignedCount,
        absentAssignedCount: fullValidation.coverage.absentAssignedCount,
        assignedQualifiedCount:
          fullValidation.qualification.assignedQualifiedCount,
        availableQualifiedCount:
          fullValidation.qualification.availableQualifiedCount,
        absentQualifiedCount:
          fullValidation.qualification.absentQualifiedCount,
        overallStatus: fullValidation.overallStatus,
        issueCount: fullValidation.issueCount,
        issues: fullValidation.issues,
      };
    })
  );

  if (options.persistSituation && overviewShifts.length > 0) {
    const situation = deriveDailySituation(
      overviewShifts.map((shift) => shift.overallStatus)
    );
    await storeSituation(normalizedDate, situation);
  }

  return {
    date: normalizedDate,
    shiftCount: overviewShifts.length,
    criticalCount: countByStatus(overviewShifts, "critical"),
    warningCount: countByStatus(overviewShifts, "warning"),
    okCount: countByStatus(overviewShifts, "ok"),
    shifts: overviewShifts,
  };
}

export function parseOverviewDate(dateInput: string): {
  normalizedDate: string;
  startDate: Date;
  endDate: Date;
} {
  const trimmedDate = dateInput.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      "Der Query-Parameter 'date' ist erforderlich und muss ein gültiges Datum sein.",
      400
    );
  }

  const startDate = new Date(`${trimmedDate}T00:00:00.000Z`);

  if (Number.isNaN(startDate.getTime())) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      "Der Query-Parameter 'date' ist erforderlich und muss ein gültiges Datum sein.",
      400
    );
  }

  const normalizedDate = startDate.toISOString().slice(0, 10);

  if (normalizedDate !== trimmedDate) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      "Der Query-Parameter 'date' ist erforderlich und muss ein gültiges Datum sein.",
      400
    );
  }

  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  return {
    normalizedDate,
    startDate,
    endDate,
  };
}

function sortOverviewShifts(shifts: ShiftOverviewEntry[]): ShiftOverviewEntry[] {
  return [...shifts].sort((left, right) => {
    const statusComparison =
      getStatusPriority(left.overallStatus) - getStatusPriority(right.overallStatus);

    if (statusComparison !== 0) {
      return statusComparison;
    }

    if (left.issueCount !== right.issueCount) {
      return right.issueCount - left.issueCount;
    }

    const typeComparison = left.type.localeCompare(right.type);

    if (typeComparison !== 0) {
      return typeComparison;
    }

    return left.shiftId - right.shiftId;
  });
}

function getStatusPriority(status: FullValidationOverallStatus): number {
  switch (status) {
    case "critical":
      return 1;
    case "warning":
      return 2;
    case "ok":
      return 3;
    default:
      return 99;
  }
}

function countByStatus(
  shifts: ShiftOverviewEntry[],
  status: FullValidationOverallStatus
): number {
  return shifts.filter((shift) => shift.overallStatus === status).length;
}
