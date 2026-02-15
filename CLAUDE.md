# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # TypeScript check + Vite build (demo app)
npm run build:lib    # TypeScript check + library build (npm package)
npm run build:demo   # TypeScript check + demo app build
npm run typecheck    # TypeScript type checking only (tsc --noEmit)
npm run preview      # Preview production build
npm test             # Run tests in watch mode (vitest)
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
```

Tests use vitest + jsdom + @testing-library/react. Test files live alongside source files as `*.test.ts(x)`. Run a single test file with `npx vitest run src/utils/parseSlideContent.test.ts`.

## Architecture

React Slides is a markdown-driven presentation tool **and** a publishable npm library (`@str-ventures/react-slides`). Users write slides in markdown (separated by `---`), and the app renders them as an interactive slide deck with navigation, animations, charts, and export capabilities.

### Dual Build System

- `vite.config.ts` - Demo app build (serves `index.html`)
- `vite.config.lib.ts` - Library build (ESM-only, entry: `src/index.ts`, externalizes all dependencies)
- `vite.config.demo.ts` - Demo app build variant

The library entry point `src/index.ts` defines the public API: `SlideDeck`, `MarkdownSlide`, `ChartRenderer`, `AnimationWrapper`, `MarkdownForm`, `TemplatePicker`, `MathVisualRenderer`, plus utility functions and types.

### Data Flow

1. **App.tsx** - Root component, manages markdown content state and editing mode
   - Fetches initial content from `/public/content.md`
   - Parses YAML frontmatter via `parseFrontmatter()` to extract theme
   - Toggles between edit mode (MarkdownForm) and presentation mode (SlideDeck)
   - Handles PDF and PPTX export

2. **SlideDeck.tsx** - Presentation container
   - Splits markdown by `---` into individual slides
   - Parses each slide using `parseSlideContent()` into structured blocks
   - Manages slide navigation (arrows + keyboard left/right)
   - Applies theme CSS variables from `themes.ts`
   - Renders markdown, chart, and animation blocks

3. **parseSlideContent.ts** - Core parsing utility
   - Extracts special code blocks (` ```chart `, ` ```animate `, ` ```math-visual `) from markdown
   - Parses YAML config from special blocks using js-yaml
   - Returns array of `SlideBlock` types: `markdown`, `chart`, `animate`, or `math-visual`

### Component Hierarchy

```
App
├── MarkdownForm (editing mode)
│   └── TemplatePicker (preset slide templates)
└── SlideDeck (presentation mode)
    ├── MarkdownSlide (ReactMarkdown with remark-gfm)
    ├── ChartRenderer (Recharts: bar/line/pie)
    ├── AnimationWrapper (CSS animations)
    └── MathVisualRenderer (math visualizations)
        ├── FlipCard (optional flip layout)
        └── visualizations/
            ├── Matrix2x2Viz
            ├── DeterminantViz
            ├── MatrixMultiplicationViz
            ├── TransformationViz (canvas-based)
            ├── FunctionPlotViz (Recharts)
            └── IntegralAreaViz (Recharts)
```

### Theme System

Themes are defined in `src/utils/themes.ts` with CSS variables for styling. Set theme via YAML frontmatter:

```markdown
---
theme: dark
---
# First Slide
```

Available themes: `light` (default), `dark`, `corporate`, `warm`, `nature`, `highcontrast`

Each theme defines: `--slide-bg`, `--slide-text`, `--slide-accent`, `--slide-muted`, and colorblind-safe chart colors (`--chart-1` through `--chart-5`).

### Special Markdown Blocks

Charts, animations, and math visualizations are defined in fenced code blocks with YAML config:

```markdown
```chart
type: bar|line|pie
title: Chart Title
data:
  - label: Q1
    value: 120
```

```markdown
```animate
type: fade-in|slide-up|bounce|spin|ping|pulse
```

```markdown
```math-visual
type: matrix-2x2|determinant|matrix-multiplication|transformation|function-plot|integral-area
equation: |
  $$\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$$
values: [[1, 2], [3, 4]]
layout: split|flip
interactive: true
```

Note: Only one special block (`chart`, `animate`, or `math-visual`) per slide.

### Export Utilities

- `exportSlidesToPDF.ts` - Uses html2canvas + jsPDF (optional peer deps)
- `exportSlidesToPPTX.ts` - Uses pptxgenjs for PowerPoint/Keynote export (optional peer dep)
- `PDFSlideDeck.tsx` - Internal component used by export utils via dynamic import (not exported in public API)

### Path Aliases

Configured in both tsconfig.json and vite.config.ts:
- `src/*` → `./src/*`
- `components/*` → `./src/components/*`
- `common/*` → `./src/components/common/*` (tsconfig only)
- `slides/*` → `./src/components/slides/*` (tsconfig only)

### Key Types

Core types are in `src/types.ts` (component props, form state, toast) and `src/utils/parseSlideContent.ts` (ParsedSlide, SlideBlock, MathVisualConfig).
