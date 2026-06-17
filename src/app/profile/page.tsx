"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import RoleGuard from "@/src/components/shared/RoleGuard";
import { useAuth } from "@/src/context/AuthContext";
import { getMyOrders } from "@/src/services/order.service";

type Order = {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await getMyOrders();
        setOrders(data.data || []);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <ProtectedRoute>
      <RoleGuard role="CUSTOMER">
        <div className="max-w-7xl mx-auto py-10 px-5 space-y-8">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account details and review past orders.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Name</p>
                <p className="mt-1 text-lg font-semibold">{user?.name || "-"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 text-lg font-semibold">{user?.email || "-"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Role</p>
                <p className="mt-1 text-lg font-semibold">{user?.role || "-"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Orders</p>
                <p className="mt-1 text-lg font-semibold">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Order History</h2>
              {loading && <span className="text-sm text-gray-500">Loading...</span>}
            </div>

            {orders.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
                No orders found yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-gray-200 p-5">
                    <div className="grid gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Placed</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{order.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">৳ {order.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}