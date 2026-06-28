import http from "node:http";

const service = process.env.MOCK_SERVICE ?? "api";
const port = Number(process.env.PORT ?? "4110");

const defaults = {
  api: { mode: "online", latencyMs: 0 },
  media: { media: "ok", latencyMs: 0 },
  auth: { auth: "anonymous", latencyMs: 0 },
  billing: { billing: "ok", latencyMs: 0 }
};

let state = { ...(defaults[service] ?? defaults.api) };

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(payload);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) resolve({});
      else {
        try {
          resolve(JSON.parse(raw));
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 200, { ok: true });
    return;
  }

  if (req.url === "/health") {
    send(res, 200, { ok: true, service });
    return;
  }

  if (req.url === "/state" && req.method === "GET") {
    if (state.mode === "offline") {
      send(res, 503, { ok: false, service, state });
      return;
    }
    const delay = state.mode === "timeout" ? 3000 : Number(state.latencyMs ?? 0);
    setTimeout(() => send(res, 200, state), delay);
    return;
  }

  if (req.url === "/__control/state" && req.method === "POST") {
    try {
      const body = await readJson(req);
      if (body.reset) {
        state = { ...(defaults[service] ?? defaults.api) };
      } else {
        state = { ...state, ...body };
      }
      send(res, 200, state);
    } catch {
      send(res, 400, { ok: false, error: "invalid json" });
    }
    return;
  }

  send(res, 404, { ok: false, service });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`${service} mock listening on ${port}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
