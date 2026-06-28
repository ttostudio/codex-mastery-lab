import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";

const pidFile = ".studystream-mock-services.json";

if (!existsSync(pidFile)) {
  console.log("mock services pid file not found");
  process.exit(0);
}

const state = JSON.parse(readFileSync(pidFile, "utf8"));

if (state.mode === "docker") {
  spawnSync("docker", ["compose", "down"], { stdio: "inherit" });
}

if (state.mode === "node" && Array.isArray(state.processes)) {
  for (const service of state.processes) {
    if (typeof service.pid !== "number") continue;
    try {
      process.kill(-service.pid, "SIGTERM");
    } catch {
      try {
        process.kill(service.pid, "SIGTERM");
      } catch {
        // 既に終了している場合はcleanupだけ続けます。
      }
    }
  }
}

rmSync(pidFile, { force: true });
console.log("mock services stopped");
