# Development Guide

## Requirements

- Node.js 20 or newer
- npm

Use npm for dependency management. The repository includes `package-lock.json`, and CI installs with `npm ci`.

## Setup

```bash
git clone https://github.com/debjit450/stablejson.git
cd stablejson
npm ci
npm run dev
```

## Validation

Run the complete local quality gate before opening a pull request:

```bash
npm run validate
```

This command runs linting, TypeScript project checks, and a production build.

Run individual checks when iterating:

```bash
npm run lint
npm run typecheck
npm run build
```

## Code Style

- Prefer TypeScript types over implicit or broad values.
- Keep JSON processing behavior deterministic for identical input.
- Use existing UI primitives from `src/components/ui` before adding new component APIs.
- Keep feature components focused and colocated in `src/components`.
- Avoid new runtime dependencies unless they remove meaningful complexity.
- Add comments only where they clarify non-obvious logic.

## Pull Requests

Pull requests should include:

- A concise summary of the change.
- The reason the change is needed.
- Screenshots or recordings for visible UI changes.
- Notes about privacy, security, or performance impact when relevant.
- Confirmation that `npm run validate` passes.

## Dependency Updates

Dependabot is configured for npm packages and GitHub Actions. Security-related dependency updates should be reviewed quickly, but breaking upgrades should be tested against JSON formatting, diffing, export, and batch processing flows before merge.
