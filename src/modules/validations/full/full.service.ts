import {
  getAllCoverageValidations,
  getCoverageValidationByShiftId,
} from "../coverage/coverage.service";
import {
  getAllQualificationValidations,
  getQualificationValidationByShiftId,
} from "../qualification/qualification.service";
import {
  aggregateFullValidationIssues,
  calculateHasCriticalIssues,
  calculateIssueCount,
  calculateOverallStatus,
  sortIssuesBySeverity,
} from "./full.rules";
import type {
  FullShiftDetailEntry,
  FullShiftsByDateResult,
  FullValidationResult,
} from "./full.types";
import { shiftsRepository } from "../../shifts/shifts.repository";
import { buildShiftOperationalAvailabilityMap } from "../availability/availability.service";
import { evaluateCoverage } from "../coverage/coverage.rules";
import { evaluateQualification } from "../qualification/qualification.rules";
import { buildQualificationFunctionIssuesForShift } from "../qualification-function/qualification-function.rules";
import { parseOverviewDate } from "../overview/overview.service";
import { deriveDailySituation, storeSituation } from "../situation/situation.service";

export async function getAllFullValidations(): Promise<
  FullValidationResult[]
> {
  const [coverageResults, qualificationResults] = await Promise.all([
    getAllCoverageValidations(),
    getAllQualificationValidations(),
  ]);
  const shifts = await shiftsRepository.findManyWithAssignments();

  const qualificationMap = new Map(
    qualificationResults.map((qualification) => [
      qualification.shiftId,
      qualification,
    ])
  );
  const shiftsById = new Map(shifts.map((shift) => [shift.id, shift]));

  return coverageResults.map((coverage) => {
    const qualification = qualificationMap.get(coverage.shiftId);
    const shift = shiftsById.get(coverage.shiftId);

    if (!qualification) {
      throw new Error(
        `Missing qualification result for shift ${coverage.shiftId}`
      );
    }

    if (!shift) {
      throw new Error(`Missing shift snapshot for shift ${coverage.shiftId}`);
    }

    const qualificationFunctionIssues = buildQualificationFunctionIssuesForShift(
      shift.id,
      shift.assignments
    );
    const aggregatedIssues = aggregateFullValidationIssues(
      coverage,
      qualification,
      qualificationFunctionIssues
    );
    const issues = sortIssuesBySeverity(aggregatedIssues);

    return {
      shiftId: coverage.shiftId,
      coverage,
      qualification,
      issues,
      issueCount: calculateIssueCount(issues),
      hasCriticalIssues: calculateHasCriticalIssues(issues),
      overallStatus: calculateOverallStatus(coverage, qualification),
    };
  });
}

export async function getFullValidationByShiftId(
  shiftId: number
): Promise<FullValidationResult> {
  const [coverage, qualification] = await Promise.all([
    getCoverageValidationByShiftId(shiftId),
    getQualificationValidationByShiftId(shiftId),
  ]);
  const shift = await shiftsRepository.findByIdWithAssignments(shiftId);

  if (!shift) {
    throw new Error(`Shift with id ${shiftId} not found`);
  }

  const qualificationFunctionIssues = buildQualificationFunctionIssuesForShift(
    shift.id,
    shift.assignments
  );
  const aggregatedIssues = aggregateFullValidationIssues(
    coverage,
    qualification,
    qualificationFunctionIssues
  );
  const issues = sortIssuesBySeverity(aggregatedIssues);

  return {
    shiftId,
    coverage,
    qualification,
    issues,
    issueCount: calculateIssueCount(issues),
    hasCriticalIssues: calculateHasCriticalIssues(issues),
    overallStatus: calculateOverallStatus(coverage, qualification, issues),
  };
}

export async function getFullValidationsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<FullValidationResult[]> {
  const shifts = await shiftsRepository.findManyByDateRangeWithAssignments(
    startDate,
    endDate
  );
  const availabilityByShiftId = await buildShiftOperationalAvailabilityMap(
    shifts
  );

  return shifts.map((shift) => {
    const availability = availabilityByShiftId.get(shift.id);

    if (!availability) {
      throw new Error(`Missing operational availability for shift ${shift.id}`);
    }

    const coverage = evaluateCoverage({
      shiftId: shift.id,
      requiredCount: shift.requiredCount,
      assignedCount: availability.assignedCount,
      availableAssignedCount: availability.availableAssignedCount,
      absentAssignedCount: availability.absentAssignedCount,
    });

    const qualification = evaluateQualification({
      shiftId: shift.id,
      requiredQualifiedCount: shift.requiredQualifiedCount,
      assignedQualifiedCount: availability.assignedQualifiedCount,
      availableQualifiedCount: availability.availableQualifiedCount,
      absentQualifiedCount: availability.absentQualifiedCount,
    });

    const qualificationFunctionIssues = buildQualificationFunctionIssuesForShift(
      shift.id,
      shift.assignments
    );
    const aggregatedIssues = aggregateFullValidationIssues(
      coverage,
      qualification,
      qualificationFunctionIssues
    );
    const issues = sortIssuesBySeverity(aggregatedIssues);

    return {
      shiftId: shift.id,
      coverage,
      qualification,
      issues,
      issueCount: calculateIssueCount(issues),
      hasCriticalIssues: calculateHasCriticalIssues(issues),
      overallStatus: calculateOverallStatus(coverage, qualification, issues),
    };
  });
}

export async function getFullShiftDetailsByDate(
  dateInput: string
): Promise<FullShiftsByDateResult> {
  const { normalizedDate, startDate, endDate } = parseOverviewDate(dateInput);
  const [shifts, fullValidations] = await Promise.all([
    shiftsRepository.findManyByDateRangeWithAssignments(startDate, endDate),
    getFullValidationsByDateRange(startDate, endDate),
  ]);

  const fullValidationByShiftId = new Map(
    fullValidations.map((validation) => [validation.shiftId, validation])
  );

  const fullShiftDetails: FullShiftDetailEntry[] = shifts.map((shift) => {
    const validation = fullValidationByShiftId.get(shift.id);

    if (!validation) {
      throw new Error(`Fehlende Full-Validation fuer Schicht ${shift.id}.`);
    }

    return {
      shiftId: shift.id,
      shiftType: shift.type,
      overallStatus: validation.overallStatus,
      requiredCount: validation.coverage.requiredCount,
      assignedCount: validation.coverage.assignedCount,
      availableAssignedCount: validation.coverage.availableAssignedCount,
      absentAssignedCount: validation.coverage.absentAssignedCount,
      requiredQualifiedCount: validation.qualification.requiredQualifiedCount,
      assignedQualifiedCount: validation.qualification.assignedQualifiedCount,
      availableQualifiedCount: validation.qualification.availableQualifiedCount,
      absentQualifiedCount: validation.qualification.absentQualifiedCount,
      issues: validation.issues,
    };
  });

  if (fullShiftDetails.length > 0) {
    const situation = deriveDailySituation(
      fullShiftDetails.map((shift) => shift.overallStatus)
    );
    await storeSituation(normalizedDate, situation);
  }

  return {
    date: normalizedDate,
    shifts: fullShiftDetails,
  };
}
