import {
  getBodyPartList,
  getEquipmentsList,
  getExerciseByEquipmentsAndBodyPart,
} from "@/Api/exercise";
import { IExercise } from "@/Api/interfaces/Response";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useSelectExercise = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const { data: bodyParts } = useQuery({
    queryKey: ["bodyParts"],
    queryFn: getBodyPartList,
  });

  const { data: equipments } = useQuery({
    queryKey: ["equipments"],
    queryFn: getEquipmentsList,
  });

  const { data: exercises } = useQuery({
    queryKey: ["exercises"],
    queryFn: () =>
      getExerciseByEquipmentsAndBodyPart({
        bodyPart: selectedBodyPart,
        equipment: selectedEquipment,
      }),
    enabled: !!selectedBodyPart && !!selectedEquipment,
  });

  const BODYPARTDATA = () => {
    if (bodyParts) {
      return bodyParts.map((item) => ({
        value: item,
        key: item,
      }));
    }
  };

  const ENQUIPMENTDATA = () => {
    if (equipments) {
      return equipments.map((item) => ({
        key: item,
        value: item,
      }));
    }
  };

  const EXERCISEDATA = () => {
    return exercises?.map((item: IExercise) => ({
      key: item.name,
      value: item.name,
    }));
  };

  const BDData = BODYPARTDATA();
  const EQData = ENQUIPMENTDATA();
  const EXData = EXERCISEDATA();
  return {
    BDData,
    EQData,
    EXData,
    selectedBodyPart,
    setSelectedBodyPart,
    selectedEquipment,
    setSelectedEquipment,
    selectedExercise,
    setSelectedExercise,
  };
};

export default useSelectExercise;
