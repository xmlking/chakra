# Agent Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Essentials

- Stack: TypeScript + React (TanStack Start) in a bun + Vite+ monorepo, with Drizzle ORM, resend, shadcn/ui, and Better Auth.
- Prefer shared `@workspace/ui` components; add primitives via shadcn CLI (`vpx shadcn@latest add <component>`).
- Use `lucide-react` for UI icons (use `Icon` suffix, e.g. `import { Loader2Icon } from "lucide-react"`); for brand icons use `@thesvg/react` (e.g. `import Github from '@thesvg/react/github'; <Github className="size-6" />`).
- When resolving module specifiers that begin with `#`, always respect the nearest ancestor `package.json` `"imports"` field using TypeScript’s `resolvePackageJsonImports` behavior.
- Use shared bun catalog versions (root `package.json`) via `catalog:`.
- Don't build after every little change. If `vp check` passes; assume changes work.

## Topic-specific Guidelines

- [TanStack patterns](.agents/tanstack-patterns.md) - Routing, data fetching, loaders, server functions, environment shaking
- [Auth patterns](.agents/auth.md) - Route guards, middleware, auth utilities
- [TypeScript conventions](.agents/typescript.md) - Casting rules, prefer type inference
- [Workflow](.agents/workflow.md) - Workflow commands, validation approach

## Development Workflow

- My TanStack Start development server is already running in another terminal.
- Never start a new dev server. Ask user for logs/browser output if needed
- Never leave background processes running.
- Run `vp check` to ensure changes pass.
- Bug fixes and new features MUST include tests
  - For bug fixes: after confirming the reproducible behavior violates the intended contract, write a failing test first, then implement the fix
- DO NOT COMMIT unless the user explicitly asks
- Conventional Commits: `feat(scope):`, `fix(scope):`, `docs:`, `chore:`.
- PRs target `main`
- Add or update spec, plan and ADR docs in `content/docs/developer` for **Spec-Driven Development**

<!-- intent-skills:start -->

## Skill Loading

Before substantial work:

- Skill check: run `vpx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `vpx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

## TanStack Docs

Use `vpx @tanstack/cli@latest` to look up TanStack documentation. Always pass `--json` for machine-readable output.

```bash
# List TanStack libraries (optionally filter by --group state|headlessUI|performance|tooling)
vpx @tanstack/cli@latest libraries --json

# Fetch a specific doc page
vpx @tanstack/cli@latest doc router framework/react/guide/data-loading --json
vpx @tanstack/cli@latest doc query framework/react/overview --docs-version latest --json

# Search docs (optionally filter by --library, --framework, --limit)
vpx @tanstack/cli@latest search-docs "server functions" --library start --json
vpx @tanstack/cli@latest search-docs "loaders" --library router --framework react --json
```

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
