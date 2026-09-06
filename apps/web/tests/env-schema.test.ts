import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";

/**
 * Contract test for the varlock env schemas.
 *
 * The web app schema must resolve without real secrets when APP_ENV=build,
 * using only the placeholders committed in apps/web/.env.build. This is
 * exactly what the Docker image build relies on, and it also proves the
 * @import graph between the web app, packages and root schema is complete.
 *
 * Only the committed env files are copied into a temp workspace, so a
 * developer's root .env.local cannot mask (or cause) a failure, and the child
 * process gets a minimal environment because the vitest process itself has the
 * real env injected by the varlock Vite plugin.
 */
const workspaceRoot = resolve(import.meta.dirname, "../../..");
const varlockBin = resolve(workspaceRoot, "node_modules/.bin/varlock");
const webDir = "apps/web";

const committedEnvFiles = [
  [".env.schema", ".env.schema"],
  [join(webDir, ".env.build"), ".env.build"],
  [join(webDir, ".env.schema"), join(webDir, ".env.schema")],
  ...["packages/db", "packages/email", "packages/storage", "packages/auth"].map((dir) => [
    join(dir, ".env.schema"),
    join(dir, ".env.schema"),
  ]),
];

let sandbox: string;

beforeAll(() => {
  sandbox = mkdtempSync(join(tmpdir(), "chakra-env-schema-"));
  for (const [source, targetPath] of committedEnvFiles) {
    const target = join(sandbox, targetPath);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(workspaceRoot, source), target);
  }
});

afterAll(() => {
  rmSync(sandbox, { recursive: true, force: true });
});

describe("varlock env schemas", () => {
  it("resolves the web app under APP_ENV=build with committed files only", () => {
    const result = spawnSync(varlockBin, ["load", "--agent"], {
      cwd: join(sandbox, webDir),
      encoding: "utf8",
      env: {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
        APP_ENV: "build",
        VARLOCK_TELEMETRY_DISABLED: "1",
      },
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
  });
});
