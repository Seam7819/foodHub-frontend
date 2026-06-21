import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";

export async function GET() {
  return NextResponse.json({ data: orders });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body || {};

  if (!id || !status) {
    return NextResponse.json({ message: "Order id and status are required." }, { status: 400 });
  }

  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  orders[index] = {
    ...orders[index],
    status,
  };

  return NextResponse.json({ data: orders[index] });
}
