import mongoose from "mongoose";
import { IEmailScheduleSchema } from "../interfaces/Project";

const emailScheduleSchema = new mongoose.Schema<IEmailScheduleSchema>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  sendTime: { type: String, required: true },
  status: { type: String, enum: ["pending", "sent"], default: "pending" },
});

const EmailSchedule = mongoose.model<IEmailScheduleSchema>(
  "EmailSchedule",
  emailScheduleSchema
);

export default EmailSchedule;
