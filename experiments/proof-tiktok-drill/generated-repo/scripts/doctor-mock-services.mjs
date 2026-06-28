import { spawnSync } from "node:child_process";

const endpoints = [
  "http://127.0.0.1:4110/health",
  "http://127.0.0.1:4111/health",
  "http://127.0.0.1:4112/health",
  "http://127.0.0.1:4113/health"
];

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function waitFor(url) {
  const started = Date.now();
  while (Date.now() - started < 15_000) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Retry while services boot.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`health check failed: ${url}`);
}

try {
  run("node", ["scripts/start-mock-services.mjs"]);
  for (const endpoint of endpoints) {
    await waitFor(endpoint);
    console.log(`ok ${endpoint}`);
  }
  console.log("mock doctor passed");
} finally {
  run("node", ["scripts/stop-mock-services.mjs"]);
}
