import { NextResponse } from "next/server";
import { clearMLTokens } from "@/lib/ml-auth";

export async function POST() {
  await clearMLTokens();
  return NextResponse.json({ success: true }, { status: 200 });
}
