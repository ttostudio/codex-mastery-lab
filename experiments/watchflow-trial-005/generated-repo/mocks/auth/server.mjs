import { createServer } from "node:http";

const states = new Set(["anonymous", "logged_in", "premium", "session_expired"]);
let currentState = "anonymous";

function json(res, status, body) {
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

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/health") return json(res, 200, { ok: true, service: "mock-auth" });
  if ((url.pathname === "/state" || url.pathname === "/__control/state") && req.method === "GET") {
    return json(res, 200, { state: currentState });
  }
  if ((url.pathname === "/state" || url.pathname === "/__control/state") && req.method === "POST") {
    return readJson(req).then((body) => {
      if (!body || !states.has(body.state)) return json(res, 400, { message: "未知の認証状態です" });
      currentState = body.state;
      return json(res, 200, { state: currentState });
    });
  }
  if (url.pathname === "/auth") {
    const requested = url.searchParams.get("state");
    const state = states.has(requested) ? requested : currentState;
    return json(res, state === "session_expired" ? 401 : 200, { state });
  }
  return json(res, 404, { message: "認証エンドポイントが見つかりません" });
}).listen(Number(process.env.PORT ?? 4030), "0.0.0.0", () => {
  console.log(`mock-auth listening on ${process.env.PORT ?? 4030}`);
});
