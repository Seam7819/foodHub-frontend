"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMeals } from "@/src/services/meal.service";
import { useCategories } from "@/src/hooks/useCategories";
import Loader from "@/src/components/shared/Loader";
import { IMeal } from "@/src/types/meal.types";

const ITEMS_PER_PAGE = 4;

function MealsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const categoryFromUrl = searchParams.get("category") || "ALL";
  const normalizedCategoryFromUrl =
    categoryFromUrl === "ALL"
      ? "ALL"
      : categoryFromUrl.trim().toLowerCase();

  const categoryParam = categoryFromUrl === "ALL" ? undefined : categoryFromUrl;

  useEffect(() => {
    setPage(1);
  }, [categoryFromUrl, search]);

  const {
    data: mealsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meals", categoryParam],
    queryFn: () => getMeals(categoryParam ? { category: categoryParam } : undefined),
    refetchOnWindowFocus: true,
  });

  const { data: categoryData } = useCategories();
  const meals: IMeal[] = mealsData?.data || [];

  const categoryFilteredMeals = useMemo(() => {
    if (categoryFromUrl === "ALL") {
      return meals;
    }

    const matchedCategory = categoryData?.data?.find((cat: any) => {
      return (
        cat.id === categoryFromUrl ||
        cat.name?.trim().toLowerCase() === normalizedCategoryFromUrl
      );
    });

    if (!matchedCategory) {
      return meals;
    }

    return meals.filter((meal) => {
      return (
        meal.categoryName?.trim().toLowerCase() === matchedCategory.name?.trim().toLowerCase() ||
        // fallback if meal stores category id instead of name
        (meal as any).categoryId === matchedCategory.id
      );
    });
  }, [meals, categoryData?.data, categoryFromUrl, normalizedCategoryFromUrl]);

  const filteredMeals = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    if (!searchLower) {
      return categoryFilteredMeals;
    }

    return categoryFilteredMeals.filter((meal) => {
      const matchesSearch =
        meal.name?.toLowerCase().includes(searchLower) ||
        meal.description?.toLowerCase().includes(searchLower) ||
        meal.provider?.businessName?.toLowerCase().includes(searchLower) ||
        meal.provider?.name?.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [categoryFilteredMeals, search]);

  const totalPages = Math.max(1, Math.ceil(filteredMeals.length / ITEMS_PER_PAGE));

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
      <div className="max-w-7xl mx-auto py-10 px-5">Failed to load meals.</div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-cyan-600">Browse Services</h1>
          <p className="text-gray-600">Search and filter services with pagination.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search services..."
            className="rounded border p-3 w-full sm:w-72"
          />

          <select
            value={categoryFromUrl}
            onChange={(e) => {
              const selected = e.target.value;
              setPage(1);
              if (selected === "ALL") {
                router.push("/meals");
              } else {
                router.push(`/meals?category=${encodeURIComponent(selected)}`);
              }
            }}
            className="rounded border p-3 w-full sm:w-56"
          >
            <option value="ALL">All Categories</option>
            {categoryData?.data?.map((cat: any) => (
              <option key={cat.id} value={cat.id} className="text-black">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {paginatedMeals.map((meal) => (
          <div key={meal.id} className="rounded-xl text-black  border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-100">
              {meal.image ? (
                <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">No image</div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <h2 className="text-xl font-semibold">{meal.name}</h2>
              <p className="text-sm text-gray-500">
                {meal.provider?.businessName || meal.provider?.name || "Unknown restaurant"}
              </p>
              <p className="text-sm text-gray-500 line-clamp-2">{meal.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-orange-500">৳ {meal.price}</span>
                <Link href={`/meals/${meal.id}`} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
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
          className="rounded border text-black bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-3 py-2">Page {page} of {totalPages}</span>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="rounded border text-black bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <MealsPageContent />
    </Suspense>
  );
}
