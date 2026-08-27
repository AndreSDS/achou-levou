import { NextResponse } from "next/server";
import { generatePKCE, randomState, saveAuthState } from "@/lib/ml-auth";

export async function GET() {
  const appId = process.env.ML_APP_ID;
  const redirectUri = process.env.ML_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return NextResponse.json(
      { error: "ML credentials missing. Configure ML_APP_ID and ML_REDIRECT_URI." },
      { status: 500 }
    );
  }

  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = randomState();

  await saveAuthState({
    state,
    code_verifier: codeVerifier,
    expires_at: Date.now() + 5 * 60 * 1000,
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: appId,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authUrl = `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
