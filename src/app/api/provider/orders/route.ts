import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";
import { getUserIdFromAuth } from "@/src/lib/cartStore";
import { users } from "@/src/lib/mockData";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? request.headers.get("Authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader);

  if (!userId) {
    return NextResponse.json({ message: "Missing or invalid authorization token." }, { status: 401 });
  }

  const user = users.find((u) => u.id === userId);

  if (!user || user.role !== "PROVIDER") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  // Return orders for this provider
  const providerOrders = orders.filter((o) => o.providerId === userId);
  return NextResponse.json({ data: providerOrders });
}
