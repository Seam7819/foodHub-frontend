"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMeals } from "@/src/services/meal.service";
import { useCategories } from "@/src/hooks/useCategories";
import { useProviders } from "@/src/hooks/useProviders";

const HomeInsights = () => {
  const { data: mealsData, isLoading: mealsLoading } = useQuery({
    queryKey: ["home-insights-meals"],
    queryFn: () => getMeals(),
  });

  const { data: categoryData, isLoading: categoriesLoading } = useCategories();
  const { data: providersData, isLoading: providersLoading } = useProviders();

  const meals = mealsData?.data || [];
  const categories = categoryData?.data || [];
  const providers = providersData?.data || [];

  const categoryChart = useMemo(() => {
    const counts = categories
      .map((category: any) => {
        const value = meals.filter((meal: any) => {
          return meal.categoryName === category.name || meal.categoryId === category.id;
        }).length;

        return {
          label: category.name,
          value,
          id: category.id,
        };
      })
      .filter((item: any) => item.value > 0)
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 6);

    const maxValue = Math.max(...counts.map((item: any) => item.value), 1);

    return counts.map((item: any) => ({
      ...item,
      height: Math.max(18, Math.round((item.value / maxValue) * 100)),
    }));
  }, [categories, meals]);

  const totalProducts = meals.length;
  const premiumProducts = meals.filter((meal: any) => Number(meal.price) >= 80).length;
  const topCategory = categoryChart[0]?.label || "No data";
  const averagePrice = totalProducts
    ? (meals.reduce((sum: number, meal: any) => sum + Number(meal.price || 0), 0) / totalProducts).toFixed(0)
    : "0";

  const stats = [
    { label: "Live products", value: totalProducts.toString(), note: "Updated from catalog" },
    { label: "Providers", value: providers.length.toString(), note: "Active storefronts" },
    { label: "Premium items", value: premiumProducts.toString(), note: "High-value listings" },
    { label: "Top category", value: topCategory, note: "Most populated" },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Marketplace pulse</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              Live insights from your product catalog
            </h2>
          </div>
          <p className="max-w-2xl text-sm text-slate-700 dark:text-slate-300">
            These figures update from the current products, categories, and providers so the homepage reflects real marketplace activity.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Today’s overview</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">A live snapshot of your marketplace</p>
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">Live</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-orange-600">{stat.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-linear-to-br from-orange-600 to-amber-500 p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">Average listing price</p>
              <p className="mt-2 text-3xl font-semibold">${averagePrice}</p>
              <p className="mt-2 text-sm text-orange-50">Based on the current catalog and provider pricing.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Category demand</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Products grouped by category</p>
              </div>
              <Link href="/products" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                View catalog
              </Link>
            </div>

            <div className="mt-6 flex min-h-64 items-end gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
              {mealsLoading || categoriesLoading || providersLoading ? (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-600 dark:text-slate-400">
                  Loading analytics...
                </div>
              ) : categoryChart.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-600 dark:text-slate-400">
                  No category data available yet.
                </div>
              ) : (
                categoryChart.map((item: any) => (
                  <div key={item.id} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-40 w-full items-end justify-center rounded-xl bg-white p-2 shadow-inner dark:bg-slate-900">
                      <div
                        className="w-full rounded-lg bg-linear-to-t from-orange-600 to-amber-400"
                        style={{ height: `${item.height}%` }}
                      />
                    </div>
                    <span className="text-center text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{item.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeInsights;
