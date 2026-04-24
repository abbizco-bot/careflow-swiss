import { shiftsRepository } from "../../shifts/shifts.repository";
import { buildShiftOperationalAvailabilityMap } from "../availability/availability.service";
import { evaluateCoverage } from "./coverage.rules";
import type { ShiftCoverageResult } from "./coverage.types";

export const coverageService = {
  async getShiftCoverage(shiftId: number): Promise<ShiftCoverageResult> {
    const shift = await shiftsRepository.findByIdWithAssignments(shiftId);

    if (!shift) {
      throw new Error(`Shift with id ${shiftId} not found`);
    }

    const availabilityByShiftId = await buildShiftOperationalAvailabilityMap([
      shift,
    ]);
    const availability = availabilityByShiftId.get(shift.id);

    if (!availability) {
      throw new Error(`Missing operational availability for shift ${shift.id}`);
    }

    return evaluateCoverage({
      shiftId: shift.id,
      requiredCount: shift.requiredCount,
      assignedCount: availability.assignedCount,
      availableAssignedCount: availability.availableAssignedCount,
      absentAssignedCount: availability.absentAssignedCount,
    });
  },

  async getAllShiftsCoverage(): Promise<ShiftCoverageResult[]> {
    const shifts = await shiftsRepository.findManyWithAssignments();
    const availabilityByShiftId = await buildShiftOperationalAvailabilityMap(
      shifts
    );

    return shifts.map((shift) => {
      const availability = availabilityByShiftId.get(shift.id);

      if (!availability) {
        throw new Error(`Missing operational availability for shift ${shift.id}`);
      }

      return evaluateCoverage({
        shiftId: shift.id,
        requiredCount: shift.requiredCount,
        assignedCount: availability.assignedCount,
        availableAssignedCount: availability.availableAssignedCount,
        absentAssignedCount: availability.absentAssignedCount,
      });
    });
  },
};

//
// ✅ Neue named exports für Controller-Kompatibilität
//

export async function getCoverageValidationByShiftId(
  shiftId: number
): Promise<ShiftCoverageResult> {
  return coverageService.getShiftCoverage(shiftId);
}

export async function getAllCoverageValidations(): Promise<
  ShiftCoverageResult[]
> {
  return coverageService.getAllShiftsCoverage();
}
