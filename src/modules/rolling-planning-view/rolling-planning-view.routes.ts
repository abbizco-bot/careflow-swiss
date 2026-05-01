import { Router } from "express";
import { getRollingOperationalWindowHandler } from "./rolling-planning-view.controller";

const rollingPlanningViewRouter = Router();

rollingPlanningViewRouter.get("/window", getRollingOperationalWindowHandler);

export default rollingPlanningViewRouter;
