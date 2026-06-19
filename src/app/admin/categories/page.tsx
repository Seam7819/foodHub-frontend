"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/src/services/category.service";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Loader from "@/src/components/shared/Loader";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminRoute from "@/src/components/auth/AdminRoute";
import { toast } from "sonner";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
      setName("");
      toast.success("Category updated successfully");
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || "Failed to delete category";
      toast.error(message);
    },
  });

  const categories = data?.data || [];

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingId) {
      updateMutation.mutate({ id: editingId, name: name.trim() });
    } else {
      createMutation.mutate({ name: name.trim() });
      setName("");
    }
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setName(currentName);
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="max-w-7xl mx-auto py-10 px-5">
        Failed to load categories.
      </div>
    );

  return (
    <ProtectedRoute>
      <AdminRoute>
        <div className="max-w-7xl mx-auto py-10 px-5 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <Sidebar />
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black">Category Management</h1>
            
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-black">{editingId ? "Edit Category" : "Add New Category"}</h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category name *"
                  className="rounded border p-3 flex-1"
                  required
                />
                <button
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded bg-orange-500 px-6 py-3 text-white disabled:opacity-50 hover:bg-orange-600 whitespace-nowrap"
                >
                  {editingId ? "Update" : "Add"} Category
                </button>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                    }}
                    className="rounded border px-6 py-3 hover:bg-gray-50 whitespace-nowrap"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
              {isLoading ? (
                <Loader />
              ) : isError ? (
                <p className="text-gray-500">Failed to load categories.</p>
              ) : categories.length === 0 ? (
                <p className="text-gray-500">No categories found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-semibold">Name</th>
                        <th className="text-center p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category: any) => (
                        <tr key={category.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{category.name}</td>
                          <td className="p-3">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => startEdit(category.id, category.name)}
                                className="rounded bg-blue-500 px-3 py-1 text-white text-xs hover:bg-blue-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Delete this category?")) {
                                    deleteMutation.mutate(category.id);
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                                className="rounded bg-red-500 px-3 py-1 text-white text-xs hover:bg-red-600 disabled:opacity-50"
                              >
                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                              </button>
                            </div>
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
