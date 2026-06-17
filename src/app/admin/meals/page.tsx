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
import Loader from "@/src/components/shared/Loader";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminRoute from "@/src/components/auth/AdminRoute";

export default function AdminMealsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    categoryName: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getMeals(),
  });

  const { data: categoryData } = useCategories();

  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => queryClient.invalidateQueries(["meals"]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) =>
      updateMeal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["meals"]);
      setEditingId(null);
      setForm({
        title: "",
        description: "",
        price: "",
        image: "",
        categoryName: "",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => queryClient.invalidateQueries(["meals"]),
  });

  const meals = data?.data || [];

  const handleSave = () => {
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      categoryName: form.categoryName,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
      setForm({
        title: "",
        description: "",
        price: "",
        image: "",
        categoryName: "",
      });
    }
  };

  const startEdit = (meal: any) => {
    setEditingId(meal.id);
    setForm({
      title: meal.title || meal.name || "",
      description: meal.description || "",
      price: String(meal.price || ""),
      image: meal.image || "",
      categoryName: meal.categoryName || "",
    });
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="max-w-7xl mx-auto py-10 px-5">
        Failed to load meals.
      </div>
    );

  return (
    <ProtectedRoute>
      <AdminRoute>
        <div className="max-w-7xl mx-auto py-10 px-5 space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold mb-4">Meal Management</h1>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.title}
                placeholder="Title"
                className="rounded border p-3"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                value={form.price}
                placeholder="Price"
                className="rounded border p-3"
                onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                value={form.categoryName}
                onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                className="rounded border p-3 md:col-span-2"
              >
                <option value="">Select category</option>
                {categoryData?.data?.map((category: any) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSave}
              className="mt-4 rounded bg-orange-500 px-5 py-3 text-white"
            >
              {editingId ? "Update Meal" : "Create Meal"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {meals.map((meal: any) => (
                  <tr key={meal.id}>
                    <td className="px-4 py-4 text-sm text-gray-700">{meal.title || meal.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">৳ {meal.price}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{meal.categoryName || "N/A"}</td>
                    <td className="px-4 py-4 text-right text-sm text-gray-700 space-x-2">
                      <button
                        onClick={() => startEdit(meal)}
                        className="rounded border px-3 py-2 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(meal.id)}
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
