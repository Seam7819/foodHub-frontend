import { NextResponse } from "next/server";
import { carts, getUserIdFromAuth } from "@/src/lib/cartStore";

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";

  carts[userId] = [];

  return NextResponse.json({ data: { message: "Cart cleared" } });
}
