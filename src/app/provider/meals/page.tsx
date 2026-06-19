"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal,
} from "@/src/services/meal.service";
import { useCategories } from "@/src/hooks/useCategories";
import { useAuth } from "@/src/context/AuthContext";
import Loader from "@/src/components/shared/Loader";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import RoleGuard from "@/src/components/shared/RoleGuard";
import { toast } from "sonner";

export default function ProviderMealsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getMeals(),
  });

  const { data: categoryData } = useCategories();

  const meals = data?.data || [];
  const providerMeals = meals.filter(
    (meal: any) =>
      meal.provider?.userId === user?.id ||
      meal.providerId === user?.id
  );

  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      toast.success("Meal added successfully");
      resetForm();
    },
    onError: () => {
      toast.error("Failed to add meal");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) =>
      updateMeal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      toast.success("Meal updated successfully");
      setEditingId(null);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to update meal");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      toast.success("Meal deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete meal");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.description.trim() || !form.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      image: form.image,
      categoryId: form.categoryId,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (meal: any) => {
    const category = categoryData?.data?.find((cat: any) => cat.name === meal.categoryName);
    setForm({
      name: meal.name,
      description: meal.description,
      price: meal.price.toString(),
      image: meal.image || "",
      categoryId: category?.id || "",
    });
    setEditingId(meal.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      image: "",
      categoryId: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <ProtectedRoute>
      <RoleGuard role="PROVIDER">
        <div className="max-w-7xl mx-auto py-10 px-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black\">My Meals</h1>
              <p className="text-gray-600">
                Manage your restaurant's meal menu.
              </p>
            </div>
            <Link href="/provider/dashboard" className="text-orange-500 hover:underline">
              Back to Dashboard
            </Link>
          </div>

          {/* Add/Edit Form */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-black">
                {editingId ? "Edit Meal" : "Add New Meal"}
              </h2>
              {showForm && (
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            {showForm ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-black">
                <div className="grid gap-4 md:grid-cols-2">
                  <input 
                    type="text"
                    placeholder="Meal Name *"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="rounded border p-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price *"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="rounded border p-2"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded border p-2"
                  rows={3}
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  className="w-full rounded border p-2"
                />

                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="w-full rounded border p-2"
                  required
                >
                  <option value="">Select Category *</option>
                  {categoryData?.data?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="rounded bg-orange-500 px-6 py-2 text-white disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingId
                      ? "Update Meal"
                      : "Add Meal"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded border px-6 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="rounded bg-orange-500 px-6 py-2 text-white"
              >
                + Add New Meal
              </button>
            )}
          </div>

          {/* Meals List */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-black">
              Meals ({providerMeals.length})
            </h2>

            {isLoading ? (
              <Loader />
            ) : isError ? (
              <p className="text-gray-500">Failed to load meals.</p>
            ) : providerMeals.length === 0 ? (
              <p className="text-gray-500">No meals found. Add your first meal!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-black">Name</th>
                      <th className="text-left p-3 text-black">Description</th>
                      <th className="text-left p-3 text-black">Price</th>
                      <th className="text-left p-3 text-black">Category</th>
                      <th className="text-center p-3 text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerMeals.map((meal: any) => (
                      <tr key={meal.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-black">{meal.name}</td>
                        <td className="p-3 text-black">
                          {meal.description?.substring(0, 50)}...
                        </td>
                        <td className="p-3 text-black">৳ {meal.price}</td>
                        <td className="p-3 text-black">{meal.categoryName}</td>
                        <td className="p-3 text-black">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(meal)}
                              className="rounded bg-blue-500 px-3 py-1 text-white text-xs hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this meal?")) {
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
      </RoleGuard>
    </ProtectedRoute>
  );
}
