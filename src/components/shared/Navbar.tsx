"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCartCount, listenCartUpdates } from "@/src/utils/cart";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const userId = user?.id || undefined;

  useEffect(() => {
    setCartCount(getCartCount(userId));
    return listenCartUpdates(() => {
      setCartCount(getCartCount(userId));
    });
  }, [userId]);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-orange-500"
        >
          FoodHub
        </Link>

        <div className="hidden md:flex gap-6 items-center text-sm md:text-base">
          <Link href="/">Home</Link>
          <Link href="/meals">Meals</Link>
          <Link href="/providers">Providers</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart" className="relative">
            Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-2 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex gap-2 md:gap-3 items-center flex-wrap justify-end">
          <Link href="/cart" className="md:hidden relative p-2">
            Cart
            {cartCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <span className="hidden sm:inline text-xs md:text-sm">{user?.name}</span>

              {user?.role === "PROVIDER" && (
                <Link
                  href="/provider/dashboard"
                  className="px-2 md:px-4 py-1 md:py-2 bg-blue-500 text-white rounded-md text-xs md:text-sm"
                >
                  Provider
                </Link>
              )}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-2 md:px-4 py-1 md:py-2 bg-purple-500 text-white rounded-md text-xs md:text-sm"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="px-2 md:px-4 py-1 md:py-2 bg-red-500 text-white rounded-md text-xs md:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-2 md:px-4 py-1 md:py-2 border rounded-md text-xs md:text-sm"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-2 md:px-4 py-1 md:py-2 bg-orange-500 text-white rounded-md text-xs md:text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;