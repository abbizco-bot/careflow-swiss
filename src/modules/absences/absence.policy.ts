import type {
  AbsencePolicyStaffCategory,
  MedicalCertificateSignal,
} from "./absence.types";

const medicalCertificateThresholds: Record<
  AbsencePolicyStaffCategory,
  number
> = {
  regular: 3,
  apprentice: 2,
  intern: 1,
};

type EmployeePolicyInput = {
  id: number;
  role: string;
};

// v0.1 transition: until Employee has an explicit staffCategory field,
// every employee falls back to the regular policy bucket.
export function resolveEmployeePolicyCategory(
  _employee: EmployeePolicyInput
): AbsencePolicyStaffCategory {
  return "regular";
}

export function buildMedicalCertificateSignal(input: {
  startDate: Date;
  endDate?: Date | null;
  asOfDate: Date;
  policyCategory: AbsencePolicyStaffCategory;
}): MedicalCertificateSignal {
  const thresholdDays = medicalCertificateThresholds[input.policyCategory];
  const normalizedStartDate = startOfUtcDay(input.startDate);
  const normalizedAsOfDate = startOfUtcDay(
    input.endDate && input.endDate < input.asOfDate
      ? input.endDate
      : input.asOfDate
  );

  const durationInDays =
    Math.floor(
      (normalizedAsOfDate.getTime() - normalizedStartDate.getTime()) /
        86_400_000
    ) + 1;
  const dueDate = new Date(normalizedStartDate);
  dueDate.setUTCDate(dueDate.getUTCDate() + thresholdDays - 1);

  return {
    medicalCertificateStatus:
      durationInDays >= thresholdDays ? "due" : "not_required_yet",
    medicalCertificateDueDate: dueDate.toISOString(),
  };
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}
