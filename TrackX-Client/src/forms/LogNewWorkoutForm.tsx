import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Plus, X } from "lucide-react";
import { IExercise, ITemplateData } from "@/Api/interfaces/Response";
import { FormikProps } from "formik";
import { ITemplate, Workout } from "@/Api/interfaces/Project";
import { PrimarySelect } from "@/components";
import { getExerciseByEquipmentsAndBodyPart } from "@/Api/exercise";
import { useQueries } from "@tanstack/react-query";
import { useSelectExercise } from "@/hooks";

interface ILogNewWorkoutForm {
  refetch: () => void;
  selectedTemplate?: ITemplateData | null | undefined;
  formik: FormikProps<ITemplate> | FormikProps<Workout>;
  type: "workout" | "template";
  update: "YES" | "NO";
  createIsPending: boolean;
  updateIsPending: boolean;
}

const LogNewWorkoutForm = ({
  formik,
  type,
  update,
  createIsPending,
  updateIsPending,
}: ILogNewWorkoutForm) => {
  const { BDData, EQData } = useSelectExercise();

  const exerciseQueries = useQueries({
    queries: formik.values.exercises.map((exercise) => ({
      queryKey: ["exercise", exercise.bodyPart, exercise.equipment],
      queryFn: () =>
        getExerciseByEquipmentsAndBodyPart({
          bodyPart: exercise.bodyPart,
          equipment: exercise.equipment,
        }),
      enabled: !!exercise.bodyPart && !!exercise.equipment,
    })),
  });
  const exercisesData = exerciseQueries.map((query) => query.data);

  const EXERCISEDATA = (index: number) => {
    const exercises = exercisesData?.[index];
    if (!exercises) return [];

    return exercises.map((item: IExercise) => ({
      key: item.name,
      value: item.name,
    }));
  };

  // Function to add a new exercise
  const addExercise = () => {
    formik.setFieldValue("exercises", [
      ...formik.values.exercises,
      {
        name: "",
        bodyPart: "",
        equipment: "",
        sets: [{ weight: 0, reps: 1, difficulty: "Easy" }],
      },
    ]);
  };

  // Function to add a new set for a specific exercise
  const addSet = (exerciseIndex: number) => {
    formik.setFieldValue(`exercises.${exerciseIndex}.sets`, [
      ...formik.values.exercises[exerciseIndex].sets,
      { weight: 0, reps: 1, difficulty: "Easy" },
    ]);
  };

  // Function to remove a set for a specific exercise
  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newSets = [...formik.values.exercises[exerciseIndex].sets];
    newSets.splice(setIndex, 1);
    formik.setFieldValue(`exercises.${exerciseIndex}.sets`, newSets);
  };

  // Function to remove an exercise
  const removeExercise = (exerciseIndex: number) => {
    formik.setFieldValue(
      "exercises",
      formik.values.exercises.filter((_, index) => index !== exerciseIndex)
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="">
      <ScrollArea className="max-h-[60vh] pr-4 overflow-y-scroll custom-scrollbar">
        <div className="space-y-4 py-4">
          {type === "template" && (
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                type="text"
                name="name"
                value={(formik.values as ITemplate).name}
                onChange={formik.handleChange}
                placeholder="e.g., Leg Day Routine"
                className="bg-[#2A2A2A] text-white"
              />
            </div>
          )}
          {formik.values.exercises.map((exercise, exerciseIndex) => {
            const EXData = EXERCISEDATA(exerciseIndex);
            return (
              <Card className="bg-[#2A2A2A] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <Label>Exercise {exerciseIndex + 1}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(exerciseIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <PrimarySelect
                  onValueChange={(value) =>
                    formik.setFieldValue(
                      `exercises.${exerciseIndex}.bodyPart`,
                      value
                    )
                  }
                  placeholder="Select Body Part"
                  value={exercise.bodyPart}
                  data={BDData}
                />

                <PrimarySelect
                  onValueChange={(value) =>
                    formik.setFieldValue(
                      `exercises.${exerciseIndex}.equipment`,
                      value
                    )
                  }
                  placeholder="Select Equipment"
                  value={exercise.equipment}
                  data={EQData}
                />

                <PrimarySelect
                  value={exercise.name}
                  data={EXData}
                  onValueChange={(value) =>
                    formik.setFieldValue(
                      `exercises.${exerciseIndex}.name`,
                      value
                    )
                  }
                  placeholder="Select Exercise"
                />
                {exercise.sets.map((set, setIndex) => (
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Set {setIndex + 1}</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Weight (kg)</Label>
                        <Input
                          type="number"
                          value={set.weight}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name={`exercises.${exerciseIndex}.sets.${setIndex}.weight`}
                          className="bg-[#3A3A3A] text-white"
                        />
                      </div>
                      <div>
                        <Label>Reps</Label>
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`}
                          className="bg-[#3A3A3A] text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <Slider
                        min={1}
                        max={3}
                        step={1}
                        value={[
                          ["Easy", "Medium", "Hard"].indexOf(set.difficulty) +
                            1,
                        ]}
                        onValueChange={(value) => {
                          formik.setFieldValue(
                            `exercises.${exerciseIndex}.sets.${setIndex}.difficulty`,
                            ["Easy", "Medium", "Hard"][value[0] - 1]
                          );
                        }}
                        className="py-4"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => addSet(exerciseIndex)}
                  variant="outline"
                  className="mt-2 w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Another Set
                </Button>
              </Card>
            );
          })}
          <Button onClick={addExercise} variant="secondary" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Another Exercise
          </Button>
        </div>
      </ScrollArea>
      <DialogFooter className="">
        <>
          {update === "NO" ? (
            <Button
              type="submit"
              className="bg-[#00BFFF] text-white hover:bg-[#00A0D0]"
            >
              {createIsPending ? "Logging..." : "Log Workout"}
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-[#00BFFF] text-white hover:bg-[#00A0D0]"
            >
              {updateIsPending ? "Updating..." : "Update Workout"}
            </Button>
          )}
        </>
      </DialogFooter>
    </form>
  );
};

export default LogNewWorkoutForm;
