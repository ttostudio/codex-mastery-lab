import { spawn, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const services = [
  ["api", 4110],
  ["media", 4111],
  ["auth", 4112],
  ["billing", 4113]
];

function dockerAvailable() {
  const result = spawnSync("docker", ["compose", "version"], { stdio: "ignore" });
  return result.status === 0;
}

function startDocker() {
  const result = spawnSync("docker", ["compose", "up", "-d", "mock-api", "mock-media", "mock-auth", "mock-billing"], {
    stdio: "inherit"
  });
  return result.status === 0;
}

function startNodeFallback() {
  const pids = [];
  for (const [service, port] of services) {
    const child = spawn(process.execPath, ["scripts/mock-service.mjs"], {
      cwd: root,
      detached: true,
      stdio: "ignore",
      env: { ...process.env, MOCK_SERVICE: service, PORT: String(port) }
    });
    child.unref();
    pids.push(child.pid);
  }
  writeFileSync(join(root, ".mock-pids.json"), JSON.stringify(pids));
  writeFileSync(join(root, ".mock-mode"), "node");
  console.log("mock services started with Node fallback");
}

if (dockerAvailable() && startDocker()) {
  writeFileSync(join(root, ".mock-mode"), "docker");
  console.log("mock services started with Docker Compose");
} else {
  startNodeFallback();
}
