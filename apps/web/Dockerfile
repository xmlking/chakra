# syntax=docker/dockerfile:1

FROM oven/bun:1-alpine AS base
WORKDIR /app

# -----------------------------------------------------------
# Dependencies stage - cached when package.json files unchanged
# -----------------------------------------------------------
FROM base AS deps

# This layer only invalidates when dependencies change, not on source changes.
# --parents preserves directory structure, picking up all workspace packages automatically.
COPY --parents **/package.json bun.lock ./

RUN bun install --ignore-scripts --frozen-lockfile

# -----------------------------------------------------------
# Build stage - copy source and build the app
# -----------------------------------------------------------
FROM deps AS build

COPY --link . .

ENV VARLOCK_TELEMETRY_DISABLED=1

# Paraglide output is generated and excluded from the Docker build context;
# regenerate it because dependency installation skips package lifecycle scripts.
RUN bun --filter @workspace/i18n build

# The generated env.ts modules are committed, so the build can skip postinstall
# code generation after installing dependencies with --ignore-scripts.
RUN bun --filter web build

# The runtime stage ships only apps/web/.output, so the schema's @import(../../)
# lines would point outside it. `flatten` copies every reachable env file into
# .env-flat/ and rewrites the import paths so it can travel with the app.
RUN cd apps/web && ../../node_modules/.bin/varlock flatten

# Bun's isolated linker installs packages as symlinks; resolve them before
# copying varlock alone (it has no runtime dependencies) into the final image.
RUN mkdir -p /tmp/runtime/node_modules \
  && cp -aL node_modules/varlock /tmp/runtime/node_modules/varlock

# -----------------------------------------------------------
# Production stage - minimal runtime image
# -----------------------------------------------------------
FROM oven/bun:1-distroless AS production

WORKDIR /app

COPY --link --from=build /app/apps/web/.output .
COPY --from=build /app/apps/web/.env-flat/ ./
COPY --from=build /tmp/runtime/node_modules ./node_modules

# Set the default fallback path for evlog
ENV EVLOG_FS_DIR=/app/logs
ENV NODE_ENV=production
ENV APP_ENV=production
ENV VARLOCK_TELEMETRY_DISABLED=1
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD bun -e "const res = await fetch('http://localhost:3000/api/health/live'); process.exit(res.ok ? 0 : 1);"

# varlock validates the runtime env (from the container platform) against the
# schema and injects it before the server boots. ENTRYPOINT, not CMD, so a
# custom `command:` in compose still goes through it.
ENTRYPOINT ["bun", "/app/node_modules/varlock/bin/cli.js", "run", "--"]
CMD ["bun", "server/index.mjs"]




