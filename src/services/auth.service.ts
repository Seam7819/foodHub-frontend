import axiosInstance from "../lib/axiosInstance";

export const registerUser = async (
  payload: any
) => {
  const { data } =
    await axiosInstance.post(
      "/auth/register",
      payload
    );

  return data;
};

export const loginUser = async (
  payload: any
) => {
  const { data } =
    await axiosInstance.post(
      "/auth/login",
      payload
    );

  return data;
};

export const getMyProfile =
  async () => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    const { data } =
      await axiosInstance.get(
        "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return data;
  };