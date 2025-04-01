import { IRES } from "@/Api/interfaces/Response";
import { createTemplateByWorkout } from "@/Api/template";
import { Button } from "@/components/ui/button";
import { useRecentWorkout } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { lazy, useState } from "react";

const PrimaryCard = lazy(() => import("@/components/PrimaryCard/PrimaryCard"));
const ScrollArea = lazy(() =>
  import("@/components/ui/scroll-area").then((module) => ({
    default: module.ScrollArea,
  }))
);
const RecentWorkoutAtom = lazy(() => import("@/atmos/RecentWorkoutAtom"));
const PrimaryAlertDialog = lazy(
  () => import("@/components/PrimaryAlertDialog/PrimaryAlertDialog")
);
const CreateTemplateFromWorkout = lazy(
  () => import("@/Fragments/CreateTemplateFromWorkout")
);

interface IRecentWorkoutFrag {
  title: string;
  des?: string;
  flag?: boolean;
}
const RecentWorkoutFrag = ({ title, des, flag }: IRecentWorkoutFrag) => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<
    string | undefined
  >("");
  const [templateName, setTemplateName] = useState<string>("");
  const { workouts } = useRecentWorkout();

  const formData = {
    name: templateName,
    workoutId: selectedWorkoutId,
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-template-by-workout"],
    mutationFn: createTemplateByWorkout,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error: AxiosError<IRES>) =>
      enqueueSnackbar(error.response?.data.message, { variant: "error" }),
  });

  return (
    <PrimaryCard title={title} des={des}>
      <ScrollArea className="h-[300px] pr-4">
        {workouts?.data?.map((workout) => (
          <div className="relative">
            <PrimaryCard
              key={workout._id}
              title={format(new Date(workout.date), "MMMM d, yyyy")}
              cardClassName="mb-4 bg-[#2A2A2A] border-none"
              cardHeaderClassName="pb-2"
              cardTitleClassName="text-lg text-[#edfafa]"
            >
              {workout.exercises.map((exercise, index) => (
                <RecentWorkoutAtom exercise={exercise} key={index} />
              ))}
            </PrimaryCard>
            {flag && (
              <PrimaryAlertDialog
                trigger={() => (
                  <Button
                    className="absolute bottom-2 right-2"
                    variant="ghost"
                    onClick={() =>
                      setSelectedWorkoutId && setSelectedWorkoutId(workout._id)
                    }
                  >
                    Select
                  </Button>
                )}
                btnName={isPending ? "Creating..." : "Create Template"}
                onClick={() => mutate(formData)}
                disabled={isPending}
                title="Create Template"
                des="Are you sure you want to create a template from this workout?"
              >
                <CreateTemplateFromWorkout setTemplateName={setTemplateName} />
              </PrimaryAlertDialog>
            )}
          </div>
        ))}
      </ScrollArea>
    </PrimaryCard>
  );
};

export default RecentWorkoutFrag;
