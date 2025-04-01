import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { fitnessStats, getUserProfile, updatePreferences, uploadProfileAvatar } from "../controller/user.controller";
import { upload } from "../utility/multer";

const UserRouter = Router();

UserRouter.route("/get-user-profile").get(isAuthenticated, getUserProfile);
UserRouter.route("/upload-avatar").put(isAuthenticated, upload.single("photo"), uploadProfileAvatar);
UserRouter.route("/fitness-stats").get(isAuthenticated, fitnessStats);
UserRouter.route("/update-preferences/:preferences").put(isAuthenticated, updatePreferences);

export default UserRouter;