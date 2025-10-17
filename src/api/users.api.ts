import { axiosInstance } from "@/axios.config";
import type { IUser } from "@/types";

// Admin API de usuarios:
interface GetAllUsersResponse {
  users: IUser[];
  success: boolean;
  message: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "SUPPORT" | "CLIENT";
}

interface CreateUserResponse {
  user: IUser;
  success: boolean;
  message: string;
}

export const getAllUsersApi = async () => {
  try {
    const response = await axiosInstance.get("/private/admin/users");
    return response.data as GetAllUsersResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUserApi = async (data: CreateUserData) => {
  try {
    const response = await axiosInstance.post("/private/admin/users", data);
    return response.data as CreateUserResponse;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al crear usuario",
      user: null,
    } as any;
  }
};

interface UpdateUserData {
  name?: string;
  password?: string;
  role?: "ADMIN" | "SUPPORT" | "CLIENT";
  active?: boolean;
}

interface UpdateUserResponse {
  user: IUser;
  success: boolean;
  message: string;
}

export const updateUserApi = async (userId: string, data: UpdateUserData) => {
  try {
    const response = await axiosInstance.patch(`/private/admin/users/${userId}`, data);
    return response.data as UpdateUserResponse;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar usuario",
      user: null,
    } as any;
  }
};
