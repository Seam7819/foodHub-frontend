import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";
import { getUserIdFromAuth } from "@/src/lib/cartStore";

export async function PATCH(request: Request, ctx: any) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";

  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");

  const order = orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  if (order.userId !== userId) {
    return NextResponse.json({ message: "Not authorized to cancel this order" }, { status: 403 });
  }

  // Only allow cancel if placed or preparing
  if (order.status && order.status.toUpperCase() === "DELIVERED") {
    return NextResponse.json({ message: "Cannot cancel delivered order" }, { status: 400 });
  }

  order.status = "CANCELLED";

  return NextResponse.json({ data: order });
}
