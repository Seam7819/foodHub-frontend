import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name, role } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
  }

  const existingUser = users.find((entry) => entry.email === email);
  if (existingUser) {
    return NextResponse.json({ message: "User already exists." }, { status: 409 });
  }

  const newUser = {
    id: `user-${users.length + 1}`,
    name,
    email,
    password,
    role: role || "CUSTOMER",
    businessName: body.businessName || null,
    address: body.address || null,
  };

  users.push(newUser as any);

  return NextResponse.json({ data: { message: "Registration successful." } });
}
