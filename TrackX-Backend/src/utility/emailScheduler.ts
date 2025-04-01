import cron from "node-cron";
import UserSetting from "../models/userSetting.route";
import sendEmail from "./resend";

// Convert user time into 24-hour format for cron
const getCronTime = (time: string): string => {
  const mapping: Record<string, string> = {
    "8:00 AM": "0 8 * * *",
    "12:00 PM": "0 12 * * *",
    "7:00 PM": "0 19 * * *",
  };
  return mapping[time] || "0 8 * * *";
};

// Run every hour (to check upcoming emails)
cron.schedule("0 * * * *", async () => {
  console.log("🔄 Checking for scheduled emails...");

  try {
    const users = await UserSetting.find({
      "workoutReminder.workoutReminder": true,
    });

    users.forEach((item) => {
      const cronTime = getCronTime(item.workoutReminder.reminderTime);
      cron.schedule(cronTime, async () => {
        await sendEmail({
          to: item.userEmail,
          subject: "Workout Reminder",
          html: `<strong>Hi ${item.userEmail}, here is your workout reminder</strong>`,
        });
      });
    });
  } catch (error) {
    console.error("❌ Error scheduling emails:", error);
  }
});