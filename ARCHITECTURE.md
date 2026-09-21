# Architecture

## Scope

This repository is a static foundation for a personal portfolio. Content and visual direction are
added manually through code. There is no CMS, database, API server, upload pipeline, or runtime
application state.

## Build and hosting topology

```text
Source code and public assets
            |
       Next.js build
            |
          out/
       /        \
    Vercel    CI quality gates
                  |
          optional image publish
                  |
                GHCR
                  |
                Dokploy
```

Next.js uses the App Router with output: "export". The build emits HTML, CSS, JavaScript, and
metadata files into out/. Vercel serves that output directly. Docker copies the same output into an
Nginx image. A successful push to main also builds and publishes that image to GitHub Container
Registry for Dokploy to pull when `PUBLISH_IMAGE=true` is enabled.

## Boundaries

- src/app/(frontend) owns the public website shell and future portfolio routes.
- src/lib/site-url.ts validates the build-time SITE_URL used by metadata, robots, and sitemap.
- public/ owns static assets.
- vercel.json and nginx/default.conf own host-level security headers.
- Dockerfile owns the reproducible static container build.
- .github/workflows/ci.yml owns quality gates and Docker build validation.
- .github/workflows/publish-image.yml owns the opt-in main-branch image publish.
- AGENTS.md owns project-specific implementation and verification rules.

There are no route handlers. /api, /studio, database configuration, migrations, and server runtime
configuration must not be added without a new architecture decision.

## Content lifecycle

1. Edit the relevant App Router page or a typed content module.
2. Run the local quality commands.
3. Build with the deployment's canonical SITE_URL.
4. Deploy the generated static output to Vercel or the Docker image.

SITE_URL is a build-time input. It is not read by a running server because the deployed site has no
application server.

## Verification boundary

Automated verification covers formatting, Oxlint, TypeScript, the static build, and the Docker image
build. Browser acceptance is manual and belongs to the user. A successful local build does not prove
visual acceptance on every viewport or deployment configuration.

## Deferred decisions

Portfolio content models, shared content modules, design tokens, component libraries, motion,
analytics, forms, search, and any backend integration remain deferred until they have a concrete
product need.
