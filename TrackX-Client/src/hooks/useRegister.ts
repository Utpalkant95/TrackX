import { Register } from "@/Api/auth";
import { IRES } from "@/Api/interfaces/Response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const useRegister = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: Register,
    onSuccess: (data: IRES) => {
      formik.resetForm();
      enqueueSnackbar(data.message, { variant: "success" });
      navigate("/auth/login");
    },
    onError: (error: AxiosError<IRES>) => {
      enqueueSnackbar(error.response?.data.message, { variant: "error", className : "" });
    },
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      mutate({
        email: values.email,
        name: values.name,
        password: values.password,
      });
    },
  });
  return {
    formik,
    isPending,
  };
};

export default useRegister;
