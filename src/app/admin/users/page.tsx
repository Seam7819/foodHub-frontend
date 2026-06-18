"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Loader from "@/src/components/shared/Loader";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminRoute from "@/src/components/auth/AdminRoute";
import { getUsers, suspendUser, activateUser } from "@/src/services/user.service";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      userId,
      action,
    }: {
      userId: string;
      action: "suspend" | "activate";
    }) => {
      if (action === "suspend") {
        return suspendUser(userId);
      } else {
        return activateUser(userId);
      }
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        `User ${action === "suspend" ? "suspended" : "activated"} successfully`
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Failed to update user status";
      toast.error(message);
    },
  });

  const users = data?.data || [];

  return (
    <ProtectedRoute>
      <AdminRoute>
        <div className="max-w-7xl mx-auto py-10 px-5 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <Sidebar />
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">User Management</h1>

            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">
                All Users ({users.length})
              </h2>

              {isLoading ? (
                <Loader />
              ) : isError ? (
                <p className="text-gray-500">Failed to load users.</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-semibold">Name</th>
                        <th className="text-left p-3 font-semibold">Email</th>
                        <th className="text-left p-3 font-semibold">Role</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Joined</th>
                        <th className="text-left p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: User) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{user.name}</td>
                          <td className="p-3 text-gray-600">{user.email}</td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === "ADMIN"
                                  ? "bg-red-100 text-red-800"
                                  : user.role === "PROVIDER"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.status === "SUSPENDED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.status || "ACTIVE"}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="p-3">
                            {user.role !== "ADMIN" && (
                              <button
                                onClick={() => {
                                  const action =
                                    user.status === "SUSPENDED"
                                      ? "activate"
                                      : "suspend";
                                  if (
                                    confirm(
                                      `${action === "suspend" ? "Suspend" : "Activate"} this user?`
                                    )
                                  ) {
                                    statusMutation.mutate({
                                      userId: user.id,
                                      action,
                                    });
                                  }
                                }}
                                disabled={statusMutation.isPending}
                                className={`px-3 py-1 rounded text-xs font-semibold text-white transition ${
                                  user.status === "SUSPENDED"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-orange-500 hover:bg-orange-600"
                                } disabled:opacity-50`}
                              >
                                {statusMutation.isPending
                                  ? "Processing..."
                                  : user.status === "SUSPENDED"
                                  ? "Activate"
                                  : "Suspend"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
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
