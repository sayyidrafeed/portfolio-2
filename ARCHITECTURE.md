# Architecture

## Scope

This repository is a design-neutral foundation for a personal portfolio. It intentionally
contains no portfolio content model, component library, animation system, visual tokens, or
analytics integration yet.

## Runtime topology

The production boundary is one Next.js container that also hosts Payload Studio and Payload's
APIs. PostgreSQL lives outside the container. Media uses either a persistent volume or R2; the
application container is stateless when R2 is configured.

```text
Cloudflare / reverse proxy
            |
     Next.js + Payload
        |          |
   PostgreSQL   Media volume / R2
```

The frontend and CMS share one process so Server Components can eventually use Payload's Local
API without an internal HTTP request. Browser-facing API routes remain available under `/api`.

The production build uses Next.js' supported webpack builder. Turbopack is intentionally deferred
until its Payload Admin build is deterministic under the pinned Bun toolchain.

## Current boundaries

- `src/app/(frontend)` owns the public website shell.
- `src/app/(payload)` mounts Payload Studio and Payload APIs.
- `src/payload` owns CMS access rules and collection schemas.
- `src/env.ts` validates runtime configuration and enforces all-or-nothing R2 configuration.
- `src/migrations` is the committed database migration history.
- `/api/health` is a liveness endpoint and deliberately does not probe PostgreSQL.

Payload's development schema push is disabled. Every environment applies the same committed
migrations. Long-running Docker deployments apply pending migrations at startup; Vercel runs them
once during the build to avoid serverless cold-start work.

## Storage

Uploads use local `media/` storage when R2 is not configured, so that directory must be persisted
for any non-ephemeral deployment. Configure every `R2_*` variable to use the S3-compatible R2
adapter and keep the application container stateless. R2 is mandatory when `VERCEL=1`; preview
deployments use a derived, isolated prefix unless `R2_PREFIX` is set explicitly.

## Vercel and Neon

Vercel Functions use a small `node-postgres` pool against Neon's pooled endpoint. Migration CLI
invocations select `DATABASE_URL_UNPOOLED`, which avoids PgBouncer transaction-pooling constraints.
The canonical site URL remains `SITE_URL`, while preview Payload sessions use the current
`VERCEL_URL` origin.

## Deferred decisions

Projects, writing, experience, dynamic metadata, structured data, previews, analytics, fonts,
motion, the rich-text editor, and the design system should be added only after the product and
visual direction are defined.
