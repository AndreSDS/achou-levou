import { NextResponse } from "next/server";
import { getMLTokens } from "@/lib/ml-auth";

export async function GET() {
  const tokens = await getMLTokens();
  if (!tokens) {
    return NextResponse.json({ connected: false });
  }

  const now = Date.now();
  const expiresAt = tokens.obtained_at + tokens.expires_in * 1000;
  const remainingMs = expiresAt - now;

  return NextResponse.json({
    connected: true,
    user_id: tokens.user_id,
    scope: tokens.scope,
    expires_in: Math.max(0, Math.floor(remainingMs / 1000)),
    obtained_at: tokens.obtained_at,
  });
}
