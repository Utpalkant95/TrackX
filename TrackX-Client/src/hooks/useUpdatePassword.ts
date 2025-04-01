import { UpdatePassword } from "@/Api/auth";
import { IRES } from "@/Api/interfaces/Response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import * as Yup from "yup";

const initialValues = {
  oldPassword: "",
  newPassword: "",
};

const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string().required("New Password is required"),
});

const useUpdatePassword = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: UpdatePassword,
    onSuccess: (data: IRES) => {
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.response?.data.message, { variant: "error" });
    },
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });
  return {
    formik,
    mutate,
    isPending,
  };
};

export default useUpdatePassword;
