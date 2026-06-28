import { createServer } from "node:http";

const labels = {
  free: "無料プラン",
  premium: "プレミアム",
  payment_failed: "支払い確認が必要"
};
const states = new Set(Object.keys(labels));
let currentState = "free";

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
  if (url.pathname === "/health") return json(res, 200, { ok: true, service: "mock-billing" });
  if ((url.pathname === "/state" || url.pathname === "/__control/state") && req.method === "GET") {
    return json(res, 200, { state: currentState, label: labels[currentState] });
  }
  if ((url.pathname === "/state" || url.pathname === "/__control/state") && req.method === "POST") {
    return readJson(req).then((body) => {
      if (!body || !states.has(body.state)) return json(res, 400, { message: "未知の課金状態です" });
      currentState = body.state;
      return json(res, 200, { state: currentState, label: labels[currentState] });
    });
  }
  if (url.pathname === "/billing") {
    const requested = url.searchParams.get("state");
    const state = states.has(requested) ? requested : currentState;
    return json(res, state === "payment_failed" ? 402 : 200, { state, label: labels[state] });
  }
  return json(res, 404, { message: "課金エンドポイントが見つかりません" });
}).listen(Number(process.env.PORT ?? 4040), "0.0.0.0", () => {
  console.log(`mock-billing listening on ${process.env.PORT ?? 4040}`);
});
