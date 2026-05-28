# Security Policy

## Supported Versions

StableJSON supports the current released version with security fixes.

| Version | Supported |
| --- | --- |
| 1.5.x | Yes |
| < 1.5 | No |

## Reporting a Vulnerability

Do not report security vulnerabilities through public GitHub issues.

Use GitHub Security Advisories for private disclosure:

https://github.com/debjit450/stablejson/security/advisories/new

If GitHub Security Advisories are unavailable, contact the maintainer listed in the README.

## What to Include

Please include:

- Affected version, branch, or commit.
- Browser and operating system details.
- Reproduction steps.
- Minimal proof of concept when available.
- Impact assessment.
- Whether the issue involves browser storage, generated files, workers, dependency behavior, routing, or exported content.

Do not include real secrets, credentials, production customer data, or private JSON payloads.

## Disclosure Expectations

Please allow maintainers reasonable time to triage and fix the issue before public disclosure. Avoid actions that access, modify, delete, or exfiltrate data that does not belong to you.

## Project Security Model

StableJSON is a static frontend application:

- JSON processing happens in the browser.
- The app does not require an application backend to process JSON.
- Editor content and preferences may be stored in local browser storage.
- File import and export use browser APIs.
- CI enforces linting, TypeScript checks, production builds, and moderate-or-higher production dependency audits.

## User Guidance

- Avoid pasting sensitive JSON into shared machines or untrusted browser sessions.
- Clear browser storage after sensitive work on shared devices.
- Share only minimized, non-sensitive sample payloads in public issues.
