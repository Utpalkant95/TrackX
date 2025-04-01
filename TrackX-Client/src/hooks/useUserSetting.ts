import { getUserSetting } from "@/Api/userSetting";
import { useQuery } from "@tanstack/react-query";

const useUserSetting = () => {
  const { data, refetch } = useQuery({
    queryKey: ["userSettings"],
    queryFn: getUserSetting,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return {
    data,
    refetch
  };
};

export default useUserSetting;