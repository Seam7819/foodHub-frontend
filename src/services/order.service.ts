import axiosInstance from "@/src/lib/axiosInstance";

export const createOrder = async (payload: any) => {
  const res = await axiosInstance.post("/orders", payload);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await axiosInstance.get("/orders");
  return res.data;
};

export const getOrders = async () => {
  const res = await axiosInstance.get("/orders");
  return res.data;
};
