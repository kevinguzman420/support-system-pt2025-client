import { axiosInstance } from "@/axios.config";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const logoutApi = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data as LogoutResponse;
};
