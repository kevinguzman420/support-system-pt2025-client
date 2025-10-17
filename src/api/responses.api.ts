import { axiosInstance } from "@/axios.config";

interface CreateResponseData {
  requestId: string;
  content: string;
}

interface ResponseData {
  id: string;
  content: string;
  createdAt: string;
  userId?: string;
  requestId: string;
}

interface CreateResponseResponse {
  response: ResponseData;
  success: boolean;
  message: string;
}

export const createResponseApi = async (data: CreateResponseData) => {
  try {
    const response = await axiosInstance.post("/private/responses", data);
    return response.data as CreateResponseResponse;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al crear la respuesta",
      response: null,
    } as any;
  }
};
