# StableJSON

[![CI](https://github.com/debjit450/stablejson/actions/workflows/ci.yml/badge.svg)](https://github.com/debjit450/stablejson/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)](https://vite.dev/)

StableJSON is a privacy-first JSON workspace for developers. It validates, formats, compares, queries, transforms, exports, and documents JSON directly in the browser.

The application is frontend-only. JSON payloads are processed locally in the user's browser and are not sent to a server by the app.

## Features

- Validate, format, minify, clean, sort, and canonicalize JSON.
- Compare two JSON documents with structural and value-aware diff views.
- Query nested data with JSONPath-style expressions.
- Inspect paths and explore large payloads with a foldable tree view.
- Analyze structure, size, depth, and type distribution.
- Generate TypeScript interfaces, Zod schemas, and JSON Schema output.
- Convert array-shaped JSON into tables and CSV.
- Transform JSON by flattening, key conversion, and merging.
- Run custom validation rules against selected JSON paths.
- Process multiple JSON files in batch.
- Export to JSON, YAML, XML, CSV, TSV, TOML, properties, and environment formats.
- Use keyboard shortcuts and the command palette for repeat workflows.
- Persist editor state and preferences in browser storage.

## Quick Start

### Requirements

- Node.js 20 or newer
- npm

### Local Development

```bash
git clone https://github.com/debjit450/stablejson.git
cd stablejson
npm ci
npm run dev
```

The Vite development server prints the local URL when it starts.

### Production Build

```bash
npm run build
npm run preview
```

The static production build is written to `dist/`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server. |
| `npm run lint` | Run ESLint across the project. |
| `npm run typecheck` | Run the TypeScript project build check without emitting files. |
| `npm run build` | Build the production bundle. |
| `npm run preview` | Serve the built app locally. |
| `npm run validate` | Run lint, typecheck, and production build in sequence. |

## Quality Gate

Pull requests and pushes to `main` or `master` run GitHub Actions CI. The workflow installs dependencies with `npm ci`, then runs:

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev --audit-level=moderate
```

Dependabot is configured for npm packages and GitHub Actions.

## Documentation

- [Usage Guide](docs/usage.md)
- [Development Guide](docs/development.md)
- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
- [Privacy and Security](docs/privacy-and-security.md)

## Project Structure

```text
src/
  components/        Feature components and shared UI primitives
  hooks/             Browser state, theme, storage, and interaction hooks
  lib/               JSON processing, performance, navigation, and utility code
  pages/             Route-level React views
public/              Static deployment assets
.github/             CI, Dependabot, and issue templates
docs/                Project documentation
```

## Privacy

StableJSON is designed for local processing:

- JSON input is parsed and transformed in the browser.
- No account is required.
- The app does not need an application backend for JSON processing.
- Editor content and preferences may be stored in local browser storage.
- Users should avoid pasting sensitive data into shared machines or untrusted browser sessions.

See [Privacy and Security](docs/privacy-and-security.md) for more detail.

## Security

Please do not report vulnerabilities through public GitHub issues. Use GitHub Security Advisories or follow the process in [SECURITY.md](SECURITY.md).

## Contributing

Contributions should be small, focused, and consistent with the existing codebase. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

StableJSON is released under the [MIT License](LICENSE).
