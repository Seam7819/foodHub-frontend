import axiosInstance from "@/src/lib/axiosInstance";

export const addToCart = async (payload: {
  mealId: string;
  quantity: number;
}) => {
  const res = await axiosInstance.post("/cart", payload);
  return res.data;
};

export const clearServerCart = async () => {
  const res = await axiosInstance.delete("/cart/clear");
  return res.data;
};

export const getMyCart = async () => {
  const res = await axiosInstance.get("/cart");
  return res.data;
};
