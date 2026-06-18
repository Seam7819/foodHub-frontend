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
        <h2 className="text-3xl font-bold mb-8">
          Featured Meals
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading meals...</p>
          </div>
        ) : meals.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">No meals available</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {meals.map((meal: any) => (
                <Link key={meal.id} href={`/meals/${meal.id}`}>
                  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white h-full flex flex-col">
                    {meal.image ? (
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-40 object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 rounded-t flex-shrink-0" />
                    )}

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">
                        {meal.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {meal.provider?.businessName || meal.provider?.name || "Unknown restaurant"}
                      </p>
                      <p className="text-gray-500 text-sm line-clamp-1">
                        {meal.categoryName}
                      </p>
                      <p className="text-orange-500 font-bold mt-auto pt-2">
                        ৳{meal.price}
                      </p>
                    </div>
                  </div>
                </Link>
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
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedMeals;