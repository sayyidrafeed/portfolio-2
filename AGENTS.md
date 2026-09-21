# Portfolio project instructions

## Architecture

- This project is a static Next.js export. The production boundary is the generated out/ directory.
- Content is edited manually through App Router pages or small typed content modules.
- Do not add Payload, a CMS, a database, API route handlers, migrations, uploads, or server actions
  without a new architecture decision.
- SITE_URL is required during builds because it owns canonical metadata, robots.txt, and the sitemap
  URL.

## Tooling

- Keep Bun, Oxlint, Oxfmt, TypeScript, and the Next.js production build.
- Do not add Playwright or Vitest unless the testing strategy is explicitly revisited.
- Run bun run quality for the standard local verification.
- Run docker build --build-arg SITE_URL=http://localhost:3000 --tag portfolio:test . when Docker
  behavior is part of the change.

## Hosting

- Vercel serves the static export directly.
- Docker serves the same export through Nginx.
- CI quality gates live in `.github/workflows/ci.yml` and run for pull requests and `main`.
- The image publish workflow is opt-in through `PUBLISH_IMAGE=true`; it publishes to GHCR only after CI passes.
- `DOKPLOY_SITE_URL` is a GitHub repository variable used only as the Docker build-time canonical URL.
- Keep security headers aligned between vercel.json and nginx/default.conf.

## Acceptance

- Automated checks prove source quality, type correctness, static output, and image construction.
- Browser and responsive acceptance are manual user checks. Do not claim browser acceptance from a
  build or command-line smoke check.
