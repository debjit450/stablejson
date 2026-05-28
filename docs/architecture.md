# Architecture

StableJSON is a Vite, React, and TypeScript single-page application. It is designed as a static frontend that performs JSON processing in the browser.

## Runtime Model

- React renders route-level pages from `src/pages`.
- Feature workflows live in `src/components`.
- JSON parsing, formatting, diffing, schema inference, path extraction, and validation utilities live in `src/lib`.
- Browser storage is used for editor content and user preferences.
- Web Workers are used where available for heavier JSON operations.

## Routing

The app uses React Router:

- `/` renders the public home page.
- `/app` renders the JSON workspace.
- `/about`, `/privacy`, `/open-source`, `/contributing`, and `/release-notes` render supporting pages.

## JSON Processing

Core JSON functions are implemented in `src/lib/jsonUtils.ts`. Feature components call these utilities and keep UI state local to the workspace.

Key behaviors:

- Invalid JSON returns user-facing errors instead of uncaught exceptions where possible.
- Canonical JSON output is deterministic.
- Diff output uses a shared `DiffResult` shape.
- Type and schema generation are inferred from representative sample input.

## Performance

`src/lib/performance.ts` provides:

- A small browser `Worker` wrapper for parse, format, minify, stringify, and validate operations.
- A streaming parser helper for large payload workflows.
- Lightweight timing metrics for JSON operations.
- Debounce and throttle helpers for responsive UI interactions.

## UI System

The UI is built with Tailwind CSS and Radix-based primitives. Shared primitives live in `src/components/ui`; product-specific components live directly under `src/components`.

## Privacy Boundary

The application does not require an API server for JSON processing. Any server or CDN used to host the static app serves assets only. JSON payloads are handled in the browser process.
