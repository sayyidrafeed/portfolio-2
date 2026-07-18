# Portfolio

A production-ready, design-neutral scaffold for a personal portfolio built with Next.js and
Payload CMS.

## Stack

- Bun 1.3.14
- Next.js 16 and React 19
- Payload CMS 3
- PostgreSQL
- Cloudflare R2 or persistent local media storage
- Oxlint, Oxfmt, Vitest, and Playwright
- Standalone multi-stage Docker image

## Local setup

```bash
cp .env.example .env.local
docker compose up -d postgres
bun ci
bun run payload:migrate
bun run dev
```

Open the public scaffold at `http://localhost:3000` and Payload Studio at
`http://localhost:3000/studio`. On a fresh database, Studio guides you through creating the first
administrator.

## Commands

| Command                          | Purpose                                          |
| -------------------------------- | ------------------------------------------------ |
| `bun run dev`                    | Start the development server                     |
| `bun run build`                  | Create the standalone production build           |
| `bun run vercel:build`           | Migrate Neon, then build for Vercel              |
| `bun run quality`                | Run formatting, linting, types, tests, and build |
| `bun run test:e2e`               | Exercise the public HTTP seams                   |
| `bun run payload:types`          | Regenerate Payload TypeScript types              |
| `bun run payload:importmap`      | Regenerate the Studio import map                 |
| `bun run payload:migrate:create` | Create a schema migration                        |
| `bun run payload:migrate`        | Apply pending migrations                         |
| `bun run payload:migrate:status` | Inspect migration state                          |

Generated types, Studio import maps, and migrations are committed. Regenerate them whenever a
Payload schema changes. Automatic development schema pushes are disabled: run
`bun run payload:migrate:create` after editing a collection, then apply the migration with
`bun run payload:migrate`. This keeps development and production databases on the same path.

## Docker

Build and run only the application image:

```bash
docker build -t portfolio .
docker run --rm -p 3000:3000 \
  -e SITE_URL=http://localhost:3000 \
  -e DATABASE_URL=postgresql://portfolio:portfolio@host.docker.internal:5432/portfolio \
  -e PAYLOAD_SECRET=replace-with-a-random-secret-at-least-32-characters-long \
  portfolio
```

For a local container smoke test with PostgreSQL and persistent local media:

```bash
docker compose --profile app up --build
```

Production must inject database, Payload, and site URL values at runtime. When R2 is enabled, inject
all R2 values at runtime as well. Do not pass secrets as Docker build arguments.

## Vercel + Neon

Vercel uses `bun ci` and `bun run vercel:build` from [vercel.json](./vercel.json). The build runs
Payload migrations before compiling Next.js, while Vercel Functions use Neon's pooled connection.
Docker keeps its startup migration behavior through `PAYLOAD_MIGRATE_ON_START=true`.

Set `DATABASE_URL` to Neon's pooled URL and `DATABASE_URL_UNPOOLED` to its direct URL. Vercel
requires both values and a complete R2 configuration, because Functions cannot retain local media.
Preview deployments use `VERCEL_URL` for Payload's browser origins and an isolated R2 prefix.

See [docs/vercel-neon.md](./docs/vercel-neon.md) for dashboard setup and operating limits.

Use a fresh database when adopting this scaffold. A database previously modified by Payload's
development schema push contains a special development migration marker and must be reconciled
before production migrations can run non-interactively.

## Environment

`SITE_URL`, `DATABASE_URL`, and `PAYLOAD_SECRET` are always required. R2 is optional outside
Vercel, but partial R2 configuration fails fast during application startup. Without R2, persist
`/app/media`; configure all five R2 values when the application should use stateless object storage.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for boundaries and intentionally deferred decisions.
