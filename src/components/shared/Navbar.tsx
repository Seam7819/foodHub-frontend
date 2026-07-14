"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCartCount, listenCartUpdates } from "@/src/utils/cart";
import ThemeToggle from "@/src/components/shared/ThemeToggle";
import { useTheme } from "@/src/providers/ThemeProvider";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const userId = user?.id || undefined;

  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    setCartCount(getCartCount(userId));
    return listenCartUpdates(() => {
      setCartCount(getCartCount(userId));
    });
  }, [userId]);

  // Close mobile menu on Escape and lock body scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="bg-linear-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-md">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className={`text-xl md:text-2xl font-bold hover:text-slate-100 transition ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Cartora
        </Link>

        <div className={`hidden md:flex gap-6 items-center text-sm md:text-base ${isLight ? 'text-slate-700' : 'text-white'}`}>
          <Link href="/" className="hover:text-slate-100 transition">Home</Link>
          <Link href="/products" className="hover:text-slate-100 transition">Products</Link>
          <Link href="/about" className="hover:text-slate-100 transition">About</Link>
          <Link href="/contact" className="hover:text-slate-100 transition">Contact</Link>
          <Link href="/blog" className="hover:text-slate-100 transition">Blog</Link>
          <Link href="/wishlist" className="hover:text-slate-100 transition">Wishlist</Link>
          <Link href="/cart" className="relative hover:text-slate-100 transition">
            Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-slate-900 px-2 text-xs font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex gap-2 md:gap-3 items-center flex-wrap justify-end">
          <ThemeToggle />

          <button
            type="button"
            className={`rounded-md p-2 md:hidden ${isLight ? 'border border-slate-300 text-slate-700' : 'border border-white/40 text-white'}`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>

          <Link href="/cart" className={`md:hidden relative p-2 hover:text-orange-100 transition ${isLight ? 'text-slate-700' : 'text-white'}`}>
            Cart
            {cartCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-orange-600 px-1.5 text-xs font-semibold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className={`hidden sm:inline text-xs md:text-sm font-semibold px-3 py-1 rounded-md transition ${isLight ? 'text-slate-800 hover:bg-orange-100' : 'text-white hover:bg-orange-700'}`}
                >
                  {user?.name}
                </Link>
              ) : user?.role === "PROVIDER" ? (
                <Link
                  href="/provider/dashboard"
                  className={`hidden sm:inline text-xs md:text-sm font-semibold px-3 py-1 rounded-md transition ${isLight ? 'text-slate-800 hover:bg-orange-100' : 'text-white hover:bg-orange-700'}`}
                >
                  {user?.name}
                </Link>
              ) : (
                <Link
                  href="/profile"
                  className={`hidden sm:inline text-xs md:text-sm font-semibold px-3 py-1 rounded-md transition ${isLight ? 'text-slate-800 hover:bg-orange-100' : 'text-white hover:bg-orange-700'}`}
                >
                  {user?.name}
                </Link>
              )}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold transition ${isLight ? 'bg-white text-orange-600 hover:bg-orange-50' : 'bg-white text-orange-600 hover:bg-orange-100'}`}
                >
                  Admin
                </Link>
              )}

              {user?.role === "PROVIDER" && (
                <Link
                  href="/provider/dashboard"
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold transition ${isLight ? 'bg-white text-orange-600 hover:bg-orange-50' : 'bg-white text-orange-600 hover:bg-orange-100'}`}
                >
                  Provider
                </Link>
              )}

              <button
                onClick={logout}
                className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold hover:bg-red-600 transition ${isLight ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`hidden sm:inline px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold transition ${isLight ? 'border-2 border-slate-300 text-slate-900 hover:bg-white hover:text-orange-600' : 'border-2 border-white text-white hover:bg-white hover:text-orange-600'}`}
              >
                Login
              </Link>

              <Link
                href="/register"
                className={`hidden sm:inline px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold transition ${isLight ? 'bg-white text-orange-600 hover:bg-orange-50' : 'bg-white text-orange-600 hover:bg-orange-100'}`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        </div>
      </div>

      {mobileMenuOpen && (
        // overlay + panel for mobile nav
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />

          <div
            id="mobile-navigation"
            ref={menuRef}
            className="fixed right-0 top-0 z-50 h-full w-72 overflow-auto border-l border-white/10 bg-orange-600 px-6 py-6 text-white"
          >
            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>

              {!user ? (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="text-left">Logout</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;