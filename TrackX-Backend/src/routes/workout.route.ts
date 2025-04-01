import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import {
  addWorkout,
  createWorkoutFromTemplate,
  deleteWorkout,
  getWorkoutPerformance,
  getWorkouts,
  getWorkoutsStats,
  repeatLastWorkout,
  updateWorkout,
} from "../controller/workout.controller";

const WorkoutRouter = Router();

WorkoutRouter.route("/create-workout").post(isAuthenticated, addWorkout);
WorkoutRouter.route("/get-workouts/:limit").get(isAuthenticated, getWorkouts);
WorkoutRouter.route("/get-workouts-stats").get(
  isAuthenticated,
  getWorkoutsStats
);
WorkoutRouter.route("/delete-workout/:id").delete(
  isAuthenticated,
  deleteWorkout
);
WorkoutRouter.route("/repeat-last-workout").put(
  isAuthenticated,
  repeatLastWorkout
);
WorkoutRouter.route("/get-workout-performance").get(
  isAuthenticated,
  getWorkoutPerformance
);

WorkoutRouter.route("/update-workout").put(isAuthenticated, updateWorkout);
WorkoutRouter.route("/create-workout-from-template").post(isAuthenticated, createWorkoutFromTemplate);

export default WorkoutRouter;
