"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import RoleGuard from "@/src/components/shared/RoleGuard";
import { useAuth } from "@/src/context/AuthContext";
import { getProviderOrders, updateProviderOrderStatus } from "@/src/services/provider-order.service";
import Loader from "@/src/components/shared/Loader";
import { toast } from "sonner";

type Order = {
  id: string;
  totalPrice: number;
  status: string;
  providerId: string;
  user?: {
    name?: string;
    email?: string;
  };
  deliveryAddress?: string;
  createdAt?: string;
};

export default function ProviderOrdersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["provider-orders", user?.id],
    queryFn: () => getProviderOrders(),
    enabled: !!user?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateProviderOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders", user?.id] });
      toast.success("Order status updated");
    },
    onError: () => {
      toast.error("Failed to update order status");
    },
  });

  const providerOrders = data?.data || [];

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  return (
    <ProtectedRoute>
      <RoleGuard role="PROVIDER">
        <div className="max-w-7xl mx-auto py-10 px-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold">Order Management</h1>
              <p className="text-gray-600 mt-2">
                Manage and update delivery status for your orders.
              </p>
            </div>
            <Link href="/provider/dashboard" className="text-orange-500 hover:underline">
              Back to Dashboard
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {isLoading ? (
              <Loader />
            ) : isError ? (
              <p className="text-gray-500">Failed to load orders.</p>
            ) : providerOrders.length === 0 ? (
              <p className="text-gray-500">No orders assigned yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">Customer</th>
                      <th className="text-left p-3 font-semibold">Email</th>
                      <th className="text-left p-3 font-semibold">Delivery Address</th>
                      <th className="text-left p-3 font-semibold">Total</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerOrders.map((order: Order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{order.user?.name || "N/A"}</td>
                        <td className="p-3">{order.user?.email || "N/A"}</td>
                        <td className="p-3 text-gray-600">
                          {order.deliveryAddress || "N/A"}
                        </td>
                        <td className="p-3 font-semibold">৳ {order.totalPrice}</td>
                        <td className="p-3">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            disabled={updateStatusMutation.isPending}
                            className="rounded border px-3 py-2 text-sm bg-white hover:border-orange-500 focus:outline-none focus:border-orange-500"
                          >
                            <option value="PLACED">PLACED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="READY">READY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="p-3 text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
