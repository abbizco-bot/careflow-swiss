import { Request, Response } from "express";
import {
  createShift,
  deleteShift,
  getShiftById,
  getShifts,
  isPrismaNotFoundError,
  updateShift,
} from "./shift.service";

type ShiftPayload = {
  date?: unknown;
  type?: unknown;
  requiredCount?: unknown;
  requiredQualifiedCount?: unknown;
};

function parseShiftId(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function parseNonNegativeInteger(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return null;
  }

  return value;
}

function validateCreatePayload(payload: ShiftPayload): {
  data?: {
    date: Date;
    type: string;
    requiredCount: number;
    requiredQualifiedCount: number;
  };
  error?: string;
} {
  const date = parseDate(payload.date);
  const type =
    typeof payload.type === "string" ? payload.type.trim() : undefined;
  const requiredCount = parsePositiveInteger(payload.requiredCount);
  const requiredQualifiedCount = parseNonNegativeInteger(
    payload.requiredQualifiedCount
  );

  if (!date) {
    return { error: "date must be a valid ISO date string." };
  }

  if (!type) {
    return { error: "type is required." };
  }

  if (requiredCount === null) {
    return { error: "requiredCount must be a positive integer." };
  }

  if (requiredQualifiedCount === null) {
    return {
      error: "requiredQualifiedCount must be a non-negative integer.",
    };
  }

  if (requiredQualifiedCount > requiredCount) {
    return {
      error: "requiredQualifiedCount cannot be greater than requiredCount.",
    };
  }

  return {
    data: {
      date,
      type,
      requiredCount,
      requiredQualifiedCount,
    },
  };
}

function validateUpdatePayload(payload: ShiftPayload): {
  data?: {
    date?: Date;
    type?: string;
    requiredCount?: number;
    requiredQualifiedCount?: number;
  };
  error?: string;
} {
  const data: {
    date?: Date;
    type?: string;
    requiredCount?: number;
    requiredQualifiedCount?: number;
  } = {};

  if (payload.date !== undefined) {
    const date = parseDate(payload.date);

    if (!date) {
      return { error: "date must be a valid ISO date string." };
    }

    data.date = date;
  }

  if (payload.type !== undefined) {
    if (typeof payload.type !== "string" || !payload.type.trim()) {
      return { error: "type must be a non-empty string." };
    }

    data.type = payload.type.trim();
  }

  if (payload.requiredCount !== undefined) {
    const requiredCount = parsePositiveInteger(payload.requiredCount);

    if (requiredCount === null) {
      return { error: "requiredCount must be a positive integer." };
    }

    data.requiredCount = requiredCount;
  }

  if (payload.requiredQualifiedCount !== undefined) {
    const requiredQualifiedCount = parseNonNegativeInteger(
      payload.requiredQualifiedCount
    );

    if (requiredQualifiedCount === null) {
      return {
        error: "requiredQualifiedCount must be a non-negative integer.",
      };
    }

    data.requiredQualifiedCount = requiredQualifiedCount;
  }

  if (Object.keys(data).length === 0) {
    return { error: "Provide at least one field to update." };
  }

  if (
    data.requiredCount !== undefined &&
    data.requiredQualifiedCount !== undefined &&
    data.requiredQualifiedCount > data.requiredCount
  ) {
    return {
      error: "requiredQualifiedCount cannot be greater than requiredCount.",
    };
  }

  return { data };
}

export async function listShifts(_req: Request, res: Response): Promise<void> {
  try {
    const shifts = await getShifts();
    res.json(shifts);
  } catch (error) {
    console.error("Failed to load shifts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getShift(req: Request, res: Response): Promise<void> {
  const id = parseShiftId(req.params.id);

  if (!id) {
    res.status(400).json({ error: "Invalid shift id." });
    return;
  }

  try {
    const shift = await getShiftById(id);

    if (!shift) {
      res.status(404).json({ error: "Shift not found." });
      return;
    }

    res.json(shift);
  } catch (error) {
    console.error("Failed to load shift:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createShiftHandler(
  req: Request,
  res: Response
): Promise<void> {
  const validation = validateCreatePayload(req.body);

  if (!validation.data) {
    res.status(400).json({ error: validation.error });
    return;
  }

  try {
    const shift = await createShift(validation.data);
    res.status(201).json(shift);
  } catch (error) {
    console.error("Failed to create shift:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateShiftHandler(
  req: Request,
  res: Response
): Promise<void> {
  const id = parseShiftId(req.params.id);

  if (!id) {
    res.status(400).json({ error: "Invalid shift id." });
    return;
  }

  const validation = validateUpdatePayload(req.body);

  if (!validation.data) {
    res.status(400).json({ error: validation.error });
    return;
  }

  try {
    const shift = await updateShift(id, validation.data);
    res.json(shift);
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      res.status(404).json({ error: "Shift not found." });
      return;
    }

    console.error("Failed to update shift:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteShiftHandler(
  req: Request,
  res: Response
): Promise<void> {
  const id = parseShiftId(req.params.id);

  if (!id) {
    res.status(400).json({ error: "Invalid shift id." });
    return;
  }

  try {
    await deleteShift(id);
    res.status(204).send();
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      res.status(404).json({ error: "Shift not found." });
      return;
    }

    console.error("Failed to delete shift:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}