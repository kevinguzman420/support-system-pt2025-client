import { axiosInstance } from "@/axios.config";
import type { TRequestForm } from "@/components/client/NuevaSolicitud";
import type { IRequests } from "@/types";

interface RequestCreateResponse {
  success: boolean;
  message?: string;
}

export const requestCreateApi = async (data: TRequestForm) => {
  const response = await axiosInstance.post("/private/requests", data);
  return response.data as RequestCreateResponse;
};

interface RequestGetResponse {
  success: boolean;
  message?: string;
  requests: IRequests[];
}
export const requestGetApi = async () => {
  const response = await axiosInstance.get("/private/requests");
  return response.data as RequestGetResponse;
};

interface RequestGetOneResponse {
  success: boolean;
  message?: string;
  request: IRequests | null;
}
export const requestGetOneApi = async (id: string) => {
  const response = await axiosInstance.get(`/private/requests/${id}`);
  return response.data as RequestGetOneResponse;
};

// Support queries
interface RequestGetResponse {
  success: boolean;
  message?: string;
  requests: IRequests[];
}
export const requestGetAllApi = async () => {
  const response = await axiosInstance.get("/private/requests/all");
  return response.data as RequestGetResponse;
};
