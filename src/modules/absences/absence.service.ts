import type { Absence } from "../../generated/prisma/client";
import { absenceRepository } from "./absence.repository";
import { buildMedicalCertificateSignal, resolveEmployeePolicyCategory } from "./absence.policy";
import { AbsenceError, absenceErrorCodes } from "./absence.errors";
import type {
  ActiveAbsenceFilters,
  ActiveAbsenceResult,
  AbsenceScope,
  CreateAbsenceInput,
} from "./absence.types";

const allowedAbsenceTypes = new Set(["sick"]);
const allowedAbsenceScopes = new Set<AbsenceScope>([
  "full_day",
  "early",
  "late",
  "night",
]);

export const absenceService = {
  async createAbsence(data: CreateAbsenceInput): Promise<Absence> {
    await ensureEmployeeExists(data.employeeId);
    ensureAllowedType(data.type);
    ensureAllowedScope(data.scope);
    ensureValidDateRange(data.startDate, data.endDate);

    return absenceRepository.create(data);
  },

  async getActiveAbsences(
    filters: ActiveAbsenceFilters = {}
  ): Promise<ActiveAbsenceResult[]> {
    if (filters.employeeId !== undefined) {
      await ensureEmployeeExists(filters.employeeId);
    }

    const asOfDate = filters.asOfDate ?? startOfUtcDay(new Date());
    const absences = await absenceRepository.findActive({
      ...filters,
      asOfDate,
    });

    return absences.map((absence) => {
      const policyCategory = resolveEmployeePolicyCategory(absence.employee);

      return {
        ...absence,
        administrativeSignal: buildMedicalCertificateSignal({
          startDate: absence.startDate,
          endDate: absence.endDate,
          asOfDate,
          policyCategory,
        }),
      };
    });
  },
};

async function ensureEmployeeExists(employeeId: number): Promise<void> {
  const employee = await absenceRepository.findEmployeeById(employeeId);

  if (!employee) {
    throw new AbsenceError(
      absenceErrorCodes.employeeNotFound,
      "Employee not found",
      404
    );
  }
}

function ensureAllowedType(type: string): void {
  if (!allowedAbsenceTypes.has(type)) {
    throw new AbsenceError(
      absenceErrorCodes.invalidType,
      "Absence type is not supported",
      400
    );
  }
}

function ensureAllowedScope(scope?: string): void {
  if (scope === undefined) {
    return;
  }

  if (!allowedAbsenceScopes.has(scope as AbsenceScope)) {
    throw new AbsenceError(
      absenceErrorCodes.invalidScope,
      "Absence scope is not supported",
      400
    );
  }
}

function ensureValidDateRange(
  startDate: Date,
  endDate?: Date | null
): void {
  if (Number.isNaN(startDate.getTime())) {
    throw new AbsenceError(
      absenceErrorCodes.invalidDate,
      "startDate must be a valid date",
      400
    );
  }

  if (endDate && Number.isNaN(endDate.getTime())) {
    throw new AbsenceError(
      absenceErrorCodes.invalidDate,
      "endDate must be a valid date",
      400
    );
  }

  if (endDate && startOfUtcDay(endDate) < startOfUtcDay(startDate)) {
    throw new AbsenceError(
      absenceErrorCodes.invalidDateRange,
      "endDate must not be before startDate",
      400
    );
  }
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export async function createAbsence(data: CreateAbsenceInput) {
  return absenceService.createAbsence(data);
}

export async function getActiveAbsences(filters: ActiveAbsenceFilters = {}) {
  return absenceService.getActiveAbsences(filters);
}
