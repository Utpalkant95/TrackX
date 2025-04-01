import mongoose from "mongoose";
import { IExerciseSchema, ISetSchema, IWorkoutSchema } from "../interfaces/Project";

const SetSchema = new mongoose.Schema<ISetSchema>({
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
});

export const ExerciseSchema = new mongoose.Schema<IExerciseSchema>({
  bodyPart : { type: String, required: true },
  equipment : { type: String, required: true },
  name: { type: String, required: true },
  sets: [SetSchema],
});

 const WorkoutSchema = new mongoose.Schema<IWorkoutSchema>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  exercises: [ExerciseSchema],
}, {
    timestamps: true
});

const Workout = mongoose.model("Workout", WorkoutSchema);

export default Workout;