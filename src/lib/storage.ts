import { PostData, AppConfig } from "@/types";

const HISTORY_KEY = "radar-achados-history";
const CONFIG_KEY = "radar-achados-config";

export function getHistory(): PostData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePost(post: PostData): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  history.unshift(post);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function deletePost(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((p) => p.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getConfig(): AppConfig {
  if (typeof window === "undefined") return { mlAffiliateId: "" };
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : { mlAffiliateId: "" };
  } catch {
    return { mlAffiliateId: "" };
  }
}

export function saveConfig(config: AppConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}