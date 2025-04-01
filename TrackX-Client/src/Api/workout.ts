import axios from "axios";
import {
  IRES,
  IWorkoutPerformance,
  IWorkoutResponse,
  IWorkoutStats,
} from "./interfaces/Response";
import { Workout } from "./interfaces/Project";

const API_BASE_URL = "https://trackx-backend.onrender.com/api/v1"

export const getWorkout = async (limit?: number | undefined) => {
  const response = await axios.get(
    `${API_BASE_URL}/workout/get-workouts/${limit}`,
    {
      withCredentials: true,
    }
  );
  return response.data as IWorkoutResponse;
};

export const getWorkoutsStats = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/workout/get-workouts-stats`,
    {
      withCredentials: true,
    }
  );
  return response.data.data as IWorkoutStats[];
};

export const logNewWorkout = async (data: Workout) => {
  const response = await axios.post(
    `${API_BASE_URL}/workout/create-workout`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const deleteWorkout = async (id: string | undefined) => {
  const response = await axios.delete(
    `${API_BASE_URL}/workout/delete-workout/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const repeatLastWorkout = async () => {
  const response = await axios.put(
    `${API_BASE_URL}/workout/repeat-last-workout`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const getWorkoutPerformance = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/workout/get-workout-performance`,
    {
      withCredentials: true,
    }
  );
  return response.data.data as IWorkoutPerformance[];
};

export const updateWorkout = async (data: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/workout/update-workout`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const createWorkoutFromTemplate = async (data: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/workout/create-workout-from-template`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};
