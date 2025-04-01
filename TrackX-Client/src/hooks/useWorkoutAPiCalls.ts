import { IRES } from "@/Api/interfaces/Response";
import { deleteWorkout, getWorkout, getWorkoutsStats, repeatLastWorkout } from "@/Api/workout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";

const useWorkoutAPiCalls = () => {
  const { data, refetch } = useQuery({
    queryKey: ["workouts"],
    queryFn:() =>getWorkout(26),
  });

  const { data: workoutStats } = useQuery({
    queryKey: ["workouts-stats"],
    queryFn: getWorkoutsStats,
  });

  const { mutate } = useMutation({
    mutationKey: ["delete workout"],
    mutationFn: deleteWorkout,
    onSuccess: (data: IRES) => {
      refetch();
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.response?.data.message, { variant: "error" });
    },
  });

  const {
    mutate: repeatLastWorkoutMutate,
    isPending: repeatLastWorkoutIsPending,
  } = useMutation({
    mutationKey: ["repeat workout"],
    mutationFn: repeatLastWorkout,
    onSuccess: (data: IRES) => {
      refetch();
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.response?.data.message, { variant: "error" });
    },
  });
  return {
    data,
    mutate,
    repeatLastWorkoutMutate,
    repeatLastWorkoutIsPending,
    refetch,
    workoutStats,
  };
};

export default useWorkoutAPiCalls;
