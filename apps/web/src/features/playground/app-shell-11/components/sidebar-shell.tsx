"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { cn } from "cn"

import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@workspace/ui/components/shadcn/sidebar"

import { AppSidebar } from "./app-sidebar"
import {
  RightSidebar,
  RightSidebarProvider,
  useRightSidebar,
} from "./right-sidebar"

const SIDEBAR_PROVIDER_STYLE = {
  "--sidebar-width": "250px",
  "--app-header-height": "50px",
  "--app-topbar-height": "48px",
  "--app-bottom-bar-height": "44px",
}

const MOBILE_SIDEBAR_BODY_STYLE = {
  "--sidebar-width": "250px",
  "--app-header-height": "50px",
  "--app-topbar-height": "48px",
  "--app-bottom-bar-height": "44px",
  "--sidebar": "color-mix(in oklab, var(--color-sidebar) 60%, transparent)",
  "--sidebar-accent":
    "color-mix(in oklab, var(--color-primary) 5%, transparent)",
  "--sidebar-accent-foreground": "var(--color-primary)",
}

type SidebarShellContextType = {
  contentSidebarOpen: boolean
  bottomSheetOpen: boolean
  workspaceSidebarOpen: boolean
  contextSidebarOpen: boolean
  allSidebarsExpanded: boolean
  toggleWorkspaceSidebar: () => void
  toggleContentSidebar: () => void
  toggleBottomSheet: () => void
  toggleContextSidebar: () => void
  expandAllSidebars: () => void
  collapseAllSidebars: () => void
  toggleAllSidebars: () => void
}

const SidebarShellContext = createContext<SidebarShellContextType>({
  contentSidebarOpen: true,
  bottomSheetOpen: true,
  workspaceSidebarOpen: true,
  contextSidebarOpen: true,
  allSidebarsExpanded: true,
  toggleWorkspaceSidebar: () => {},
  toggleContentSidebar: () => {},
  toggleBottomSheet: () => {},
  toggleContextSidebar: () => {},
  expandAllSidebars: () => {},
  collapseAllSidebars: () => {},
  toggleAllSidebars: () => {},
})

export function useSidebarShell() {
  return useContext(SidebarShellContext)
}

function SidebarShellControlsProvider({ children }: { children: ReactNode }) {
  const {
    isMobile,
    open: workspaceOpen,
    setOpen: setWorkspaceOpen,
    openMobile: workspaceMobileOpen,
    setOpenMobile: setWorkspaceMobileOpen,
    toggleSidebar,
  } = useSidebar()
  const {
    isOpen: rightSidebarOpen,
    mobileOpen: rightSidebarMobileOpen,
    toggle: toggleRightSidebar,
    open: openRightSidebar,
    close: closeRightSidebar,
    toggleMobile: toggleRightSidebarMobile,
    closeMobile: closeRightSidebarMobile,
  } = useRightSidebar()
  const [contentSidebarOpen, setContentSidebarOpen] = useState(true)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(true)

  const workspaceSidebarOpen = isMobile ? workspaceMobileOpen : workspaceOpen
  const contextSidebarOpen = isMobile
    ? rightSidebarMobileOpen
    : rightSidebarOpen
  const allSidebarsExpanded =
    workspaceOpen && rightSidebarOpen && contentSidebarOpen && bottomSheetOpen

  const toggleWorkspaceSidebar = useCallback(() => {
    toggleSidebar()
  }, [toggleSidebar])

  const toggleContentSidebar = useCallback(() => {
    setContentSidebarOpen((open) => !open)
  }, [])

  const toggleBottomSheet = useCallback(() => {
    setBottomSheetOpen((open) => !open)
  }, [])

  const toggleContextSidebar = useCallback(() => {
    if (isMobile) {
      toggleRightSidebarMobile()
    } else {
      toggleRightSidebar()
    }
  }, [isMobile, toggleRightSidebar, toggleRightSidebarMobile])

  const expandAllSidebars = useCallback(() => {
    setWorkspaceOpen(true)
    setWorkspaceMobileOpen(false)
    openRightSidebar()
    closeRightSidebarMobile()
    setContentSidebarOpen(true)
    setBottomSheetOpen(true)
  }, [
    closeRightSidebarMobile,
    openRightSidebar,
    setWorkspaceMobileOpen,
    setWorkspaceOpen,
  ])

  const collapseAllSidebars = useCallback(() => {
    setWorkspaceOpen(false)
    setWorkspaceMobileOpen(false)
    closeRightSidebar()
    closeRightSidebarMobile()
    setContentSidebarOpen(false)
    setBottomSheetOpen(false)
  }, [
    closeRightSidebar,
    closeRightSidebarMobile,
    setWorkspaceMobileOpen,
    setWorkspaceOpen,
  ])

  const toggleAllSidebars = useCallback(() => {
    if (allSidebarsExpanded) {
      collapseAllSidebars()
    } else {
      expandAllSidebars()
    }
  }, [allSidebarsExpanded, collapseAllSidebars, expandAllSidebars])

  const value = useMemo(
    () => ({
      contentSidebarOpen,
      bottomSheetOpen,
      workspaceSidebarOpen,
      contextSidebarOpen,
      allSidebarsExpanded,
      toggleWorkspaceSidebar,
      toggleContentSidebar,
      toggleBottomSheet,
      toggleContextSidebar,
      expandAllSidebars,
      collapseAllSidebars,
      toggleAllSidebars,
    }),
    [
      allSidebarsExpanded,
      bottomSheetOpen,
      collapseAllSidebars,
      contentSidebarOpen,
      contextSidebarOpen,
      expandAllSidebars,
      toggleAllSidebars,
      toggleBottomSheet,
      toggleContentSidebar,
      toggleContextSidebar,
      toggleWorkspaceSidebar,
      workspaceSidebarOpen,
    ]
  )

  return (
    <SidebarShellContext.Provider value={value}>
      {children}
    </SidebarShellContext.Provider>
  )
}

function useMobileBodyTheme(isMobile: boolean) {
  useEffect(() => {
    if (!isMobile) return

    const body = document.body

    const prev: Record<string, string> = {}
    for (const [prop, value] of Object.entries(MOBILE_SIDEBAR_BODY_STYLE)) {
      prev[prop] = body.style.getPropertyValue(prop)
      body.style.setProperty(prop, value)
    }

    return () => {
      for (const [prop, prevValue] of Object.entries(prev)) {
        if (prevValue) {
          body.style.setProperty(prop, prevValue)
        } else {
          body.style.removeProperty(prop)
        }
      }
    }
  }, [isMobile])
}

function SidebarBody({ children }: { children: ReactNode }) {
  const { isMobile } = useSidebar()
  useMobileBodyTheme(isMobile)

  return (
    <SidebarInset className="ml-0! min-h-svh overflow-hidden">
      {children}
    </SidebarInset>
  )
}

export function SidebarShell({ children }: { children: ReactNode }) {
  return (
    <RightSidebarProvider>
      <SidebarProvider
        className={cn(
          "h-screen",
          "[--sidebar:color-mix(in_oklab,var(--color-sidebar)_60%,transparent)]",
          "[--sidebar-width:250px]",
          "[--sidebar-accent:color-mix(in_oklab,var(--color-primary)_5%,transparent)]",
          "[--sidebar-accent-foreground:var(--color-primary)]"
        )}
        style={SIDEBAR_PROVIDER_STYLE as CSSProperties}
      >
        <SidebarShellControlsProvider>
          <AppSidebar />
          <SidebarBody>{children}</SidebarBody>
          <RightSidebar />
        </SidebarShellControlsProvider>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}