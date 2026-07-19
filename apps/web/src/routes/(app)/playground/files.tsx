import { createFileRoute } from "@tanstack/react-router";
import { CapabilitiesBadges } from "@workspace/ui/components/files-sdk/capabilities-badges";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/files-sdk/dropzone";
import { FileActions } from "@workspace/ui/components/files-sdk/file-actions";
import { FileBrowser } from "@workspace/ui/components/files-sdk/file-browser";
import { FileList } from "@workspace/ui/components/files-sdk/file-list";
import { FileSearch } from "@workspace/ui/components/files-sdk/file-search";
import { TrashBin } from "@workspace/ui/components/files-sdk/trash-bin";
import { useFiles } from "files-sdk/react";
import { useState } from "react";

export const Route = createFileRoute("/(app)/playground/files")({
  staticData: {
    breadcrumb: () => "Files",
  },
  component: FilesPage,
});

function FilesPage() {
  const files = useFiles({ endpoint: "/api/files" });
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Files SDK Test</h1>
      <div className="mt-4 text-lg">
        {/* Capabilities Badges   */}
        <CapabilitiesBadges files={files} supportedOnly />
        {/* Upload Section */}
        <Dropzone
          accept="application/pdf"
          files={files}
          prefix="docs/"
          onUploaded={bump}
          maxFiles={5}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
        <FileSearch
          files={files}
          prefix="docs/"
          defaultMatch="glob"
          onSelect={(file) => console.log(file.key)}
        />
        {/* file list   */}
        <FileList files={files} key={`list-${version}`} prefix="docs/" onChanged={bump} />

        <FileBrowser
          files={files}
          key={`browser-${version}`}
          initialPrefix="docs/"
          onSelect={(file) => console.log(file.key)}
        />
        <TrashBin files={files} key={`trash-${version}`} onChanged={bump} />
        {/* file actions   */}
        <div className="flex w-full max-w-sm items-center justify-between gap-4 rounded-lg border border-border p-3">
          <span className="truncate text-sm font-medium">docs/b4.png</span>
          <FileActions
            files={files}
            fileKey="docs/b4.png"
            onChanged={() => {
              console.log("FileActions...");
            }}
          />
        </div>
      </div>
    </div>
  );
}
