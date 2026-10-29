# Portfolio project instructions

## Architecture

- This project is a static Next.js export. The production boundary is the generated out/ directory.
- Content is edited manually through App Router pages or small typed content modules.
- Do not add Payload, a CMS, a database, API route handlers, migrations, uploads, or server actions
  without a new architecture decision.
- SITE_URL is required during builds because it owns canonical metadata, robots.txt, and the sitemap
  URL. The Docker image can override the origin in robots.txt and the sitemap at container start
  through its own SITE_URL environment variable (nginx/40-site-url.sh).

## Tooling

- Keep Bun, Oxlint, Oxfmt, TypeScript, and the Next.js production build.
- Do not add Playwright or Vitest unless the testing strategy is explicitly revisited.
- Run bun run quality for the standard local verification.
- Run docker build --build-arg SITE_URL=http://localhost:3000 --tag portfolio:test . when Docker
  behavior is part of the change.

## Local preview

- next start does not work with output: "export". Do not suggest it.
- Use bun run dev for day-to-day development. Dev mode is looser than the export, so unsupported
  features such as dynamic routes without generateStaticParams only fail during next build.
- Preview the end product with bun run build, then bunx serve@latest out. serve runs through bunx
  and is not a project dependency. It resolves clean URLs but does not apply the Nginx or Vercel
  security headers or the 404 redirect to /.
- Use docker compose up --build only when a change touches Nginx, headers, or routing behavior,
  because only the Docker image matches production serving exactly.
- Do not preview with python3 -m http.server. It does not map /about to about.html.

## Hosting

- Vercel serves the static export directly.
- Docker serves the same export through Nginx.
- CI quality gates live in `.github/workflows/ci.yml` and run for pull requests and `main`.
- The image publish workflow is opt-in through `PUBLISH_IMAGE=true`; it publishes to GHCR only after CI passes.
- The published image is `ghcr.io/sayyidrafeed/portfolio`. `DOKPLOY_SITE_URL` is optional; set
  SITE_URL on the Dokploy container instead to point robots.txt and the sitemap at the live domain.
- Keep security headers aligned between vercel.json and nginx/default.conf.

## Acceptance

- Automated checks prove source quality, type correctness, static output, and image construction.
- Browser and responsive acceptance are manual user checks. Do not claim browser acceptance from a
  build or command-line smoke check.
