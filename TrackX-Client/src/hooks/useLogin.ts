import { Login } from "@/Api/auth";
import { IRES } from "@/Api/interfaces/Response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
const useLogin = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: Login,
    onSuccess: (data: IRES) => {
      formik.resetForm();
      enqueueSnackbar(data.message, { variant: "success" });
      window.location.reload();
      navigate("/");
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.response?.data.message, {
        variant: "error",
      });
    },
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      mutate({
        email: values.email,
        password: values.password,
      });
    },
  });
  return {
    formik,
    isPending,
  };
};

export default useLogin;