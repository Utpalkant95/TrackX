import { Request, Response } from "express";
import { Exercise } from "../models";

export const bodyPartList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bodyPartList = await Exercise.distinct("bodyPart");
    res.status(200).json({ success: true, data: bodyPartList });
  } catch (error) {
    console.log("error in listing body part", error);
    res.status(500).json({
      success: false,
      message: "server error while listing body part",
    });
  }
};

export const exercisesByBodyPart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bodyPart = req.params;

    if (!bodyPart) {
      res.status(400).json({
        success: false,
        message: "Body Part is Required",
      });
    }

    const exercises = Exercise.find({ bodyPart });

    res.status(200).json({
      success: true,
      message: "Data is Fetched",
      data: exercises,
    });
  } catch (error) {
    console.log("error while fetching body part exercises", error);
    res.status(500).json({
      success: true,
      message: "error while fetching body part exercises",
    });
  }
};

export const equipmentsList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const equipmentsList = await Exercise.distinct("equipment");
    res.status(200).json({ success: true, data: equipmentsList });
  } catch (error) {
    console.log("error in listing equipments", error);
    res.status(500).json({
      success: false,
      message: "server error while listing equipments",
    });
  }
};

export const exercisesByEquipmentAndBodyPart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { equipment, bodyPart } = req.params;
    const exercises =await Exercise.find({ bodyPart, equipment }).select("-id, -bodyPart -equipment -target -secondaryMuscles -instructions -__v");

    res.status(200).json({
      success: true,
      message: "Data is Fetched",
      data: exercises,
    });
  } catch (error) {
    console.log("error while fetching body part exercises", error);
    res.status(500).json({
      success: true,
      message: "error while fetching body part exercises",
    });
  }
};