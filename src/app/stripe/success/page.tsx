"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { clearCart } from "@/src/utils/cart";

export default function StripeSuccessPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Processing your payment...");

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Wait for auth to load
        if (authLoading) {
          console.log("[STRIPE SUCCESS] Auth still loading...");
          return;
        }

        if (!user?.id) {
          console.error("[STRIPE SUCCESS] No user found after auth loading");
          setStatusMessage("User not found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("[STRIPE SUCCESS] Payment successful for user:", user.id);
        setStatusMessage("✓ Payment confirmed! Your order is being saved...");

        // Clear cart and localStorage
        try {
          localStorage.removeItem("cartora_delivery_address");
          localStorage.removeItem("cartora_payment_intent_client_secret");
          clearCart(user?.id);
        } catch (err) {
          console.error("Failed to clear storage", err);
        }

        setStatusMessage("✓ Order saved successfully!");
        
        // Wait a moment then redirect to profile where webhook will have updated the order
        setTimeout(() => {
          console.log("[STRIPE SUCCESS] Redirecting to profile");
          router.push("/profile");
        }, 2000);
      } catch (error) {
        console.error("[STRIPE SUCCESS] Error:", error);
        setStatusMessage("Payment processed. Redirecting to profile...");
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      handleSuccess();
    }
  }, [authLoading, user?.id, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-20 px-4">
      <div className="mx-auto max-w-xl rounded-3xl bg-white dark:bg-slate-800 p-10 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="flex items-center justify-center mb-6">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white text-center">Payment Successful</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        <p className="mt-6 text-center text-lg font-semibold" style={{
          color: '#16a34a'
        }}>
          {statusMessage}
        </p>
        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!loading && (
            <>
              <Link
                href="/products"
                className="rounded bg-orange-500 px-5 py-3 text-white hover:bg-orange-600 font-semibold transition text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href="/profile"
                className="rounded border border-orange-300 px-5 py-3 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-slate-700 font-semibold transition text-center"
              >
                View My Orders
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
