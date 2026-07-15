import { NextResponse } from "next/server";
import { categories } from "@/src/lib/mockData";

const resolveCategoryId = async (
  request: Request,
  ctx: { params?: Promise<{ id?: string }> | { id?: string } | unknown }
) => {
  const params = await (ctx.params as Promise<{ id?: string }> | { id?: string } | undefined);
  const rawId = typeof params === "object" && params !== null ? params.id : undefined;
  const id = typeof rawId === "string" ? rawId : String(rawId ?? "");

  if (id) {
    return id;
  }

  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const categoryIndex = segments.findIndex((segment) => segment === "categories");

  if (categoryIndex >= 0 && segments[categoryIndex + 1]) {
    return segments[categoryIndex + 1];
  }

  return "";
};

export async function GET(request: Request, ctx: { params?: Promise<{ id?: string }> | { id?: string } | unknown }) {
  const id = await resolveCategoryId(request, ctx);
  const category = categories.find((item) => item.id === id);

  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ data: category });
}

export async function PATCH(
  request: Request,
  ctx: { params?: Promise<{ id?: string }> | { id?: string } | unknown }
) {
  const id = await resolveCategoryId(request, ctx);
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();

  if (!name) {
    return NextResponse.json({ message: "Category name is required" }, { status: 400 });
  }

  const index = categories.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  categories[index] = { ...categories[index], name };

  return NextResponse.json({ data: categories[index] });
}

export async function DELETE(
  request: Request,
  ctx: { params?: Promise<{ id?: string }> | { id?: string } | unknown }
) {
  const id = await resolveCategoryId(request, ctx);
  const index = categories.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  const [removed] = categories.splice(index, 1);

  return NextResponse.json({ data: removed });
}
