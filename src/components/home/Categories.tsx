"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCategories } from "@/src/hooks/useCategories";

const Categories = () => {
  const { data, isLoading } = useCategories();

  const categories = data?.data || [];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8">
          Categories
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/meals?category=${category.name}`}
              >
                <div className="border p-6 rounded-lg text-center hover:shadow-lg hover:border-orange-500 transition cursor-pointer bg-white">
                  <span className="font-medium text-gray-800">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;