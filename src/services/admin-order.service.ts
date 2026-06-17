import axiosInstance from "@/src/lib/axiosInstance";

export const getAllOrders = async () => {
  const res = await axiosInstance.get("/order");
  return res.data;
};

export const updateOrderStatus = async (
  id: string,
  status: string
) => {
  const res = await axiosInstance.patch(
    `/order/${id}`,
    { status }
  );

  return res.data;
};
