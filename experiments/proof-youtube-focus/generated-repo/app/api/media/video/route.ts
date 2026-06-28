import { getMediaMode } from "@/lib/mocks/adapter";
import { mockServiceUrls, shouldUseExternalMockServices } from "@/lib/mocks/external";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const mode = getMediaMode(searchParams.get("mode"));

  if (shouldUseExternalMockServices()) {
    const externalUrl = new URL("/video", mockServiceUrls.media);
    if (searchParams.has("mode")) externalUrl.searchParams.set("mode", mode);
    const range = request.headers.get("range");
    const response = await fetch(externalUrl, {
      cache: "no-store",
      headers: range ? { range } : undefined
    });
    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });
  }

  if (mode === "not_found") {
    return Response.json({ message: "動画ファイルが見つかりません" }, { status: 404 });
  }

  if (mode === "failure") {
    return Response.json({ message: "動画取得に失敗しました" }, { status: 503 });
  }

  if (mode === "slow") {
    await new Promise((resolve) => setTimeout(resolve, 1800));
  }

  const file = await readFile(join(process.cwd(), "public", "mock-media", "sample.mp4"));
  if (mode === "interrupted") {
    const chunk = file.subarray(0, Math.max(1, Math.floor(file.byteLength / 3)));
    return new Response(chunk, {
      status: 200,
      headers: {
        "content-type": "video/mp4",
        "content-length": String(file.byteLength),
        "cache-control": "no-store"
      }
    });
  }

  return new Response(file, {
    headers: {
      "content-type": "video/mp4",
      "cache-control": "public, max-age=3600"
    }
  });
}
