import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { bodyPartList, equipmentsList, exercisesByBodyPart, exercisesByEquipmentAndBodyPart } from "../controller/exercise.controller";
const ExerciseRouter = Router();

ExerciseRouter.route("/body-part-list").get(isAuthenticated, bodyPartList);
ExerciseRouter.route("/exercises-by-body-part/:bodyPart").get(isAuthenticated, exercisesByBodyPart);
ExerciseRouter.route("/equipments-list").get(isAuthenticated, equipmentsList);
ExerciseRouter.route("/exercises-by-equipment-and-by-body-part/:equipment/:bodyPart").get(isAuthenticated, exercisesByEquipmentAndBodyPart);

export default ExerciseRouter