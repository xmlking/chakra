# Storage

[Files SDK](https://files-sdk.dev/) is a unified storage API for 40+ providers - one class, ten methods, a typed escape hatch, and an agent-friendly CLI.

## Usage

```tsx title="apps/web/src/actions/files.tsx"
import { files, type FilesError } from "@workspace/storage";

// Upload
await files.upload("reports/q1.pdf", file, {
  contentType: "application/pdf",
  cacheControl: "public, max-age=31536000",
  metadata: { userId: "123" },
});

// List with cursor pagination
const { items, cursor } = await files.list({ prefix: "reports/", limit: 50 });

// Sign a short-lived read URL
const url = await files.url("reports/q1.pdf", { expiresIn: 300 });

// Hand back a browser-direct upload contract
const upload = await files.signedUploadUrl("reports/q2.pdf", {
  expiresIn: 600,
  contentType: "application/pdf",
  maxSize: 25_000_000,
});

// Handle normalized errors
try {
  await files.download("missing.pdf");
} catch (err) {
  if (err instanceof FilesError && err.code === "NotFound") return null;
  throw err;
}
```

## Commands

```shell
vp build packages/storage
vp test packages/storage
vp check packages/storage
vp run @workspace/storage#typecheck
```

## Refeence

- [TanStack Start Gateway](https://files-sdk.dev/docs/ui/server/tanstack-start)
