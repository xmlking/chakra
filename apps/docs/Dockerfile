# ---------- base ----------
FROM oven/bun:1-slim AS base
WORKDIR /app

# ---------- prepare workspace ----------
FROM base AS prepare
RUN bun add -g turbo

COPY . .
RUN turbo prune --scope=@workspace/docs --docker

# ---------- dependencies ----------
FROM base AS deps
WORKDIR /app

COPY --from=prepare /app/out/json/ .
RUN bun install --production --frozen-lockfile --ignore-scripts
COPY --from=prepare /app/out/full/ .

# ---------- runtime ----------
FROM base AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app /app

WORKDIR /app/apps/docs

EXPOSE 4000

CMD ["bun", "run", "start"]
