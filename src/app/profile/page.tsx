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
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      console.log("Loading orders for user:", user?.id);
      const data = await getMyOrders();
      console.log("Orders fetched:", data);
      console.log("Orders count:", data.data?.length);
      const loadedOrders = data.data || [];
      setOrders(loadedOrders);
      if (loadedOrders.length > 0) {
        console.log("Orders loaded successfully");
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Load orders on initial mount
  useEffect(() => {
    console.log("Profile page mounted, loading orders...");
    loadOrders();
  }, []);

  // Reload orders when coming from checkout (refresh parameter in URL)
  useEffect(() => {
    const refresh = new URLSearchParams(window.location.search).get("refresh");
    if (refresh === "true") {
      console.log("Refresh=true detected in URL, reloading orders...");
      loadOrders();
      // Clean up URL
      window.history.replaceState({}, "", "/profile");
    }
  }, []);

  return (
    <ProtectedRoute>
      <RoleGuard role="CUSTOMER">
        <div className="max-w-7xl mx-auto py-10 px-5 space-y-8 dark:bg-slate-900 min-h-screen">
          <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-white to-orange-50 p-8 shadow-md dark:from-slate-800 dark:to-slate-700 dark:border-orange-700">
            <h1 className="text-4xl font-bold mb-2 text-orange-900 dark:text-orange-300">My Profile</h1>
            <p className="text-orange-700 dark:text-orange-200 font-medium">
              Manage your account details and track your orders.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-md">
                <p className="text-sm text-blue-100">Name</p>
                <p className="mt-1 text-lg font-semibold text-white">{user?.name || "-"}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-4 shadow-md">
                <p className="text-sm text-green-100">Email</p>
                <p className="mt-1 text-lg font-semibold break-all text-sm text-white">
                  {user?.email || "-"}
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-md">
                <p className="text-sm text-purple-100">Role</p>
                <p className="mt-1 text-lg font-semibold text-white">{user?.role || "-"}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-4 shadow-md">
                <p className="text-sm text-orange-100">Total Orders</p>
                <p className="mt-1 text-lg font-semibold text-white">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-orange-200 bg-white p-8 shadow-md dark:bg-slate-800 dark:border-orange-700">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-2xl font-semibold text-orange-900 dark:text-orange-300">Order Tracking</h2>
              <button
                onClick={loadOrders}
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 disabled:opacity-50 transition"
              >
                {loading ? "Refreshing..." : "Refresh Orders"}
              </button>
            </div>

            {loading && !orders.length ? (
              <div className="mt-6">
                <Loader />
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-orange-300 bg-orange-50 p-8 text-center dark:border-orange-700 dark:bg-slate-700">
                <p className="text-orange-900 dark:text-orange-200 mb-4 font-medium">No orders found yet.</p>
                <Link
                  href="/products"
                  className="inline-block rounded-md bg-orange-500 px-6 py-2 text-white hover:bg-orange-600 font-semibold transition"
                >
                  Start Ordering
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4 text-slate-900 dark:text-white">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-orange-200 p-5 hover:shadow-lg transition bg-orange-50 dark:bg-slate-700 dark:border-orange-600"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-fit">
                        <div className="flex items-center gap-3 mb-3">
                          <p className="text-sm text-orange-700 dark:text-orange-200 font-medium">Order ID</p>
                          <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                            {order.id.substring(0, 8)}...
                          </p>
                        </div>
                        <div className="grid gap-2 text-sm">
                          <div>
                            <span className="text-orange-700 dark:text-orange-200 font-medium">Placed on:</span>{" "}
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                              {new Date(order.createdAt).toLocaleDateString()} at{" "}
                              {new Date(order.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-orange-700 dark:text-orange-200 font-medium">Total Amount:</span>{" "}
                            <span className="font-bold text-orange-600 dark:text-orange-400">
                              ৳ {order.totalPrice}
                            </span>
                          </div>
                          {order.deliveryAddress && (
                            <div>
                              <span className="text-orange-700 dark:text-orange-200 font-medium">Delivery to:</span>{" "}
                              <span className="font-medium text-slate-800 dark:text-slate-100">
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
                          className="text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 font-bold text-lg"
                        >
                          {expandedOrder === order.id ? "▼" : "▶"}
                        </button>
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-600 space-y-3">
                        {order.items && order.items.length > 0 ? (
                          <div>
                            <p className="font-semibold text-sm mb-2 text-slate-900 dark:text-white">Items:</p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-sm text-slate-700 dark:text-slate-200"
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
                          <p className="text-sm text-orange-700 dark:text-orange-200">No items details</p>
                        )}

                        {order.status === "DELIVERED" && (
                          <Link
                            href="/products"
                            className="inline-block mt-3 rounded-md bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600 font-semibold transition"
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
                            className="ml-3 inline-block mt-3 rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 font-semibold transition"
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