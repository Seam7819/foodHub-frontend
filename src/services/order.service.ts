import axiosInstance from "@/src/lib/axiosInstance";
import { addOrderToStore, replaceOrders, syncOrders } from "@/src/lib/orderStore";

type OrderItem = {
  price?: number;
  quantity?: number;
};

type OrderPayload = {
  userId?: string;
  items?: OrderItem[];
  totalPrice?: number;
  status?: string;
  deliveryAddress?: string;
};

const getCurrentUserId = () => {
  if (typeof window === "undefined") return "";

  const token = window.localStorage.getItem("accessToken") || "";
  return token.replace(/^Bearer\s+/i, "").replace(/^mock-token-/, "").replace(/^mock-refresh-/, "");
};

const getAuthHeaders = () => {
  if (typeof window === "undefined") return undefined;

  const token = window.localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const createOrder = async (payload: OrderPayload) => {
  try {
    console.log("[createOrder] Creating order with payload:", payload);
    console.log("[createOrder] Current userId from token:", getCurrentUserId());
    
    const res = await axiosInstance.post("/orders", payload, {
      headers: getAuthHeaders(),
    });

    console.log("[createOrder] API response:", res.data);

    if (res.data?.data) {
      console.log("[createOrder] Order created on server, adding to store:", res.data.data);
      addOrderToStore(res.data.data);
    }

    return res.data;
  } catch (error) {
    console.error("[createOrder] API error:", error);
    const fallbackOrder = {
      id: `order-${Date.now()}`,
      items: payload.items || [],
      totalPrice: payload.totalPrice ?? 0,
      status: payload.status || "PLACED",
      userId: payload.userId || getCurrentUserId() || "guest",
      providerId: null,
      deliveryAddress: payload.deliveryAddress || null,
      createdAt: new Date().toISOString(),
    };

    console.log("[createOrder] Creating fallback order:", fallbackOrder);
    addOrderToStore(fallbackOrder as any);
    return { data: fallbackOrder, fallback: true, error };
  }
};

export const getMyOrders = async () => {
  try {
    const currentUserId = getCurrentUserId();
    console.log("[getMyOrders] Fetching orders for userId:", currentUserId);
    
    const res = await axiosInstance.get("/orders");
    const nextOrders = Array.isArray(res.data?.data) ? res.data.data : [];
    
    console.log("[getMyOrders] API returned orders:", nextOrders);
    console.log("[getMyOrders] API orders count:", nextOrders.length);

    if (nextOrders.length > 0) {
      console.log("[getMyOrders] Using API orders");
      return { data: nextOrders };
    }

    // If API returns empty, check localStorage
    const fallbackOrders = syncOrders().filter((order: { userId?: string }) => {
      if (!currentUserId) return true;
      return order.userId === currentUserId;
    });
    
    console.log("[getMyOrders] Fallback orders from localStorage:", fallbackOrders);
    console.log("[getMyOrders] All stored orders:", syncOrders());
    
    return { data: fallbackOrders };
  } catch (error) {
    console.error("[getMyOrders] API error:", error);
    const fallbackOrders = syncOrders();
    console.log("[getMyOrders] Returning fallback orders after error:", fallbackOrders);
    return { data: fallbackOrders };
  }
};

export const getOrders = async () => {
  const res = await axiosInstance.get("/orders");
  return res.data;
};

export const cancelOrder = async (id: string) => {
  const res = await axiosInstance.patch(`/orders/cancel/${id}`);
  return res.data;
};
