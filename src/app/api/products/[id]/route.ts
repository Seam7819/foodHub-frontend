import { NextResponse } from "next/server";
import { meals } from "@/src/lib/mockData";

export async function GET(request: Request, ctx: any) {
  const params = await ctx.params;
  const idRaw = params?.id;
  const id = typeof idRaw === "string" ? idRaw : String(idRaw || "");

  let product = meals.find((m) => m.id === id);

  if (!product) {
    product = meals.find((m) => m.id === `meal-${id}`);
  }

  if (!product && id) {
    product = meals.find((m) => (m.id || "").toLowerCase().includes(id.toLowerCase()));
  }

  if (!product && id) {
    product = meals.find((m) => (m.name || "").toLowerCase().includes(id.toLowerCase()));
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
  const index = meals.findIndex((m) => m.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const updated = Object.assign(meals[index], body);
  meals[index] = updated as any;

  return NextResponse.json({ data: updated });
}

export async function DELETE(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const index = meals.findIndex((m) => m.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  meals.splice(index, 1);

  return NextResponse.json({ data: { message: "Deleted" } });
}
