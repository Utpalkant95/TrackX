import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import {AuthRouter, UserRouter,WorkoutRouter,TemplateRouter, UserSettingRouter, ProgressRouter, ExerciseRouter} from "./routes"
import cors from "cors";
import cookieParser from "cookie-parser";
require("./utility/emailScheduler");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: [process.env.CLIENT_URL!, process.env.CLIENT_URL_START!, "7cf0-2409-40d0-1035-72-6c67-453-4a9a-f325.ngrok-free.app", "https://track-x-kappa.vercel.app"],
  credentials: true
}));
app.use(cookieParser());

// api route
app.get("/", (_, res) => {
  res.send("TrackX API");
})
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/workout", WorkoutRouter);
app.use("/api/v1/template", TemplateRouter);
app.use("/api/v1/userSetting", UserSettingRouter);
app.use("/api/v1/progress", ProgressRouter);
app.use("/api/v1/exercise", ExerciseRouter);

app.listen(process.env.PORT, () => {
  console.log(`TrackX app listening on port ${process.env.PORT}`);
});