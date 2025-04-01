import axios from "axios";
import {
  IAIInsight,
  IPersonalBests,
  IProgressGraph,
  IRES,
  IWeeklyProgress,
} from "./interfaces/Response";

const API_BASE_URL = "https://trackx-backend.onrender.com/api/v1"

export const getPersonalBest = async () => {
  const response = await axios.get(`${API_BASE_URL}/progress/personal-best`, {
    withCredentials: true,
  });
  return response.data.data as IPersonalBests[];
};

export const getAiInsights = async () => {
  const response = await axios.get(`${API_BASE_URL}/progress/ai-insights`, {
    withCredentials: true,
  });
  return response.data.data as IAIInsight[];
};

export const getWeeklyProgress = async () => {
  const response = await axios.get(`${API_BASE_URL}/progress/weekly-progress`, {
    withCredentials: true,
  });
  return response.data as IWeeklyProgress;
};

export const getProgressGraph = async ({
  exerciseName,
  dateRange = `7`,
}: {
  exerciseName: string;
  dateRange?: string;
}) => {
  const response = await axios.get(
    `${API_BASE_URL}/progress/progress-graph/${exerciseName}/${dateRange}`,
    { withCredentials: true }
  );
  return response.data.data as IProgressGraph[];
};

export const getProgressReport = async () => {
  const response = await axios.get(`${API_BASE_URL}/progress/progress-report`, {
    withCredentials: true,
    responseType: `blob`,
  });

  try {
    // Create a download link dynamically
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "progress-report.pdf"; // Change filename as needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the report:", error);
  }
  return response.data as IRES;
};

export const getExerciseList = async () => {
  const response = await axios.get(`${API_BASE_URL}/progress/exercise-list`, {
    withCredentials: true,
  });
  return response.data.data as string[];
};
