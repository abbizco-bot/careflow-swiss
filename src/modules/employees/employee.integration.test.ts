import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

const app = createApp({ includeValidations: false });
const employeeIds: number[] = [];

describe("Employee integration", () => {
  afterEach(async () => {
    await prisma.employee.deleteMany({
      where: {
        id: {
          in: employeeIds.splice(0),
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates an employee with a stable base qualification while keeping role", async () => {
    const response = await request(app)
      .post("/employees")
      .send({
        name: "Employee Base Qualification Test",
        role: "nurse",
        workload: 80,
        qualified: true,
        baseQualification: "FAGE",
      });

    employeeIds.push(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Employee Base Qualification Test",
      role: "nurse",
      workload: 80,
      qualified: true,
      baseQualification: "FAGE",
    });
  });

  it("uses OTHER as the default base qualification", async () => {
    const response = await request(app)
      .post("/employees")
      .send({
        name: "Employee Base Qualification Default Test",
        role: "assistant",
        workload: 60,
      });

    employeeIds.push(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      role: "assistant",
      baseQualification: "OTHER",
    });
  });
});
