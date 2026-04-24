import { Router } from "express";
import {
  getLeadershipDayHandler,
  getLeadershipMonthHandler,
  getLeadershipWeekHandler,
} from "./leadership-view.controller";

const leadershipViewRouter = Router();

leadershipViewRouter.get("/day", getLeadershipDayHandler);
leadershipViewRouter.get("/week", getLeadershipWeekHandler);
leadershipViewRouter.get("/month", getLeadershipMonthHandler);

export default leadershipViewRouter;
