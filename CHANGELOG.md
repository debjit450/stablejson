# Changelog

All notable changes to StableJSON are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2025-01

### Added

- Enhanced diff viewer with side-by-side, unified, inline, and statistics views.
- Custom validation rules with JSONPath-style targeting.
- Batch processing for multiple JSON files.
- Advanced export formats: YAML, XML, CSV, TSV, TOML, Java properties, and environment variables.
- Performance utilities for heavier JSON operations.
- Keyboard navigation and command palette improvements.

### Changed

- Improved JSON formatting, minification, sorting, and cleanup workflows.
- Improved responsive layout and dark mode presentation.
- Improved user feedback for long-running operations.
- Updated project documentation and open-source maintenance files.

### Fixed

- TypeScript project checks now pass through `npm run typecheck`.
- ESLint now exits successfully through `npm run lint`.
- XML export uses the supported `xml2js` builder API.
- Enhanced diff labels now match the shared diff result model.

## [1.0.0] - 2024-12

### Added

- JSON validation and formatting.
- JSON minification.
- Object key sorting.
- Data cleanup for null and empty values.
- Canonical JSON output.
- JSON diffing.
- JSONPath-style querying.
- Foldable tree view.
- Structure analysis.
- TypeScript interface generation.
- Zod schema generation.
- JSON Schema inference.
- Table view and CSV export.
- Hash generation.
- Dark and light themes.
- Local browser storage for editor state and preferences.

## Links

- Repository: https://github.com/debjit450/stablejson
- Releases: https://github.com/debjit450/stablejson/releases
