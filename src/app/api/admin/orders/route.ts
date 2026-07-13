import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";
import { getUserIdFromAuth } from "@/src/lib/cartStore";
import { users } from "@/src/lib/mockData";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";
  const user = users.find((u) => u.id === userId);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  return NextResponse.json({ data: orders });
}
