import { ProgressProvider, useProgress } from "@bprogress/react";
import { useRouterState } from "@tanstack/react-router";
import { type FC, type ReactNode, useEffect } from "react";

interface IProps {
  children: ReactNode;
}

/**
 * Delay in milliseconds before showing the progress bar.
 * Only shows if navigation takes longer than this threshold.
 * This usually never happens unless the user has a very slow device or network.
 */
const delayMs = 120;

export const RouteProgressProvider: FC<IProps> = ({ children }) => {
  return (
    <ProgressProvider
      options={{ showSpinner: false }}
      color="var(--color-primary)"
      height="2px"
      delay={delayMs}
    >
      {children}
    </ProgressProvider>
  );
};

export const RouteProgressController: FC = () => {
  const isNavigating = useRouterState({ select: (state) => state.status === "pending" });
  const { start, stop } = useProgress();

  useEffect(() => {
    if (isNavigating) {
      start(undefined, delayMs);
      return;
    }

    stop();
  }, [isNavigating, start, stop]);

  return null;
};
