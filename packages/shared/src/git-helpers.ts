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

export function getBuildInfo() {
  return {
    // String values must be wrapped in JSON.stringify() to be valid replacements
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "dev"),
    __GIT_TAG__: JSON.stringify(
      process.env.GITHUB_REF_NAME ||
        process.env.VERCEL_GIT_COMMIT_REF ||
        runCmd("git describe --tags --always"),
    ),
    __GIT_SHA__: JSON.stringify(
      process.env.GITHUB_SHA ||
        process.env.VERCEL_GIT_COMMIT_SHA ||
        runCmd("git rev-parse --short HEAD"),
    ),
    __GIT_TIME__: JSON.stringify(runCmd("git log -1 --format=%ci") ?? new Date().toISOString()),
  };
}
