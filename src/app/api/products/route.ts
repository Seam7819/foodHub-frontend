import { NextResponse } from "next/server";
import { meals } from "@/src/lib/mockData";

// Temporary products API backed by the same mock data (meals)
export async function GET() {
  return NextResponse.json({ data: meals });
}
