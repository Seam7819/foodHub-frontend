import axios from "axios";
import axiosInstance from "@/src/lib/axiosInstance";

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await axiosInstance.get(`/users/${id}`);
  return res.data;
};

const updateUserStatusByIdStatus = async (
  id: string,
  data: { status: string }
) => {
  const res = await axiosInstance.patch(`/users/${id}/status`, data);
  return res.data;
};

const updateUserStatusByAdminIdStatus = async (
  id: string,
  data: { status: string }
) => {
  const res = await axiosInstance.patch(`/admin/users/${id}/status`, data);
  return res.data;
};

const updateUserStatusById = async (
  id: string,
  data: { status: string }
) => {
  const res = await axiosInstance.patch(`/users/${id}`, data);
  return res.data;
};

const updateUserStatusByBody = async (
  id: string,
  data: { status: string }
) => {
  const res = await axiosInstance.patch("/users", { id, ...data });
  return res.data;
};

export const updateUserStatus = async (
  id: string,
  data: { status: string }
) => {
  const updateStrategies = [
    updateUserStatusByIdStatus,
    updateUserStatusByAdminIdStatus,
    updateUserStatusById,
    updateUserStatusByBody,
  ];

  let lastError: unknown = null;

  for (const updateFn of updateStrategies) {
    try {
      return await updateFn(id, data);
    } catch (error: unknown) {
      lastError = error;

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 404
      ) {
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

export const suspendUser = async (id: string) => {
  return updateUserStatus(id, { status: "SUSPENDED" });
};

export const activateUser = async (id: string) => {
  return updateUserStatus(id, { status: "ACTIVE" });
};

export const deleteUser = async (id: string) => {
  const res = await axiosInstance.delete(`/users/${id}`);
  return res.data;
};
