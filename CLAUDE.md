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
   - Extracts special code blocks (` ```chart ` and ` ```animate `) from markdown
   - Parses YAML config from special blocks using js-yaml
   - Returns array of `SlideBlock` types: `markdown`, `chart`, or `animate`

### Component Hierarchy

```
App
├── MarkdownForm (editing mode)
└── SlideDeck (presentation mode)
    ├── MarkdownSlide (ReactMarkdown with remark-gfm)
    ├── ChartRenderer (Recharts: bar/line/pie)
    └── AnimationWrapper (CSS animations)
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

Charts and animations are defined in fenced code blocks with YAML config:

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

Note: Only one special block (`chart` or `animate`) per slide.

### Export Utilities

- `exportSlidesToPDF.ts` - Uses html2canvas + jsPDF
- `exportSlidesToPPTX.ts` - Uses pptxgenjs for PowerPoint/Keynote export

### Path Aliases

Configured in both tsconfig.json and vite.config.ts:
- `src/*` → `./src/*`
- `components/*` → `./src/components/*`
