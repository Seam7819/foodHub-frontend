"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/src/services/category.service";
import Loader from "@/src/components/shared/Loader";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminRoute from "@/src/components/auth/AdminRoute";

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
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditingId(null);
      setName("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
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
        <div className="max-w-7xl mx-auto py-10 px-5">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Category Management</h1>
              <p className="text-gray-600">Create, edit, and delete categories.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="rounded border p-3 w-full sm:w-72"
              />
              <button
                onClick={handleSave}
                className="rounded bg-orange-500 px-5 py-3 text-white"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {categories.map((category: any) => (
                  <tr key={category.id}>
                    <td className="px-4 py-4 text-sm text-gray-700">{category.name}</td>
                    <td className="px-4 py-4 text-right text-sm text-gray-700 space-x-2">
                      <button
                        onClick={() => startEdit(category.id, category.name)}
                        className="rounded border px-3 py-2 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(category.id)}
                        className="rounded border border-red-500 px-3 py-2 text-sm text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminRoute>
    </ProtectedRoute>
  );
}
