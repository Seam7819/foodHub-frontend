"use client";

import { useEffect, useMemo, useState } from "react";
import { useCategories } from "@/src/hooks/useCategories";
import { useMeals } from "@/src/hooks/useMeals";
import FilterSidebar from "@/src/components/catalog/FilterSidebar";
import ProductsCatalog from "@/src/components/catalog/ProductsCatalog";

function ProductsPageContent() {
  const { data: mealData, isLoading, isError } = useMeals();
  const { data: categoryData } = useCategories();
  const products = mealData?.data || [];
  const categories = categoryData?.data || [];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || null;
    const min = Number(searchParams.get("minPrice")) || null;
    const max = Number(searchParams.get("maxPrice")) || null;
    const sort = searchParams.get("sort") || "featured";

    setSearchTerm(search);
    setSelectedCategory(category);
    setMinPrice(min === null || Number.isNaN(min) ? null : min);
    setMaxPrice(max === null || Number.isNaN(max) ? null : max);
    setSortBy(sort);
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product: any) => {
        const matchesCategory = !selectedCategory || product.categoryId === selectedCategory || product.categoryName === selectedCategory;
        const matchesPrice =
          (minPrice === null || Number(product.price) >= minPrice) &&
          (maxPrice === null || Number(product.price) <= maxPrice);
        const matchesSearch =
          !searchTerm ||
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.provider?.businessName?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((a: any, b: any) => {
        if (sortBy === "price-low") {
          return Number(a.price) - Number(b.price);
        }
        if (sortBy === "price-high") {
          return Number(b.price) - Number(a.price);
        }
        if (sortBy === "name") {
          return String(a.name || "").localeCompare(String(b.name || ""));
        }
        return 0;
      });
  }, [products, selectedCategory, minPrice, maxPrice, searchTerm, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Marketplace</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Browse all products</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
            Discover the latest listings from trusted providers and compare features before you buy.
          </p>
        </div>
      </div>

      <div className="mb-10 rounded-3xl border border-orange-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Find the right product faster</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Use search, category filters, or price range to narrow your results.</p>
          </div>
          <div className="relative max-w-xl flex-1">
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <input
              id="product-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, brands, or categories"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <ProductsCatalog
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
        />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsPageContent />;
}
