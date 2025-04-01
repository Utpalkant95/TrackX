import { Logout } from "@/Api/auth";
import { IRES } from "@/Api/interfaces/Response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";

const useLogout = () => {
  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: Logout,
    onSuccess: (data: IRES) => {
      enqueueSnackbar(data.message, { variant: "success" });
      window.location.reload();
    },
    onError: (error: AxiosError<IRES>) =>
      enqueueSnackbar(error.response?.data.message, { variant: "error" }),
  });
  return {
    mutate,
  };
};

export default useLogout;