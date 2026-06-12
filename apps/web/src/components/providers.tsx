import { ThemeProvider } from "@lonik/themer";
// import { Link, useRouter } from "@tanstack/react-router";
import { Toaster } from "@workspace/ui/components/shadcn/sonner";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { Suspense, type ReactNode } from "react";

import { MetaTheme } from "#components/meta-theme";
import { WelcomeToast } from "#components/welcome-toast";
// import { AuthUIProvider } from "@daveyplate/better-auth-ui"
// import { authClient } from "@workspace/authclient"
// import { AuthProvider } from "./auth/auth-provider"

export function Providers({ children }: { children: ReactNode }) {
  // const { navigate } = useRouter();

  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <TooltipProvider>
        {/* <AuthProvider> */}
        {/* <AuthUIProvider
            authClient={authClient}
            navigate={(href) => navigate({ href })}
            replace={(href) => navigate({ href, replace: true })}
            Link={({ href, ...props }) => <Link to={href} {...props} />}
        > */}
        {children}
        <MetaTheme />
        <Suspense fallback={null}>
          <Toaster richColors closeButton />
          <WelcomeToast />
        </Suspense>
        {/* </AuthProvider> */}
        {/* </AuthUIProvider> */}
      </TooltipProvider>
    </ThemeProvider>
  );
}
