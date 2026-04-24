import { availabilityRequestsRepository } from "./availability-requests.repository";
import type {
  AvailabilityRequestFilters,
  AvailabilityRequestPriority,
  AvailabilityRequestStatus,
  AvailabilityRequestType,
  CreateAvailabilityRequestInput,
  UpdateAvailabilityRequestStatusInput,
} from "./availability-requests.types";

const allowedAvailabilityRequestTypes = new Set<AvailabilityRequestType>([
  "absence",
  "wish_free",
  "availability_constraint",
  "note",
]);

const allowedAvailabilityRequestPriorities =
  new Set<AvailabilityRequestPriority>(["low", "medium", "high"]);

const allowedAvailabilityRequestStatuses = new Set<AvailabilityRequestStatus>([
  "submitted",
  "reviewed",
  "approved",
  "rejected",
]);

export const availabilityRequestsService = {
  async listAvailabilityRequests(filters: AvailabilityRequestFilters = {}) {
    if (filters.employeeId !== undefined) {
      await ensureEmployeeExists(filters.employeeId);
    }

    if (
      filters.status !== undefined &&
      !allowedAvailabilityRequestStatuses.has(filters.status)
    ) {
      throw new Error(
        "status must be one of: submitted, reviewed, approved, rejected"
      );
    }

    return availabilityRequestsRepository.findMany(filters);
  },

  async createAvailabilityRequest(data: CreateAvailabilityRequestInput) {
    await ensureEmployeeExists(data.employeeId);
    validateAvailabilityRequestInput({
      ...data,
      status: "submitted",
    });

    return availabilityRequestsRepository.create({
      ...data,
      status: "submitted",
    });
  },

  async getAvailabilityRequestById(id: number) {
    const availabilityRequest = await availabilityRequestsRepository.findById(id);

    if (!availabilityRequest) {
      throw new Error(`AvailabilityRequest with id ${id} not found`);
    }

    return availabilityRequest;
  },

  async updateAvailabilityRequestStatus(
    id: number,
    data: UpdateAvailabilityRequestStatusInput
  ) {
    await this.getAvailabilityRequestById(id);
    validateAvailabilityRequestStatusUpdate(data);

    return availabilityRequestsRepository.updateStatus(id, data);
  },
};

async function ensureEmployeeExists(employeeId: number): Promise<void> {
  const employee = await availabilityRequestsRepository.findEmployeeById(
    employeeId
  );

  if (!employee) {
    throw new Error(`Employee with id ${employeeId} not found`);
  }
}

function validateAvailabilityRequestInput(
  data: CreateAvailabilityRequestInput
): void {
  if (!allowedAvailabilityRequestTypes.has(data.type)) {
    throw new Error(
      "type must be one of: absence, wish_free, availability_constraint, note"
    );
  }

  if (Number.isNaN(data.startDate.getTime())) {
    throw new Error("startDate must be a valid date");
  }

  if (data.endDate && Number.isNaN(data.endDate.getTime())) {
    throw new Error("endDate must be a valid date");
  }

  if (data.endDate && startOfUtcDay(data.endDate) < startOfUtcDay(data.startDate)) {
    throw new Error("endDate must not be before startDate");
  }

  if (typeof data.isFullDay !== "boolean") {
    throw new Error("isFullDay must be a boolean");
  }

  if (
    data.constraintType !== undefined &&
    data.constraintType !== null &&
    typeof data.constraintType !== "string"
  ) {
    throw new Error("constraintType must be a string");
  }

  if (data.note !== undefined && data.note !== null && typeof data.note !== "string") {
    throw new Error("note must be a string");
  }

  if (
    data.priority !== undefined &&
    !allowedAvailabilityRequestPriorities.has(data.priority)
  ) {
    throw new Error("priority must be one of: low, medium, high");
  }

  if (
    data.status !== undefined &&
    !allowedAvailabilityRequestStatuses.has(data.status)
  ) {
    throw new Error(
      "status must be one of: submitted, reviewed, approved, rejected"
    );
  }
}

function validateAvailabilityRequestStatusUpdate(
  data: UpdateAvailabilityRequestStatusInput
): void {
  if (!allowedAvailabilityRequestStatuses.has(data.status)) {
    throw new Error(
      "status must be one of: submitted, reviewed, approved, rejected"
    );
  }
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export async function listAvailabilityRequests(
  filters: AvailabilityRequestFilters = {}
) {
  return availabilityRequestsService.listAvailabilityRequests(filters);
}

export async function createAvailabilityRequest(
  data: CreateAvailabilityRequestInput
) {
  return availabilityRequestsService.createAvailabilityRequest(data);
}

export async function getAvailabilityRequestById(id: number) {
  return availabilityRequestsService.getAvailabilityRequestById(id);
}

export async function updateAvailabilityRequestStatus(
  id: number,
  data: UpdateAvailabilityRequestStatusInput
) {
  return availabilityRequestsService.updateAvailabilityRequestStatus(id, data);
}
