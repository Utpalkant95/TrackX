import mongoose from "mongoose";
import { IUserSettingSchema } from "../interfaces/Project";

const userSettingSchema = new mongoose.Schema<IUserSettingSchema>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: { type: String, required: true },
    workoutReminder: {
      workoutReminder: { type: Boolean, default: false },
      reminderTime: {
        type: String,
        enum: ["8:00 AM", "2:00 PM", "7:00 PM"],
        default: "8:00 AM",
      },
    },
    progessAiAlerts: {
      plateauAlerts: { type: Boolean, default: false },
      goalTrackingAlerts: { type: Boolean, default: false },
    },
    emailNotifications: {
      receiveWeeklyProgressReports: { type: Boolean, default: false },
      receiveSpecialTrainingTipsUpdates: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const UserSetting = mongoose.model<IUserSettingSchema>(
  "UserSetting",
  userSettingSchema
);

export default UserSetting;