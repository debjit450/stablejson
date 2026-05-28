# Usage Guide

StableJSON is a browser-based workspace for common JSON tasks. Paste JSON into the input editor, choose an action from the toolbar or command palette, and review the result in the output panel.

## Core Actions

### Format

Formats valid JSON with indentation for readability.

### Minify

Removes whitespace and returns compact JSON suitable for transport or storage.

### Clean

Removes null and empty values from objects and arrays.

### Sort

Sorts object keys alphabetically. This is useful for stable diffs and version control.

### Canonical

Produces deterministic JSON output so equivalent input produces stable serialized output.

## Compare JSON

Use the comparison editor for the second document, then choose `Diff` or `Enhanced Diff`.

The standard diff view focuses on direct changes. The enhanced diff view adds filtering, unified output, inline output, and summary statistics.

## Query and Inspect

Use JSONPath-style expressions to query nested values. Common examples:

```text
$.users[0].email
$..id
$.items[*].name
```

The foldable tree view helps inspect nested payloads and extract selected paths.

## Generate Types and Schemas

The type generation view can infer:

- TypeScript interfaces
- Zod schemas
- JSON Schema

Generated output is based on the sample JSON provided in the editor. Review generated types before using them in production code.

## Transform and Export

StableJSON can transform JSON and export to multiple formats:

- JSON
- YAML
- XML
- CSV
- TSV
- TOML
- Java properties
- Environment variable files

Array-shaped JSON is best suited for table, CSV, and TSV output. Nested objects may be stringified or flattened depending on the selected tool.

## Batch Processing

Batch processing accepts multiple `.json` files and applies the selected operation to each file. Completed results can be downloaded individually or as a ZIP archive with a processing report.

## Keyboard Workflow

Use `Ctrl+K` or `Cmd+K` to open the command palette. Shortcuts are available for common operations such as format, minify, sort, clean, diff, table view, type generation, and clearing the workspace.

## Local Storage

StableJSON stores editor content and preferences in browser storage for convenience. Use the clear action or browser storage controls to remove local data.
