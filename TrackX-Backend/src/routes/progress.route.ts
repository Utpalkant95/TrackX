import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { aiInsights, exerciseList, personalBest, progressGraph, progressReport, weeklyProgress } from "../controller/progress.controller";

const ProgressRouter = express.Router();

ProgressRouter.route("/personal-best").get(isAuthenticated, personalBest);
ProgressRouter.route("/ai-insights").get(isAuthenticated, aiInsights);
ProgressRouter.route("/weekly-progress").get(isAuthenticated, weeklyProgress);
ProgressRouter.route("/progress-graph/:exerciseName/:dateRange").get(isAuthenticated, progressGraph);
ProgressRouter.route("/progress-report").get(isAuthenticated, progressReport);
ProgressRouter.route("/exercise-list").get(isAuthenticated, exerciseList);

export default ProgressRouter