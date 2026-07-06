FROM oven/bun:1.3.11-alpine AS base

# Install and build
FROM base AS build
WORKDIR /app
COPY . .
RUN bun ci
RUN bun run --filter web --filter @workspace/db build

# Run
FROM base AS runner

RUN apk --no-cache add curl
HEALTHCHECK --interval=1s --timeout=10s CMD [ "curl", "http://localhost:3000/api/health/live" ]

ENV NODE_ENV=production

WORKDIR /app
COPY /packages/db/drizzle ./packages/db/drizzle
COPY --from=build /app/packages/db/dist ./packages/db
COPY --from=build /app/apps/web/dist ./apps/web

WORKDIR /app/apps/web
USER bun
EXPOSE 3000
CMD [ "bun", "run", "./server/index.mjs" ]
