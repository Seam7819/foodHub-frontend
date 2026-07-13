import { meals } from "@/src/lib/mockData";

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

export const orders: Order[] = [
  {
    id: "order-1",
    items: [meals[0]],
    totalPrice: meals[0].price,
    status: "PLACED",
    userId: "user-1",
    providerId: meals[0].providerId,
    deliveryAddress: "123 Example Avenue",
    createdAt: new Date().toISOString(),
  },
];

export const getOrderById = (id: string) => orders.find((order) => order.id === id);
