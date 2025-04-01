import { getUserProfile } from "@/Api/User";
import { useQuery } from "@tanstack/react-query";

const useUserProfile = () => {
  const { data, refetch } = useQuery({
    queryKey: ["get-user-profile"],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return {
    data,
    refetch,
  };
};

export default useUserProfile;
