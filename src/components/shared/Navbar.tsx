"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCartCount, listenCartUpdates } from "@/src/utils/cart";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const userId = user?.id ?? null;

  useEffect(() => {
    setCartCount(getCartCount(userId));
    return listenCartUpdates(() => {
      setCartCount(getCartCount(userId));
    });
  }, [userId]);

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-orange-500"
        >
          FoodHub
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/">Home</Link>
          <Link href="/meals">Meals</Link>
          <Link href="/providers">Providers</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart" className="relative">
            Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-2 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span>{user?.name}</span>

              {user?.role === "PROVIDER" && (
                <Link
                  href="/provider/dashboard"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                >
                  Provider Dashboard
                </Link>
              )}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border rounded-md"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 bg-orange-500 text-white rounded-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;