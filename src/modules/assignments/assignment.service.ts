import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()

export const createAssignment = async (data: {
  employeeId: number
  shiftId: number
  role?: string
}) => {
  return prisma.assignment.create({
    data
  })
}

export const getAssignments = async () => {
  return prisma.assignment.findMany({
    include: {
      employee: true,
      shift: true
    }
  })
}