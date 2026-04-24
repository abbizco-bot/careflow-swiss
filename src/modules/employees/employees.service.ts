import {
  employeesRepository,
  type CreateEmployeeData,
} from "./employees.repository";
import {
  BASE_QUALIFICATIONS,
  type BaseQualification,
} from "./employees.types";

export const employeesService = {
  async getAllEmployees() {
    return employeesRepository.findMany();
  },

  async getEmployeeById(employeeId: number) {
    const employee = await employeesRepository.findById(employeeId);

    if (!employee) {
      throw new Error(`Employee with id ${employeeId} not found`);
    }

    return employee;
  },

  async createEmployee(data: CreateEmployeeData) {
    validateCreateEmployeeInput(data);

    return employeesRepository.create(data);
  },

  async updateEmployee(
    employeeId: number,
    data: Partial<CreateEmployeeData>
  ) {
    validateUpdateEmployeeInput(data);

    await this.getEmployeeById(employeeId);

    return employeesRepository.update(employeeId, data);
  },
};

function validateCreateEmployeeInput(data: CreateEmployeeData): void {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Employee name is required");
  }

  if (!data.role || data.role.trim().length === 0) {
    throw new Error("Employee role is required");
  }

  if (
    !Number.isInteger(data.workload) ||
    data.workload < 0 ||
    data.workload > 100
  ) {
    throw new Error("Employee workload must be an integer between 0 and 100");
  }

  if (data.qualified !== undefined && typeof data.qualified !== "boolean") {
    throw new Error("Employee qualified must be a boolean");
  }

  validateBaseQualification(data.baseQualification);
}

function validateUpdateEmployeeInput(
  data: Partial<CreateEmployeeData>
): void {
  if (Object.keys(data).length === 0) {
    throw new Error("At least one field must be provided for update");
  }

  if (data.name !== undefined && data.name.trim().length === 0) {
    throw new Error("Employee name cannot be empty");
  }

  if (data.role !== undefined && data.role.trim().length === 0) {
    throw new Error("Employee role cannot be empty");
  }

  if (
    data.workload !== undefined &&
    (!Number.isInteger(data.workload) ||
      data.workload < 0 ||
      data.workload > 100)
  ) {
    throw new Error("Employee workload must be an integer between 0 and 100");
  }

  if (data.qualified !== undefined && typeof data.qualified !== "boolean") {
    throw new Error("Employee qualified must be a boolean");
  }

  validateBaseQualification(data.baseQualification);
}

function validateBaseQualification(
  baseQualification: BaseQualification | undefined
): void {
  if (baseQualification === undefined) {
    return;
  }

  if (!BASE_QUALIFICATIONS.includes(baseQualification)) {
    throw new Error("Employee baseQualification is invalid");
  }
}

export async function getAllEmployees() {
  return employeesService.getAllEmployees();
}

export async function getEmployeeById(employeeId: number) {
  return employeesService.getEmployeeById(employeeId);
}

export async function createEmployee(data: CreateEmployeeData) {
  return employeesService.createEmployee(data);
}

export async function updateEmployee(
  employeeId: number,
  data: Partial<CreateEmployeeData>
) {
  return employeesService.updateEmployee(employeeId, data);
}
