import { spawn } from "node:child_process";

const baseUrl = "http://127.0.0.1:4314";
const scenarios = ["empty", "valid", "failure", "timeout", "rate_limit"];
const child = spawn(process.execPath, ["mocks/ci-service/server.mjs"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  env: process.env
});

try {
  await waitForHealth();
  await assertJson("/health", (body) => body.ok === true && body.version === "mvp015");
  await assertJson("/state", (body) => body.scenario === "empty" && body.ci.label.includes("empty"));
  for (const scenario of scenarios) {
    const response = await fetch(`${baseUrl}/__control/state`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ scenario })
    });
    if (!response.ok) throw new Error(`control failed for ${scenario}: ${response.status}`);
    const body = await response.json();
    if (body.scenario !== scenario) throw new Error(`scenario mismatch: ${body.scenario}`);
  }
  await assertJson("/state", (body) => body.version === "mvp015" && body.contract === "fixture-driven-mock-ci-service" && body.scenario === "rate_limit" && body.ci.retryAfterSeconds === 60);
  console.log("mock:doctor passed");
} finally {
  child.kill("SIGTERM");
}

async function waitForHealth() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 10_000) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("mock-ci-service did not become healthy");
}

async function assertJson(pathname, predicate) {
  const response = await fetch(`${baseUrl}${pathname}`);
  if (!response.ok) throw new Error(`${pathname} returned ${response.status}`);
  const body = await response.json();
  if (!predicate(body)) throw new Error(`${pathname} payload did not match contract`);
}
