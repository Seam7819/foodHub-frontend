import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";
import { getUserIdFromAuth } from "@/src/lib/cartStore";
import { users } from "@/src/lib/mockData";

export async function PATCH(request: Request, ctx: any) {
  const authHeader = request.headers.get("authorization") ?? request.headers.get("Authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader);

  if (!userId) {
    return NextResponse.json({ message: "Missing or invalid authorization token." }, { status: 401 });
  }

  const user = users.find((u) => u.id === userId);

  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");

  if (!user || (user.role !== "PROVIDER" && user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const body = await request.json();
  const { status } = body;

  const order = orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  // Providers can only update orders that belong to them
  if (user.role === "PROVIDER" && order.providerId !== userId) {
    return NextResponse.json({ message: "Not authorized to update this order" }, { status: 403 });
  }

  if (status) order.status = status;

  return NextResponse.json({ data: order });
}
