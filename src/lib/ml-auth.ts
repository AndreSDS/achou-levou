import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const TOKENS_FILE = path.join(DATA_DIR, "ml-tokens.json");
const STATE_FILE = path.join(DATA_DIR, "ml-auth-state.json");

export interface MLTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  obtained_at: number;
  scope?: string;
  user_id?: string;
}

export interface MLAuthState {
  state: string;
  code_verifier: string;
  expires_at: number;
}

function ensureDataDir() {
  return fs.mkdir(DATA_DIR, { recursive: true }).catch(() => {});
}

export function generatePKCE(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = base64UrlEncode(crypto.randomBytes(64));
  const codeChallenge = base64UrlEncode(
    crypto.createHash("sha256").update(codeVerifier).digest()
  );
  return { codeVerifier, codeChallenge };
}

export function hashSHA256(plain: string): string {
  return base64UrlEncode(crypto.createHash("sha256").update(plain).digest());
}

export function randomState(): string {
  return base64UrlEncode(crypto.randomBytes(32));
}

export async function getMLTokens(): Promise<MLTokens | null> {
  try {
    const raw = await fs.readFile(TOKENS_FILE, "utf-8");
    const tokens: MLTokens = JSON.parse(raw);
    return tokens;
  } catch {
    return null;
  }
}

export async function saveMLTokens(tokens: MLTokens): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf-8");
}

export async function clearMLTokens(): Promise<void> {
  try {
    await fs.unlink(TOKENS_FILE);
  } catch {
    // file may not exist
  }
}

export async function saveAuthState(state: MLAuthState): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

export async function getAuthState(): Promise<MLAuthState | null> {
  try {
    const raw = await fs.readFile(STATE_FILE, "utf-8");
    const state: MLAuthState = JSON.parse(raw);
    if (state.expires_at < Date.now()) {
      await fs.unlink(STATE_FILE).catch(() => {});
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

export async function clearAuthState(): Promise<void> {
  try {
    await fs.unlink(STATE_FILE);
  } catch {
    // ignore
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getMLTokens();
  if (!tokens) return null;

  const now = Date.now();
  const obtained = tokens.obtained_at || 0;
  const expiresAt = obtained + tokens.expires_in * 1000;
  const bufferMs = 5 * 60 * 1000;

  if (now >= expiresAt - bufferMs) {
    try {
      const refreshed = await refreshAccessToken(tokens.refresh_token);
      return refreshed.access_token;
    } catch {
      await clearMLTokens();
      return null;
    }
  }

  return tokens.access_token;
}

export async function refreshAccessToken(refreshToken: string): Promise<MLTokens> {
  const appId = process.env.ML_APP_ID;
  const secret = process.env.ML_SECRET;
  if (!appId || !secret) {
    throw new Error("ML credentials missing. Configure .env.local.");
  }

  const params = new URLSearchParams();
  params.set("grant_type", "refresh_token");
  params.set("refresh_token", refreshToken);
  params.set("client_id", appId);
  params.set("client_secret", secret);

  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text();
    let errorData: { error?: string } = {};
    try {
      errorData = JSON.parse(text);
    } catch {
      // ignore parse error
    }
    if (errorData.error === "invalid_grant") {
      await clearMLTokens();
    }
    throw new Error(`ML token refresh failed: ${res.status} ${text}`);
  }

  const data: Record<string, unknown> = await res.json();

  const tokens: MLTokens = {
    access_token: data.access_token as string,
    refresh_token: data.refresh_token as string,
    expires_in: data.expires_in as number,
    obtained_at: Date.now(),
    scope: data.scope as string | undefined,
    user_id: data.user_id as string | undefined,
  };

  await saveMLTokens(tokens);
  return tokens;
}

function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
