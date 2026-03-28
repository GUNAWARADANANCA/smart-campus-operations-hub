const { spawnSync } = require("node:child_process");
const path = require("node:path");

const cwd = __dirname;
const runner = path.join(cwd, "run-mvnw.cjs");

const result = spawnSync(process.execPath, [runner, "-B", "-q", "compile"], {
  cwd,
  stdio: "inherit",
});

if (result.status === 0) {
  process.exit(0);
}

if (process.env.CI) {
  console.error("Backend compile/lint failed (see Maven output above).");
  process.exit(1);
}

console.warn(
  "Backend lint skipped or failed. Ensure Java 17+ and run from apps/backend: node run-mvnw.cjs -B -q compile",
);
process.exit(0);
