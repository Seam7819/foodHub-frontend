import axiosInstance from "@/src/lib/axiosInstance";

export const getMeals = async (
  params?: Record<string, any>
) => {
  const res =
    await axiosInstance.get(
      "/meals",
      {
        params,
      }
    );

  return res.data;
};

export const getSingleMeal =
  async (id: string) => {
    const res =
      await axiosInstance.get(
        `/meals/${id}`
      );

    return res.data;
  };