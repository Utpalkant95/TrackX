import mongoose from "mongoose";
import {ExerciseSchema} from "./workout.model";
const TemplateSchema = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    exercises: [ExerciseSchema]
})

const Template = mongoose.model("Template", TemplateSchema);

export default Template