import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { getSettings, resetSettings, saveSettings, workoutReminder } from "../controller/userSetting.controller";

const UserSettingRouter = Router();
UserSettingRouter.route("/save-user-setting").put(isAuthenticated, saveSettings);
UserSettingRouter.route("/reset-user-setting").delete(isAuthenticated, resetSettings);
UserSettingRouter.route("/get-user-setting").get(isAuthenticated, getSettings);
UserSettingRouter.route("/workout-reminder/:workoutReminder").put(isAuthenticated, workoutReminder);

export default UserSettingRouter