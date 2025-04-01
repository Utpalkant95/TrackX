import { getExerciseList } from "@/Api/progress";
import { PrimarySelect } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
const SelectExerciseFrag = ({setSelectedExercise} : {setSelectedExercise : Dispatch<SetStateAction<string>> | undefined}) => {
  const [selectExercise, setSelectExercise] = useState<string>("");
  const {data} = useQuery({
    queryKey: ["exercises"],
    queryFn: getExerciseList,
  });

  const tempExer = data?.map((item) => ({
    key: item,
    value: item,
  }));

  useEffect(() => {
    setSelectedExercise &&  setSelectedExercise(selectExercise);
  }, [selectExercise]);
  return (
    <>
      <PrimarySelect
        data={tempExer}
        placeholder="Select Exercise"
        onValueChange={setSelectExercise}
        value={selectExercise}
      />
    </>
  );
};

export default SelectExerciseFrag;
