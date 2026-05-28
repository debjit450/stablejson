# Privacy and Security

StableJSON is designed to process JSON locally in the browser.

## Data Handling

- JSON input is parsed, transformed, and rendered client-side.
- The app does not require users to sign in.
- The app does not need a backend service for JSON processing.
- Editor content and preferences may be written to local browser storage.
- Batch files are read through browser file APIs and processed locally.

## User Responsibilities

- Do not paste sensitive production data into shared or untrusted browser sessions.
- Clear browser storage after working with sensitive data on a shared machine.
- Review exported files before sharing them.
- Use representative sample data when filing public issues.

## Security Reporting

Do not disclose vulnerabilities through public issues. Use GitHub Security Advisories or the process in `SECURITY.md`.

Reports should include:

- Affected version, branch, or commit.
- Reproduction steps.
- Expected and actual impact.
- A minimal proof of concept when available.
- Whether the issue involves browser storage, generated files, worker execution, or dependency behavior.

## Dependency Security

CI enforces production dependency audits at moderate severity and above. Dependabot is enabled for npm packages and GitHub Actions.

Some dependency updates can affect browser bundle behavior. Review export, diff, formatting, and batch workflows after security upgrades.
