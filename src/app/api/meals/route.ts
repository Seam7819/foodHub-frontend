import { NextResponse } from "next/server";
import { categories, meals, providers, users } from "@/src/lib/mockData";
import { getUserIdFromAuth } from "@/src/lib/cartStore";

export async function GET() {
  return NextResponse.json({ data: meals });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const userId = getUserIdFromAuth(authHeader) || "guest";
  const user = users.find((u) => u.id === userId);

  const body = await request.json();
  const { name, description, price, image, categoryId, providerId: requestedProviderId } = body;

  if (!name || !description || !price || !categoryId) {
    return NextResponse.json({ message: "name, description, price, and categoryId are required" }, { status: 400 });
  }

  const category = categories.find((cat) => cat.id === categoryId);
  const providerId =
    user?.role === "PROVIDER"
      ? user.id
      : requestedProviderId || providers[0]?.id || "provider-1";
  const provider = providers.find((p) => p.id === providerId) ?? {
    id: providerId,
    name: "Unknown Provider",
    businessName: "Unknown Provider",
  };

  const newMeal = {
    id: `meal-${meals.length + 1}`,
    name,
    description,
    price: Number(price),
    image: image || "",
    categoryId,
    categoryName: category?.name || "Unknown",
    providerId,
    provider,
  };

  meals.push(newMeal as any);
  return NextResponse.json({ data: newMeal });
}
