# Portfolio Scaffold Specification

## Goal

Create a design-neutral, production-oriented foundation for a personal portfolio. The scaffold
must be ready for content and visual direction later without inventing either now.

## Required stack

- Bun for dependency management, scripts, and the production container runtime.
- Next.js App Router for the public website and SEO-facing routes.
- Payload CMS embedded in the same Next.js application, mounted at `/studio`.
- PostgreSQL with committed, deterministic migrations.
- Optional Cloudflare R2 media storage configured entirely through runtime environment variables.
- A standalone, multi-stage Docker image that runs as a non-root user.

## Required seams

- `/` returns a design-neutral public shell.
- `/api/health` returns a stable JSON liveness response without depending on PostgreSQL.
- `/studio` mounts Payload Studio and can bootstrap the first administrator on a fresh database.
- The CMS initially exposes only authenticated users and media uploads.
- Basic metadata, `robots.txt`, `sitemap.xml`, error, and not-found surfaces exist.
- Formatting, linting, type checking, unit tests, HTTP end-to-end tests, production build, and
  Docker build run in CI.

## Operational constraints

- Required configuration fails fast and partial R2 configuration is rejected.
- Secrets are injected at runtime and never baked into the image.
- All database environments use committed migrations; automatic development schema pushes are
  disabled.
- Generated Payload types, Studio import maps, and migrations are checked into source control.

## Out of scope

Portfolio content models, final copy, visual tokens, component library choices, motion, analytics,
preview workflows, structured content, and rich text remain deferred until product and design
direction exist.
