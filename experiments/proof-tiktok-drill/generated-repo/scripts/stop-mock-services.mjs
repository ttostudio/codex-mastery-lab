import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const modeFile = join(root, ".mock-mode");
const pidFile = join(root, ".mock-pids.json");
const mode = existsSync(modeFile) ? readFileSync(modeFile, "utf8").trim() : "";

if (mode === "docker") {
  spawnSync("docker", ["compose", "down"], { stdio: "inherit" });
}

if (existsSync(pidFile)) {
  const pids = JSON.parse(readFileSync(pidFile, "utf8"));
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // Already stopped.
    }
  }
}

for (const file of [modeFile, pidFile]) {
  if (existsSync(file)) rmSync(file);
}

console.log("mock services stopped");
