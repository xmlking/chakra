import {
  AlertTriangle,
  Info,
  PauseCircle,
  Scan,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Timer,
  Radio,
  Route,
  Globe,
  Bot,
  Cloud,
  MonitorSmartphone,
  Mail,
  GitCompare,
  Terminal,
  Languages,
  ShieldAlert,
  FileCode2,
  KeyRound,
} from "lucide-react";

import { HoverRow } from "./info-hover";

export function ThreatBreakHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" />
        <p className="text-sm font-semibold">
          Threat<span className="text-primary">break</span>
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        Two-stage, autonomous event correlation: a fast stage scores every device&apos;s activity
        before anyone reads anything, and only what clears the line goes to an AI investigator that
        pulls its own evidence and writes a plain-language finding. Threatbreak is the moment the
        noise breaks into a signal.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Two temporal horizons</p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">Fast pass</span> — every 30 seconds, scores
          counts (beaconing, blocked attempts, failed logins, high-entropy uploads) against a
          handoff line; catches a burst as it happens
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">Slow pass</span> — every 15 minutes over the
          last hour, and only speaks up when activity is sustained, not bursty; catches what a
          30-second window never can, like a password spray of one attempt every few minutes
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          The investigator widens the horizon again, looking a few hours either side of a flagged
          window. It is read-only and opt-in — nothing is investigated until an admin turns it on.
        </p>
      </div>
    </div>
  );
}
export function TrustZeroHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">TrustZero</p>
      </div>
      <p className="text-xs text-muted-foreground">
        TrustZero is one org-wide default that auto-generates and maintains the underlying
        allow/deny policies for you, instead of requiring every rule to be hand-written. It reads
        from the same app catalog your fleet already populates — pick a posture, and TrustZero keeps
        the policy rows in sync as apps get blocked or unblocked.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">The three postures</p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">Allow by Default</span> — only explicitly
          blocked apps are denied
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">Learn, Then Enforce</span> — every app can
          reach the network for days while the catalog fills in, then TrustZero switches to Catalog
          Only automatically using what it saw
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">Catalog Only</span> — nothing reaches the
          network unless it&apos;s already catalogued and unblocked
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Deny all ingress is a separate toggle below — it blocks unsolicited inbound traffic
          org-wide regardless of which posture you pick.
        </p>
      </div>
    </div>
  );
}

export function ZonesOverviewHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Scan className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">Zones</p>
      </div>
      <p className="text-xs text-muted-foreground">
        A zone defines a network segment by its{" "}
        <span className="font-mono text-foreground">entry point</span> — the device or selector
        traffic has to pass through to reach it — plus what's allowed once inside: IP ranges, DNS
        servers, whether QS-channel or auth is required, and how long a session lasts.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">EdgeGuard toggles, when relevant</p>
        <p className="text-[11px] text-muted-foreground">
          Rate limiting, SYN cookies, and challenge-ACK only do anything when a zone's entry point
          is an <span className="font-mono text-foreground">EdgeGuard</span> gateway — on an
          ordinary device they're stored but inert.
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Zones define <span className="font-medium text-foreground">where</span> traffic enters and
          what's expected there — <span className="font-medium text-foreground">Policies</span>{" "}
          define what's actually allowed to happen once it does.
        </p>
      </div>
    </div>
  );
}

export function PiHeadingHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">π Inspector</p>
      </div>
      <p className="text-xs text-muted-foreground">
        π is Threatmatic&apos;s own inspection engine — it decrypts and classifies a device&apos;s
        HTTPS traffic locally, at the endpoint itself, rather than at a perimeter firewall. Every
        request is scored for encrypted exfiltration, C2 beaconing, brute-force attempts, DNS
        tunneling, and more.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          This page configures the rules π enforces — thresholds, allow/block lists, and detection
          toggles, below.
        </p>
      </div>
    </div>
  );
}

export function ExampleHelp1() {
  return (
    <div className="space-y-2">
      <HoverRow icon={Info} tone="info">
        The first pass always runs a fast, deterministic set of rules. When this is on, a calibrated
        model (Jev) also scores every window, and either one flagging something is enough to start
        an investigation.
      </HoverRow>
      <HoverRow icon={AlertTriangle} tone="warning">
        Both this and the rules above only run while Automated investigations is on -- turning that
        off stops Jev too. There's no way to run Jev on its own.
      </HoverRow>

      <HoverRow icon={Lock} tone="restricted">
        Only organization admins can change this.
      </HoverRow>

      <HoverRow icon={PauseCircle} tone="warning">
        Automated investigations is off, so this has no effect right now.
      </HoverRow>
    </div>
  );
}
export function ExampleHelp2() {
  return (
    <div className="space-y-2">
      <HoverRow icon={Info} tone="info">
        When on, flagged activity is reviewed by an AI investigator (the Claude API) and written up
        here as a finding.
      </HoverRow>
      <HoverRow icon={ShieldCheck} tone="safe">
        Device, user and policy names, internal addresses and paths are replaced with placeholders
        first; only public domains, IPs and program names are shared.
      </HoverRow>
      <HoverRow icon={CheckCircle2} tone="active">
        test
      </HoverRow>
      <HoverRow icon={Lock} tone="restricted">
        Only organization admins can change this.
      </HoverRow>
    </div>
  );
}

export function IngressProtectionIntentsHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-indigo-500" />
        <p className="text-sm font-semibold">EdgePi Ingress Protections</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Which categories of protection your org wants once EdgePi's ingress inspection exists — a
        signal for what to build, not a configuration of it.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Intent-capture only, for now. Selecting a category doesn't configure or enforce anything
          yet.
        </p>
      </div>
    </div>
  );
}

export function ProtectIngressHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-sky-500" />
        <p className="text-sm font-semibold">Protect Ingress</p>
      </div>
      <p className="text-xs text-muted-foreground">
        A meta-toggle, not a detection category — it provisions{" "}
        <span className="font-medium text-foreground">two existing mechanisms</span> at once instead
        of leaving you to wire up perimeter defense field by field.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">What flipping it on provisions</p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">policy</span> — ingress, block, assigned to
          devices tagged <span className="font-mono text-foreground">gateway</span>
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">bruteForceFailureThreshold</span> — 5 → 3,
          only if still at the default
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-sky-500/10 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-sky-600 dark:text-sky-400" />
        <p className="text-[11px] text-muted-foreground">
          Turning it off <span className="font-medium text-foreground">pauses</span> the policy
          rather than deleting it, and never touches a threshold you've customized since — nothing
          it did gets silently clobbered or lost.
        </p>
      </div>
    </div>
  );
}

export function AllowedDomainsHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <p className="text-sm font-semibold">Allowed domains</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Traffic to these domains skips all entropy, C2, and method checks and is always permitted.
        Use this for trusted internal services or CDNs that trigger false positives.
      </p>
      <div className="space-y-1 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Syntax</p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">cdn.example.com</span> — exact host
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">*.example.com</span> — all subdomains
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">example.com</span> — bare domain + all
          subdomains
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
          Allowlist is checked first — it takes priority over every other rule including blocked
          domains and entropy.
        </p>
      </div>
    </div>
  );
}

export function BruteForceWindowHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-amber-500" />
        <p className="text-sm font-semibold">Brute-force detection window</p>
      </div>
      <p className="text-xs text-muted-foreground">
        The rolling time window the brute-force detector counts{" "}
        <span className="font-mono text-foreground">auth_failure</span> events in, per device +
        host. Crossing the failure threshold within this window flags an active brute-force attempt.
      </p>
      <div className="space-y-1 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Trade-off</p>
        <p className="text-[11px] text-muted-foreground">
          Shorter windows catch fast credential-stuffing tools sooner but can miss a slow,
          deliberately-paced attacker. Longer windows catch slow attacks but delay detection of fast
          ones.
        </p>
      </div>
    </div>
  );
}

export function BruteForceThresholdHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-amber-500" />
        <p className="text-sm font-semibold">Brute-force failure threshold</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Failed logins (HTTP 401/403/429 on an auth-shaped path —{" "}
        <span className="font-mono text-foreground">/login</span>,{" "}
        <span className="font-mono text-foreground">/oauth/token</span>, etc.) from the same device
        to the same host, within the window above, before a{" "}
        <span className="font-mono text-foreground">brute_force</span> event fires.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Checked by a background poller every 30s, not on every request — expect up to ~30s of
          detection lag.
        </p>
      </div>
    </div>
  );
}

export function C2PatternsHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Radio className="h-4 w-4 text-red-500" />
        <p className="text-sm font-semibold">C2 beacon patterns</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Requests whose path contains any of these fragments are blocked immediately as{" "}
        <span className="font-mono text-foreground">c2_beacon</span> traffic — checked before DGA,
        typosquat, entropy, and method rules.
      </p>
      <div className="space-y-1 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Keep patterns specific</p>
        <p className="text-[11px] text-muted-foreground">
          Short, generic fragments (<span className="font-mono text-foreground">/cx</span>,{" "}
          <span className="font-mono text-foreground">/it</span>) cause false positives on
          legitimate paths that happen to contain them. Prefer distinctive tracking-pixel or beacon
          paths like <span className="font-mono text-foreground">/submit.php</span> or{" "}
          <span className="font-mono text-foreground">/dpixel</span>.
        </p>
      </div>
    </div>
  );
}

export function MethodPathRulesHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Route className="h-4 w-4 text-red-500" />
        <p className="text-sm font-semibold">Method + path rules</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Blocks requests where the HTTP method and path both match — e.g. a{" "}
        <span className="font-mono text-foreground">DELETE</span> to an admin endpoint. Checked
        after C2 patterns, before entropy analysis.
      </p>
      <div className="space-y-1 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Syntax — METHOD:path</p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">DELETE:/admin</span> — blocks DELETE requests
          whose path contains <span className="font-mono text-foreground">/admin</span>
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-mono text-foreground">CONNECT:</span> — empty path after the colon
          matches every path, blocking the method outright
        </p>
      </div>
    </div>
  );
}

export function BlockDohHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-blue-500" />
        <p className="text-sm font-semibold">Block DNS-over-HTTPS</p>
      </div>
      <p className="text-xs text-muted-foreground">
        DoH is always detected and counted regardless of this setting — any request to a known DoH
        resolver (Cloudflare, Google, Quad9, etc.) or using the DoH wire format (
        <span className="font-mono text-foreground">application/dns-message</span>,{" "}
        <span className="font-mono text-foreground">application/dns-json</span>) is classified as{" "}
        <span className="font-mono text-foreground">doh</span>. This toggle only controls whether
        detected DoH traffic is actually blocked.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          DoH bypasses DNS-based visibility and filtering — some orgs block it outright, others just
          want to know it's happening. Off by default so existing DoH usage isn't disrupted.
        </p>
      </div>
    </div>
  );
}

export function BlockShadowAiHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-violet-500" />
        <p className="text-sm font-semibold">Block shadow AI</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Traffic to LLM/AI API endpoints (OpenAI, Anthropic, Gemini, Cohere, Mistral, Perplexity,
        etc.) is always detected and counted as{" "}
        <span className="font-mono text-foreground">shadow_ai</span>. This toggle only controls
        whether it's blocked outright.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Most orgs want visibility here before they want a hard block — unsanctioned AI usage is a
          data-handling question as much as a security one.
        </p>
      </div>
    </div>
  );
}

export function BlockCloudStorageHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Cloud className="h-4 w-4 text-sky-500" />
        <p className="text-sm font-semibold">Block personal cloud storage</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Traffic to Dropbox, Google Drive, OneDrive, Box, Mega, and WeTransfer is always detected and
        counted as <span className="font-mono text-foreground">cloud_storage</span>. This toggle
        only controls whether it's blocked outright.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Classic DLP category — uploads to personal accounts are a common exfil path even when the
          traffic itself looks completely normal.
        </p>
      </div>
    </div>
  );
}

export function BlockRemoteAccessHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MonitorSmartphone className="h-4 w-4 text-amber-500" />
        <p className="text-sm font-semibold">Block remote access tools</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Traffic to AnyDesk, TeamViewer, Chrome Remote Desktop, LogMeIn, GoToMyPC, Splashtop, and
        ScreenConnect is always detected and counted as{" "}
        <span className="font-mono text-foreground">remote_access</span>. This toggle only controls
        whether it's blocked outright.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Legitimate for IT support, but also a favorite for social-engineering and insider-threat
          abuse — some orgs restrict it to a specific approved tool only.
        </p>
      </div>
    </div>
  );
}

export function BlockWebmailHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-rose-500" />
        <p className="text-sm font-semibold">Block personal webmail</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Traffic to Gmail, Outlook/Hotmail, Yahoo Mail, AOL Mail, ProtonMail, and iCloud Mail is
        always detected and counted as <span className="font-mono text-foreground">webmail</span>.
        This toggle only controls whether it's blocked outright.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Common in stricter compliance postures to limit data leaving through personal email
          accounts on managed devices.
        </p>
      </div>
    </div>
  );
}

export function BlockDomainFrontingHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <GitCompare className="h-4 w-4 text-red-500" />
        <p className="text-sm font-semibold">Block domain fronting</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Flags requests where the TLS SNI doesn't match the HTTP{" "}
        <span className="font-mono text-foreground">Host</span> header — the core technique behind
        domain fronting, used to hide the real destination from every domain-based rule above it
        (blocked domains, threat intel, even Advanced Features). Always detected and counted as{" "}
        <span className="font-mono text-foreground">domain_fronting</span>.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Known false positive: HTTP/2 connection coalescing lets a client legitimately reuse one
          TLS connection for a different Host covered by the same certificate. Review before
          enabling blocking.
        </p>
      </div>
    </div>
  );
}

export function BlockSuspiciousUaHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-red-500" />
        <p className="text-sm font-semibold">Block suspicious User-Agent</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Flags requests with a missing User-Agent, or one identifying a scripting/CLI HTTP client
        (curl, Wget, python-requests, Go-http-client, libwww-perl) — tools that rarely bother
        spoofing a browser UA. Always detected and counted as{" "}
        <span className="font-mono text-foreground">suspicious_ua</span>.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Deliberately excludes generic library UAs (OkHttp, Java) — those are also the default for
          huge numbers of legitimate mobile apps.
        </p>
      </div>
    </div>
  );
}

export function BlockPunycodeHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-red-500" />
        <p className="text-sm font-semibold">Block punycode / IDN homograph domains</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Flags hostnames containing an <span className="font-mono text-foreground">xn--</span> label
        — the encoding used for internationalized domain names, and the classic mechanism behind
        homograph phishing (visually-similar Unicode lookalikes). Always detected and counted as{" "}
        <span className="font-mono text-foreground">punycode_domain</span>.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Known false positive: orgs with real international users/customers will see legitimate
          non-Latin-script domains here too.
        </p>
      </div>
    </div>
  );
}

export function BlockSuspiciousCertHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-red-500" />
        <p className="text-sm font-semibold">Block self-signed certificates</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Flags upstream servers presenting a self-signed certificate (issuer == subject) instead of
        one from a real CA — unusual for an internet-facing HTTPS service, since browsers would warn
        on it directly. π already holds this certificate from terminating TLS to the real server.
        Always detected and counted as{" "}
        <span className="font-mono text-foreground">suspicious_cert</span>.
      </p>
      <div className="flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Known false positive: internal dev/test environments and self-hosted services legitimately
          use self-signed certs too.
        </p>
      </div>
    </div>
  );
}

export function BlockMaliciousJsHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FileCode2 className="h-4 w-4 text-red-500" />
        <p className="text-sm font-semibold">Block malicious JavaScript</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Flags response bodies containing known browser-based threat signatures — today, the Stratum
        mining-pool wire protocol a browser-based cryptominer has to speak to reach a pool — checked
        regardless of declared Content-Type. Always detected and counted as{" "}
        <span className="font-mono text-foreground">malicious_js</span>.
      </p>
      <div className="space-y-1 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Deliberately narrow, for now</p>
        <p className="text-[11px] text-muted-foreground">
          Signature-based JS detection is an arms race — obfuscation defeats a string match
          trivially. This starts with structural protocol markers rather than named-campaign strings
          that go stale, and does not attempt payment-field/skimmer behavior detection — that needs
          domain reputation, not content alone, to avoid flagging legitimate payment SDKs (Stripe,
          Braintree) that read card fields the same way a skimmer does.
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Known false positive: legitimate mining-pool operator dashboards and blockchain explorer
          sites can reference the same Stratum connection strings.
        </p>
      </div>
    </div>
  );
}

export function BlockCredentialLeakHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-red-500" />
        <p className="text-sm font-semibold">Block credential leaks</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Flags request bodies containing a known secret/token format — AWS access keys, GitHub PATs,
        Slack tokens, Stripe live keys, PEM private keys, JWTs — on POST/PUT only, the direction a
        credential actually leaves the device in. Always detected and counted as{" "}
        <span className="font-mono text-foreground">credential_leak</span>.
      </p>
      <div className="space-y-1 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">A different signal than entropy</p>
        <p className="text-[11px] text-muted-foreground">
          Real tokens are usually short, structured strings — not statistically random — so the
          outbound entropy check above misses most of them outright. This checks for known formats
          directly instead. Response bodies aren&apos;t checked: a login endpoint returning a
          session token is routine, not a leak.
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Covers well-established vendor formats only, for now — an internal or custom token with no
          recognizable shape won&apos;t be caught.
        </p>
      </div>
    </div>
  );
}
