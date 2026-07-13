"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMeals } from "@/src/services/meal.service";
import { useCategories } from "@/src/hooks/useCategories";
import { useProviders } from "@/src/hooks/useProviders";

const ResultsSection = () => {
  const { data: mealsData } = useQuery({
    queryKey: ["results-section-meals"],
    queryFn: () => getMeals(),
  });

  const { data: categoryData } = useCategories();
  const { data: providersData } = useProviders();

  const meals = mealsData?.data || [];
  const categories = categoryData?.data || [];
  const providers = providersData?.data || [];

  const results = useMemo(() => {
    const totalProducts = meals.length;
    const averagePrice = totalProducts
      ? Math.round(
          meals.reduce((sum: number, meal: any) => sum + Number(meal.price || 0), 0) / totalProducts
        )
      : 0;

    return [
      { label: "Live products", value: totalProducts.toString(), note: "Fresh catalog from providers" },
      { label: "Active providers", value: providers.length.toString(), note: "Growing storefronts" },
      { label: "Categories", value: categories.length.toString(), note: "Easy discovery" },
      { label: "Avg. listing price", value: `$${averagePrice}`, note: "Healthy marketplace mix" },
    ];
  }, [meals, providers, categories]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Proof that the marketplace is growing</p>
          <h2 className="mt-2 text-2xl font-bold text-app-fg md:text-3xl">
            Real numbers, visible momentum, and stronger buyer trust
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {results.map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
              <p className="mt-2 text-sm text-orange-600">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
