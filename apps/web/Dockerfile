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
COPY .env.build.example .env

RUN bun --filter web build

# -----------------------------------------------------------
# Production stage - minimal runtime image
# -----------------------------------------------------------
FROM oven/bun:1-distroless AS production

WORKDIR /app

COPY --link --from=build /app/apps/web/.output .

# Set the default fallback path for evlog
ENV EVLOG_FS_DIR=/app/logs
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD bun -e "const res = await fetch('http://localhost:3000/health'); process.exit(res.ok ? 0 : 1);"

CMD ["server/index.mjs"]




