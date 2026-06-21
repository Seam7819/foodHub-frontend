import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";

export async function GET() {
  return NextResponse.json({ data: orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = `order-${orders.length + 1}`;
  const providerId =
    body.providerId ||
    (Array.isArray(body.items) && body.items[0]?.providerId) ||
    "provider-1";

  const newOrder = {
    id,
    providerId,
    ...body,
  };

  orders.push(newOrder as any);
  return NextResponse.json({ data: newOrder });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  // Support cancel endpoint: { action: 'cancel', id }
  if (body && body.action === "cancel" && body.id) {
    const idx = orders.findIndex((o) => o.id === body.id);
    if (idx === -1) return NextResponse.json({ message: "Order not found" }, { status: 404 });
    orders[idx].status = "cancelled";
    return NextResponse.json({ data: orders[idx] });
  }

  return NextResponse.json({ message: "Unsupported patch" }, { status: 400 });
}
