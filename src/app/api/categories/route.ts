import { NextResponse } from "next/server";
import { categories } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json({ data: categories });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();

  if (!name) {
    return NextResponse.json({ message: "Category name is required" }, { status: 400 });
  }

  const existing = categories.find((item) => item.name.toLowerCase() === name.toLowerCase());

  if (existing) {
    return NextResponse.json({ message: "Category already exists" }, { status: 409 });
  }

  const newCategory = {
    id: `cat-${Date.now()}`,
    name,
  };

  categories.push(newCategory);

  return NextResponse.json({ data: newCategory }, { status: 201 });
}
