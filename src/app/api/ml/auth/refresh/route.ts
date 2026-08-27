import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/ml-auth";

export async function GET() {
  try {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return NextResponse.json({ access_token: null });
    }
    return NextResponse.json({ access_token: accessToken });
  } catch (error) {
    console.error("ML auth refresh error:", error);
    return NextResponse.json({ error: "Failed to refresh access token" }, { status: 500 });
  }
}
