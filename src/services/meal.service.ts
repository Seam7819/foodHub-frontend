import axiosInstance from "@/src/lib/axiosInstance";

export const getMeals = async (
  params?: Record<string, any>
) => {
  const res = await axiosInstance.get(
    "/meals",
    {
      params,
    }
  );

  return res.data;
};

export const getSingleMeal = async (id: string) => {
  const res = await axiosInstance.get(
    `/meals/${id}`
  );

  return res.data;
};

export const createMeal = async (payload: any) => {
  const res = await axiosInstance.post(
    "/meals",
    payload
  );

  return res.data;
};

export const updateMeal = async (
  id: string,
  payload: any
) => {
  const res = await axiosInstance.patch(
    `/meals/${id}`,
    payload
  );

  return res.data;
};

export const deleteMeal = async (id: string) => {
  const res = await axiosInstance.delete(
    `/meals/${id}`
  );

  return res.data;
};