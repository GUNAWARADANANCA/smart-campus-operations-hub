const { execSync, spawnSync } = require("node:child_process");
const path = require("node:path");

const cwd = __dirname;
const args = process.argv.slice(2);

/** Quote an argument only if needed (paths with spaces). */
function escArg(a) {
  if (/[\s"]/.test(a)) {
    return `"${String(a).replace(/"/g, '\\"')}"`;
  }
  return a;
}

if (process.platform === "win32") {
  const cmd = ["mvnw.cmd", ...args.map(escArg)].join(" ");
  execSync(cmd, { cwd, stdio: "inherit", windowsHide: true });
} else {
  const mvnw = path.join(cwd, "mvnw");
  const result = spawnSync("sh", [mvnw, ...args], {
    cwd,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
