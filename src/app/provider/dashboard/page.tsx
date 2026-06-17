"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import RoleGuard from "@/src/components/shared/RoleGuard";
import { useAuth } from "@/src/context/AuthContext";
import { getOrders } from "@/src/services/order.service";
import Loader from "@/src/components/shared/Loader";

export default function ProviderDashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", "provider"],
    queryFn: getOrders,
  });

  const orders = data?.data || [];

  const providerOrders = useMemo(
    () => orders.filter((order: any) => order.providerId === user?.id),
    [orders, user?.id]
  );

  return (
    <ProtectedRoute>
      <RoleGuard role="PROVIDER">
        <div className="max-w-7xl mx-auto py-10 px-5">
          <h1 className="text-4xl font-bold">Provider Dashboard</h1>
          <p className="mt-4 text-gray-600">
            Manage your meals and orders from here.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Orders</h2>
              {isLoading ? (
                <Loader />
              ) : isError ? (
                <p className="text-gray-500">Failed to load orders.</p>
              ) : (
                <p className="text-gray-600">
                  {providerOrders.length} order{providerOrders.length === 1 ? "" : "s"} assigned to your provider account.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Quick Actions</h2>
              <p className="text-gray-600 mb-4">
                Use your provider dashboard to keep delivery times and meal availability up to date.
              </p>
              <div className="space-y-2">
                <Link
                  href="/provider/meals"
                  className="block w-full rounded bg-orange-500 px-4 py-3 text-white text-center hover:bg-orange-600"
                >
                  Manage Menu
                </Link>
                <Link
                  href="/provider/meals"
                  className="block w-full rounded border px-4 py-3 text-gray-700 text-center hover:bg-gray-50"
                >
                  Update Availability
                </Link>
              </div>
            </div>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
