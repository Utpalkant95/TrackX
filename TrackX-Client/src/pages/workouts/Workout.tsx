import { lazy, useState } from "react";
import { ITemplateData, IWorkoutData } from "@/Api/interfaces/Response";
const PrimaryCard = lazy(() => import("@/components/PrimaryCard/PrimaryCard"));
const PrimaryDailog = lazy(() => import("@/components/PrimaryDialog/PrimaryDailog"));
const UiLayout = lazy(() => import("@/layout/UiLayout"));
const LayoutContentWrapper = lazy(() => import("@/Wrappers/LayoutContentWrapper"));
const LayoutGridWrapper = lazy(() => import("@/Wrappers/LayoutGridWrapper"));
const LogNewWorkoutForm = lazy(() => import("@/forms/LogNewWorkoutForm"));
const WorkoutFromTemplate = lazy(() => import("@/Fragments/WorkoutFromTemplate"));
import {Accordion,AccordionContent,AccordionItem,AccordionTrigger} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ClipboardList, Edit2, Plus, Repeat, Trash2 } from "lucide-react";
import { useLogWorkout, useWorkoutAPiCalls } from "@/hooks";

const RenderWorkoutStatsElement = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div>
      <Label className="text-gray-400">{label}</Label>
      <p className="text-2xl font-bold">{String(value)}</p>
    </div>
  );
};

const Workout = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<IWorkoutData | undefined>();
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplateData | null>();
  const [openImportWorkout, setOpenImportWorkout] = useState<boolean>();
  const [openForm, setOpenForm] = useState<boolean>(false);
  const {
    data,
    mutate,
    repeatLastWorkoutIsPending,
    repeatLastWorkoutMutate,
    workoutStats,
    refetch,
  } = useWorkoutAPiCalls();

  const {formik,logNewWorkoutIsPending,updateWorkoutIsPending, createWorkoutFromTemplateIsPending} = useLogWorkout({refetch, selectedWorkout,selectedTemplate, setOpenForm, });
  return (
    <UiLayout>
      <LayoutContentWrapper
        header="Workouts"
        des="Log new workouts and track your exercise history."
      >
        <PrimaryDailog
          btn={() => (
            <Button
              className="bg-[#00BFFF] text-white hover:bg-[#00A0D0]"
              onClick={() => setOpenForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Log New Workout
            </Button>
          )}
          description={
            selectedWorkout
              ? ""
              : "Log a new workout to track your exercise history."
          }
          title={selectedWorkout ? "Edit Workout" : "Log New Workout"}
          dialogClassName="bg-[#2A2A2A]"
          onClick={() => {
            setOpenForm(false);
            setSelectedTemplate(null);
            setSelectedWorkout(undefined);
          }}
          openForm={openForm}
        >
          <LogNewWorkoutForm
            formik={formik}
            createIsPending = {logNewWorkoutIsPending || createWorkoutFromTemplateIsPending}
            updateIsPending = {updateWorkoutIsPending}
            type="workout"
            update={selectedWorkout ? "YES" : "NO"}
            refetch={refetch}
            selectedTemplate={selectedTemplate}
          />
        </PrimaryDailog>
      </LayoutContentWrapper>

      <LayoutGridWrapper Cols={2}>
        <div className="space-y-8">
          {/* Past Workout History */}
          <PrimaryCard
            title="Workout History"
            des="View and edit your past workouts"
          >
            <Accordion type="single" collapsible className="w-full">
              {data?.data?.map((workout: IWorkoutData | undefined) => (
                <AccordionItem
                  key={workout?._id}
                  value={`workout-${workout?._id}`}
                >
                  <AccordionTrigger className="text-left">
                    <div className="flex justify-between items-center w-full">
                      <span>
                        {format(
                          new Date(workout?.date as string),
                          "MMMM d, yyyy"
                        )}
                      </span>
                      <Badge variant="secondary">
                        {workout?.exercises.length} exercises
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {workout?.exercises.map((exercise, index) => (
                      <div key={index} className="mb-2">
                        <h4 className="font-semibold">{exercise.name}</h4>
                        <p className="text-sm text-gray-400">
                          {exercise.sets.map((set, setIndex) => (
                            <span key={setIndex}>
                              {set.weight}kg x {set.reps}
                              {setIndex < exercise.sets.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedWorkout(workout);
                          setOpenForm(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => mutate(workout?._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </PrimaryCard>
        </div>

        <div className="space-y-8">
          {/* Quick Workout Stats */}
          <PrimaryCard title="Quick Stats">
          {workoutStats?.map((workout) => {
            return (
              <RenderWorkoutStatsElement
              label={workout.title}
              value={workout.value}
            />
            )
          })}
          </PrimaryCard>

          {/* Quick Actions */}
          <PrimaryCard title="Quick Actions" cardContentClassName="space-y-4">
            <Button
              className="w-full bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
              onClick={() => repeatLastWorkoutMutate()}
            >
              <Repeat className="mr-2 h-4 w-4" />{" "}
              {repeatLastWorkoutIsPending
                ? "Repeating..."
                : "Repeat Last Workout"}
            </Button>
            <PrimaryDailog
              btn={() => (
                <Button
                  className="w-full bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
                  onClick={() => setOpenImportWorkout(true)}
                >
                  <ClipboardList className="mr-2 h-4 w-4" /> Import from
                  Templates
                </Button>
              )}
              dialogClassName="bg-[#2A2A2A]"
              openForm={openImportWorkout}
              onClick={() => setOpenImportWorkout(false)}
              title="Import Workout Template"
              description="Choose a template to start your workout with predefined exercises and sets."
            >
              <WorkoutFromTemplate
                setSelectedTemplate={setSelectedTemplate}
                setOpenForm={setOpenForm}
              />
            </PrimaryDailog>
          </PrimaryCard>
        </div>
      </LayoutGridWrapper>
    </UiLayout>
  );
};

export default Workout;