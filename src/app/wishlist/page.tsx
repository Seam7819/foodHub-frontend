"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getWishlistItems,
  removeWishlistItem,
  WishlistItem,
} from "@/src/services/wishlist.service";
import { useAuth } from "@/src/context/AuthContext";

export default function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (user?.id) {
      setItems(getWishlistItems(user.id));
    } else {
      setItems([]);
    }
  }, [user?.id]);

  const removeItem = (id: string) => {
    removeWishlistItem(id, user?.id);
    setItems(getWishlistItems(user?.id));
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="text-gray-600">Saved meals you want to order later.</p>
        </div>
        <Link
          href="/meals"
          className="rounded bg-orange-500 px-4 py-2 text-white"
        >
          Browse Meals
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-[120px_1fr_auto]">
              <div className="h-28 w-full overflow-hidden rounded-lg bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-500">৳ {item.price}</p>
              </div>

              <div className="flex flex-col items-end justify-between gap-3">
                <Link href={`/meals/${item.id}`} className="rounded bg-orange-500 px-4 py-2 text-white">
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
