import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type PlanningMonthTestContext = {
  planningMonthIds: number[];
};

const testContexts: PlanningMonthTestContext[] = [];
const app = createApp({ includeValidations: false });

describe("Planning month controlled usability integration", () => {
  afterEach(async () => {
    while (testContexts.length > 0) {
      const context = testContexts.pop();

      if (!context) {
        continue;
      }

      await prisma.planningMonth.deleteMany({
        where: {
          id: {
            in: context.planningMonthIds,
          },
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates, lists, and retrieves a planning month", async () => {
    const createResponse = await request(app).post("/planning-months").send({
      year: 2026,
      month: 6,
      status: "draft",
    });

    testContexts.push({
      planningMonthIds: [createResponse.body.id],
    });

    const listResponse = await request(app).get("/planning-months");
    const getResponse = await request(app).get(
      `/planning-months/${createResponse.body.id}`
    );

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      year: 2026,
      month: 6,
      status: "draft",
    });

    expect(listResponse.status).toBe(200);
    expect(
      listResponse.body.some(
        (planningMonth: { id: number }) =>
          planningMonth.id === createResponse.body.id
      )
    ).toBe(true);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject({
      id: createResponse.body.id,
      year: 2026,
      month: 6,
      status: "draft",
    });
  });

  it("rejects nested planning day creation on planning month create", async () => {
    const response = await request(app).post("/planning-months").send({
      year: 2026,
      month: 8,
      status: "draft",
      planningDays: [
        {
          date: "2026-08-01",
          shiftTemplates: [
            {
              type: "early",
              requiredCount: 2,
              requiredQualifiedCount: 1,
            },
          ],
        },
      ],
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message:
          "planningDays cannot be created through POST /planning-months. Initialize planning days explicitly.",
      },
    });

    const planningMonths = await prisma.planningMonth.findMany({
      where: {
        year: 2026,
        month: 8,
      },
    });

    expect(planningMonths).toHaveLength(0);
  });

  it("initializes planning days idempotently for the full month", async () => {
    const createResponse = await request(app).post("/planning-months").send({
      year: 2026,
      month: 2,
      status: "draft",
    });

    testContexts.push({
      planningMonthIds: [createResponse.body.id],
    });

    const firstInitializeResponse = await request(app).post(
      `/planning-months/${createResponse.body.id}/initialize-days`
    );
    const secondInitializeResponse = await request(app).post(
      `/planning-months/${createResponse.body.id}/initialize-days`
    );

    expect(firstInitializeResponse.status).toBe(200);
    expect(firstInitializeResponse.body.planningDays).toHaveLength(28);
    expect(firstInitializeResponse.body.planningDays[0]).toMatchObject({
      date: "2026-02-01T00:00:00.000Z",
      isSpecialDay: false,
      note: null,
    });
    expect(firstInitializeResponse.body.planningDays[27]).toMatchObject({
      date: "2026-02-28T00:00:00.000Z",
    });

    expect(secondInitializeResponse.status).toBe(200);
    expect(secondInitializeResponse.body.planningDays).toHaveLength(28);
  });

  it("manages planning shift templates without creating operational shifts", async () => {
    const createPlanningMonthResponse = await request(app)
      .post("/planning-months")
      .send({
        year: 2026,
        month: 7,
        status: "draft",
      });

    testContexts.push({
      planningMonthIds: [createPlanningMonthResponse.body.id],
    });

    const initializeResponse = await request(app).post(
      `/planning-months/${createPlanningMonthResponse.body.id}/initialize-days`
    );

    const planningDayId = initializeResponse.body.planningDays[0].id;

    const createTemplateResponse = await request(app)
      .post(`/planning-months/days/${planningDayId}/shift-templates`)
      .send({
        type: "mid",
        requiredCount: 4,
        requiredQualifiedCount: 2,
        isCritical: true,
      });

    const templateId = createTemplateResponse.body.id;
    const listTemplatesResponse = await request(app).get(
      `/planning-months/days/${planningDayId}/shift-templates`
    );
    const getTemplateResponse = await request(app).get(
      `/planning-months/shift-templates/${templateId}`
    );
    const updateTemplateResponse = await request(app)
      .patch(`/planning-months/shift-templates/${templateId}`)
      .send({
        requiredCount: 5,
        requiredQualifiedCount: 3,
        isCritical: false,
      });

    expect(createTemplateResponse.status).toBe(201);
    expect(createTemplateResponse.body).toMatchObject({
      planningDayId,
      type: "mid",
      requiredCount: 4,
      requiredQualifiedCount: 2,
      isCritical: true,
    });

    expect(listTemplatesResponse.status).toBe(200);
    expect(listTemplatesResponse.body).toHaveLength(1);
    expect(getTemplateResponse.status).toBe(200);
    expect(getTemplateResponse.body.id).toBe(templateId);

    expect(updateTemplateResponse.status).toBe(200);
    expect(updateTemplateResponse.body).toMatchObject({
      id: templateId,
      requiredCount: 5,
      requiredQualifiedCount: 3,
      isCritical: false,
    });

    const shifts = await prisma.shift.findMany({
      where: {
        date: new Date("2026-07-01T00:00:00.000Z"),
      },
    });

    expect(shifts).toHaveLength(0);

    const deleteTemplateResponse = await request(app).delete(
      `/planning-months/shift-templates/${templateId}`
    );

    expect(deleteTemplateResponse.status).toBe(204);
  });
});
