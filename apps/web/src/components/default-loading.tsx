import { Loader2Icon } from "lucide-react";

export function DefaultLoading() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <Loader2Icon className="animate-spin" />
    </div>
  );
}
