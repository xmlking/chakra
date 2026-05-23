import { ThemeProvider } from "@lonik/themer";
import { Toaster } from "@workspace/ui/components/shadcn/sonner";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import type { ReactNode } from "react";
// import { AuthProvider } from "./auth/auth-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {/* <AuthProvider> */}
        {children}
        <Toaster />
        {/* </AuthProvider> */}
      </TooltipProvider>
    </ThemeProvider>
  );
}
