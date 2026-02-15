# v1.0.0 Release Readiness

## Critical

- [x] Remove debug `console.log` in `src/components/MarkdownSlide.tsx` (lines 10-11)
- [x] Fix README prop name: `markdown` should be `markdownContent` in usage example

## Version & Packaging

- [x] Bump version from `0.1.0` to `1.0.0` in `package.json`
- [x] Remove `src/` from `files` array in `package.json` (only `dist`, `README.md`, `LICENSE` should ship)
- [x] Remove `@types/html2canvas` from `devDependencies` (deprecated stub, html2canvas ships its own types)

## Build Config

- [x] Remove `dompurify` from externals in `vite.config.lib.ts` (not used anywhere)

## Documentation

- [x] Replace Google Doc link in README with in-repo `docs/pdf-export-design.md`
- [x] Create `CHANGELOG.md` for v1.0.0

## Security

- [x] Run `npm audit fix` to address vulnerabilities (1 low, 1 moderate, 1 high)

## Verification

- [x] `npm run build:lib` passes
- [x] `npm run test:run` — all 301 tests pass
- [x] `npm audit` — 0 vulnerabilities
- [x] Review `dist/` output — no `src/` included
