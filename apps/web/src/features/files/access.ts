import type { PermissionAction } from "@workspace/auth/permissions";
import type { FilesOperation } from "files-sdk/api";

/**
 * Pure file-access rules (no I/O). See
 * `content/docs/developer/specifications/0009-file-access-control/spec.md`.
 */

export type FileAction = PermissionAction<"file">;

export const fileFolders = ["images", "files"] as const;
export type FileFolder = (typeof fileFolders)[number];

export interface FileFolderPaths {
  images: string;
  files: string;
}

const operationActions: Partial<Record<FilesOperation, FileAction>> = {
  head: "preview",
  exists: "preview",
  url: "preview",
  download: "preview",
  list: "list",
  search: "list",
  trashed: "list",
  versions: "list",
  upload: "upload",
  signedUploadUrl: "upload",
  copy: "update",
  move: "update",
  restoreTrashed: "update",
  restoreVersion: "update",
  delete: "delete",
  purge: "purge",
};

/** The `file` permission an operation needs; `undefined` means deny (`capabilities` needs none). */
export function fileActionFor(operation: FilesOperation): FileAction | undefined {
  return operationActions[operation];
}

const asFolder = (path: string) => (path.endsWith("/") ? path : `${path}/`);

/**
 * True for PDFs, which get the tall preview. some PDFs may be stored as
 * `application/octet-stream`, so the extension counts too.
 */
export function isPdf(file: { key: string; contentType: string }): boolean {
  return file.contentType === "application/pdf" || file.key.toLowerCase().endsWith(".pdf");
}

export function fileFolderRoots(paths: FileFolderPaths): Record<FileFolder, string> {
  return {
    images: asFolder(paths.images),
    files: asFolder(paths.files),
  };
}

/**
 * RFC 5987 compliant encoding for Content-Disposition filename*.
 *
 * Standard encodeURIComponent() leaves certain characters unencoded (!, ', (, ), *)
 * that violate RFC 5987 rules. This helper explicitly encodes these characters
 * to their percent-encoded hex representation (e.g., * becomes %2A).
 */
function encodeRFC5987ValueChars(str: string): string {
  return encodeURIComponent(str).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/**
 * Response overrides for `url`/`download` of a composed PDF; `undefined` keeps the gateway's
 * `attachment` default.
 *
 * Content-Disposition for print batch PDFs:
 * - `inline` renders the PDF directly in the browser (vs `attachment` which forces download)
 * - `filename` provides an ASCII fallback for older clients that don't support RFC 5987
 * - `filename*=UTF-8''` declares the encoding standard and language tag per RFC 5987 format:
 *   - UTF-8 = character set
 *   - First '' = empty language tag (RFC 5987: charset'lang'encoded-value, lang is optional)
 *   - Following $ = the percent-encoded filename
 *   (note: no quotes around filename* value, and exactly two single quotes after charset)
 */
export function pdfPreviewResponse(
  operation: FilesOperation,
  key: string | undefined,
  composedBase: string,
): { disposition: string; responseContentType: string } | undefined {
  if ((operation !== "url" && operation !== "download") || !key) return undefined;
  const base = asFolder(composedBase);
  if (!key.startsWith(base) || !key.endsWith(".pdf")) return undefined;

  const fileName = key.slice(base.length);
  // ASCII fallback for the `filename` parameter: remove non-ASCII characters (replace with "_")
  // for older clients that don't support RFC 5987's `filename*` parameter
  const asciiFallback = fileName.replace(/[^\x20-\x7e]/g, "_");
  const encoded = encodeRFC5987ValueChars(fileName);
  // Always force `application/pdf` (an Azure SAS `rsct`): composed PDFs may be stored as
  // `application/octet-stream`, which browsers download whatever the disposition, and pinning
  // the type also stops anything else under a `.pdf` key from rendering inline.
  return {
    disposition: `inline; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`,
    responseContentType: "application/pdf",
  };
}
