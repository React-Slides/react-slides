---
name: react-slides
description: Create, edit, and export markdown-driven presentations with React Slides. Use when building slide decks, adding charts/animations/math visualizations, applying themes, managing templates, or exporting to PDF/PPTX. Supports interactive charts (bar/line/pie), CSS animations, KaTeX math equations, and 6 visual themes.
---

# React Slides Development Skill

Create professional presentations using markdown with embedded charts, animations, and mathematical visualizations.

## Quick Start

```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # TypeScript check + Vite build
npm run typecheck    # Type checking only
```

## Slide Format

Slides are written in markdown, separated by `---`. Set theme via YAML frontmatter:

```markdown
---
theme: corporate
---
# First Slide Title

Your content here with **bold** and *italic* text.

- Bullet points
- Support GFM markdown

---

# Second Slide

More content...
```

## Available Themes

| Theme | Description |
|-------|-------------|
| `light` | Default light theme |
| `dark` | Dark mode theme |
| `corporate` | Professional business theme |
| `warm` | Warm earth tones |
| `nature` | Green nature-inspired |
| `highcontrast` | High contrast for accessibility |

## Special Blocks

### Charts

Create interactive charts with Recharts:

```markdown
```chart
type: bar
title: Quarterly Revenue
data:
  - label: Q1
    value: 120000
  - label: Q2
    value: 150000
  - label: Q3
    value: 180000
  - label: Q4
    value: 200000
```
```

**Chart types:** `bar`, `line`, `pie`

### Animations

Add CSS animations to slide content:

```markdown
```animate
type: fade-in
duration: 1s
delay: 0.5s
```
```

**Animation types:** `fade-in`, `slide-up`, `bounce`, `spin`, `ping`, `pulse`

### Math Visualizations

Create interactive mathematical visualizations:

```markdown
```math-visual
type: matrix-2x2
equation: |
  $$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$$
values: [[1, 2], [3, 4]]
layout: split
interactive: true
```
```

**Visualization types:**
- `matrix-2x2` - Color-coded 2x2 matrix grid
- `determinant` - Matrix with ad-bc formula breakdown
- `matrix-multiplication` - Matrix x vector calculation
- `transformation` - Canvas-based geometric transformations
- `function-plot` - Interactive function graphing
- `integral-area` - Function curve with shaded integral

**Layout options:** `split` (side-by-side) or `flip` (click to reveal)

### Speaker Notes

Add notes that won't be displayed in presentation:

```markdown
# Slide Title

Content visible to audience

<!--notes
These are speaker notes only you can see.
Use them for talking points and reminders.
-->
```

## File Locations

| Path | Purpose |
|------|---------|
| `public/content.md` | Default slide content |
| `src/components/SlideDeck.tsx` | Main presentation renderer |
| `src/components/ChartRenderer.tsx` | Chart visualization |
| `src/components/MathVisualRenderer.tsx` | Math visualizations |
| `src/utils/parseSlideContent.ts` | Markdown parsing logic |
| `src/utils/themes.ts` | Theme definitions |
| `src/constants/templates.ts` | Pre-built templates |

## Templates

Four pre-built templates available:

1. **Business Pitch** - Startup/product presentations
2. **Technical Presentation** - Developer/engineering talks
3. **Educational Course** - Teaching materials
4. **General Presentation** - Multipurpose template

## Export Options

### PDF Export
Uses html2canvas + jsPDF for high-quality PDF output.

### PPTX Export
Uses pptxgenjs - compatible with PowerPoint, Keynote, and Google Slides.

## MCP Server Integration

The react-slides MCP server provides programmatic access for AI-assisted slide creation.

### Available MCP Tools

#### Content Management
- `slides_create` - Create new slides or presentations
- `slides_read` - Read current presentation content
- `slides_update` - Update existing slide content
- `slides_delete` - Delete a slide
- `slides_reorder` - Move slides to new positions

#### Chart Tools
- `chart_create` - Generate chart blocks with data
- `chart_from_description` - Create charts from natural language

#### Theme & Template Tools
- `theme_apply` - Apply a theme to the presentation
- `theme_list` - List available themes
- `template_list` - List available templates
- `template_apply` - Apply a template

#### Export Tools
- `export_pdf` - Export to PDF format
- `export_pptx` - Export to PowerPoint format

#### Validation
- `slides_validate` - Validate markdown content

### MCP Resources

Access presentation data via these URIs:
- `slides://content` - Current markdown content
- `slides://content/parsed` - Parsed slide structure as JSON
- `slides://templates` - Available templates
- `slides://templates/{id}` - Specific template content
- `slides://themes` - Available themes and colors
- `slides://slide/{index}` - Individual slide content

### MCP Prompts

Pre-built generation patterns:
- `create_presentation` - Generate complete presentation from topic
- `add_chart_to_slide` - Add chart to existing slide
- `improve_slide` - Enhance slide content
- `add_speaker_notes` - Generate speaker notes

## Examples

### Complete Presentation

```markdown
---
theme: corporate
---
# Q4 Business Review

Annual performance summary

---

# Revenue Growth

```chart
type: line
title: Monthly Revenue 2024
data:
  - label: Jan
    value: 85000
  - label: Feb
    value: 92000
  - label: Mar
    value: 105000
```

---

# Market Share

```chart
type: pie
title: Market Distribution
data:
  - label: Our Product
    value: 35
  - label: Competitor A
    value: 28
  - label: Others
    value: 37
```

---

# Key Takeaways

```animate
type: fade-in
```

- Revenue up 23% YoY
- Market share increased 5 points
- Customer satisfaction at 94%

---

# Thank You

Questions?
```

### Math Presentation

```markdown
---
theme: dark
---
# Linear Algebra Fundamentals

Understanding matrices and transformations

---

# 2x2 Matrix

```math-visual
type: matrix-2x2
equation: |
  $$A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$$
values: [[2, 1], [1, 3]]
interactive: true
```

---

# Determinant

```math-visual
type: determinant
equation: |
  $$\det(A) = ad - bc$$
values: [[2, 1], [1, 3]]
layout: split
```

---

# Geometric Transformation

```math-visual
type: transformation
equation: |
  $$T: \mathbb{R}^2 \to \mathbb{R}^2$$
values: [[1, 0.5], [0, 1]]
interactive: true
```
```

## Architecture Overview

```
App.tsx (root)
├── MarkdownForm (editing mode)
└── SlideDeck (presentation mode)
    ├── MarkdownSlide (ReactMarkdown + remark-gfm)
    ├── ChartRenderer (Recharts: bar/line/pie)
    ├── AnimationWrapper (CSS animations)
    └── MathVisualRenderer
        ├── FlipCard (optional flip layout)
        └── visualizations/
            ├── Matrix2x2Viz
            ├── DeterminantViz
            ├── MatrixMultiplicationViz
            ├── TransformationViz (canvas)
            ├── FunctionPlotViz (Recharts)
            └── IntegralAreaViz (Recharts)
```

## Data Flow

1. `App.tsx` loads content from localStorage or `/public/content.md`
2. `parseFrontmatter()` extracts theme from YAML header
3. `SlideDeck` splits markdown by `---` delimiter
4. `parseSlideContent()` extracts special blocks (chart, animate, math-visual)
5. Components render based on `SlideBlock` types

## Best Practices

1. **One special block per slide** - Only one chart, animation, or math-visual per slide
2. **Use semantic headings** - Start slides with `#` for titles
3. **Keep content concise** - Slides should be scannable
4. **Choose appropriate charts** - Bar for comparison, line for trends, pie for composition
5. **Test responsiveness** - Preview at different viewport sizes
6. **Use speaker notes** - Keep detailed talking points in `<!--notes -->` blocks
