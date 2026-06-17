export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

const CART_KEY = "foodhub_cart";
const CART_EVENT = "foodhub_cart_update";

const getCartKey = (userId?: string) =>
  userId ? `${CART_KEY}_${userId}` : CART_KEY;

export const getCartItems = (userId?: string): CartItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(getCartKey(userId)) || "[]");
};

export const setCartItems = (
  items: CartItem[],
  userId?: string
) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(getCartKey(userId), JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
};

export const addCartItem = (
  item: CartItem,
  userId?: string
) => {
  const cart = getCartItems(userId);
  const existing = cart.find((cartItem) => cartItem.id === item.id);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  setCartItems(cart, userId);
};

export const removeCartItem = (
  id: string,
  userId?: string
) => {
  setCartItems(
    getCartItems(userId).filter((item) => item.id !== id),
    userId
  );
};

export const updateCartItemQuantity = (
  id: string,
  quantity: number,
  userId?: string
) => {
  const updated = getCartItems(userId).map((item) =>
    item.id === id
      ? { ...item, quantity: Math.max(1, quantity) }
      : item
  );

  setCartItems(updated, userId);
};

export const clearCart = (userId?: string) => {
  setCartItems([], userId);
};

export const getCartCount = (userId?: string) => {
  return getCartItems(userId).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
};

export const listenCartUpdates = (
  callback: () => void
) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(CART_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};
