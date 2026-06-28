import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("mock-media service", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    // @ts-expect-error server.mjs は独立Nodeサービスとして配布するため、TS型定義は持たせない。
    const mediaServerModule = await import("./server.mjs");
    server = mediaServerModule.createMediaServer();
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("mock-media のテストポートを取得できません");
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (!server) return;
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("Range request に 206 と Content-Range で応答する", async () => {
    const response = await fetch(`${baseUrl}/video`, { headers: { range: "bytes=0-15" } });
    expect(response.status).toBe(206);
    expect(response.headers.get("accept-ranges")).toBe("bytes");
    expect(response.headers.get("content-range")).toMatch(/^bytes 0-15\/\d+$/);
    expect((await response.arrayBuffer()).byteLength).toBe(16);
  });

  it("500相当の障害をJSONで返す", async () => {
    const response = await fetch(`${baseUrl}/video?mode=failure`);
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ message: "動画取得に失敗しました" });
  });

  it("control endpoint でメディア状態を変更できる", async () => {
    const update = await fetch(`${baseUrl}/__control/state`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: "not_found" })
    });
    expect(update.status).toBe(200);
    await expect(update.json()).resolves.toEqual({ state: "not_found" });

    const state = await fetch(`${baseUrl}/state`);
    await expect(state.json()).resolves.toEqual({ state: "not_found" });

    const response = await fetch(`${baseUrl}/video`);
    expect(response.status).toBe(404);
  });

  it("interrupted mode は途中でストリームを破断する", async () => {
    await expect(
      fetch(`${baseUrl}/video?mode=interrupted`).then((response) => response.arrayBuffer())
    ).rejects.toThrow();
  });
});
