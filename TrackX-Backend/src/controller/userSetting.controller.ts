import { Request, Response } from "express";
import userSettingSchema from "../validations/userSetting";
import UserSetting from "../models/userSetting.route";
import {
  AuthRequest,
  IUserModel,
  IUserSettingSchema,
} from "../interfaces/Project";
import { User } from "../models";

export const saveSettings = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.id;
    const user: IUserModel | null = await User.findById(userId);
    const data = req.body;

    const validation = userSettingSchema.safeParse(data);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.message,
      });
      return;
    }

    const updatedSettings: IUserSettingSchema | null =
      await UserSetting.findOneAndUpdate({
        userId,
        userEmail: user?.email,
        ...data,
      });

    updatedSettings?.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: updatedSettings,
    });

    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while updating settings",
    });

    return;
  }
};

export const resetSettings = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.id;
    const resetSettings = await UserSetting.findOneAndReplace({
      userId,
    });
    res.status(200).json({
      success: true,
      message: "Settings reset successfully",
      data: resetSettings,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while resetting settings",
    });
    return;
  }
};

export const getSettings = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.id;
    const settings: IUserSettingSchema | null = await UserSetting.findOne({
      userId,
    });
    res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      data: settings,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching settings",
    });
    return;
  }
};

export const workoutReminder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const user: IUserModel | null = await User.findById(userId);
    const { workoutReminder } = req.params;

    const updatedSettings: IUserSettingSchema | null =
      await UserSetting.findOneAndUpdate({
        userId,
        userEmail: user?.email,
        workoutReminder: {
          workoutReminder: workoutReminder,
        },
      });

    updatedSettings?.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.log("error while updating workout reminder", error);
    res
      .status(500)
      .json({ message: "Server error while updating workout reminder" });
  }
};
