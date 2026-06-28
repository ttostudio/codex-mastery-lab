export type ServiceState = {
  mode?: string;
  auth?: "anonymous" | "premium";
  billing?: "ok" | "failed";
  media?: "ok" | "failed";
  latencyMs?: number;
};

export type CombinedMockState = {
  api: ServiceState;
  auth: ServiceState;
  media: ServiceState;
  billing: ServiceState;
};

export const serviceUrls = {
  api: "http://127.0.0.1:4110",
  media: "http://127.0.0.1:4111",
  auth: "http://127.0.0.1:4112",
  billing: "http://127.0.0.1:4113"
} as const;

export const defaultMockState: CombinedMockState = {
  api: { mode: "online", latencyMs: 0 },
  media: { media: "ok", latencyMs: 0 },
  auth: { auth: "anonymous", latencyMs: 0 },
  billing: { billing: "ok", latencyMs: 0 }
};

export async function fetchServiceState(url: string, signal?: AbortSignal): Promise<ServiceState> {
  const response = await fetch(`${url}/state`, { signal });
  if (!response.ok) throw new Error(`state request failed: ${response.status}`);
  return (await response.json()) as ServiceState;
}
