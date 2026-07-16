"use client";

import { CapabilitiesBadges } from "@workspace/ui/components/files-sdk/capabilities-badges";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/files-sdk/dropzone";
import { useFiles } from "files-sdk/react";
// import { toast } from "sonner";

export function FilesPage() {
  const files = useFiles({ endpoint: "/api/files" });

  return (
    <div className="container-wrapper">
      <CapabilitiesBadges files={files} supportedOnly />
      {/* Upload Section */}
      <Dropzone accept="image/*" files={files} prefix="docs/" maxFiles={5}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
}
