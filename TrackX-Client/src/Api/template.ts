import axios from "axios";
import { IRES, ITemplateData } from "./interfaces/Response";
import { ITemplate } from "./interfaces/Project";

const API_BASE_URL = "https://trackx-backend.onrender.com/api/v1"
export const getTemplates = async () => {
  const response = await axios.get(`${API_BASE_URL}/template/get-templates`, {
    withCredentials: true,
  });
  return response.data.data as ITemplateData[];
};

export const createTemplate = async (data: ITemplate) => {
  const response = await axios.post(
    `${API_BASE_URL}/template/create-template`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const deleteTemplate = async (id: string | undefined) => {
  const response = await axios.delete(
    `${API_BASE_URL}/template/delete-template/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const getTemplateById = async (id: string | null) => {
  const response = await axios.get(
    `${API_BASE_URL}/template/get-template/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const updateTemplate = async ({
  data,
  id,
}: {
  data: ITemplate;
  id: string;
}) => {
  const response = await axios.put(
    `${API_BASE_URL}/template/update-template/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data as IRES;
};

export const createTemplateByWorkout = async (data: {
  name: string;
  workoutId: string | undefined;
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/template/create-template-by-workout`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data as IRES;
};
