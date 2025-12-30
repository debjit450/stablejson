# Changelog

All notable changes to StableJSON will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Separated home page from main application for better user experience
- Comprehensive documentation and contributing guidelines
- MIT license for open source distribution

### Changed
- Improved navigation with dedicated app route
- Enhanced README with world-class documentation
- Better project structure for maintainability

## [1.0.0] - 2024-01-XX

### Added
- **Core JSON Processing**
  - JSON validation and formatting
  - Minification and prettification
  - Key sorting (alphabetical)
  - Data cleaning (remove null/empty values)
  - Canonical JSON output for deterministic results

- **Advanced Analysis**
  - JSON diff with structural and value-based comparison
  - JSONPath query support (`$.users[0].name`, `$..email`)
  - Interactive tree view with folding
  - Structure analysis (size, depth, type distribution)
  - Path inspection and extraction

- **Code Generation**
  - TypeScript interface generation
  - Zod schema generation
  - JSON Schema inference

- **Data Transformation**
  - Table view for JSON arrays
  - CSV export functionality
  - Data transformation tools
  - Hash generation (SHA-256)

- **Developer Experience**
  - Command palette (⌘K / Ctrl+K)
  - Keyboard shortcuts
  - Dark/light mode toggle
  - Responsive design
  - Offline support

- **Privacy & Security**
  - Client-side only processing
  - No data collection or tracking
  - No external dependencies
  - Local storage persistence

### Technical
- React 18 with TypeScript
- Vite build system
- Tailwind CSS with custom design system
- shadcn/ui component library
- React Router for navigation
- Local storage for state persistence

---

## Version History

### Versioning Strategy
- **Major versions** (x.0.0) - Breaking changes or major feature additions
- **Minor versions** (x.y.0) - New features and enhancements
- **Patch versions** (x.y.z) - Bug fixes and small improvements

### Release Schedule
- **Major releases** - Every 6-12 months
- **Minor releases** - Every 1-2 months
- **Patch releases** - As needed for critical fixes

### Support Policy
- **Current version** - Full support with new features and bug fixes
- **Previous major version** - Security fixes and critical bug fixes only
- **Older versions** - No official support (community support available)

---

## Migration Guides

### From Beta to 1.0.0
No migration needed - this is the first stable release.

### Future Migrations
Migration guides will be provided for any breaking changes in future major versions.

---

## Acknowledgments

### Contributors
- Initial development team
- Community contributors (see GitHub contributors page)
- Beta testers and feedback providers

### Inspiration
- JSONLint for JSON validation concepts
- jq for JSON processing inspiration
- Prettier for formatting principles
- Various JSON tools in the ecosystem

---

*For the complete list of changes, see the [GitHub releases page](https://github.com/debjit450/stablejson/releases).*