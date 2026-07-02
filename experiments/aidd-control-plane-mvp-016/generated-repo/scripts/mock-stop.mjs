import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

const pidPath = path.join(process.cwd(), ".mock", "ci-service.pid");

if (!existsSync(pidPath)) {
  console.log("mock-ci-service is not running");
  process.exit(0);
}

const pid = Number(readFileSync(pidPath, "utf8"));
if (pid) {
  try {
    process.kill(pid, "SIGTERM");
    console.log(`mock-ci-service stopped: ${pid}`);
  } catch {
    console.log(`mock-ci-service pid was stale: ${pid}`);
  }
}
rmSync(pidPath, { force: true });
