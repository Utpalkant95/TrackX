import mongoose from "mongoose";
import { IExercise } from "../interfaces/Project";

const exerciseSchema = new mongoose.Schema<IExercise>({
    id : String,
    name : String,
    bodyPart : String,
    equipment : String,
    gifUrl : String,
    target : String,
    secondaryMuscles : [String],
    instructions : [String]
})

const Exercise = mongoose.model<IExercise>("Exercise", exerciseSchema);

export default Exercise