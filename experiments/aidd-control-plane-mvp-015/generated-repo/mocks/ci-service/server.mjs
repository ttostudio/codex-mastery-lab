import { createServer } from "node:http";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { URL } from "node:url";

const PORT = Number(process.env.MOCK_CI_SERVICE_PORT ?? 4314);
const HOST = process.env.MOCK_CI_SERVICE_HOST ?? "127.0.0.1";
const VERSION = "mvp015";
const scenarios = ["empty", "valid", "failure", "timeout", "rate_limit"];
const fixtureDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");
let currentScenario = "empty";

const samples = Object.fromEntries(
  scenarios.map((scenario) => [
    scenario,
    JSON.parse(readFileSync(path.join(fixtureDir, `${scenario}.json`), "utf8"))
  ])
);

function statePayload() {
  return {
    service: "mock-ci-service",
    version: VERSION,
    contract: "fixture-driven-mock-ci-service",
    scenario: currentScenario,
    updatedAt: new Date().toISOString(),
    ci: samples[currentScenario]
  };
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `${HOST}:${PORT}`}`);
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }
  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, { ok: true, service: "mock-ci-service", version: VERSION, scenario: currentScenario });
    return;
  }
  if (request.method === "GET" && url.pathname === "/state") {
    sendJson(response, 200, statePayload());
    return;
  }
  if (request.method === "POST" && url.pathname === "/__control/state") {
    try {
      const body = await readJson(request);
      if (!scenarios.includes(body.scenario)) {
        sendJson(response, 400, { ok: false, error: `unknown scenario: ${body.scenario}`, scenarios });
        return;
      }
      currentScenario = body.scenario;
      sendJson(response, 200, statePayload());
    } catch {
      sendJson(response, 400, { ok: false, error: "invalid json" });
    }
    return;
  }
  sendJson(response, 404, { ok: false, error: "not found" });
});

server.listen(PORT, HOST, () => {
  console.log(`mock-ci-service ${VERSION} listening on http://${HOST}:${PORT}`);
});
