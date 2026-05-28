import { execSync } from "node:child_process";

let cachedRepoRoot: string | undefined;

export function getRepoRoot() {
  if (cachedRepoRoot) return cachedRepoRoot;

  try {
    cachedRepoRoot = execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return cachedRepoRoot;
  } catch {
    return process.cwd();
  }
}

export function runCmd(command: string) {
  try {
    return execSync(command, {
      cwd: getRepoRoot(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch (err) {
    console.error(`Command failed: ${command}`, err);
    return "unknown";
  }
}
