# Workflow

## Build Commands

- `vp run -r build`: Only for build/bundler issues or verifying production output
- `vp check`: Type-checking & type-aware linting

- `vp run console#dev` runs `console` dev server indefinitely in watch mode
- `vp run @workspace/db` for Drizzle Kit commands (e.g. `vp run @workspace/db#generate` to generate a migration, `vp run @workspace/db#generate` to seed database)

Don't build after every change. If lint passes; assume changes work.

## Testing

Vitest (via Vite+) is configured for testing in node and browser environments

- `vp test`: Run all tests in workspace. options `--coverage`, `--testNamePattern`
- `vp test -t "renders correctly and matches snapshot"`: to run specific test.

## Linting

Oxfmt (via Vite+) is configured for consistent code formatting via `vp lint`.

## Formatting

Oxfmt (via Vite+) is configured for consistent code formatting via `vp fmt`.

`vp check` do both lint and format and `vp check --fix` fix if needed.

It runs automatically on commit via Vite+ pre-commit hooks, so manual formatting is not necessary.
