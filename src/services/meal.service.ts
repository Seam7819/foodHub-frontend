import axiosInstance from "../lib/axiosInstance";

export const getMeals =
  async () => {
    const { data } =
      await axiosInstance.get(
        "/meals"
      );

    return data;
  };