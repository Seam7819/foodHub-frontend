import { NextResponse } from "next/server";
import { meals as products } from "@/src/lib/mockData";
import { carts, getUserIdFromAuth } from "@/src/lib/cartStore";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";

  const body = await request.json();
  const { mealId, quantity } = body;

  if (!mealId || !quantity) {
    return NextResponse.json({ message: "mealId and quantity required" }, { status: 400 });
  }

  const meal = products.find((m) => m.id === mealId || m.id === `meal-${mealId}`);

  const item = {
    id: `cart-${Date.now()}`,
    mealId,
    quantity,
    meal: meal || null,
  };

  if (!carts[userId]) carts[userId] = [];
  carts[userId].push(item);

  return NextResponse.json({ data: carts[userId] });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";

  return NextResponse.json({ data: carts[userId] || [] });
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";

  if (carts[userId]) {
    carts[userId] = [];
  }

  return NextResponse.json({ data: [], message: "Cart cleared" });
}
