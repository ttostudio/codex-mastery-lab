import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const services = [
  { name: "mock-api", health: "http://127.0.0.1:4010/health" },
  { name: "mock-media", health: "http://127.0.0.1:4020/health" },
  { name: "mock-auth", health: "http://127.0.0.1:4030/health" },
  { name: "mock-billing", health: "http://127.0.0.1:4040/health" }
];

async function isHealthy(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function healthSnapshot() {
  return Promise.all(
    services.map(async (service) => ({
      name: service.name,
      ok: await isHealthy(service.health)
    }))
  );
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    stdio: options.stdio ?? "pipe",
    env: { ...process.env, ...options.env },
    encoding: "utf8"
  });
}

function printResult(label, ok, detail) {
  console.log(`${ok ? "OK" : "NG"}: ${label}${detail ? ` - ${detail}` : ""}`);
}

const dockerVersion = run("docker", ["compose", "version"]);
const dockerAvailable = dockerVersion.status === 0;
printResult(
  "Docker Compose",
  dockerAvailable,
  dockerAvailable ? dockerVersion.stdout.trim() : "利用できないためNode fallbackを確認します"
);

if (existsSync("docker-compose.yml")) {
  const composeConfig = run("docker", ["compose", "config", "--quiet"]);
  if (dockerAvailable) {
    printResult("docker-compose.yml の静的検証", composeConfig.status === 0);
  } else {
    printResult("docker-compose.yml の存在確認", true, "Docker未導入のためconfig検証はスキップ");
  }
} else {
  printResult("docker-compose.yml の存在確認", false);
}

let startedByDoctor = false;
const beforeStart = await healthSnapshot();

if (beforeStart.every((result) => result.ok)) {
  printResult("Node fallback health", true, "既存のmock serviceが稼働中です");
} else {
  const start = run("pnpm", ["run", "mock:start"], {
    stdio: "inherit",
    env: { STUDYSTREAM_MOCK_NODE_ONLY: "1" }
  });
  startedByDoctor = start.status === 0;
  printResult("Node fallback 起動", startedByDoctor);
}

const afterStart = await healthSnapshot();
for (const result of afterStart) {
  printResult(`${result.name} health`, result.ok);
}

if (startedByDoctor) {
  const stop = run("pnpm", ["run", "mock:stop"], { stdio: "inherit" });
  printResult("doctor起動分の停止", stop.status === 0);
}

if (!afterStart.every((result) => result.ok)) {
  process.exit(1);
}
