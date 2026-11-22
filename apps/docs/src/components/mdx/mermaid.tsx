"use client";
import { cn } from "cn";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CopyIcon,
  Maximize2Icon,
  Minimize2Icon,
  RefreshCwIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  type MouseEventHandler,
  type PointerEvent,
  type ReactNode,
  Suspense,
  use,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

// Renders with mermaid.js (the same engine GitHub uses) in the browser, so
// every diagram feature (autonumber, alt/else with notes, erDiagram, xychart…)
// matches the GitHub preview. mermaid is loaded lazily on first diagram.
// Controls mirror GitHub's viewer: fullscreen, copy source, pan and zoom.

const PAN_STEP = 60;
const ZOOM_STEP = 1.25;
const MIN_SCALE = 0.25;
const MAX_SCALE = 8;

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, create: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = create();
  cache.set(key, promise);
  return promise;
}

const noopSubscribe = () => () => {};

export function Mermaid({ chart, label }: { chart: string; label?: string }) {
  // mermaid needs the DOM, so render only on the client.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const figureRef = useRef<HTMLElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [checked, onCopy] = useCopyButton(() => navigator.clipboard.writeText(chart.trim()));

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === figureRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const pan = (dx: number, dy: number) => setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  const zoom = (factor: number) =>
    setView((v) => ({
      ...v,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor)),
    }));
  const reset = () => setView({ x: 0, y: 0, scale: 1 });
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void figureRef.current?.requestFullscreen();
  };

  // Drag to pan, like GitHub's viewer.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    pan(e.clientX - drag.current.x, e.clientY - drag.current.y);
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <figure
      ref={figureRef}
      aria-label={label}
      className={cn(
        "group not-prose bg-fd-card relative my-6 overflow-hidden rounded-xl border",
        fullscreen && "flex flex-col rounded-none border-0",
      )}
    >
      <div
        className={cn(
          "cursor-grab touch-none p-5 select-none active:cursor-grabbing",
          fullscreen && "flex flex-1 items-center justify-center [&_svg]:max-w-none",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={reset}
      >
        <div
          className="w-full origin-center"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        >
          {mounted ? (
            <Suspense fallback={<div className="h-40" />}>
              <MermaidContent chart={chart} />
            </Suspense>
          ) : (
            <div className="h-40" />
          )}
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1">
        <ControlButton
          label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          onClick={toggleFullscreen}
        >
          {fullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
        </ControlButton>
        <ControlButton label="Copy diagram source" onClick={onCopy}>
          {checked ? <CheckIcon /> : <CopyIcon />}
        </ControlButton>
      </div>

      <div className="absolute right-2 bottom-2 grid grid-cols-3 gap-1">
        <span />
        <ControlButton label="Pan up" onClick={() => pan(0, PAN_STEP)}>
          <ChevronUpIcon />
        </ControlButton>
        <ControlButton label="Zoom in" onClick={() => zoom(ZOOM_STEP)}>
          <ZoomInIcon />
        </ControlButton>
        <ControlButton label="Pan left" onClick={() => pan(PAN_STEP, 0)}>
          <ChevronLeftIcon />
        </ControlButton>
        <ControlButton label="Reset view" onClick={reset}>
          <RefreshCwIcon />
        </ControlButton>
        <ControlButton label="Pan right" onClick={() => pan(-PAN_STEP, 0)}>
          <ChevronRightIcon />
        </ControlButton>
        <span />
        <ControlButton label="Pan down" onClick={() => pan(0, -PAN_STEP)}>
          <ChevronDownIcon />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={() => zoom(1 / ZOOM_STEP)}>
          <ZoomOutIcon />
        </ControlButton>
      </div>
    </figure>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      // Keep button presses from starting a drag-pan on the diagram.
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        buttonVariants({ color: "secondary", size: "icon-xs" }),
        "bg-fd-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
      )}
    >
      {children}
    </button>
  );
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId().replaceAll(":", "");
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "default";
  const { default: mermaid } = use(cachePromise("mermaid", () => import("mermaid")));

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    fontFamily: "inherit",
    theme,
  });

  const { svg, bindFunctions } = use(
    cachePromise(`${theme}:${chart}`, () => mermaid.render(`mermaid-${id}`, chart.trim())),
  );

  // mermaid emits width="100%" + max-width: <natural width>, so a full-width
  // wrapper lets the diagram fill the frame up to its natural size.
  return (
    <div
      className="flex w-full justify-center [&_svg]:h-auto"
      ref={(container) => {
        if (container) bindFunctions?.(container);
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
