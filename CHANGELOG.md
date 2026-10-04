# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Renamed the package from `@str-ventures/react-slides` to `@react-slides/react-slides`.** GitHub Packages requires the npm scope to match the repository owner (`React-Slides`). Update your imports and change the `.npmrc` scope line to `@react-slides:registry=https://npm.pkg.github.com`.
- Publishing runs once per published GitHub release (not on drafts or tag pushes), checks the release tag matches `package.json`, and runs typecheck and tests first.

## [1.0.0] - 2026-02-15

### Added

- `SlideDeck` component for rendering markdown-driven slide presentations
- `MarkdownSlide` component with GitHub Flavored Markdown, math (KaTeX), and syntax highlighting
- `ChartRenderer` component supporting bar, line, and pie charts via Recharts
- `AnimationWrapper` component with fade-in, slide-up, bounce, spin, ping, and pulse animations
- `MathVisualRenderer` with interactive visualizations: matrix-2x2, determinant, matrix-multiplication, transformation, function-plot, integral-area
- `MarkdownForm` editor component with `TemplatePicker` for preset slide templates
- Theme system with 6 themes: light, dark, corporate, warm, nature, highcontrast
- Colorblind-safe chart color palettes per theme
- PDF export via html2canvas + jsPDF (optional peer dependencies)
- PPTX export via pptxgenjs (optional peer dependency)
- Special markdown blocks: `chart`, `animate`, `math-visual` with YAML config
- Keyboard navigation (left/right arrows) for slide navigation
- Flip card layout option for math visualizations
- PDF export design documentation (`docs/pdf-export-design.md`)

### Fixed

- Removed debug `console.log` from `MarkdownSlide` component
- Fixed incorrect prop name in README usage example (`markdown` -> `markdownContent`)

### Changed

- Bumped version from 0.1.0 to 1.0.0
- Removed `src/` from published package files (only `dist/`, `README.md`, `LICENSE` ship)
- Removed unused `dompurify` from library build externals
- Removed deprecated `@types/html2canvas` dev dependency
- Replaced external Google Doc link with in-repo `docs/pdf-export-design.md`

### Security

- Resolved npm audit vulnerabilities: updated `diff`, `jspdf`, and `lodash`
