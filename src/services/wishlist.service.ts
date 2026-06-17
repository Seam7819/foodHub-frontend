export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

const WISHLIST_KEY = "foodhub_wishlist";

const getWishlistKey = (userId?: string) =>
  userId ? `${WISHLIST_KEY}_${userId}` : WISHLIST_KEY;

export const getWishlistItems = (userId?: string): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(getWishlistKey(userId)) || "[]") as WishlistItem[];
};

export const addWishlistItem = (
  item: WishlistItem,
  userId?: string
) => {
  if (typeof window === "undefined") return;
  const wishlist = getWishlistItems(userId);
  if (!wishlist.some((entry) => entry.id === item.id)) {
    wishlist.push(item);
  }
  localStorage.setItem(getWishlistKey(userId), JSON.stringify(wishlist));
};

export const removeWishlistItem = (
  id: string,
  userId?: string
) => {
  if (typeof window === "undefined") return;
  const wishlist = getWishlistItems(userId).filter(
    (item: any) => item.id !== id
  );
  localStorage.setItem(getWishlistKey(userId), JSON.stringify(wishlist));
};

export const isWishlisted = (id: string, userId?: string) => {
  return getWishlistItems(userId).some(
    (item: any) => item.id === id
  );
};

export const clearWishlist = (userId?: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getWishlistKey(userId));
};
