import { IUserSetting } from "@/Api/interfaces/Project";
import { IRES } from "@/Api/interfaces/Response";
import {
  resetUserSetting,
  saveUserSetting,
} from "@/Api/userSetting";
import { useMutation} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FormikValues, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  workoutReminder: Yup.object().shape({
    workoutReminder: Yup.boolean(),
    reminderTime: Yup.string().when("workoutReminder", {
      is: true,
      then: (schema) => schema.required("Reminder time is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  progessAiAlerts: Yup.object().shape({
    plateauAlerts: Yup.boolean(),
    goalTrackingAlerts: Yup.boolean(),
  }),
  emailNotifications: Yup.object().shape({
    receiveWeeklyProgressReports: Yup.boolean(),
    receiveSpecialTrainingTipsUpdates: Yup.boolean(),
  }),
});

const useUserSettings = ({data, refetch} : {data ?: IUserSetting  | undefined, refetch : () => void}) => {
  const { mutate: saveUserSettingMutate, isPending: isSavePending } =
    useMutation({
      mutationKey: ["saveuserSetting"],
      mutationFn: saveUserSetting,
      onSuccess: (data) => {
        enqueueSnackbar(data.message, { variant: "success" });
        refetch();
      },
      onError: (error: AxiosError<IRES>) => {
        enqueueSnackbar(error.response?.data.message, { variant: "error" });
      },
    });

  const { mutate: resetUserSettingMutate, isPending: isResetPending } =
    useMutation({
      mutationKey: ["resetuserSetting"],
      mutationFn: resetUserSetting,
      onSuccess: (data) => {
        enqueueSnackbar(data?.message, { variant: "success" });
        refetch()
      },
      onError: (error: AxiosError<IRES>) => {
        enqueueSnackbar(error.response?.data.message, { variant: "error" });
      },
    });

    const initialValues = {
      workoutReminder: {
        workoutReminder: false || data?.workoutReminder.workoutReminder,
        reminderTime: data?.workoutReminder.reminderTime,
      },
      progessAiAlerts: {
        plateauAlerts: false || data?.progessAiAlerts.plateauAlerts,
        goalTrackingAlerts: false || data?.progessAiAlerts.goalTrackingAlerts,
      },
      emailNotifications: {
        receiveWeeklyProgressReports: false || data?.emailNotifications.receiveWeeklyProgressReports,
        receiveSpecialTrainingTipsUpdates: false || data?.emailNotifications.receiveSpecialTrainingTipsUpdates,
      },
    };

    const submissionValues = (values : FormikValues) => {
      return {
        workoutReminder : {
          workoutReminder : values.workoutReminder.workoutReminder || false,
          reminderTime : values.workoutReminder.reminderTime || "8:00 AM"
        },
        progessAiAlerts : {
          plateauAlerts : values.progessAiAlerts.plateauAlerts || false,
          goalTrackingAlerts : values.progessAiAlerts.goalTrackingAlerts || false
        },
        emailNotifications : {
          receiveWeeklyProgressReports : values.emailNotifications.receiveWeeklyProgressReports || false,
          receiveSpecialTrainingTipsUpdates : values.emailNotifications.receiveSpecialTrainingTipsUpdates || false
        },
      }
    }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const newValues = submissionValues(values);
      console.log(newValues);
      
      saveUserSettingMutate(newValues)
    },
  });
  return {
    formik,
    resetUserSettingMutate,
    isResetPending,
    isSavePending,
    data
  };
};

export default useUserSettings;
