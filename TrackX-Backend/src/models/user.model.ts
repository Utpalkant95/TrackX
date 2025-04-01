import mongoose from "mongoose";
import { IUserModel } from "../interfaces/Project";

const userModel = new mongoose.Schema <IUserModel>({
    name : {
        type : String,
        required : [true, "Name is required"],
    },
    email : {
        type : String,
        required : [true, "Email is required"],
    },
    password : {
        type : String,
        required : [true, "Password is required"],
    },
    avatar: {
        public_id: { type: String, default: "trackx/noc5v5l8komday6wdlet" },
        secure_url: { type: String, default: "https://res.cloudinary.com/dt4wkkyhy/image/upload/v1738305704/trackx/noc5v5l8komday6wdlet.png" }
    },
    preferences: {type: String, enum: ["kg", "lbs"], default: "kg"},
}, {
    timestamps : true
})


const User = mongoose.model<IUserModel>("User", userModel)

export default User