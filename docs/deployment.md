# Deployment

StableJSON builds to static assets and can be hosted on any static web platform.

## Build

```bash
npm ci
npm run build
```

The output directory is `dist/`.

## Preview

```bash
npm run preview
```

Use preview to test the production bundle locally before deployment.

## Vercel

Recommended settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

## Netlify

Recommended settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

## Generic Static Hosting

Upload the contents of `dist/` to a static host or CDN. Configure fallback routing to `index.html` so client-side routes load correctly.

## Continuous Integration

GitHub Actions runs the project quality gate on pull requests and pushes to `main` or `master`:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm audit --omit=dev --audit-level=moderate`

## Security Headers

For production hosting, configure standard static-site security headers where supported:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

If you add a Content Security Policy, verify Monaco Editor, downloadable exports, and generated worker code still function as expected.
