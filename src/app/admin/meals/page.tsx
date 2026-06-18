"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal,
} from "@/src/services/meal.service";
import { useCategories } from "@/src/hooks/useCategories";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Loader from "@/src/components/shared/Loader";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminRoute from "@/src/components/auth/AdminRoute";
import { toast } from "sonner";

export default function AdminMealsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getMeals(),
  });

  const { data: categoryData } = useCategories();

  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      toast.success("Meal created successfully");
      setForm({ name: "", description: "", price: "", image: "", categoryId: "" });
    },
    onError: () => toast.error("Failed to create meal"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) => updateMeal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      toast.success("Meal updated successfully");
      setEditingId(null);
      setForm({ name: "", description: "", price: "", image: "", categoryId: "" });
    },
    onError: () => toast.error("Failed to update meal"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      toast.success("Meal deleted successfully");
    },
    onError: () => toast.error("Failed to delete meal"),
  });

  const meals = data?.data || [];

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.description.trim() || !form.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      categoryId: form.categoryId,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEdit = (meal: any) => {
    const category = categoryData?.data?.find((cat: any) => cat.name === meal.categoryName);
    setEditingId(meal.id);
    setForm({
      name: meal.name || "",
      description: meal.description || "",
      price: String(meal.price || ""),
      image: meal.image || "",
      categoryId: category?.id || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "", image: "", categoryId: "" });
  };

  return (
    <ProtectedRoute>
      <AdminRoute>
        <div className="max-w-7xl mx-auto py-10 px-5 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <Sidebar />
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Meal Management</h1>

            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? "Edit Meal" : "Add New Meal"}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <input
                  value={form.name}
                  placeholder="Meal Name *"
                  className="rounded border p-3"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  value={form.price}
                  placeholder="Price *"
                  type="number"
                  step="0.01"
                  min="0"
                  className="rounded border p-3"
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
                <input
                  value={form.image}
                  placeholder="Image URL"
                  className="rounded border p-3 md:col-span-2"
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                <textarea
                  value={form.description}
                  placeholder="Description"
                  className="rounded border p-3 md:col-span-2"
                  rows={3}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="rounded border p-3 md:col-span-2"
                  required
                >
                  <option value="">Select Category *</option>
                  {categoryData?.data?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded bg-orange-500 px-6 py-2 text-white disabled:opacity-50 hover:bg-orange-600"
                >
                  {editingId ? "Update" : "Add"} Meal
                </button>
                {editingId && (
                  <button
                    onClick={handleCancel}
                    className="rounded border px-6 py-2 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Meals ({meals.length})</h2>
              {isLoading ? (
                <Loader />
              ) : isError ? (
                <p className="text-gray-500">Failed to load meals.</p>
              ) : meals.length === 0 ? (
                <p className="text-gray-500">No meals found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-semibold">Name</th>
                        <th className="text-left p-3 font-semibold">Description</th>
                        <th className="text-left p-3 font-semibold">Price</th>
                        <th className="text-left p-3 font-semibold">Category</th>
                        <th className="text-center p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meals.map((meal: any) => (
                        <tr key={meal.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{meal.name}</td>
                          <td className="p-3 text-gray-600">
                            {meal.description?.substring(0, 40)}...
                          </td>
                          <td className="p-3">৳ {meal.price}</td>
                          <td className="p-3">{meal.categoryName || "N/A"}</td>
                          <td className="p-3">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => startEdit(meal)}
                                className="rounded bg-blue-500 px-3 py-1 text-white text-xs hover:bg-blue-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Delete this meal?")) {
                                    deleteMutation.mutate(meal.id);
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                                className="rounded bg-red-500 px-3 py-1 text-white text-xs hover:bg-red-600 disabled:opacity-50"
                              >
                                Delete
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
