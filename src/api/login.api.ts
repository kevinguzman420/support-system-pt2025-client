import { axiosInstance } from "@/axios.config";

export async function loginApi(email: string, password: string) {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}
