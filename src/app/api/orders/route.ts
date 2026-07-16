import { NextResponse } from "next/server";
import { orders, addOrderToStore, syncOrders } from "@/src/lib/orderStore";
import { getUserIdFromAuth } from "@/src/lib/cartStore";
import { users } from "@/src/lib/mockData";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  console.log("[GET /api/orders] Auth header:", authHeader);
  
  const userId = getUserIdFromAuth(authHeader) || "guest";
  console.log("[GET /api/orders] Extracted userId:", userId);

  syncOrders();
  console.log("[GET /api/orders] All synced orders:", orders);
  
  const userOrders = orders.filter((o) => o.userId === userId);
  console.log("[GET /api/orders] Filtered orders for userId", userId, ":", userOrders);

  return NextResponse.json({ data: userOrders });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const body = await request.json();
  console.log("[POST /api/orders] Auth header:", authHeader);
  console.log("[POST /api/orders] Request body:", body);
  
  const resolvedUserId = getUserIdFromAuth(authHeader) || body?.userId || body?.user?.id || "guest";
  console.log("[POST /api/orders] Resolved userId:", resolvedUserId);
  
  const user = users.find((u) => u.id === resolvedUserId);
  console.log("[POST /api/orders] Found user:", user?.name, "(", resolvedUserId, ")");

  const total = Array.isArray(body.items)
    ? body.items.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0)
    : body.totalPrice || 0;

  const newOrder = {
    id: `order-${Date.now()}`,
    items: body.items || [],
    totalPrice: total,
    status: body.status || "PLACED",
    userId: resolvedUserId,
    providerId: body.items && body.items.length > 0 ? body.items[0].providerId : null,
    deliveryAddress: body.deliveryAddress || null,
    createdAt: new Date().toISOString(),
    user: user ? { name: user.name, email: user.email } : undefined,
  };

  console.log("[POST /api/orders] Created order:", newOrder);
  addOrderToStore(newOrder as any);
  console.log("[POST /api/orders] Orders after store:", orders);

  return NextResponse.json({ data: newOrder });
}
