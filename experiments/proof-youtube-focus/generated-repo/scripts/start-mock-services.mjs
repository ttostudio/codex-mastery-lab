import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const services = [
  { name: "mock-api", dir: "mocks/api", port: 4010, health: "http://127.0.0.1:4010/health" },
  { name: "mock-media", dir: "mocks/media", port: 4020, health: "http://127.0.0.1:4020/health" },
  { name: "mock-auth", dir: "mocks/auth", port: 4030, health: "http://127.0.0.1:4030/health" },
  { name: "mock-billing", dir: "mocks/billing", port: 4040, health: "http://127.0.0.1:4040/health" }
];
const pidFile = ".studystream-mock-services.json";

async function isHealthy(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForHealth(timeoutMs = 30_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const results = await Promise.all(services.map((service) => isHealthy(service.health)));
    if (results.every(Boolean)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("mock services のhealth checkが時間内に完了しませんでした");
}

async function alreadyRunning() {
  const results = await Promise.all(services.map((service) => isHealthy(service.health)));
  return results.every(Boolean);
}

function canUseDockerCompose() {
  if (process.env.STUDYSTREAM_MOCK_NODE_ONLY === "1") return false;
  const docker = spawnSync("docker", ["compose", "version"], { stdio: "ignore" });
  return docker.status === 0;
}

async function startWithDocker() {
  console.log("mock services mode: docker compose");
  const result = spawnSync("docker", ["compose", "up", "-d", "mock-api", "mock-media", "mock-auth", "mock-billing"], {
    stdio: "inherit"
  });
  if (result.status !== 0) throw new Error("docker compose によるmock service起動に失敗しました");
  writeFileSync(pidFile, JSON.stringify({ mode: "docker" }, null, 2));
  await waitForHealth();
}

async function startWithNode() {
  console.log("mock services mode: node fallback");
  const existing = existsSync(pidFile) ? JSON.parse(readFileSync(pidFile, "utf8")) : null;
  if (existing?.mode === "node" && Array.isArray(existing.processes) && (await alreadyRunning())) return;

  const processes = services.map((service) => {
    const child = spawn("pnpm", ["--dir", service.dir, "start"], {
      detached: true,
      stdio: "ignore",
      env: { ...process.env, PORT: String(service.port) }
    });
    child.unref();
    return { name: service.name, pid: child.pid };
  });
  writeFileSync(pidFile, JSON.stringify({ mode: "node", processes }, null, 2));
  await waitForHealth();
}

if (await alreadyRunning()) {
  console.log("mock services are already healthy");
  process.exit(0);
}

try {
  if (canUseDockerCompose()) {
    await startWithDocker();
  } else {
    await startWithNode();
  }
  console.log("mock services are healthy");
} catch (error) {
  if (canUseDockerCompose()) {
    console.warn("Docker起動に失敗したためNode直接起動へフォールバックします");
    await startWithNode();
    console.log("mock services are healthy");
  } else {
    throw error;
  }
}
