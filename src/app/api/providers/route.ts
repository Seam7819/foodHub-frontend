import { NextResponse } from "next/server";
import { providers } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json({ data: providers });
}
