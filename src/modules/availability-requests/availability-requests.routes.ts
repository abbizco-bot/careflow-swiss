import { Router } from "express";
import {
  createAvailabilityRequestHandler,
  getAvailabilityRequestHandler,
  listAvailabilityRequestsHandler,
  updateAvailabilityRequestStatusHandler,
} from "./availability-requests.controller";

const availabilityRequestsRouter = Router();

availabilityRequestsRouter.get("/", listAvailabilityRequestsHandler);
availabilityRequestsRouter.get("/:id", getAvailabilityRequestHandler);
availabilityRequestsRouter.post("/", createAvailabilityRequestHandler);
availabilityRequestsRouter.patch(
  "/:id/status",
  updateAvailabilityRequestStatusHandler
);

export default availabilityRequestsRouter;
