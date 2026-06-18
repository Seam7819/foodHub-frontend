"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import RoleGuard from "@/src/components/shared/RoleGuard";
import { useAuth } from "@/src/context/AuthContext";
import { getMyOrders, cancelOrder } from "@/src/services/order.service";
import { toast } from "sonner";
import Loader from "@/src/components/shared/Loader";

type Order = {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveryAddress?: string;
  items?: Array<{ mealName?: string; quantity?: number; price?: number }>;
};

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "PLACED":
      return "bg-blue-100 text-blue-800";
    case "PREPARING":
      return "bg-yellow-100 text-yellow-800";
    case "READY":
      return "bg-purple-100 text-purple-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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
            <p className="text-gray-600">
              Manage your account details and track your orders.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <p className="text-sm text-gray-600">Name</p>
                <p className="mt-1 text-lg font-semibold">{user?.name || "-"}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="mt-1 text-lg font-semibold break-all text-sm">
                  {user?.email || "-"}
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                <p className="text-sm text-gray-600">Role</p>
                <p className="mt-1 text-lg font-semibold">{user?.role || "-"}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="mt-1 text-lg font-semibold">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Order Tracking</h2>
              {loading && <span className="text-sm text-gray-500">Loading...</span>}
            </div>

            {loading && !orders.length ? (
              <div className="mt-6">
                <Loader />
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-gray-600 mb-4">No orders found yet.</p>
                <Link
                  href="/meals"
                  className="inline-block rounded-md bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
                >
                  Start Ordering
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-fit">
                        <div className="flex items-center gap-3 mb-3">
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-mono text-sm font-medium">
                            {order.id.substring(0, 8)}...
                          </p>
                        </div>
                        <div className="grid gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Placed on:</span>{" "}
                            <span className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString()} at{" "}
                              {new Date(order.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Amount:</span>{" "}
                            <span className="font-bold text-orange-600">
                              ৳ {order.totalPrice}
                            </span>
                          </div>
                          {order.deliveryAddress && (
                            <div>
                              <span className="text-gray-500">Delivery to:</span>{" "}
                              <span className="font-medium">
                                {order.deliveryAddress.substring(0, 40)}
                                {order.deliveryAddress.length > 40 ? "..." : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id
                            )
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedOrder === order.id ? "▼" : "▶"}
                        </button>
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        {order.items && order.items.length > 0 ? (
                          <div>
                            <p className="font-semibold text-sm mb-2">Items:</p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-sm text-gray-600"
                                >
                                  <span>
                                    {item.mealName} x {item.quantity || 1}
                                  </span>
                                  <span>৳ {item.price || 0}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No items details</p>
                        )}

                        {order.status === "DELIVERED" && (
                          <Link
                            href="/meals"
                            className="inline-block mt-3 rounded-md bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600"
                          >
                            Leave Review
                          </Link>
                        )}
                        {order.status === "PLACED" && (
                          <button
                            onClick={async () => {
                              if (!confirm("Cancel this order?")) return;
                              try {
                                await cancelOrder(order.id);
                                toast?.success?.("Order cancelled");
                                // reload orders
                                const data = await getMyOrders();
                                setOrders(data.data || []);
                              } catch (err) {
                                console.error(err);
                                toast?.error?.("Failed to cancel order");
                              }
                            }}
                            className="ml-3 inline-block mt-3 rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    )}
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