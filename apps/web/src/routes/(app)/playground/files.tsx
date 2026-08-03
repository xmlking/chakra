import { createFileRoute } from "@tanstack/react-router";
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
  const [key, setKey] = useState<string>();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Files SDK Test</h1>
      <div className="mt-4 text-lg">
        {/* Capabilities Badges   */}
        <CapabilitiesBadges files={files} supportedOnly />
        {/* Upload Section */}
        <Dropzone
          accept="image/*,text/*,application/pdf"
          directory
          files={files}
          prefix="docs/"
          onUploaded={bump}
          maxFiles={10}
        >
          <DropzoneContent />
          <DropzoneEmptyState />
          <DropzoneError />
        </Dropzone>
        <FileSearch
          files={files}
          prefix="docs/"
          defaultMatch="glob"
          onSelect={(file) => setKey(file.key)}
        />
        {/* file list   */}
        {/* <FileList files={files} key={`list-${version}`} prefix="docs/" onChanged={bump} /> */}

        <FileBrowser
          files={files}
          key={`browser-${version}`}
          initialPrefix="docs/"
          onSelect={(file) => setKey(file.key)}
        />
        <p>Preview File: {key}</p>
        {key && <FilePreview file={key} files={files} />}
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
