import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";

export async function GET(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const order = orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ data: order });
}

export async function PATCH(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const body = await request.json();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  orders[idx] = { ...orders[idx], ...body };
  return NextResponse.json({ data: orders[idx] });
}

export async function DELETE(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  orders.splice(idx, 1);
  return NextResponse.json({ data: { message: "Deleted" } });
}
