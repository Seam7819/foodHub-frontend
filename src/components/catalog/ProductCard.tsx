"use client";

import Link from "next/link";
import React from "react";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 dark:text-slate-400">No image</div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">New</span>
          )}
          {product.isHot && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Hot</span>
          )}
          {product.discountPercent && (
            <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">-{product.discountPercent}%</span>
          )}
        </div>
      </div>

      <div className="flex grow flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">{product.name}</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{product.provider?.businessName || product.provider?.name || "Provider"}</p>

            {product.rating && (
              <div className="mt-2 flex items-center gap-2 text-sm text-amber-500">
                <span className="font-semibold text-slate-800 dark:text-white">{product.rating.toFixed(1)}</span>
                <span className="text-xs">{Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                ))}</span>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold text-orange-600">৳{product.price}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{typeof product.availableItems === 'number' ? `${product.availableItems} left` : ''}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link href={`/products/${product.id}`} className={`rounded-md px-3 py-2 text-xs font-semibold text-white ${product.availableItems === 0 ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}>
            {product.availableItems === 0 ? 'Out of stock' : 'View'}
          </Link>
          <button aria-label="save" className="text-slate-400 hover:text-orange-600">
            ♥
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
