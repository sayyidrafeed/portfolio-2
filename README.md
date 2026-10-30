# Portfolio

A static portfolio scaffold built with Next.js. Portfolio content is intentionally edited in code
until a separate content decision is made.

## Stack

- Bun 1.3.14
- Next.js 16 and React 19
- Static export to out/
- Vercel static hosting or an Nginx Docker image
- Oxlint, Oxfmt, TypeScript, and the Next.js production build

## Local setup

```bash
cp .env.example .env.local
bun ci
bun run dev
```

Open http://localhost:3000. SITE_URL is required when building the static output and should be the
canonical URL for the deployment.

## Commands

| Command              | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| bun run dev          | Start the development server                                     |
| bun run build        | Create the static export in out/                                 |
| bun run format:check | Check formatting with Oxfmt                                      |
| bun run lint         | Run Oxlint with the Next.js, React, and accessibility plugins    |
| bun run typecheck    | Run TypeScript without emitting files                            |
| bun run quality      | Run formatting, linting, type checking, and the production build |

There is no CMS, database, API route, test runner, or browser automation in this scaffold.

## Manual content

The current public page is a deliberately small scaffold. Edit the App Router files directly when
adding portfolio content. Keep content close to its owning page until a shared typed content module
is justified by more than one consumer.

## Static build

```bash
SITE_URL=https://portfolio.example.com bun run build
```

The build must produce out/index.html, out/404.html, out/robots.txt, and out/sitemap.xml.

## Docker

The image builds the static export with Bun and serves it with Nginx:

```bash
docker build --build-arg SITE_URL=https://portfolio.example.com -t portfolio .
docker run --rm -p 3000:3000 portfolio
```

For a local container:

```bash
docker compose up --build
```

Security headers are configured in both vercel.json and nginx/default.conf so the two hosting paths
have the same baseline behavior.

## Vercel

Connect this repository to the Vercel project and set SITE_URL in the Vercel project environment.
Vercel then runs bun ci and bun run build, and serves the generated static output without a function
or database.
Require the `CI / Quality gates` check in GitHub branch protection if merges to `main` must pass the
quality workflow first.

## CI and Dokploy image flow

The CI workflow runs format, lint, typecheck, static build, and Docker build quality gates for pull
requests and `main`. Vercel can deploy independently through its Git integration.

The GHCR publish workflow is opt-in. Set the GitHub repository variable `PUBLISH_IMAGE=true` to
enable it. The image publish runs only after the CI workflow passes on `main`.

The image builds with `SITE_URL=https://sayyidrafee.com`, which ends up in the canonical URL, Open
Graph tags, JSON-LD, robots.txt, and the sitemap. To publish for another domain, set the
`DOKPLOY_SITE_URL` repository variable. A `SITE_URL` set on the running container has no effect.

Images are published for `linux/amd64` and `linux/arm64`, so ARM servers can pull them too. The
image names are:

- ghcr.io/sayyidrafeed/portfolio:main
- ghcr.io/sayyidrafeed/portfolio:sha-<commit>

To redeploy automatically after each publish, turn on Auto Deploy for the application in Dokploy
and store its deploy webhook URL (Deployments tab) as the repository secret `DOKPLOY_WEBHOOK_URL`.
The publish workflow posts to that URL once the image is pushed, and Dokploy pulls the configured
image again. Without the secret the step is skipped.

Configure Dokploy to pull the GHCR image. The main tag is convenient for automatic updates. A SHA
tag is immutable and is preferred when a deployment needs an exact rollback target. If the GHCR
package is private, configure a read-only registry token in Dokploy. No registry credentials belong
in this repository.
