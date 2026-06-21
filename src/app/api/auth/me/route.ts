import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Missing authorization token." }, { status: 401 });
  }

  const userId = token.replace(/^mock-token-/, "");
  const user = users.find((entry) => entry.id === userId);

  if (!user) {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 });
  }

  return NextResponse.json({ data: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: user.businessName,
    address: user.address,
  }});
}
