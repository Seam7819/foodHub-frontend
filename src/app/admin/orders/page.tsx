"use client";

import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "@/src/services/admin-order.service";
import Sidebar from "@/src/components/dashboard/Sidebar";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminRoute from "@/src/components/auth/AdminRoute";
import { toast } from "sonner";

type Order = {
  id: string;
  totalPrice: number;
  status: string;
  user?: {
    name?: string;
    email?: string;
  };
  deliveryAddress?: string;
  createdAt?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data.data || []);
    } catch (error) {
      console.error("Failed to load orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      loadOrders();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <ProtectedRoute>
      <AdminRoute>
        <div className="max-w-7xl mx-auto py-10 px-5 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <Sidebar />
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Order Management</h1>

            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : (
                <div className="overflow-x-auto ">
                  <table className="w-full text-sm ">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-semibold">Customer</th>
                        <th className="text-left p-3 font-semibold">Email</th>
                        <th className="text-left p-3 font-semibold">Address</th>
                        <th className="text-left p-3 font-semibold">Total</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">
                              {order.user?.name || "Unknown"}
                            </td>
                            <td className="p-3">{order.user?.email || "N/A"}</td>
                            <td className="p-3">
                              {order.deliveryAddress || "N/A"}
                            </td>
                            <td className="p-3 font-semibold">৳ {order.totalPrice}</td>
                            <td className="p-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "DELIVERED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3 ">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminRoute>
    </ProtectedRoute>
  );
}
