import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

const sanitizeUser = (user: any) => {
  const { password, ...rest } = user;
  return rest;
};

export async function GET(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");

  const user = users.find((entry) => entry.id === id);
  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ data: sanitizeUser(user) });
}

export async function PATCH(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const body = await request.json();

  const index = users.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  users[index] = {
    ...users[index],
    ...body,
  } as any;

  return NextResponse.json({ data: sanitizeUser(users[index]) });
}

export async function DELETE(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");

  const index = users.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  const removedUser = users.splice(index, 1)[0];
  return NextResponse.json({ data: sanitizeUser(removedUser) });
}
