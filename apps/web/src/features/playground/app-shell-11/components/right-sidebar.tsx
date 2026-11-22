"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@workspace/ui/components/shadcn/sheet";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { cn } from "cn";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { CalendarPanel } from "./calendar-panel";

type RightSidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  mobileOpen: boolean;
  toggleMobile: () => void;
  openMobile: () => void;
  closeMobile: () => void;
};

const RightSidebarContext = createContext<RightSidebarContextType>({
  isOpen: true,
  toggle: () => {},
  open: () => {},
  close: () => {},
  mobileOpen: false,
  toggleMobile: () => {},
  openMobile: () => {},
  closeMobile: () => {},
});

export function RightSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggle = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  const toggleMobile = useCallback(() => {
    setMobileOpen((open) => !open);
  }, []);
  const openMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);
  const value = useMemo(
    () => ({
      isOpen,
      toggle,
      open,
      close,
      mobileOpen,
      toggleMobile,
      openMobile,
      closeMobile,
    }),
    [close, closeMobile, isOpen, mobileOpen, open, openMobile, toggle, toggleMobile],
  );

  return <RightSidebarContext.Provider value={value}>{children}</RightSidebarContext.Provider>;
}

export function useRightSidebar() {
  return useContext(RightSidebarContext);
}

export function RightSidebar() {
  const { isOpen, mobileOpen, openMobile, closeMobile } = useRightSidebar();
  const isMobile = useIsMobile();

  return isMobile ? (
    <Sheet open={mobileOpen} onOpenChange={(open) => (open ? openMobile() : closeMobile())}>
      <SheetContent
        side="right"
        className="w-[300px] p-0 [&>button]:hidden"
        style={{ "--sidebar-width": "300px" } as CSSProperties}
      >
        <SheetTitle className="sr-only">Context panel</SheetTitle>
        <SheetDescription className="sr-only">
          Right-side context panel with calendar and activity.
        </SheetDescription>
        <CalendarPanel />
      </SheetContent>
    </Sheet>
  ) : (
    <div
      role="complementary"
      aria-label="Context panel"
      aria-hidden={!isOpen}
      className={cn(
        "sticky top-0 h-svh shrink-0 overflow-hidden",
        "flex border-l bg-background transition-[width] duration-300 ease-in-out",
        isOpen ? "w-[280px]" : "w-0",
      )}
    >
      <div className="flex w-[280px] shrink-0">
        <CalendarPanel />
      </div>
    </div>
  );
}
