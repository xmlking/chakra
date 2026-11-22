import { createFileRoute, redirect } from "@tanstack/react-router";
// import { CsvViewer } from "@workspace/ui/components/extend/csv-viewer";
// import { PDFViewer } from "@workspace/ui/components/extend/pdf-viewer";
import { CapabilitiesBadges } from "@workspace/ui/components/files-sdk/capabilities-badges";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  DropzoneError,
} from "@workspace/ui/components/files-sdk/dropzone";
import { FileBrowser } from "@workspace/ui/components/files-sdk/file-browser";
import { FilePreview } from "@workspace/ui/components/files-sdk/file-preview";
import { FileSearch } from "@workspace/ui/components/files-sdk/file-search";
import { TrashBin } from "@workspace/ui/components/files-sdk/trash-bin";
import type { FileInfo } from "files-sdk";
import { useFiles } from "files-sdk/react";
import { useState } from "react";

import { isPdf } from "#features/files/access";
import { getSystemFileAccessFn } from "#features/files/api/service";

export const Route = createFileRoute("/(app)/admin/files")({
  staticData: {
    breadcrumb: ["Admin", "Files"],
  },
  // UX guard only; `/api/admin/files` authorizes every operation itself.
  async beforeLoad() {
    const { canBrowse } = await getSystemFileAccessFn();
    if (!canBrowse) {
      throw redirect({ to: "/forbidden" });
    }
  },
  head: () => ({
    meta: [{ title: "Files | Admin" }],
  }),
  component: FilesPage,
});

function FilesPage() {
  const files = useFiles({ endpoint: "/api/admin/files" });
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);
  const [selected, setSelected] = useState<FileInfo>();

  return (
    <div className="container mx-auto p-8">
      <div className="text-lg">
        {/* Capabilities Badges   */}
        <CapabilitiesBadges files={files} supportedOnly />
        {/* Upload Section */}
        <Dropzone
          accept="image/*,text/*,application/pdf"
          directory
          files={files}
          onUploaded={bump}
          maxFiles={10}
        >
          <DropzoneContent />
          <DropzoneEmptyState />
          <DropzoneError />
        </Dropzone>
        <FileSearch files={files} defaultMatch="glob" onSelect={setSelected} />
        {/* file list   */}
        {/* <FileList files={files} key={`list-${version}`} prefix="docs/" onChanged={bump} /> */}

        <FileBrowser
          files={files}
          key={`browser-${version}`}
          pageSize={10}
          onNavigate={() => setSelected(undefined)}
          onSelect={setSelected}
        />
        {selected && (
          <>
            <p>Preview File: {selected.key}</p>
            <FilePreview
              key={selected.key}
              file={selected.key}
              files={files}
              // Tall viewer for PDFs only; text (JSON, CSV) keeps the default `max-h-72`.
              previewClassName={isPdf(selected) ? "h-[80vh] max-h-none" : undefined}
            />
          </>
        )}
        {/* {key && (
          <FilePreview
            file={key}
            files={files}
            renderPreview={({ file, src, text }) => {
              if (file.type === "application/pdf" && src) {
                return <PDFViewer className="h-[640px]" src={src} />;
              }
              if (file.type === "text/csv" && text) {
                return <CsvViewer data={text} search />;
              }
              return <p className="text-sm text-muted-foreground">No preview</p>;
            }}
          />
        )} */}

        <TrashBin files={files} key={`trash-${version}`} onChanged={bump} />
      </div>
    </div>
  );
}
