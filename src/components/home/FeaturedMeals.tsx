"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMeals } from "@/src/services/meal.service";

const FeaturedMeals = () => {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const { data, isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getMeals(),
  });

  const allMeals = data?.data || [];
  const totalPages = Math.max(1, Math.ceil(allMeals.length / ITEMS_PER_PAGE));
  const meals = allMeals.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Featured Products</p>
            <h2 className="mt-3 text-3xl font-bold text-app-fg dark:text-white md:text-4xl">
              Latest marketplace favorites
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted dark:text-slate-300">
              Explore a curated selection of top-quality products with verified providers and fast shipping.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-orange-500 bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Browse all products
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40 rounded-3xl border border-app bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm text-muted">Loading products...</p>
          </div>
        ) : meals.length === 0 ? (
          <div className="flex justify-center items-center h-40 rounded-3xl border border-app bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm text-muted">No products available right now.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {meals.map((meal: any, index: number) => (
                <Link key={meal.id} href={`/products/${meal.id}`}>
                  <div className="group h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950">
                    <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-900">
                      {meal.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-600 dark:text-slate-400">No image available</div>
                      )}
                      <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
                        {index === 0 ? "Top pick" : "Best value"}
                      </span>
                    </div>

                    <div className="flex h-full flex-col gap-4 p-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            {meal.categoryName || "Category"}
                          </span>
                          <span className="text-sm font-semibold text-orange-600">৳{meal.price}</span>
                        </div>

                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white line-clamp-2">
                          {meal.name}
                        </h3>

                        <p className="text-sm text-muted dark:text-slate-300 line-clamp-2">
                          {meal.provider?.businessName || meal.provider?.name || "Verified provider"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        {meal.rating ? (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700 dark:bg-amber-200/10 dark:text-amber-200">
                            {meal.rating.toFixed(1)} ★
                          </span>
                        ) : null}
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
                          {typeof meal.availableItems === "number" ? `${meal.availableItems} in stock` : "Stock unknown"}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
                          {meal.discountPercent ? `-${meal.discountPercent}% off` : "No discount"}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          View details
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-orange-600">Shop now</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-3 md:flex-row">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Showing {meals.length} of {allMeals.length} products. Flip through pages for more curated offers.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-400">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedMeals;