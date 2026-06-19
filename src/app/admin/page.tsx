"use client";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminRoute from "@/src/components/auth/AdminRoute";
import Sidebar from "@/src/components/dashboard/Sidebar";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminRoute>
        <div className="max-w-7xl mx-auto py-10 px-5 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <Sidebar />
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-4xl font-bold text-black">Admin Dashboard</h1>
            <p className="mt-4 text-gray-600">
              Use the sidebar to manage users, categories, meals, and orders.
            </p>
          </div>
        </div>
      </AdminRoute>
    </ProtectedRoute>
  );
}