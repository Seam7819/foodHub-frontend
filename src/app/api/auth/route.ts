import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

const findUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  const response = {
    accessToken: `mock-token-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessName: user.businessName,
      address: user.address,
    },
  };

  return NextResponse.json({ data: response });
}

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "Missing authorization token." }, { status: 401 });
  }

  const userId = token.replace(/^mock-token-/, "");
  const user = users.find((entry) => entry.id === userId);

  if (!user) {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 });
  }

  return NextResponse.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role, businessName: user.businessName, address: user.address } });
}
