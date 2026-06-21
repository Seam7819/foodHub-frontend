import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

export async function PATCH(request: Request, ctx: any) {
  const params = await ctx.params;
  const id = typeof params?.id === "string" ? params.id : String(params?.id || "");
  const body = await request.json();

  if (!body?.status) {
    return NextResponse.json({ message: "Status is required." }, { status: 400 });
  }

  const index = users.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  users[index] = {
    ...users[index],
    status: body.status,
  } as any;

  return NextResponse.json({ data: { id, status: users[index].status } });
}
