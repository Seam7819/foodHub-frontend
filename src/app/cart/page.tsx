"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";
import { addToCart as addCartItemServer, clearServerCart } from "@/src/services/cart.service";
import { createCheckoutSession } from "@/src/services/stripe.service";
import {
  CartItem,
  clearCart as clearCartStorage,
  getCartItems,
  listenCartUpdates,
  setCartItems,
} from "@/src/utils/cart";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setCart(getCartItems(user.id));
    } else {
      setCart([]);
    }

    return listenCartUpdates(() => {
      if (user?.id) {
        setCart(getCartItems(user.id));
      }
    });
  }, [user?.id]);

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const updateQuantity = (
    itemId: string,
    value: number
  ) => {
    const updated = cart.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(1, value) }
        : item
    );

    setCart(updated);
    setCartItems(updated, user?.id);
  };

  const removeItem = (itemId: string) => {
    const updated = cart.filter((item) => item.id !== itemId);
    setCart(updated);
    setCartItems(updated, user?.id);
  };

  const clearCart = () => {
    setCart([]);
    clearCartStorage(user?.id);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!user) {
      toast.error("Please login to place your order.");
      router.push("/login");
      return;
    }

    // Check if user is a provider or admin
    if (user.role === "PROVIDER" || user.role === "ADMIN") {
      toast.error("Providers and Admins cannot place orders. Please use a customer account.");
      return;
    }

    setIsSubmitting(true);

    try {
      const address = deliveryAddress.trim();

      if (!address) {
        setValidationError("Please enter a delivery address.");
        setIsSubmitting(false);
        return;
      }

      if (address.length < 5) {
        setValidationError("Delivery address is too short. Please provide at least 5 characters.");
        setIsSubmitting(false);
        return;
      }

      await clearServerCart();

      for (const item of cart) {
        await addCartItemServer({
          mealId: item.id,
          quantity: item.quantity,
        });
      }

      const session = await createCheckoutSession({
        deliveryAddress: address,
        items: cart,
      });

      if (!session?.url) {
        throw new Error("Unable to start Stripe checkout. Please try again.");
      }

      window.location.href = session.url;
    } catch (error: any) {
      console.error("Full Error Object:", error);
      console.error("Error Status:", error.response?.status);
      console.error("Error Data:", error.response?.data);
      console.error("Error Message:", error.message);
      
      if (error.response?.status === 403) {
        toast.error("You don't have permission to place orders. Please contact support.");
      } else {
        toast.error("Failed to submit order. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Cart</h1>
          <p className="text-gray-600">Review cart items before checkout.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/meals")}
          className="rounded bg-orange-500 px-4 py-2 text-white"
        >
          Continue Shopping
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-[120px_1fr_auto]"
            >
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded border px-3 py-1"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="rounded border px-3 py-1"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between gap-3">
                <span className="text-lg font-semibold">৳ {item.price * item.quantity}</span>
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

          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-3xl font-bold">৳ {cartTotal}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded border px-4 py-2"
                >
                  Clear Cart
                </button>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="rounded bg-orange-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold text-slate-900">Validation Error</p>
              <p className="mt-2 text-sm text-gray-600">Please update the delivery address before checkout.</p>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
              {validationError}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="rounded bg-orange-500 px-4 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
