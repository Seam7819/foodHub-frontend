import axiosInstance from "../lib/axiosInstance";

export const loginUser = async (
  payload: {
    email: string;
    password: string;
  }
) => {
  const response =
    await axiosInstance.post(
      "/auth/login",
      payload
    );

  return response.data.data;
};

export const registerUser =
  async (payload: any) => {
    const response =
      await axiosInstance.post(
        "/auth/register",
        payload
      );

    return response.data;
  };

export const getMyProfile =
  async () => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    const response =
      await axiosInstance.get(
        "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };