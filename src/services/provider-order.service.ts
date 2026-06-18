import axiosInstance from "@/src/lib/axiosInstance";

export const getProviderOrders = async () => {
  const res = await axiosInstance.get("/provider/orders");
  return res.data;
};

export const updateProviderOrderStatus = async (id: string, status: string) => {
  const res = await axiosInstance.patch(`/provider/orders/${id}`, { status });
  return res.data;
};
