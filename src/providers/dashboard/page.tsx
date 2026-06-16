"use client";

import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import RoleGuard from "@/src/components/shared/RoleGuard";

export default function ProviderPage() {
  return (
    <ProtectedRoute>
      <RoleGuard role="PROVIDER">
        <div className="max-w-7xl mx-auto py-10 px-5">
          <h1 className="text-4xl font-bold">
            Provider Dashboard
          </h1>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}