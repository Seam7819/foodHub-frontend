"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import RoleGuard from "@/src/components/shared/RoleGuard";
import ProviderSidebar from "@/src/components/dashboard/ProviderSidebar";
import { useAuth } from "@/src/context/AuthContext";
import { getProviderOrders } from "@/src/services/provider-order.service";
import Loader from "@/src/components/shared/Loader";

export default function ProviderDashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["provider-orders", user?.id],
    queryFn: getProviderOrders,
    enabled: !!user?.id && user?.role === "PROVIDER",
  });

  const orders = data?.data || [];

  const providerOrders = useMemo(
    () => orders.filter((order: any) => order.providerId === user?.id),
    [orders, user?.id]
  );

  return (
    <ProtectedRoute>
      <RoleGuard role="PROVIDER">
        <div className="max-w-7xl mx-auto py-10 px-5 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <ProviderSidebar />
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-black">Provider Dashboard</h1>
              <p className="mt-2 text-orange-400">
                Manage your products and orders from here.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-2 text-black">Orders</h2>
                {isLoading ? (
                  <Loader />
                ) : isError ? (
                  <p className="text-black">Failed to load orders.</p>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">
                      {providerOrders.length} order{providerOrders.length === 1 ? "" : "s"} assigned to your provider account.
                    </p>
                    <Link
                      href="/provider/orders"
                      className="inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      View Orders
                    </Link>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-2 text-black">Quick Actions</h2>
                <p className="text-gray-600 mb-4">
                  Use your provider dashboard to keep delivery times and meal availability up to date.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/provider/meals"
                    className="block w-full rounded bg-orange-500 px-4 py-3 text-white text-center hover:bg-orange-600"
                  >
                    Manage Products
                  </Link>
                  <Link
                    href="/provider/orders"
                    className="block w-full rounded border px-4 py-3 text-gray-700 text-center hover:bg-gray-50"
                  >
                    Manage Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
