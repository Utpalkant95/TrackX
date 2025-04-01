import {Router} from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { createTemplate, createTemplateByWorkout, deleteTemplate, getTemplateDetailById, getTemplates, updateTemplate } from "../controller/template.controller";

const router = Router();

router.route("/create-template").post(isAuthenticated, createTemplate);
router.route("/get-templates").get(isAuthenticated, getTemplates);
router.route("/delete-template/:id").delete(isAuthenticated, deleteTemplate);
router.route("/update-template/:id").put(isAuthenticated, updateTemplate);
router.route("/get-template/:id").get(isAuthenticated, getTemplateDetailById);
router.route("/create-template-by-workout").post(isAuthenticated, createTemplateByWorkout);

export default router