import { NextResponse } from "next/server";
import { categories } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json({ data: categories });
}
