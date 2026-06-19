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
    <nav className="bg-linear-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-white hover:text-orange-100 transition"
        >
          FoodHub 
        </Link>
        
        <div className="hidden md:flex gap-6 items-center text-sm md:text-base text-white">
          <Link href="/" className="hover:text-orange-100 transition">Home</Link>
          <Link href="/meals" className="hover:text-orange-100 transition">Meals</Link>
          <Link href="/providers" className="hover:text-orange-100 transition">Providers</Link>
          <Link href="/wishlist" className="hover:text-orange-100 transition">Wishlist</Link>
          <Link href="/cart" className="relative hover:text-orange-100 transition">
            Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-orange-600 px-2 text-xs font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex gap-2 md:gap-3 items-center flex-wrap justify-end">
          <Link href="/cart" className="md:hidden relative p-2 text-white hover:text-orange-100 transition">
            Cart
            {cartCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-orange-600 px-1.5 text-xs font-semibold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <span className="hidden sm:inline text-xs md:text-sm text-white">{user?.name}</span>

              {user?.role === "PROVIDER" && (
                <Link
                  href="/provider/dashboard"
                  className="px-2 md:px-4 py-1 md:py-2 bg-white text-orange-600 rounded-md text-xs md:text-sm font-semibold hover:bg-orange-100 transition"
                >
                  Provider
                </Link>
              )}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-2 md:px-4 py-1 md:py-2 bg-yellow-400 text-gray-800 rounded-md text-xs md:text-sm font-semibold hover:bg-yellow-300 transition"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="px-2 md:px-4 py-1 md:py-2 bg-red-500 text-white rounded-md text-xs md:text-sm font-semibold hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-2 md:px-4 py-1 md:py-2 border-2 border-white text-white rounded-md text-xs md:text-sm font-semibold hover:bg-white hover:text-orange-600 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-2 md:px-4 py-1 md:py-2 bg-white text-orange-600 rounded-md text-xs md:text-sm font-semibold hover:bg-orange-100 transition"
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