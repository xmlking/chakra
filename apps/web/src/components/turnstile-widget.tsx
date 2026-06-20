import type { CaptchaRenderProps } from "@better-auth-ui/react/plugins";
import { type TurnstileInstance, Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import env from "virtual:env/client";

export function TurnstileWidget({ setToken, clearToken, setReset }: CaptchaRenderProps) {
  const ref = useRef<TurnstileInstance>(null);

  useEffect(() => {
    setReset(() => ref.current?.reset());
    return () => setReset(null);
  }, [setReset]);

  const { theme } = useTheme();

  return (
    <Turnstile
      ref={ref}
      siteKey={env.VITE_TURNSTILE_SITE_KEY}
      onSuccess={setToken}
      onError={clearToken}
      onExpire={clearToken}
      options={{ size: "flexible", theme: theme?.endsWith("-dark") ? "dark" : "light" }}
    />
  );
}
