import { createServer } from "node:http";

const channels = [
  { id: "ch-product", name: "集中プロダクト講座", handle: "@focus-product" },
  { id: "ch-data", name: "データ読解ノート", handle: "@data-notes" },
  { id: "ch-code", name: "実装集中ラボ", handle: "@code-focus" }
];

const videos = [
  { id: "vf-001", title: "集中学習キューを設計する", category: "集中設計", channelId: "ch-product" },
  { id: "vf-002", title: "データ可視化の読み方を30分で復習する", category: "データ読解", channelId: "ch-data" },
  { id: "vf-003", title: "TypeScript strictで学習アプリの状態を守る", category: "実装演習", channelId: "ch-code" },
  { id: "vf-004", title: "プレミアム教材の支払い失敗時UIを検証する", category: "実装演習", channelId: "ch-code" }
];
const networkStates = new Set(["online", "offline", "timeout"]);
let networkState = "online";

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

function withChannel(video) {
  return { ...video, channel: channels.find((channel) => channel.id === video.channelId) };
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/health") return json(res, 200, { ok: true, service: "mock-api" });
  if ((url.pathname === "/state" || url.pathname === "/__control/state") && req.method === "GET") {
    return json(res, 200, { state: networkState });
  }
  if ((url.pathname === "/state" || url.pathname === "/__control/state") && req.method === "POST") {
    return readJson(req).then((body) => {
      if (!body || !networkStates.has(body.state)) return json(res, 400, { message: "未知のネットワーク状態です" });
      networkState = body.state;
      return json(res, 200, { state: networkState });
    });
  }
  if (networkState === "offline") return json(res, 503, { message: "ネットワークに接続できません" });
  if (networkState === "timeout") {
    setTimeout(() => json(res, 504, { message: "応答が時間内に完了しませんでした" }), 1800);
    return;
  }
  if (url.pathname === "/videos") {
    const id = url.searchParams.get("id");
    if (id) {
      const video = videos.find((item) => item.id === id);
      return video ? json(res, 200, { video: withChannel(video) }) : json(res, 404, { message: "動画が見つかりません" });
    }
    return json(res, 200, { videos: videos.map(withChannel) });
  }
  if (url.pathname === "/search") {
    const query = (url.searchParams.get("q") ?? "").toLowerCase();
    const matched = videos.filter((video) => [video.title, video.category].join(" ").toLowerCase().includes(query));
    return json(res, 200, { query, videos: matched.map(withChannel) });
  }
  return json(res, 404, { message: "APIエンドポイントが見つかりません" });
}).listen(Number(process.env.PORT ?? 4010), "0.0.0.0", () => {
  console.log(`mock-api listening on ${process.env.PORT ?? 4010}`);
});
