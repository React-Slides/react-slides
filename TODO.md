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

---

# Post-Release

## GitHub Pages Stats Dashboard

- [ ] Add `TRAFFIC_TOKEN` repo secret (PAT with `repo` scope) to enable `.github/workflows/traffic-archive.yml`
- [ ] Serve stats report at `react-slides.github.io/react-slides/stats/` — modify `deploy-pages.yml` to checkout `github-repo-stats` branch and copy `{owner}/{repo}/latest-report/` into `dist-demo/stats/` before uploading the Pages artifact
- [ ] Un-ignore `CLAUDE.md` from `.gitignore` so the Pages/stats documentation is tracked in git
