"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import axiosInstance from "@/src/lib/axiosInstance";
import { clearCart } from "@/src/utils/cart";
import { toast } from "sonner";
import { createOrder } from "@/src/services/order.service";

export default function StripeSuccessPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orderCreated, setOrderCreated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Processing your payment...");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const handleOrderCreation = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      try {
        // Wait for auth to load
        if (authLoading) {
          console.log("Auth still loading...");
          setStatusMessage("Loading user information...");
          return;
        }

        if (!user?.id) {
          console.error("No user found after auth loading");
          setStatusMessage("User not found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("[SUCCESS PAGE] Creating order for user:", user.id);
        setStatusMessage("Fetching your cart...");

        // Get cart items from localStorage (stored during checkout)
        const storedCartJson = localStorage.getItem("cartora_checkout_items");
        const cartItems = storedCartJson ? JSON.parse(storedCartJson) : [];

        console.log("[SUCCESS PAGE] Cart items from localStorage:", cartItems);

        if (cartItems.length === 0) {
          console.log("Cart is empty, skipping order creation");
          setStatusMessage("Your cart is empty.");
          setLoading(false);
          return;
        }

        setStatusMessage("Creating your order...");

        // Get delivery address from localStorage
        const deliveryAddress = localStorage.getItem("cartora_delivery_address") || "Not provided";

        // Create order with cart items
        type CartItem = {
          mealId?: string;
          meal?: {
            name?: string;
            price?: number;
            providerId?: string;
          };
          quantity: number;
        };

        const cartItemsTyped = cartItems as CartItem[];

        const totalPrice = cartItemsTyped.reduce(
          (sum: number, item: CartItem) => sum + (item.meal?.price || 0) * item.quantity,
          0
        );

        const orderPayload = {
          userId: user.id,
          items: cartItemsTyped.map((item: CartItem) => ({
            mealId: item.mealId,
            mealName: item.meal?.name || "Unknown Meal",
            quantity: item.quantity,
            price: item.meal?.price || 0,
            providerId: item.meal?.providerId,
          })),
          deliveryAddress,
          totalPrice,
          status: "PLACED",
        };

        console.log("Order payload:", orderPayload);
        console.log("[SUCCESS PAGE] About to create order");

        const orderResponse = await createOrder(orderPayload);

        console.log("[SUCCESS PAGE] Order response:", orderResponse);
        console.log("[SUCCESS PAGE] Order response?.data:", orderResponse?.data);
        console.log("[SUCCESS PAGE] Order response?.data?.id:", orderResponse?.data?.id);
        console.log("[SUCCESS PAGE] Order response?.data?.userId:", orderResponse?.data?.userId);

        if (orderResponse?.data) {
          console.log("[SUCCESS PAGE] Order created successfully:", orderResponse.data);
          setOrderCreated(true);
          setStatusMessage("✓ Order created successfully!");
          toast.success("Order created successfully!");

          // Clear cart on server and locally
          try {
            await axiosInstance.delete("/cart");
            // Clear local delivery address, stored cart items, and local cart storage
            localStorage.removeItem("cartora_delivery_address");
            localStorage.removeItem("cartora_checkout_items");
            try {
              clearCart(user?.id);
            } catch (e) {
              // If clearing local cart fails, log but continue
              console.error("Failed to clear local cart", e);
            }
          } catch (err) {
            console.error("Failed to clear cart", err);
          }

          // Redirect to profile immediately
          console.log("Redirecting to profile...");
          router.push("/profile?refresh=true");
        }
      } catch (error) {
        console.error("Failed to create order:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error details:", errorMessage);
        setStatusMessage("Order processing issue. Your order may already be created.");
        toast.error("Checking your orders...");
        // Still redirect to profile so user can see their order
        setTimeout(() => {
          console.log("Redirecting to profile after error");
          router.push("/profile?refresh=true");
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      handleOrderCreation();
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
          color: orderCreated ? '#16a34a' : '#ea580c'
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
                href="/profile?refresh=true"
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
