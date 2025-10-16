import { axiosInstance } from "@/axios.config";

interface UpdateUserPasswordResponse {
  success: boolean;
  message?: string;
}
export const updateUsegrPasswordApi = async (newPassword: string) => {
  try {
    const response = await axiosInstance.put(`/private/me`, {
     newPassword,
    });
    return response.data as UpdateUserPasswordResponse;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
