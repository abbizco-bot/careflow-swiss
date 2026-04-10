import { Request, Response } from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignments,
  isPrismaNotFoundError,
  updateAssignment,
} from "./assignment.service";

export async function listAssignments(_req: Request, res: Response) {
  try {
    const assignments = await getAssignments();
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}

export async function getAssignment(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid assignment id" });
    }

    const assignment = await getAssignmentById(id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    return res.status(200).json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return res.status(500).json({ error: "Failed to fetch assignment" });
  }
}

export async function createAssignmentHandler(req: Request, res: Response) {
  try {
    const { employeeId, shiftId, role, status } = req.body;

    const assignment = await createAssignment({
      employeeId: Number(employeeId),
      shiftId: Number(shiftId),
      role,
      status,
    });

    return res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    return res.status(500).json({ error: "Failed to create assignment" });
  }
}

export async function updateAssignmentHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid assignment id" });
    }

    const { employeeId, shiftId, role, status } = req.body;

    const assignment = await updateAssignment(id, {
      employeeId:
        employeeId !== undefined ? Number(employeeId) : undefined,
      shiftId: shiftId !== undefined ? Number(shiftId) : undefined,
      role,
      status,
    });

    return res.status(200).json(assignment);
  } catch (error) {
    console.error("Error updating assignment:", error);

    if (isPrismaNotFoundError(error)) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    return res.status(500).json({ error: "Failed to update assignment" });
  }
}

export async function deleteAssignmentHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid assignment id" });
    }

    await deleteAssignment(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting assignment:", error);

    if (isPrismaNotFoundError(error)) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    return res.status(500).json({ error: "Failed to delete assignment" });
  }
}