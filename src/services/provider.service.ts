import axiosInstance from "../lib/axiosInstance";

export const getProviders =
  async () => {
    const { data } =
      await axiosInstance.get(
        "/providers"
      );

    return data;
  };