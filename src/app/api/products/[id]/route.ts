import { NextResponse } from "next/server";
import { meals as products } from "@/src/lib/mockData";

export async function GET(request: Request, ctx: any) {
  const params = await ctx.params;
  const idRaw = params?.id;
  const id = typeof idRaw === "string" ? idRaw : String(idRaw || "");

  let product = products.find((m) => m.id === id);

  if (!product) {
    product = products.find((m) => m.id === `meal-${id}`);
  }

  if (!product && id) {
    product = products.find((m) => (m.id || "").toLowerCase().includes(id.toLowerCase()));
  }

  if (!product && id) {
    product = products.find((m) => (m.name || "").toLowerCase().includes(id.toLowerCase()));
  }

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}

export async function PATCH(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const body = await request.json();
  const index = products.findIndex((m) => m.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const updated = Object.assign(products[index], body);
  products[index] = updated as any;

  return NextResponse.json({ data: updated });
}

export async function DELETE(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const index = products.findIndex((m) => m.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  products.splice(index, 1);

  return NextResponse.json({ data: { message: "Deleted" } });
}
