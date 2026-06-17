import axiosInstance from "@/src/lib/axiosInstance";

export const getCategories = async () => {
  const res = await axiosInstance.get(
    "/categories"
  );

  return res.data;
};

export const createCategory = async (
  payload: { name: string }
) => {
  const res = await axiosInstance.post(
    "/categories",
    payload
  );

  return res.data;
};

export const updateCategory = async (
  id: string,
  payload: { name: string }
) => {
  const res = await axiosInstance.patch(
    `/categories/${id}`,
    payload
  );

  return res.data;
};

export const deleteCategory = async (
  id: string
) => {
  const res = await axiosInstance.delete(
    `/categories/${id}`
  );

  return res.data;
};