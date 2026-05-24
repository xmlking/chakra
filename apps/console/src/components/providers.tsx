import { ThemeProvider } from "@lonik/themer";
import { Toaster } from "@workspace/ui/components/shadcn/sonner";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { Suspense, type ReactNode } from "react";

import { WelcomeToast } from "#components/welcome-toast";
// import { AuthProvider } from "./auth/auth-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {/* <AuthProvider> */}
        {children}
        <Suspense fallback={null}>
          <Toaster closeButton />
          <WelcomeToast />
        </Suspense>
        {/* </AuthProvider> */}
      </TooltipProvider>
    </ThemeProvider>
  );
}
