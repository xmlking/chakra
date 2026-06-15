import type { CaptchaRenderProps } from "@better-auth-ui/react/plugins";
import { type TurnstileInstance, Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useRef } from "react";
import env from "virtual:env/client";

export function TurnstileWidget({ setToken, clearToken, setReset }: CaptchaRenderProps) {
  const ref = useRef<TurnstileInstance>(null);

  useEffect(() => {
    setReset(() => ref.current?.reset());
    return () => setReset(null);
  }, [setReset]);

  return (
    <Turnstile
      ref={ref}
      siteKey={env.VITE_TURNSTILE_SITE_KEY}
      onSuccess={setToken}
      onError={clearToken}
      onExpire={clearToken}
      options={{ size: "flexible" }}
    />
  );
}
