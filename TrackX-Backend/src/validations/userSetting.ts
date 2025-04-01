import z from "zod";

const userSettingSchema = z.object({
  workoutReminder: z.object({
    workoutReminder: z.boolean(),
    reminderTime: z.string(),
  }),
  progessAiAlerts: z.object({
    plateauAlerts: z.boolean(),
    goalTrackingAlerts: z.boolean(),
  }),
  emailNotifications: z.object({
    receiveWeeklyProgressReports: z.boolean(),
    receiveSpecialTrainingTipsUpdates: z.boolean(),
  }),
});

export default userSettingSchema