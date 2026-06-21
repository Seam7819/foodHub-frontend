import { NextResponse } from "next/server";
import { orders } from "@/src/lib/orderStore";

export async function PATCH(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const body = await request.json();

  if (!body?.status) {
    return NextResponse.json({ message: "Status is required." }, { status: 400 });
  }

  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  orders[index] = {
    ...orders[index],
    status: body.status,
  };

  return NextResponse.json({ data: orders[index] });
}
