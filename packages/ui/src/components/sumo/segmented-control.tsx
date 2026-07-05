// oxlint-disable react-doctor/no-multi-comp react-doctor/no-react19-deprecated-apis
"use client";

import { Tabs } from "@base-ui/react";
import React from "react";

import { cn } from "#lib/utils";

import { useTabObserver } from "./hooks/use-tab-observer";

/**
 * AlignUI SegmentedControl v0.0.0
 * Source: https://www.alignui.com/docs/v1.2/ui/segmented-control
 * Docs: https://www.radix-ui.com/primitives/docs/components/tabs
 */

const SegmentedControlRoot = Tabs.Root;
SegmentedControlRoot.displayName = "SegmentedControlRoot";

const SegmentedControlList = React.forwardRef<
  React.ComponentRef<typeof Tabs.List>,
  React.ComponentPropsWithoutRef<typeof Tabs.List> & {
    floatingBgClassName?: string;
  }
>(({ children, className, floatingBgClassName, ...rest }, forwardedRef) => {
  const [lineStyle, setLineStyle] = React.useState({ width: 0, left: 0 });

  const { mounted, listRef } = useTabObserver({
    onActiveTabChange: (_, activeTab) => {
      const { offsetWidth: width, offsetLeft: left } = activeTab;
      setLineStyle({ width, left });
    },
  });

  const handleRef = (element: HTMLDivElement | null) => {
    listRef.current = element;
    if (forwardedRef) {
      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else {
        forwardedRef.current = element;
      }
    }
  };

  return (
    <Tabs.List
      className={cn(
        "rounded-10 bg-bg-weak-50 relative isolate grid w-full auto-cols-fr grid-flow-col gap-1 p-1",
        className,
      )}
      ref={handleRef}
      {...rest}
    >
      {children}

      {/* floating bg */}
      <div
        aria-hidden="true"
        className={cn(
          "bg-bg-white-0 shadow-toggle-switch absolute inset-y-1 left-0 -z-10 rounded-md transition-transform duration-300",
          {
            hidden: !mounted,
          },
          floatingBgClassName,
        )}
        style={{
          transform: `translate3d(${lineStyle.left}px, 0, 0)`,
          width: `${lineStyle.width}px`,
          transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      />
    </Tabs.List>
  );
});
SegmentedControlList.displayName = "SegmentedControlList";

const SegmentedControlTrigger = React.forwardRef<
  React.ComponentRef<typeof Tabs.Tab>,
  React.ComponentPropsWithoutRef<typeof Tabs.Tab>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <Tabs.Tab
      className={cn(
        // base
        "peer",
        "text-label-sm text-text-soft-400 relative z-10 h-7 rounded-md px-1 whitespace-nowrap outline-none",
        "flex items-center justify-center gap-1.5",
        "transition duration-300 ease-out",
        // focus
        "focus:outline-none",
        // active
        "data-[state=active]:text-text-strong-950",
        className,
      )}
      ref={forwardedRef}
      {...rest}
    />
  );
});
SegmentedControlTrigger.displayName = "SegmentedControlTrigger";

const SegmentedControlContent = React.forwardRef<
  React.ComponentRef<typeof Tabs.Panel>,
  React.ComponentPropsWithoutRef<typeof Tabs.Panel>
>(({ ...rest }, forwardedRef) => <Tabs.Panel ref={forwardedRef} {...rest} />);
SegmentedControlContent.displayName = "SegmentedControlContent";

export {
  SegmentedControlRoot as Root,
  SegmentedControlList as List,
  SegmentedControlTrigger as Trigger,
  SegmentedControlContent as Content,
};
