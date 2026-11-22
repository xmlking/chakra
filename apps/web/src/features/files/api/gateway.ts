import { auth } from "@workspace/auth";
import { log } from "evlog";
import { FilesError } from "files-sdk";
import type { AuthorizeContext, AuthorizeResult } from "files-sdk/api";

import { ENV } from "#env";

import {
  type FileAction,
  type FileFolderPaths,
  fileActionFor,
  pdfPreviewResponse,
} from "../access";

export const fileFolderPaths = (): FileFolderPaths => ({
  images: "/images",
  files: "/files",

});

/**
 * Origins allowed to call the files gateways (`/api/files`, `/api/admin/files`):
 * the app itself, plus the local dev hosts in development.
 */
export function filesAllowedOrigins(): string[] {
  const origins = [ENV.BETTER_AUTH_URL!];
  if (ENV.APP_ENV === "development") {
    origins.push(
      "http://localhost:3000",
      "https://console-127-0-0-1.nip.io",
      "http://localhost:9000",
    );
  }
  return origins;
}


/** System (admin plugin) grant: honors `adminUserIds` and comma-separated roles. */
const systemCan = async (headers: Headers, action: FileAction) =>
  (await auth.api.userHasPermission({ headers, body: { permissions: { file: [action] } } }))
    .success;

/** Org grant, evaluated against the active member (dynamic roles included). */
const orgCan = async (headers: Headers, action: FileAction) =>
  auth.api
    .hasPermission({ headers, body: { permissions: { file: [action] } } })
    .then((r) => r.success)
    .catch(() => false);

// `ReadOnly` is the files-sdk code that maps to 403; `Unauthorized` is 401 (signed out).
const forbidden = (message: string) => new FilesError("ReadOnly", message);

type Gateway = "preview" | "system";
type Decision = { userId?: string; organizationId?: string | null; reason?: string };

function audit(gateway: Gateway, ctx: AuthorizeContext, decision: Decision, allowed: boolean) {
  const fields = {
    source: "files.gateway",
    gateway,
    operation: ctx.operation,
    action: fileActionFor(ctx.operation),
    key: ctx.key,
    keys: ctx.keys?.length,
    from: ctx.from,
    to: ctx.to,
    allowed,
    ...decision,
  };
  if (allowed) log.info(fields);
  else log.warn(fields);
}

async function requireSession(gateway: Gateway, ctx: AuthorizeContext) {
  const session = await auth.api.getSession({ headers: ctx.req.headers });
  if (!session) {
    audit(gateway, ctx, { reason: "no session" }, false);
    throw new FilesError("Unauthorized", "sign in");
  }
  return session;
}

/**
 * `/api/files`: single-key reads for PDF Preview and Org File Browser downloads. The router also
 * pins `operations` to head/exists/url/download and uses `files.readonly()`.
 */
export async function authorizePreview(ctx: AuthorizeContext): Promise<AuthorizeResult> {
  const session = await requireSession("preview", ctx);
  // PDF Preview (`pdfSource="url"`) reads capabilities to choose a signed URL or the proxy.
  if (ctx.operation === "capabilities") return;
  const headers = ctx.req.headers;
  const decision: Decision = {
    userId: session.user.id,
    organizationId: session.session.activeOrganizationId,
  };
  const deny = (reason: string) => {
    audit("preview", ctx, { ...decision, reason }, false);
    return forbidden(reason);
  };

  if (fileActionFor(ctx.operation) !== "preview") throw deny("operation not allowed");
  const response = pdfPreviewResponse(ctx.operation, ctx.key, fileFolderPaths().files);

  if (await systemCan(headers, "preview")) {
    audit("preview", ctx, { ...decision, reason: "system" }, true);
    return response;
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw deny("no active organization");

  const [canPreview] = await Promise.all([
    orgCan(headers, "preview"),
    orgCan(headers, "list"),
  ]);
  if (!canPreview) throw deny("missing file:preview");


  // Org owners/admins download any file; members only open txt files.
  const visible = (key: string) => key.endsWith(".txt")

  if (ctx.keys) {
    audit("preview", ctx, decision, true);
    return { filterKeys: visible };
  }
  if (!ctx.key || !visible(ctx.key)) throw deny("outside org");

  audit("preview", ctx, decision, true);
  return response;
}

/** `/api/admin/files`: every operation on the whole container, for system `file:*` grants only. */
export async function authorizeSystem(ctx: AuthorizeContext): Promise<AuthorizeResult> {
  if (ctx.operation === "capabilities") return;
  const session = await requireSession("system", ctx);
  const decision: Decision = { userId: session.user.id };

  const action = fileActionFor(ctx.operation);
  if (!action || !(await systemCan(ctx.req.headers, action))) {
    audit("system", ctx, { ...decision, reason: `missing file:${action}` }, false);
    throw forbidden("not permitted");
  }

  audit("system", ctx, decision, true);
  return pdfPreviewResponse(ctx.operation, ctx.key, fileFolderPaths().files);
}
