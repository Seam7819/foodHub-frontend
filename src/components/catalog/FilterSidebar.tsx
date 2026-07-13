"use client";

import React from "react";

type Props = {
  categories: any[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  minPrice?: number | null;
  maxPrice?: number | null;
  onPriceChange?: (min: number | null, max: number | null) => void;
};

const FilterSidebar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  minPrice = null,
  maxPrice = null,
  onPriceChange,
}: Props) => {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Filter</h4>

        <div className="mb-4">
          <label className="block mb-2 text-xs text-slate-500">Category</label>
          <div className="flex flex-col gap-2">
            <button
              className={`text-left text-sm ${!selectedCategory ? "font-semibold text-slate-900" : "text-slate-600"}`}
              onClick={() => onSelectCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`text-left text-sm ${selectedCategory === cat.id ? "font-semibold text-slate-900" : "text-slate-600"}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-xs text-slate-500">Price range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice ?? ""}
              onChange={(e) => onPriceChange && onPriceChange(Number(e.target.value) || null, maxPrice ?? null)}
              className="w-1/2 rounded border p-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice ?? ""}
              onChange={(e) => onPriceChange && onPriceChange(minPrice ?? null, Number(e.target.value) || null)}
              className="w-1/2 rounded border p-2 text-sm"
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="block mb-2 text-xs text-slate-500">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full rounded border p-2 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
