"use client";

import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "@/src/services/admin-order.service";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminRoute from "@/src/components/auth/AdminRoute";

type Order = {
  id: string;
  totalPrice: number;
  status: string;
  user?: {
    name?: string;
  };
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (
    id: string,
    status: string
  ) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <ProtectedRoute>
      <AdminRoute>
        <div className="max-w-7xl mx-auto py-10 px-5">
          <h1 className="text-3xl font-bold mb-6">
            Orders
          </h1>

          {loading ? (
            <div>Loading orders...</div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {order.user?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          ৳ {order.totalPrice}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <select
                            value={order.status}
                            className="rounded border px-3 py-2"
                            onChange={(e) =>
                              changeStatus(order.id, e.target.value)
                            }
                          >
                            <option value="PLACED">PLACED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="READY">READY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminRoute>
    </ProtectedRoute>
  );
}
