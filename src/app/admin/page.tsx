"use client";

import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import RoleGuard from "@/src/components/shared/RoleGuard";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <RoleGuard role="ADMIN">
        <div className="max-w-7xl mx-auto py-10 px-5">
          <h1 className="text-4xl font-bold">
            Admin Dashboard
          </h1>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}