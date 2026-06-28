import { getAuthState, getBillingState, getMediaMode } from "./adapter";
import type { AuthState, BillingState, MediaMode } from "./types";

export type NetworkState = "online" | "offline" | "timeout";

export const mockServiceUrls = {
  api: process.env.WATCHFLOW_MOCK_API_URL ?? "http://127.0.0.1:4010",
  media: process.env.WATCHFLOW_MOCK_MEDIA_URL ?? "http://127.0.0.1:4020",
  auth: process.env.WATCHFLOW_MOCK_AUTH_URL ?? "http://127.0.0.1:4030",
  billing: process.env.WATCHFLOW_MOCK_BILLING_URL ?? "http://127.0.0.1:4040"
};

export function shouldUseExternalMockServices(): boolean {
  return process.env.WATCHFLOW_USE_EXTERNAL_MOCKS === "1";
}

export function getNetworkState(value: unknown): NetworkState {
  return value === "offline" || value === "timeout" ? value : "online";
}

async function readServiceState<T>(url: string, fallback: T, normalize: (value: unknown) => T): Promise<T> {
  if (!shouldUseExternalMockServices()) return fallback;
  try {
    const response = await fetch(`${url}/state`, { cache: "no-store" });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as { state?: unknown };
    return normalize(payload.state);
  } catch {
    return fallback;
  }
}

export async function getExternalAuthState(fallback: AuthState = "anonymous"): Promise<AuthState> {
  return readServiceState(mockServiceUrls.auth, fallback, (value) => getAuthState(String(value ?? "")));
}

export async function getExternalBillingState(fallback: BillingState = "free"): Promise<BillingState> {
  return readServiceState(mockServiceUrls.billing, fallback, (value) => getBillingState(String(value ?? "")));
}

export async function getExternalMediaMode(fallback: MediaMode = "normal"): Promise<MediaMode> {
  return readServiceState(mockServiceUrls.media, fallback, (value) => getMediaMode(String(value ?? "")));
}

export async function getExternalNetworkState(fallback: NetworkState = "online"): Promise<NetworkState> {
  return readServiceState(mockServiceUrls.api, fallback, getNetworkState);
}
