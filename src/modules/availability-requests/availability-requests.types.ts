import type { AvailabilityRequest } from "../../generated/prisma/client";

export type AvailabilityRequestType =
  | "absence"
  | "wish_free"
  | "availability_constraint"
  | "note";

export type AvailabilityRequestPriority = "low" | "medium" | "high";
export type AvailabilityRequestStatus =
  | "submitted"
  | "reviewed"
  | "approved"
  | "rejected";

export interface CreateAvailabilityRequestInput {
  employeeId: number;
  type: AvailabilityRequestType;
  startDate: Date;
  endDate?: Date | null;
  isFullDay: boolean;
  constraintType?: string | null;
  note?: string | null;
  priority?: AvailabilityRequestPriority;
  status?: AvailabilityRequestStatus;
}

export interface AvailabilityRequestFilters {
  employeeId?: number;
  status?: AvailabilityRequestStatus;
}

export interface UpdateAvailabilityRequestStatusInput {
  status: AvailabilityRequestStatus;
}

export type AvailabilityRequestRecord = AvailabilityRequest;

// AvailabilityRequest captures foreseeable employee input for planning.
// It does not trigger scheduling, change assignments, or replace
// leadership decisions in the operational staffing layer.
