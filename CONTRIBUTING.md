# Contributing

Thank you for contributing to StableJSON. The project values small, focused changes that improve correctness, usability, performance, privacy, or maintainability.

## Ground Rules

- Keep pull requests narrow and reviewable.
- Match existing patterns before introducing new abstractions.
- Avoid new dependencies unless they clearly reduce project complexity.
- Keep JSON output deterministic for identical input.
- Do not add analytics, telemetry, or server-side JSON processing without a clear maintainer decision.
- Do not include private or sensitive JSON payloads in issues, tests, screenshots, or pull requests.

## Setup

```bash
git clone https://github.com/debjit450/stablejson.git
cd stablejson
npm ci
npm run dev
```

Use Node.js 20 or newer.

## Development Workflow

1. Create a branch from the default branch.
2. Make a focused change.
3. Run the local quality gate.
4. Open a pull request with a clear summary and validation notes.

```bash
npm run validate
```

## Commit Messages

Use concise, conventional prefixes where practical:

- `feat:` for user-facing features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for internal code changes
- `test:` for tests
- `chore:` for maintenance

Example:

```text
fix: preserve array values during JSON cleanup
```

## Code Guidelines

- Use TypeScript for application code.
- Prefer explicit data shapes for JSON utilities.
- Keep UI state close to the component that owns it.
- Use shared UI primitives from `src/components/ui` where possible.
- Handle invalid JSON with user-facing errors.
- Keep browser-only behavior guarded when necessary.
- Document non-obvious behavior in code or docs.

## Documentation Guidelines

Update documentation when a change affects:

- User workflows
- Public project setup
- CI or deployment behavior
- Privacy or security expectations
- Supported commands

Maintained documentation lives in `docs/`.

## Pull Request Checklist

- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- The change is documented where needed.
- UI changes include screenshots or a short recording.
- Security and privacy implications are described when relevant.

## Reporting Issues

Use the GitHub issue templates for bugs and feature requests. Include a minimal reproduction and sample JSON only when it is safe to share.

Security vulnerabilities must be reported privately through GitHub Security Advisories or the process in `SECURITY.md`.

## Code of Conduct

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
