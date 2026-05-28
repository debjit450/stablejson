# Release Notes

## StableJSON 1.5.0

StableJSON 1.5.0 expands the browser JSON workspace with stronger diffing, validation, export, batch processing, and performance tooling.

### Highlights

- Enhanced diff viewer with multiple review modes and exportable reports.
- Custom validation rules for required fields, regex checks, ranges, formats, and custom expressions.
- Batch processor for formatting, minifying, validating, cleaning, and sorting multiple JSON files.
- Advanced exporter for JSON, YAML, XML, CSV, TSV, TOML, properties, and environment files.
- Type generation for TypeScript, Zod, and JSON Schema.
- Improved keyboard navigation and command palette workflow.

### Quality and Maintenance

- Added TypeScript project validation through `npm run typecheck`.
- Added a combined `npm run validate` quality gate.
- Added GitHub Actions CI for linting, typechecking, building, and production dependency audit checks.
- Added Dependabot configuration for npm packages and GitHub Actions.
- Added GitHub issue templates and pull request template.

## StableJSON 1.0.0

The initial StableJSON release introduced a frontend-only JSON utility focused on privacy, deterministic output, and practical developer workflows.

### Included

- JSON validation, formatting, minification, sorting, cleanup, and canonical output.
- JSON diffing, path inspection, querying, analysis, and tree exploration.
- TypeScript, Zod, and JSON Schema generation.
- Table conversion, CSV export, and hash generation.
- Dark and light themes.
- Local browser storage for editor state and preferences.

## Known Limitations

- Very large JSON payloads are constrained by browser memory.
- Generated types and schemas should be reviewed before production use.
- Browser-specific file and clipboard permissions may affect import, export, and copy workflows.
