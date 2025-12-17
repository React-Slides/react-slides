# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # TypeScript check + Vite build
npm run typecheck    # TypeScript type checking only (tsc --noEmit)
npm run preview      # Preview production build
```

Note: No test framework is currently configured.

## Architecture

React Slides is a markdown-driven presentation tool. Users write slides in markdown (separated by `---`), and the app renders them as an interactive slide deck with navigation, animations, charts, and export capabilities.

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

#### Math Visual Block Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | required | Visualization type (see below) |
| `equation` | string | required | KaTeX equation to display |
| `values` | array | varies | Data for visualization |
| `layout` | string | `split` | `split` (side-by-side) or `flip` (click to flip card) |
| `interactive` | boolean | `true` | Enable sliders/inputs (web only) |
| `title` | string | optional | Title above visualization |
| `func` | string | optional | Function expression for function-plot/integral-area |
| `domain` | [number, number] | optional | X-axis range for function plots |
| `bounds` | [number, number] | optional | Integration bounds for integral-area |

#### Visualization Types

- `matrix-2x2`: Color-coded 2x2 matrix grid with editable cells
- `determinant`: Matrix with ad-bc formula breakdown and result
- `matrix-multiplication`: Matrix × vector calculation with step-by-step
- `transformation`: Canvas-based geometric transformation visualization
- `function-plot`: Interactive function graphing with Recharts
- `integral-area`: Function curve with shaded integral area

Note: Only one special block (`chart`, `animate`, or `math-visual`) per slide.

### Export Utilities

- `exportSlidesToPDF.ts` - Uses html2canvas + jsPDF
- `exportSlidesToPPTX.ts` - Uses pptxgenjs for PowerPoint/Keynote export

### Path Aliases

Configured in both tsconfig.json and vite.config.ts:
- `src/*` → `./src/*`
- `components/*` → `./src/components/*`
