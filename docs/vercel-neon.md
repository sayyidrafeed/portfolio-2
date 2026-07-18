# Vercel Hobby + Neon Free

This project runs Next.js and Payload in Vercel Node.js Functions. Bun remains the package manager
and runs the build and Payload CLI; the function runtime stays on Node.js for Payload, Sharp, and
`node-postgres` compatibility.

## One-time setup

1. Import this repository into a personal Vercel Hobby account.
2. Install the Neon native integration from the Vercel Marketplace and create a Neon project in the
   Vercel Function region closest to your audience. Enable a database branch for Preview deployments.
3. In the Neon integration, expose both `DATABASE_URL` and `DATABASE_URL_UNPOOLED` to Production
   and Preview. The first is pooled for Functions; the second is direct for migrations.
4. Add R2 credentials and a public media URL to both Vercel environments. Use a separate preview
   bucket or a preview-specific `R2_PREFIX` when preview uploads are enabled.
5. Set a distinct `PAYLOAD_SECRET` in Production and Preview, and set `SITE_URL` to the canonical
   production URL in both environments.
6. Deploy. Vercel runs `bun ci`, then `bun run vercel:build`; the latter applies migrations before
   `next build`.

## Environment variables

| Variable                | Production               | Preview                   |
| ----------------------- | ------------------------ | ------------------------- |
| `DATABASE_URL`          | Neon pooled URL          | Preview branch pooled URL |
| `DATABASE_URL_UNPOOLED` | Neon direct URL          | Preview branch direct URL |
| `SITE_URL`              | Canonical production URL | Same canonical URL        |
| `PAYLOAD_SECRET`        | Production-only secret   | Separate preview secret   |
| `R2_*`                  | Complete configuration   | Complete configuration    |
| `R2_PREFIX`             | Optional stable prefix   | Optional isolated prefix  |

Vercel injects `VERCEL`, `VERCEL_ENV`, `VERCEL_URL`, and Git metadata automatically. The app uses
the current preview URL for Payload CORS and CSRF, but keeps metadata and canonical links on
`SITE_URL`.

## Operating constraints

- Vercel Hobby is for personal, non-commercial projects. It has a 4.5 MB Function request-body
  limit, so keep Payload image uploads below 4 MB. Larger files need direct-to-object-storage upload
  work.
- Neon Free can scale to zero. Do not add a database uptime monitor that keeps it awake; the existing
  `/api/health` endpoint is intentionally a liveness check only.
- Neon preview branches and R2 preview prefixes need periodic cleanup. Do not let preview media
  share the production prefix.
- Production schema migrations must be backward-compatible because they run during build, before a
  new deployment receives traffic.

## Validation checklist

1. Confirm Vercel Build Logs show `payload migrate` before `next build`.
2. Confirm `DATABASE_URL` contains `-pooler` and the unpooled URL does not.
3. Visit `/`, `/api/health`, and `/studio` on a Preview deployment.
4. Upload a sub-4 MB image in Studio and confirm its R2 public URL survives a redeploy.
5. Confirm a Preview deployment does not create documents in Production's Neon branch.
