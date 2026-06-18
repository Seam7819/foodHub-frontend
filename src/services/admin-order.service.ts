import axiosInstance from "@/src/lib/axiosInstance";

export const getAllOrders = async () => {
  const res = await axiosInstance.get("/admin/orders");
  return res.data;
};

// Note: Providers update status via /provider/orders/:id
// Admins do not have a dedicated update endpoint in the API.
export const updateOrderStatus = async (
  id: string,
  status: string
) => {
  const res = await axiosInstance.patch(
    `/provider/orders/${id}`,
    { status }
  );

  return res.data;
};
