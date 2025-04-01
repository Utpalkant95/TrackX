import { Document } from "mongoose";
import { Request } from "express";

export interface IDecodeTokenData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  iat: number;
  exp: number;
}

export interface ISetSchema extends Document {
  weight: number;
  reps: number;
  difficulty: string;
}

export interface IExerciseSchema extends Document {
  bodyPart: string;
  equipment: string;
  name: string;
  sets: ISetSchema[];
}

export interface IWorkoutSchema extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  date: Date;
  exercises: IExerciseSchema[];
}

export interface IUserModel extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    secure_url: string;
  };
  preferences: { [("kg", "lbs")] };
}

export interface IUserSettingSchema extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  userEmail: string;
  workoutReminder: {
    workoutReminder: boolean;
    reminderTime: string;
  };
  progessAiAlerts: {
    plateauAlerts: boolean;
    goalTrackingAlerts: boolean;
  };
  emailNotifications: {
    receiveWeeklyProgressReports: boolean;
    receiveSpecialTrainingTipsUpdates: boolean;
  };
}

interface IEmailScheduleSchema extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  email: string;
  subject: string;
  body: string;
  sendTime: string;
  status: "pending" | "sent";
}

export interface IExercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export interface AuthRequest extends Request {
  id?: string;
}
