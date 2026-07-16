import { meals as products } from "@/src/lib/mockData";

export type Order = {
  id: string;
  items: Array<any>;
  totalPrice: number;
  status: string;
  userId: string;
  providerId: string;
  deliveryAddress?: string;
  createdAt?: string;
  user?: {
    name?: string;
    email?: string;
  };
};

const STORAGE_KEY = "cartora_orders";

const readStoredOrders = (): Order[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistOrders = (nextOrders: Order[]) => {
  if (typeof window === "undefined") {
    return nextOrders;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
  } catch {
    // Ignore storage failures and keep the in-memory array available.
  }

  return nextOrders;
};

const seededOrders: Order[] = [
  {
    id: "order-1",
    items: [products[0]],
    totalPrice: products[0].price,
    status: "PLACED",
    userId: "user-1",
    providerId: products[0].providerId,
    deliveryAddress: "123 Example Avenue",
    createdAt: new Date().toISOString(),
  },
];

const storedOrders = readStoredOrders();

export const orders: Order[] = storedOrders.length > 0 ? storedOrders : seededOrders;

export const syncOrders = () => {
  const stored = readStoredOrders();
  console.log("[syncOrders] Stored orders from localStorage:", stored);
  if (stored.length > 0) {
    orders.splice(0, orders.length, ...stored);
  }

  console.log("[syncOrders] In-memory orders array:", orders);
  return orders;
};

export const addOrderToStore = (order: Order) => {
  console.log("[addOrderToStore] Adding order:", order);
  const existingIndex = orders.findIndex((item) => item.id === order.id);

  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.push(order);
  }

  console.log("[addOrderToStore] Orders array after add:", orders);
  const persisted = persistOrders(orders);
  console.log("[addOrderToStore] Orders persisted to localStorage:", persisted);
  return persisted;
};

export const replaceOrders = (nextOrders: Order[]) => {
  orders.splice(0, orders.length, ...nextOrders);
  return persistOrders(orders);
};

export const getOrderById = (id: string) => orders.find((order) => order.id === id);
