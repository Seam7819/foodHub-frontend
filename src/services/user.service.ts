import axiosInstance from "@/src/lib/axiosInstance";

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await axiosInstance.get(`/users/${id}`);
  return res.data;
};

export const updateUserStatus = async (
  id: string,
  data: { status: string }
) => {
  const res = await axiosInstance.patch(`/users/${id}`, data);
  return res.data;
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
