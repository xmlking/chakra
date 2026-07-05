/**
 * AlignUI useTabObserver v0.0.0
 * Source: https://www.alignui.com/docs/v1.2/ui/segmented-control
 */
import React, { useEffect } from "react";

interface TabObserverOptions {
  onActiveTabChange?: (index: number, element: HTMLElement) => void;
}

export function useTabObserver({ onActiveTabChange }: TabObserverOptions = {}) {
  const [mounted] = React.useState(true);
  const listRef = React.useRef<HTMLDivElement>(null);
  const onActiveTabChangeRef = React.useRef(onActiveTabChange);

  React.useEffect(() => {
    onActiveTabChangeRef.current = onActiveTabChange;
  }, [onActiveTabChange]);

  useEffect(() => {
    const handleUpdate = () => {
      if (listRef.current) {
        const tabs = listRef.current.querySelectorAll('[role="tab"]');
        tabs.forEach((el, i) => {
          if (el.getAttribute("data-state") === "active") {
            onActiveTabChangeRef.current?.(i, el as HTMLElement);
          }
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleUpdate);
    const mutationObserver = new MutationObserver(handleUpdate);

    if (listRef.current) {
      resizeObserver.observe(listRef.current);
      mutationObserver.observe(listRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    handleUpdate();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return { mounted, listRef };
}
