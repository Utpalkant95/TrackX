import { getWorkout } from "@/Api/workout";
import { useQuery } from "@tanstack/react-query";

const useRecentWorkout = () => {
  const { data: workouts } = useQuery({
    queryKey: ["get-recent-workouts"],
    queryFn: () => getWorkout(7),
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return {
    workouts,
  };
};

export default useRecentWorkout;
