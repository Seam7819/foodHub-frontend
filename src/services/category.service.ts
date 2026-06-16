import axiosInstance from "../lib/axiosInstance";

export const getCategories =
  async () => {
    const { data } =
      await axiosInstance.get(
        "/categories"
      );

    return data;
  };