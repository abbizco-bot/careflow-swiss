import { shiftsRepository } from "../../shifts/shifts.repository";
import { buildShiftOperationalAvailabilityMap } from "../availability/availability.service";
import { evaluateQualification } from "./qualification.rules";
import type { ShiftQualificationResult } from "./qualification.types";

export const qualificationService = {
  async getShiftQualification(
    shiftId: number
  ): Promise<ShiftQualificationResult> {
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

    return evaluateQualification({
      shiftId: shift.id,
      requiredQualifiedCount: shift.requiredQualifiedCount,
      assignedQualifiedCount: availability.assignedQualifiedCount,
      availableQualifiedCount: availability.availableQualifiedCount,
      absentQualifiedCount: availability.absentQualifiedCount,
    });
  },

  async getAllShiftsQualification(): Promise<ShiftQualificationResult[]> {
    const shifts = await shiftsRepository.findManyWithAssignments();
    const availabilityByShiftId = await buildShiftOperationalAvailabilityMap(
      shifts
    );

    return shifts.map((shift) => {
      const availability = availabilityByShiftId.get(shift.id);

      if (!availability) {
        throw new Error(`Missing operational availability for shift ${shift.id}`);
      }

      return evaluateQualification({
        shiftId: shift.id,
        requiredQualifiedCount: shift.requiredQualifiedCount,
        assignedQualifiedCount: availability.assignedQualifiedCount,
        availableQualifiedCount: availability.availableQualifiedCount,
        absentQualifiedCount: availability.absentQualifiedCount,
      });
    });
  },
};

export async function getQualificationValidationByShiftId(
  shiftId: number
): Promise<ShiftQualificationResult> {
  return qualificationService.getShiftQualification(shiftId);
}

export async function getAllQualificationValidations(): Promise<
  ShiftQualificationResult[]
> {
  return qualificationService.getAllShiftsQualification();
}
