"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCategories } from "@/src/hooks/useCategories";

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categoryData } = useCategories();
  const categories = categoryData?.data || [];
  const popularTags = categories
    .slice(0, 4)
    .map((cat: any) => cat.name)
    .filter(Boolean) as string[];

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/products?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-orange-700">
              Trusted marketplace for modern buyers
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Discover products from verified providers with fast delivery.
            </h1>
            <p className="max-w-2xl text-slate-700">
              Browse curated collections, compare prices, and shop from local sellers with secure checkout and clear product details.
            </p>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search products, brands, or providers"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="rounded-full bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700"
                >
                  Search
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">Popular:</span>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 transition hover:bg-orange-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-orange-500/20"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Start shopping
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
              >
                Sell your products
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-4xl bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-orange-200">Flash deals</p>
              <h2 className="mt-4 text-3xl font-semibold">Top products with unbeatable prices</h2>
              <p className="mt-3 text-slate-300">
                Save with limited-time offers from trusted providers, all in one place.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-orange-200">Featured deal</p>
                  <p className="mt-3 font-semibold text-lg">Premium items at low cost</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-orange-200">Fast delivery</p>
                  <p className="mt-3 font-semibold text-lg">Quick shipping from local sellers</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.35em] text-orange-600">Competitive Price</p>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">Everyday low price</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.35em] text-orange-600">Authentic Products</p>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">Verified brands</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.35em] text-orange-600">Secure Payment</p>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">Smooth checkout</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.35em] text-orange-600">Fast Delivery</p>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">Rapid doorstep service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;