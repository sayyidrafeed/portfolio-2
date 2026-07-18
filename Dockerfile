# syntax=docker/dockerfile:1.7

FROM oven/bun:1.3.14-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS dependencies
RUN apk add --no-cache libc6-compat
COPY package.json bun.lock ./
RUN --mount=type=cache,id=portfolio-bun-cache,target=/root/.bun/install/cache \
  bun ci

FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production \
  SITE_URL=http://localhost:3000 \
  DATABASE_URL=postgresql://portfolio:portfolio@127.0.0.1:5432/portfolio \
  PAYLOAD_SECRET=build-only-payload-secret-at-least-32-characters
RUN --mount=type=cache,id=portfolio-next-cache,target=/app/.next/cache \
  bun run build

FROM oven/bun:1.3.14-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  HOSTNAME=0.0.0.0 \
  PAYLOAD_MIGRATE_ON_START=true \
  PORT=3000

RUN mkdir -p media && chown bun:bun media

COPY --from=builder /app/public ./public
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

USER bun
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["bun", "-e", "fetch('http://127.0.0.1:3000/api/health').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"]
CMD ["bun", "server.js"]
