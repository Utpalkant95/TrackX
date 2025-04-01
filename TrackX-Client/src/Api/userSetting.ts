import axios from "axios";
import { IRES } from "./interfaces/Response";
import { IUserSetting } from "./interfaces/Project";

const API_BASE_URL ="https://trackx-backend.onrender.com/api/v1"

export const saveUserSetting = async (data: IUserSetting) => {
  const response = await axios.put(
    `${API_BASE_URL}/userSetting/save-user-setting`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const resetUserSetting = async () => {
  const response = await axios.delete(
    `${API_BASE_URL}/userSetting/reset-user-setting`,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const getUserSetting = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/userSetting/get-user-setting`,
    {
      withCredentials: true,
    }
  );
  return response.data.data as IUserSetting | undefined;
};

export const updateWorkoutReminder = async (workoutReminder: boolean) => {
  const response = await axios.put(
    `${API_BASE_URL}/userSetting/workout-reminder/${workoutReminder}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data as IRES;
};
