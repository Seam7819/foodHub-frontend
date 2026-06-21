import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

const sanitizeUser = (user: any) => {
  const { password, ...rest } = user;
  return rest;
};

export async function GET() {
  return NextResponse.json({ data: users.map(sanitizeUser) });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body || {};

  if (!id) {
    return NextResponse.json({ message: "User id is required." }, { status: 400 });
  }

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  users[index] = {
    ...users[index],
    ...updates,
  } as any;

  return NextResponse.json({ data: sanitizeUser(users[index]) });
}
