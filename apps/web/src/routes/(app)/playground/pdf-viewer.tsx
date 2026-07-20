import { createFileRoute } from "@tanstack/react-router";
import { PDFViewer } from "@workspace/ui/components/extend/pdf-viewer";

export const Route = createFileRoute("/(app)/playground/pdf-viewer")({
  component: RouteComponent,
});

const PDF_URL = "/loan-application.pdf";
const showRotateControls = true;

function RouteComponent() {
  return (
    <div className="container">
      <PDFViewer
        src={PDF_URL}
        defaultZoom={0.5}
        showRotateControls={showRotateControls}
        className="h-[640px]"
      />
    </div>
  );
}
