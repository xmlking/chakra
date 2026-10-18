---
description: Review, validate, and commit task changes with Cog and Conventional Commits
---

# /commit — Commit Task Changes

Use this workflow only when the user explicitly asks to commit or invokes `/commit`. Do not commit as an automatic final step for ordinary coding tasks.

The repository uses Bun, Vite+, and Cog. Never assume a particular Git identity, branch, or framework.

## 1. Inspect the Repository State

```bash
git status --short --branch
git branch --show-current
git remote -v
git diff --stat
git diff --cached --stat
```

Review the actual unstaged, staged, and untracked changes. Use the current session's task and conversation to identify which changes were generated for this request. Do not include unrelated user changes, secrets, local environment files, build output, or files outside the task.

- If there are no task changes, stop and report that there is nothing to commit.
- If the index contains staged changes unrelated to this task, stop before committing and ask the user how to proceed. Do not unstage or discard their work.
- Do not change branches, rewrite history, or amend existing commits.

## 2. Validate the Changes

Run the narrowest applicable checks for the task. For code changes, use the relevant package tests and `vp check`; use the repository's documented Vite+ commands rather than substituting another framework's commands. For documentation-only changes, skip code checks unless documentation tests apply.

If a relevant check fails, do not commit. Report the exact command and failure; do not hide or work around failures by weakening checks.

Do not start another development server. Do not add unrelated tests or make unrelated fixes as a prerequisite to committing.

## 3. Stage and Review Only Task Changes

Stage only the files belonging to this task, using explicit paths:

```bash
git add -- path/to/file ...
```

Do not use `git add -A`, `git add .`, or Cog's `--add` option. Inspect the staged paths and complete staged diff before committing:

```bash
git status --short
git diff --cached --check
git diff --cached
```

If the staged diff includes unrelated changes, secrets, or generated artifacts, stop and resolve the scope with the user before committing.

## 4. Choose a Commit Message from the Session and Diff

Write a concise message that describes the purpose of the current task, confirmed against the staged diff. Do not use a generic message such as `update code`, repeat this workflow's name, or invent work not present in the changes.

Use Conventional Commits, with a type supported by `cog.toml`/Cog:

```text
<type>(<scope>): <imperative description>
```

The scope is optional. Choose a scope that matches the affected app, package, or concern (for example `web`, `db`, `auth`, `docs`, or `ui`); omit it when no single scope fits. Common types include `feat`, `fix`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, and the repository-specific `ops` and `wip`.

Examples:

```text
feat(db): add event bus publishing
fix(web): handle missing organization context
docs: document cache invalidation
```

Create the commit with Cog's positional syntax: `cog commit <TYPE> "<MESSAGE>" [SCOPE]`. The CLI takes the type, description, and optional scope separately; do not pass a preformatted `type(scope): description` string as one argument.

```bash
cog commit feat "add event bus publishing" db
```

Use the type and scope that accurately describe this task. Do not set or rewrite Git identity; use the repository/user's configured identity.

## 5. Report the Result

Summarize:

- The commit hash and exact Conventional Commit subject.
- The validation commands run and their results (or why checks were skipped).
- Any remaining changes that were intentionally not included.
