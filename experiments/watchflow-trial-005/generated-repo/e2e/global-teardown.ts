import { spawnSync } from "node:child_process";

async function globalTeardown() {
  spawnSync("pnpm", ["run", "mock:stop"], { stdio: "inherit" });
}

export default globalTeardown;
