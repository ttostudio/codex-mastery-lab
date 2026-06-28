import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const repoRoot = existsSync(join(process.cwd(), "public", "mock-media"))
  ? process.cwd()
  : join(process.cwd(), "..", "..");
const samplePath = join(repoRoot, "public", "mock-media", "sample.mp4");
const captionsPath = join(repoRoot, "public", "mock-media", "captions-ja.vtt");
const states = new Set(["normal", "slow", "not_found", "failure", "interrupted"]);
let currentState = "normal";

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload)
  });
  res.end(payload);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

function sendCaptions(res) {
  res.writeHead(200, {
    "content-type": "text/vtt; charset=utf-8",
    "cache-control": "public, max-age=3600"
  });
  createReadStream(captionsPath).pipe(res);
}

function parseRange(rangeHeader, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader ?? "");
  if (!match) return null;
  const start = match[1] === "" ? 0 : Number(match[1]);
  const end = match[2] === "" ? size - 1 : Number(match[2]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end >= size) return null;
  return { start, end };
}

function streamVideo(req, res, { slow = false, interrupted = false } = {}) {
  const { size } = statSync(samplePath);
  const range = parseRange(req.headers.range, size);
  const start = range?.start ?? 0;
  const plannedEnd = range?.end ?? size - 1;
  const end = interrupted ? Math.max(start, Math.min(plannedEnd, start + 1023)) : plannedEnd;
  const status = range ? 206 : 200;
  const headers = {
    "accept-ranges": "bytes",
    "content-type": "video/mp4",
    "content-length": String(interrupted ? plannedEnd - start + 1 : end - start + 1),
    "cache-control": "no-store"
  };
  if (range) headers["content-range"] = `bytes ${start}-${end}/${size}`;

  res.writeHead(status, headers);
  if (interrupted) {
    const stream = createReadStream(samplePath, { start, end });
    stream.once("data", (chunk) => {
      res.write(chunk);
      stream.destroy();
      res.destroy(new Error("mock interrupted stream"));
    });
    stream.once("error", () => res.destroy());
    return;
  }

  const pipe = () => createReadStream(samplePath, { start, end }).pipe(res);
  if (slow) {
    setTimeout(pipe, 1200);
    return;
  }
  pipe();
}

export function createMediaServer() {
  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/health") {
      sendJson(res, 200, { ok: true, service: "mock-media" });
      return;
    }
    if ((url.pathname === "/state" || url.pathname === "/__control/state") && req.method === "GET") {
      sendJson(res, 200, { state: currentState });
      return;
    }
    if ((url.pathname === "/state" || url.pathname === "/__control/state") && req.method === "POST") {
      readJson(req).then((body) => {
        if (!body || !states.has(body.state)) {
          sendJson(res, 400, { message: "未知のメディア状態です" });
          return;
        }
        currentState = body.state;
        sendJson(res, 200, { state: currentState });
      });
      return;
    }
    if (url.pathname === "/captions/ja.vtt" || url.pathname === "/captions-ja.vtt") {
      sendCaptions(res);
      return;
    }
    if (url.pathname !== "/video" && extname(url.pathname) !== ".mp4") {
      sendJson(res, 404, { message: "メディアエンドポイントが見つかりません" });
      return;
    }

    const requestedMode = url.searchParams.get("mode");
    const mode = states.has(requestedMode) ? requestedMode : currentState;
    if (mode === "not_found") {
      sendJson(res, 404, { message: "動画ファイルが見つかりません" });
      return;
    }
    if (mode === "failure") {
      sendJson(res, 500, { message: "動画取得に失敗しました" });
      return;
    }

    streamVideo(req, res, { slow: mode === "slow", interrupted: mode === "interrupted" });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 4020);
  createMediaServer().listen(port, "0.0.0.0", () => {
    console.log(`mock-media listening on ${port}`);
  });
}
