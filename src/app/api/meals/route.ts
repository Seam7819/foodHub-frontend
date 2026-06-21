import { NextResponse } from "next/server";
import { meals } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json({ data: meals });
}
