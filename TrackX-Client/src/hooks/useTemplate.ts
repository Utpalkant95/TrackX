import { ITemplate } from "@/Api/interfaces/Project";
import { IRES, ITemplateData } from "@/Api/interfaces/Response";
import { createTemplate, updateTemplate } from "@/Api/template";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FormikProps, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { Dispatch, SetStateAction, useEffect } from "react";
import * as Yup from "yup";

const initialValues: ITemplate = {
  name: "",
  exercises: [
    {
      name: "",
      bodyPart: "",
      equipment: "",
      sets: [
        {
          weight: 0,
          reps: 1,
          difficulty: "Easy",
        },
      ],
    },
  ],
};

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Template name is required"),
  exercises: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().trim().required("Exercise name is required"),
        sets: Yup.array()
          .of(
            Yup.object().shape({
              weight: Yup.number()
                .min(0, "Weight cannot be negative")
                .required("Weight is required"),
              reps: Yup.number()
                .min(1, "Reps must be at least 1")
                .required("Reps are required"),
              difficulty: Yup.string()
                .oneOf(["Easy", "Medium", "Hard"], "Invalid difficulty")
                .required("Difficulty is required"),
            })
          )
          .min(1, "At least one set is required"),
      })
    )
    .min(1, "At least one exercise is required"),
});

interface IUseTemplate {
  refetch: () => void;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
  selectedTemplate: ITemplateData | undefined | null;
}

const useTemplate = ({
  refetch,
  setOpenForm,
  selectedTemplate,
}: IUseTemplate) => {
  const { mutate: createTemplateMutation, isPending: createTemplateIsPending } =
    useMutation({
      mutationKey: ["createTemplate"],
      mutationFn: createTemplate,
      onSuccess: (data) => {
        enqueueSnackbar(data.message, { variant: "success" });
        formik.resetForm();
        setOpenForm(false);
        refetch();
      },
      onError: (error: AxiosError<IRES>) => {
        enqueueSnackbar(error.response?.data.message, { variant: "error" });
      },
    });

  const { mutate: updateTemplateMutation, isPending: updateTemplateIsPending } =
    useMutation({
      mutationKey: ["updateTemplate"],
      mutationFn: updateTemplate,
      onSuccess: (data) => {
        enqueueSnackbar(data.message, { variant: "success" });
        formik.resetForm();
        setOpenForm(false);
        refetch();
      },
      onError: (error: AxiosError<IRES>) => {
        enqueueSnackbar(error.response?.data.message, { variant: "error" });
      },
    });
  const formik: FormikProps<ITemplate> = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (selectedTemplate) {
        updateTemplateMutation({ data: values, id: selectedTemplate._id });
      } else{
        createTemplateMutation(values);
      }
    },
  });

  useEffect(() => {
    if (selectedTemplate) {
      formik.setValues({
        name: selectedTemplate.name,
        exercises: selectedTemplate.exercises,
      });
    } else {
      formik.setValues(initialValues);
    }
  }, [selectedTemplate]);
  return {
    formik,
    createTemplateIsPending,
    updateTemplateIsPending,
  };
};

export default useTemplate;
