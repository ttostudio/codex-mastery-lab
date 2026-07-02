import { createServer } from "node:http";
import { Buffer } from "node:buffer";
import { URL } from "node:url";

const PORT = Number(process.env.MOCK_CI_SERVICE_PORT ?? 4314);
const HOST = process.env.MOCK_CI_SERVICE_HOST ?? "127.0.0.1";
const scenarios = ["empty", "valid", "failure", "timeout", "rate_limit"];
let currentScenario = "empty";

const samples = {
  empty: {
    label: "empty: CI run URL入力待ち",
    runUrl: "未入力",
    owner: "未抽出",
    repo: "未抽出",
    runId: "未抽出",
    commitSha: "未登録",
    workflow: "aidd-control-plane-mvp-014-ci",
    jobs: ["未取得"],
    artifacts: ["未取得"],
    issue: "CI証跡をまだ取得していません。",
    repair: "CI run URLを貼り、mock CI状態をvalid / failure / timeout / rate_limitに切り替えて証跡を確認する。",
    promptDelta: "Mock CI Serviceでempty stateを表示し、入力前に必要artifact一覧を見せる。"
  },
  valid: {
    label: "valid: 必須CI証跡が揃っています",
    runUrl: "github.local/aidd-lab/aidd-control-plane/actions/runs/14014",
    owner: "aidd-lab",
    repo: "aidd-control-plane",
    runId: "14014",
    commitSha: "9f4c2d1a8b7e6c5d4a3b2c1d0e9f8a7b6c5d4e3f",
    workflow: "aidd-control-plane-mvp-014-ci",
    jobs: ["lint: 成功", "typecheck: 成功", "test: 成功", "e2e: 成功", "mock:doctor: 成功", "doctor:aidd: 成功"],
    artifacts: ["coverage", "playwright-report", "test-results", "terminal-evidence", "empty-screenshot", "valid-screenshot", "failure-screenshot", "timeout-screenshot", "rate-limit-screenshot"],
    issue: "不足artifactはありません。",
    repair: "Verification EvidenceへCI run URL、artifact一覧、terminal evidence、mock service stateを保存する。",
    promptDelta: "独立Mock CI Serviceのvalid状態をReview Recordでpassとして扱う。"
  },
  failure: {
    label: "failure: CI証跡不足",
    runUrl: "github.local/aidd-lab/aidd-control-plane/actions/runs/broken",
    owner: "aidd-lab",
    repo: "aidd-control-plane",
    runId: "未抽出",
    commitSha: "abc12",
    workflow: "aidd-control-plane-mvp-014-ci",
    jobs: ["lint: 成功", "test: 失敗", "e2e: 失敗"],
    artifacts: ["coverage", "terminal-evidence"],
    issue: "playwright-report / test-results / screenshot artifactsが不足し、commit SHAも短すぎます。",
    repair: "失敗job、短いcommit SHA、token scope不足をEvidence Gap Repair Plannerへ渡す。",
    promptDelta: "不足artifact、失敗job、短いcommit SHAを次回AI Task Packet Deltaへ戻す。"
  },
  timeout: {
    label: "timeout: CI取得タイムアウト",
    runUrl: "github.local/aidd-lab/aidd-control-plane/actions/runs/14014",
    owner: "aidd-lab",
    repo: "aidd-control-plane",
    runId: "14014",
    commitSha: "9f4c2d1a8b7e6c5d4a3b2c1d0e9f8a7b6c5d4e3f",
    workflow: "aidd-control-plane-mvp-014-ci",
    jobs: ["jobs API: timeout", "artifacts API: timeout"],
    artifacts: ["取得未完了"],
    issue: "mock CI serviceがタイムアウト状態を返しました。",
    repair: "再試行し、fallbackとして手動Evidence Binderへterminal evidenceを保存する。",
    promptDelta: "CI取得タイムアウト時の再試行と手動Evidence Binder fallbackを完了条件へ追加する。"
  },
  rate_limit: {
    label: "rate_limit: CI API制限中",
    runUrl: "github.local/aidd-lab/aidd-control-plane/actions/runs/14014",
    owner: "aidd-lab",
    repo: "aidd-control-plane",
    runId: "14014",
    commitSha: "9f4c2d1a8b7e6c5d4a3b2c1d0e9f8a7b6c5d4e3f",
    workflow: "aidd-control-plane-mvp-014-ci",
    jobs: ["jobs API: rate_limit", "artifacts API: rate_limit"],
    artifacts: ["取得保留"],
    issue: "CI APIのrate limitによりartifact取得を待機しています。",
    repair: "待機時間を確認し、token scopeを見直し、手動証跡添付で完了条件を維持する。",
    promptDelta: "次回AI Task Packet Deltaへrate_limit時の待機時間、token scope見直し、手動証跡添付を追加する。",
    retryAfterSeconds: 60,
    tokenScopeReview: ["actions:read", "contents:read"],
    manualEvidence: ["terminal-evidence", "playwright-report URL", "test-results"],
    nextTaskPacketDelta: "rate_limit時は60秒待機、actions:read / contents:readを確認し、手動証跡添付を許可する。"
  }
};

function statePayload() {
  return {
    service: "mock-ci-service",
    version: "mvp014",
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
    sendJson(response, 200, { ok: true, service: "mock-ci-service", version: "mvp014", scenario: currentScenario });
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
  console.log(`mock-ci-service listening on http://${HOST}:${PORT}`);
});
