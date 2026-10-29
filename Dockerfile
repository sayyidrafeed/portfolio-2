# syntax=docker/dockerfile:1.7

# The static export is the same on every architecture, so only the Nginx stage is per-platform.
FROM --platform=$BUILDPLATFORM oven/bun:1.4.4-alpine AS base
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
ARG SITE_URL=http://localhost:3000
ENV NODE_ENV=production \
  SITE_URL=${SITE_URL}
RUN --mount=type=cache,id=portfolio-next-cache,target=/app/.next/cache \
  bun run build \
  && bun -e 'console.log(new URL(process.env.SITE_URL).origin)' > /app/build-site-url

FROM nginx:alpine AS runner
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/build-site-url /etc/nginx/build-site-url
COPY --chmod=755 nginx/40-site-url.sh /docker-entrypoint.d/40-site-url.sh

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["wget", "--quiet", "-O", "/dev/null", "http://127.0.0.1:3000/"]
