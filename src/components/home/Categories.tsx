"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCategories } from "@/src/hooks/useCategories";

const Categories = () => {
  const { data, isLoading } = useCategories();

  const categories = data?.data || [];

  return (
    <section className="py-16">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-8 text-orange-600">
          Shop by Category
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <p className="text-slate-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex justify-center items-center h-20">
            <p className="text-slate-600">No service categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.id)}`}
              >
                <div className="rounded-3xl border border-app bg-surface p-6 text-center shadow-sm transition hover:border-orange-500 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                    {category.name?.charAt(0) ?? "#"}
                  </div>
                  <span className="font-semibold text-app-fg dark:text-white">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
};

export default Categories;