import { Response, Request } from "express";
import { User, Workout } from "../models";
import { createWorkoutSchema } from "../validations";
import mongoose from "mongoose";
import { AuthRequest, IWorkoutSchema } from "../interfaces/Project";
import moment from "moment";

export const addWorkout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { exercises } = req.body;
    const userId = req.id;
    const date = new Date().toString();

    const validation = createWorkoutSchema.safeParse({ date, exercises });

    if (!validation.success) {
      res.status(400).json({ message: validation.error.errors[0].message });
      return;
    }

    if (!exercises || exercises.length === 0) {
      res.status(400).json({ message: "At least one exercise is required" });
      return;
    }

    const newWorkout = await Workout.create({
      date: new Date(date),
      userId,
      exercises,
    });

    res.status(201).json({
      success: true,
      message: "Workout logged successfully",
      data: newWorkout,
    });
  } catch (error) {
    console.log("error in adding workout", error);
    res
      .status(500)
      .json({ success: false, message: "server error while adding workout" });
  }
};

export const getWorkouts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const {limit} = req.params;
    const limitValue = limit ? parseInt(limit, 10) : undefined;
    const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(limitValue as number);

    res.status(200).json({
      success: true,
      message: "Workouts fetched successfully",
      data: workouts,
    });
  } catch (error) {
    console.log("error in getting workouts", error);
    res
      .status(500)
      .json({ success: false, message: "server error while getting workouts" });
  }
};

export const getWorkoutsStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    // Fetch workouts from the last 7 days
    const workouts: IWorkoutSchema[] = await Workout.find({
      userId,
      date: { $gte: startDate },
    });

    let totalWorkouts = workouts.length;
    let exerciseCount: Record<string, number> = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        // Count frequency of each exercise
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });

     // Get the most frequent exercise
     let mostFrequentExercise = null;
     let maxCount = 0;
     for (const exercise in exerciseCount) {
       if (exerciseCount[exercise] > maxCount) {
         mostFrequentExercise = exercise;
         maxCount = exerciseCount[exercise];
       }
     }

     // Convert data into array of objects
    const stats = [
      { title: "Total Workouts This Week", value: totalWorkouts },
      { title: "Most Frequent Exercise", value: mostFrequentExercise || "None" }
    ];

     res.status(200).json({
       success: true,
       message: "Workouts stats fetched successfully",
       data: stats
     })
  } catch (error) {
    console.log("error in getting workouts stats", error);
    res.status(500).json({
      success: false,
      message: "server error while getting workouts stats",
    });
  }
};

export const deleteWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedWorkout = await Workout.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
      data: deletedWorkout,
    });
  } catch (error) {
    console.log("error in deleting workout", error);
    res
      .status(500)
      .json({ success: false, message: "server error while deleting workout" });
  }
};

export const repeatLastWorkout = async (req: AuthRequest, res: Response) => {
  // Implement this function to repeat the last workout

  try {
    const userId = req.id;

    // Find the last workout of the user
    const lastWorkout: IWorkoutSchema | null = await Workout.findOne({
      userId,
    }).sort({ date: -1 });

    if (!lastWorkout) {
      res.status(404).json({ success: false, message: "No workouts found" });
      return;
    }

    // Create a new workout with the same exercises
    const newWorkout = await Workout.create({
      date: new Date().toString(),
      userId,
      exercises: lastWorkout.exercises,
    });

    res.status(201).json({
      success: true,
      message: "Last workout repeated successfully",
      data: newWorkout,
    });
  } catch (error) {
    console.log("error in repeating last workout", error);
    res.status(500).json({
      success: false,
      message: "server error while repeating last workout",
    });
  }
};

export const getWorkoutPerformance = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const weightPreference = user?.preferences;
    const workouts: IWorkoutSchema[] | null = await Workout.find({ userId });

    if (workouts.length === 0) {
      res.status(200).json({
        success: true,
        message: "No workouts logged yet",
        stats: {
          heaviestLift: 0,
          heaviestLiftExercise: "N/A",
          longestStreak: "N/A",
          mostFrequentExercise: "N/A",
        },
      });
      return;
    }

    // 🏋️‍♂️ 1️⃣ Heaviest Lift (Max weight lifted)
    let heaviestLift = 0;
    let heaviestLiftExercise = "N/A";

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.weight > heaviestLift) {
            heaviestLift = set.weight;
            heaviestLiftExercise = exercise.name;
          }
        });
      });
    });

    // 🔥 2️⃣ Longest Streak (Consecutive workout days)
    const workoutDates = workouts.map((w) =>
      moment(w.date).format("DD MMM YYYY")
    ); // ✅ Format date
    const uniqueDates = [...new Set(workoutDates)].sort((a, b) =>
      moment(a, "DD MMM YYYY").diff(moment(b, "DD MMM YYYY"))
    ); // Sort dates

    let maxStreak = 0;
    let currentStreak = 1;
    let streakStart = uniqueDates[0];
    let streakEnd = uniqueDates[0];

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = moment(uniqueDates[i - 1], "DD MMM YYYY");
      const currDate = moment(uniqueDates[i], "DD MMM YYYY");
      const diff = currDate.diff(prevDate, "days");

      if (diff === 1) {
        currentStreak++;
        streakEnd = uniqueDates[i];
      } else {
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
          streakStart = uniqueDates[i - currentStreak];
          streakEnd = uniqueDates[i - 1];
        }
        currentStreak = 1;
      }
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      streakStart = uniqueDates[uniqueDates.length - currentStreak];
      streakEnd = uniqueDates[uniqueDates.length - 1];
    }

    const longestStreak =
      maxStreak > 1
        ? `${streakStart} - ${streakEnd} (${maxStreak} days)`
        : "N/A";

    // 🔄 3️⃣ Most Frequent Exercise
    const exerciseCount: { [key: string]: number } = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });

    let mostFrequentExercise = "N/A";
    let mostFrequentCount = 0;

    Object.keys(exerciseCount).forEach((exercise) => {
      if (exerciseCount[exercise] > mostFrequentCount) {
        mostFrequentCount = exerciseCount[exercise];
        mostFrequentExercise = exercise;
      }
    });

    const data = [
      {
        title : "Heaviest Lift",
        value : weightPreference === "kg" ? `${heaviestLift} kg` : `${heaviestLift * 2.20462} lbs`,
        valueTitle : heaviestLiftExercise
      },
      {
        title : "Longest Streak",
        value : longestStreak,
        valueTitle : `${streakStart} - ${streakEnd}`
      },
      {
        title : "Most Frequent Exercise",
        value : mostFrequentExercise,
        valueTitle : mostFrequentCount
      }
    ]

    // 📌 Response
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.log("error in getting workout performance", error);
    res.status(500).json({
      success: false,
      message: "server error while getting workout performance",
    });
  }
};

export const updateWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, data } = req.body;
    const updatedWorkout = await Workout.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      data: updatedWorkout,
    });
  } catch (error) {
    console.log("error in updating workout", error);
    res
      .status(500)
      .json({ success: false, message: "server error while updating workout" });
  }
};

export const createWorkoutFromTemplate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { exercises } = req.body;
    const date = new Date().toString();
    const userId = req.id;
    const validation = createWorkoutSchema.safeParse({ date, exercises });

    if (!validation.success) {
      res.status(400).json({ message: validation.error.errors[0].message });
      return;
    }

    const newWorkout = await Workout.create({
      date,
      userId,
      exercises,
    });

    await newWorkout.save();

    if (!newWorkout) {
      res.status(400).json({ message: "Workout not created" });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      data: newWorkout,
    });
  } catch (error) {
    console.log("error in creating workout from template", error);
    res.status(500).json({
      success: false,
      message: "server error while creating workout from template",
    });
  }
};
