import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { deleteMediaFromCloudinary, uploadMedia } from "../utility/cloudinary";
import fs from "fs";
import { AuthRequest, IUserModel, IWorkoutSchema } from "../interfaces/Project";
import { Workout } from "../models";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const decodeToken: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (!decodeToken) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const user: IUserModel | null = await User.findById(decodeToken.id).select(
      "-password -updatedAt -__v"
    );

    res
      .status(200)
      .json({ success: true, message: "user profile", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const uploadProfileAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const photo = req.file;
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    if (!photo) {
      res.status(400).json({ message: "photo is required" });
      return;
    }

    const decodeToken: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (!decodeToken) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const user: IUserModel | null = await User.findById(decodeToken.id).select(
      "-password -updatedAt -__v"
    );

    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    if (user.avatar) {
      await deleteMediaFromCloudinary(user.avatar.public_id);
    }

    const result = await uploadMedia(photo.path);

    if (!result) {
      res.status(500).json({ message: "server error while uplaoding image" });
      return;
    }

    user.avatar = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };

    await user.save();

    // **Delete the uploaded file from the uploads folder**
    fs.unlink(photo.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    res
      .status(200)
      .json({ success: true, message: "image uploaded successfully" });
  } catch (error) {
    console.log(error);
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file in catch block:", err);
        }
      });
    }
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const sendEmial = async (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {}
};

export const fitnessStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const weightPreference = user?.preferences;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const workouts: IWorkoutSchema[] = await Workout.find({ userId });

    let totalWorkouts = workouts.length;
    let exerciseCount: Record<string, number> = {};
    let maxWeightLifted = 0;
    let workoutDays = new Set<string>();

    workouts.forEach((workout) => {
      const workoutDate = workout.date.toISOString().split("T")[0];
      workoutDays.add(workoutDate);

      workout.exercises.forEach((exercise) => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;

        // Find max weight lifted in a single set
        exercise.sets.forEach((set) => {
          maxWeightLifted = Math.max(maxWeightLifted, set.weight);
        });
      });
    });

    // Find most frequent exercise
    let mostFrequentExercise = Object.keys(exerciseCount).reduce(
      (a, b) => (exerciseCount[a] > exerciseCount[b] ? a : b),
      "None"
    );

    // Calculate workout streak
    let sortedWorkoutDays = Array.from(workoutDays).sort().reverse();
    let streak = 0;
    let currentDate = new Date().toISOString().split("T")[0];

    for (let day of sortedWorkoutDays) {
      if (day === currentDate) {
        streak++;
        currentDate = new Date(
          new Date(currentDate).setDate(new Date(currentDate).getDate() - 1)
        )
          .toISOString()
          .split("T")[0];
      } else {
        break;
      }
    }

    // Convert max weight lifted to the user's preference
    const maxWeightDisplay =
      weightPreference === "lbs"
        ? `${(maxWeightLifted * 2.20462).toFixed(2)} lbs`
        : `${maxWeightLifted} kg`;

    // Convert to array of objects
    const stats = [
      { title: "Total Workouts", value: totalWorkouts },
      { title: "Most Frequent", value: mostFrequentExercise },
      {
        title: "Personal Best",
        value: maxWeightDisplay,
      },
      { title: "Workout Streak", value: `${streak} Days` },
    ];

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "server error while getting stats" });
  }
};

export const updatePreferences = async (
  req: AuthRequest,
  res: Response
): Promise<void> => { 
  try {
    const userId = req.id;
    const { preferences } = req.params;
    const user: IUserModel | null = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    user.preferences = preferences;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "preferences updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "server error while updating preferences",
      });
  }
};
