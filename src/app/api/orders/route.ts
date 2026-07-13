import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";
import { getUserIdFromAuth } from "@/src/lib/cartStore";
import { users } from "@/src/lib/mockData";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";

  const userOrders = orders.filter((o) => o.userId === userId);

  return NextResponse.json({ data: userOrders });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";
  const user = users.find((u) => u.id === userId);

  const body = await request.json();

  const total = Array.isArray(body.items)
    ? body.items.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0)
    : body.totalPrice || 0;

  const newOrder = {
    id: `order-${Date.now()}`,
    items: body.items || [],
    totalPrice: total,
    status: body.status || "PLACED",
    userId,
    providerId: body.items && body.items.length > 0 ? body.items[0].providerId : null,
    deliveryAddress: body.deliveryAddress || null,
    createdAt: new Date().toISOString(),
    user: user ? { name: user.name, email: user.email } : undefined,
  };

  orders.push(newOrder as any);

  return NextResponse.json({ data: newOrder });
}
