"use client";

import React from "react";
import Loader from "@/src/components/shared/Loader";
import { useMeals } from "@/src/hooks/useMeals";
import ProductCard from "./ProductCard";

type ProductsCatalogProps = {
  products?: any[];
  isLoading?: boolean;
  isError?: boolean;
};

const ProductsCatalog = ({ products, isLoading, isError }: ProductsCatalogProps) => {
  const internalQuery = useMeals();
  const productsToRender = products ?? internalQuery.data?.data ?? [];
  const loading = isLoading ?? internalQuery.isLoading;
  const error = isError ?? internalQuery.isError;

  if (loading) return (
    <div className="flex justify-center py-10"><Loader /></div>
  );

  if (error) return (
    <div className="text-center py-10 text-red-500">Failed to load products.</div>
  );

  return (
    <section className="mt-8">
      {productsToRender.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          No products match your filter settings.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsToRender.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsCatalog;
