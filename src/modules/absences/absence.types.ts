import type { Employee, Absence } from "../../generated/prisma/client";

export type AbsenceType = "sick";
export type AbsenceStatus = "active" | "closed";
export type AbsenceScope = "full_day" | "early" | "late" | "night";
export type MedicalCertificateStatus =
  | "not_required_yet"
  | "due"
  | "received";
export type AbsencePolicyStaffCategory =
  | "regular"
  | "apprentice"
  | "intern";

export interface CreateAbsenceInput {
  employeeId: number;
  type: AbsenceType;
  scope?: AbsenceScope;
  startDate: Date;
  endDate?: Date | null;
  note?: string;
}

export interface ActiveAbsenceFilters {
  asOfDate?: Date;
  employeeId?: number;
}

export interface MedicalCertificateSignal {
  medicalCertificateStatus: MedicalCertificateStatus;
  medicalCertificateDueDate: string;
}

export interface ActiveAbsenceResult extends Absence {
  employee: Pick<Employee, "id" | "name" | "role" | "qualified">;
  administrativeSignal: MedicalCertificateSignal;
}
