import { NextRequest, NextResponse } from "next/server";
import { getAuthState, clearAuthState, saveMLTokens } from "@/lib/ml-auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/auth?status=error&reason=missing_params", request.url));
  }

  const storedState = await getAuthState();
  if (!storedState || storedState.state !== state) {
    return NextResponse.redirect(new URL("/auth?status=error&reason=invalid_state", request.url));
  }

  const appId = process.env.ML_APP_ID;
  const secret = process.env.ML_SECRET;
  const redirectUri = process.env.ML_REDIRECT_URI;

  if (!appId || !secret || !redirectUri) {
    await clearAuthState();
    return NextResponse.redirect(new URL("/auth?status=error&reason=missing_credentials", request.url));
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: appId,
    client_secret: secret,
    code,
    redirect_uri: redirectUri,
    code_verifier: storedState.code_verifier,
  });

  try {
    const res = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const text = await res.text();
      let errorReason = "token_exchange_failed";
      try {
        const errorData = JSON.parse(text);
        if (errorData.error === "invalid_grant") {
          errorReason = "invalid_grant";
        }
      } catch {
        // ignore
      }
      await clearAuthState();
      return NextResponse.redirect(new URL(`/config?auth=error&reason=${errorReason}`, request.url));
    }

    const data = await res.json();
    const tokens = {
      access_token: data.access_token as string,
      refresh_token: data.refresh_token as string,
      expires_in: data.expires_in as number,
      obtained_at: Date.now(),
      scope: data.scope as string | undefined,
      user_id: data.user_id as string | undefined,
    };

    await saveMLTokens(tokens);
    await clearAuthState();

    return NextResponse.redirect(new URL("/auth?status=success", request.url));
  } catch {
    await clearAuthState();
    return NextResponse.redirect(new URL("/auth?status=error&reason=network_error", request.url));
  }
}
