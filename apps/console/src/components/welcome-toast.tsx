import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 850) return;
    if (!document.cookie.includes("welcome-toast=3")) {
      toast("🚀 Welcome to TanStack Faster!", {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie += "welcome-toast=3;max-age=31536000";
        },
        description: (
          <>
            This is a highly performant WebApp template using TanStack Start.
            <hr className="my-2" />
            This demo is to highlight the speed a full-stack TanStack Start site can achieve.{" "}
            <a
              href="https://github.com/xmlking/chakra/"
              className="text-accent1 font-semibold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get the Source
            </a>
          </>
        ),
      });
    }
  }, []);

  return null;
}
