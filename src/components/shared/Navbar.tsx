"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-orange-500"
        >
          FoodHub
        </Link>

        <div className="flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/meals">Meals</Link>
          <Link href="/providers">Providers</Link>
        </div>

        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span>{user?.name}</span>

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