import { Response, Request } from "express";
import Template from "../models/template.route";
import { templateSchema } from "../validations";
import { AuthRequest } from "../interfaces/Project";
import { Workout } from "../models";

export const createTemplate = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;

    const { name, exercises } = req.body;

    const validation = templateSchema.safeParse({ name, exercises });

    if (!validation.success) {
      res.status(400).json({ message: validation.error.errors[0].message });
      return;
    }
    const newTemplate = await Template.create({ userId, name, exercises });

    res.status(201).json({
      success: true,
      message: "template created successfully",
      data: newTemplate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error while creating template" });
  }
};

export const getTemplates = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.id;
    const templates = await Template.find({ userId });
    res.status(200).json({
      success: true,
      message: "templates fetched successfully",
      data: templates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error while getting templates" });
  }
};

export const deleteTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedTemplate = await Template.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "template deleted successfully",
      data: deletedTemplate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error while deleting template" });
  }
};

export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, exercises } = req.body;
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { name, exercises },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "template updated successfully",
      data: updatedTemplate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error while updating template" });
  }
};

export const getTemplateDetailById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id);
    res.status(200).json({
      success: true,
      message: "template fetched successfully",
      data: template,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error while getting template" });
  }
};

export const createTemplateByWorkout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const { name, workoutId } = req.body;

    if (!name || !workoutId) {
      res
        .status(400)
        .json({ success: false, message: "All fields are requied." });
    }

    const workout = await Workout.findById(workoutId);

    const newTemplate = await Template.create({
      userId,
      name,
      exercises: workout?.exercises,
    });

    res.status(201).json({
      success: true,
      message: "template created successfully",
    });
  } catch (error) {
    console.log("error while creating template from workout", error);
    res.status(500).json({ message: "server error while creating template" });
  }
};
