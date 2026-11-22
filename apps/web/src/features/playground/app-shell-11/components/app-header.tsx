import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@workspace/ui/components/shadcn/breadcrumb";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { SidebarTrigger } from "@workspace/ui/components/shadcn/sidebar";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { cn } from "cn";
import {
  RocketIcon,
  EyeIcon,
  FlaskConicalIcon,
  ChevronsUpDownIcon,
  CheckIcon,
  PlusIcon,
  HelpCircleIcon,
  BotIcon,
  PanelRightIcon,
} from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";

import { useRightSidebar } from "./right-sidebar";

type HeaderProject = {
  id: string;
  name: string;
  tier: string;
  Logo: ComponentType<{ className?: string }>;
  isActive?: boolean;
};

type HeaderEnvironment = {
  id: string;
  name: string;
  icon: ReactNode;
  isActive?: boolean;
};

function AcmeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id="sidebar-11-ws-acme"
          x1="0"
          y1="0"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="35%" stopColor="#7c3aed" />
          <stop offset="70%" stopColor="#a21caf" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill="url(#sidebar-11-ws-acme)" />
    </svg>
  );
}

function StarterLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id="sidebar-11-ws-starter"
          x1="0"
          y1="0"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="33%" stopColor="#f97316" />
          <stop offset="66%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill="url(#sidebar-11-ws-starter)" />
    </svg>
  );
}

function EnterpriseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id="sidebar-11-ws-enterprise"
          x1="0"
          y1="0"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="35%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill="url(#sidebar-11-ws-enterprise)" />
    </svg>
  );
}

const HEADER_PROJECTS: HeaderProject[] = [
  {
    id: "atlas-desk",
    name: "Atlas Desk",
    tier: "Agent workspace",
    Logo: AcmeLogo,
    isActive: true,
  },
  {
    id: "handoff-kit",
    name: "Handoff Kit",
    tier: "Customer handoffs",
    Logo: StarterLogo,
  },
  {
    id: "review-studio",
    name: "Review Studio",
    tier: "QA workspace",
    Logo: EnterpriseLogo,
  },
];

const HEADER_ENVIRONMENTS: HeaderEnvironment[] = [
  {
    id: "production",
    name: "Production",
    isActive: true,
    icon: <RocketIcon className="size-4" aria-hidden="true" />,
  },
  {
    id: "preview",
    name: "Preview",
    icon: <EyeIcon className="size-4" aria-hidden="true" />,
  },
  {
    id: "sandbox",
    name: "Sandbox",
    icon: <FlaskConicalIcon className="size-4" aria-hidden="true" />,
  },
];

const headerSwitcherTriggerClassName =
  "h-8 items-center gap-1.5 px-2.5 py-0 text-sm leading-none text-foreground [&_svg]:block";

const headerSwitcherIconClassName = "flex size-4 shrink-0 items-center justify-center leading-none";

const headerSwitcherLabelClassName = "inline-flex h-4 items-center leading-none";

const headerSwitcherChevronClassName = "size-3.5 shrink-0 opacity-60";

function ProjectSwitcher() {
  const [activeProject, setActiveProject] = useState(
    HEADER_PROJECTS.find((project) => project.isActive) ?? HEADER_PROJECTS[0],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className={headerSwitcherTriggerClassName}
          />
        }
      >
        <span className={headerSwitcherIconClassName}>
          <activeProject.Logo className="size-4" />
        </span>
        <span className={cn("sr-only sm:not-sr-only", headerSwitcherLabelClassName)}>
          {activeProject.name}
        </span>
        <ChevronsUpDownIcon className={headerSwitcherChevronClassName} aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" alignOffset={-16} sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          <DropdownMenuGroup>
            {HEADER_PROJECTS.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={cn(activeProject.id === project.id && "bg-accent")}
              >
                <project.Logo className="size-5 shrink-0" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm">{project.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{project.tier}</span>
                </div>
                {activeProject.id === project.id && (
                  <CheckIcon className="ml-auto size-4 text-primary" aria-hidden="true" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PlusIcon aria-hidden="true" />
            Create Project
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EnvironmentSwitcher() {
  const [activeEnv, setActiveEnv] = useState(
    HEADER_ENVIRONMENTS.find((env) => env.isActive) ?? HEADER_ENVIRONMENTS[0],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className={headerSwitcherTriggerClassName}
          />
        }
      >
        <span className={headerSwitcherIconClassName}>{activeEnv.icon}</span>
        <span className={headerSwitcherLabelClassName}>{activeEnv.name}</span>
        <ChevronsUpDownIcon className={headerSwitcherChevronClassName} aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Environments</DropdownMenuLabel>
          <DropdownMenuGroup>
            {HEADER_ENVIRONMENTS.map((env) => (
              <DropdownMenuItem
                key={env.id}
                onClick={() => setActiveEnv(env)}
                className={cn(activeEnv.id === env.id && "bg-accent")}
              >
                {env.icon}
                {env.name}
                {activeEnv.id === env.id && (
                  <CheckIcon className="ml-auto size-4 text-primary" aria-hidden="true" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppHeader() {
  const { isOpen, toggle, mobileOpen, toggleMobile } = useRightSidebar();
  const isMobile = useIsMobile();

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-(--app-header-height) shrink-0 items-center gap-3 border-b border-border bg-background",
        "px-3 sm:px-4",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1 md:hidden" />

        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="min-w-0 flex-nowrap gap-1">
            <BreadcrumbItem>
              <ProjectSwitcher />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden text-xs opacity-60 sm:flex">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem className="hidden sm:flex">
              <EnvironmentSwitcher />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div
        role="toolbar"
        aria-label="Header actions"
        className="ml-auto flex shrink-0 items-center gap-1.5"
      >
        <Button
          variant="ghost"
          size="default"
          className="hidden text-muted-foreground xl:inline-flex"
        >
          <HelpCircleIcon data-icon="inline-start" aria-hidden="true" />
          Help
        </Button>

        <Button variant="outline" size="default">
          <BotIcon data-icon="inline-start" aria-hidden="true" />
          <span className="hidden xl:inline">Ask ReUI</span>
          <span className="xl:hidden">Ask</span>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={isMobile ? toggleMobile : toggle}
          aria-label={
            (isMobile ? mobileOpen : isOpen) ? "Close context panel" : "Open context panel"
          }
          aria-expanded={isMobile ? mobileOpen : isOpen}
        >
          <PanelRightIcon aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
