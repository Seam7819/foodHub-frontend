"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMeals } from "@/src/services/meal.service";
import { useCategories } from "@/src/hooks/useCategories";
import Loader from "@/src/components/shared/Loader";
import { IMeal } from "@/src/types/meal.types";

const ITEMS_PER_PAGE = 8;

export default function MealsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [page, setPage] = useState(1);

  const {
    data: mealsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getMeals(),
  });

  const { data: categoryData } = useCategories();

  const meals: IMeal[] = mealsData?.data || [];

  const filteredMeals = useMemo(() => {
    const searchLower = search.toLowerCase();

    return meals.filter((meal) => {
      const matchesSearch = meal.name
        .toLowerCase()
        .includes(searchLower);

      const matchesCategory =
        category === "ALL" ||
        meal.categoryName === category;

      return matchesSearch && matchesCategory;
    });
  }, [meals, search, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMeals.length / ITEMS_PER_PAGE)
  );

  const paginatedMeals = useMemo(
    () =>
      filteredMeals.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      ),
    [filteredMeals, page]
  );

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="max-w-7xl mx-auto py-10 px-5">
        Failed to load meals.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Browse Meals
          </h1>
          <p className="text-gray-600">
            Search and filter meals with pagination.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search meals..."
            className="rounded border p-3 w-full sm:w-72"
          />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded border p-3 w-full sm:w-56"
          >
            <option value="ALL">All Categories</option>
            {categoryData?.data?.map((cat: any) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {paginatedMeals.map((meal) => (
          <div key={meal.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-100">
              {meal.image ? (
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No image
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <h2 className="text-xl font-semibold">{meal.name}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {meal.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-orange-500">৳ {meal.price}</span>
                <Link
                  href={`/meals/${meal.id}`}
                  className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="rounded border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-3 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="rounded border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
