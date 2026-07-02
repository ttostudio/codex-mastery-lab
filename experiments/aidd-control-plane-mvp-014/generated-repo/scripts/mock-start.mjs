import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const runDir = path.join(root, ".mock");
const pidPath = path.join(runDir, "ci-service.pid");
mkdirSync(runDir, { recursive: true });

if (existsSync(pidPath)) {
  const pid = Number(readFileSync(pidPath, "utf8"));
  if (pid && isRunning(pid)) {
    console.log(`mock-ci-service already running: ${pid}`);
    process.exit(0);
  }
}

const child = spawn(process.execPath, ["mocks/ci-service/server.mjs"], {
  cwd: root,
  detached: true,
  stdio: "ignore",
  env: process.env
});
child.unref();
writeFileSync(pidPath, String(child.pid));
console.log(`mock-ci-service started: ${child.pid}`);

function isRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
