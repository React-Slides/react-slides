# React Slides MCP Server Reference

Complete reference for the React Slides MCP server tools, resources, and prompts.

## Tools Reference

### Content Management

#### slides_create

Create a new slide or complete presentation.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `content` | string | Yes | Markdown content for the slide(s) |
| `position` | number | No | Insert position (0-indexed). Appends if omitted |
| `theme` | ThemeName | No | Theme to apply (light, dark, corporate, warm, nature, highcontrast) |

**Example:**
```json
{
  "name": "slides_create",
  "arguments": {
    "content": "# Welcome\n\nIntroducing our new product",
    "position": 0,
    "theme": "corporate"
  }
}
```

**Returns:**
```typescript
{
  success: boolean;
  slideCount: number;
  slideIndices: number[];
  markdown: string;
}
```

---

#### slides_read

Read the current presentation content.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | number | No | Specific slide index. Returns all if omitted |
| `format` | "raw" \| "parsed" | No | Return format. Default: "raw" |

**Returns:**
```typescript
{
  markdown: string;
  theme: ThemeName;
  slideCount: number;
  slides?: ParsedSlide[];  // Only if format="parsed"
}
```

---

#### slides_update

Update an existing slide's content.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | number | Yes | Index of slide to update (0-indexed) |
| `content` | string | Yes | New markdown content for the slide |

**Returns:**
```typescript
{
  success: boolean;
  slideIndex: number;
  markdown: string;
}
```

---

#### slides_delete

Delete a slide from the presentation.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | number | Yes | Index of slide to delete (0-indexed) |

**Returns:**
```typescript
{
  success: boolean;
  remainingSlides: number;
  markdown: string;
}
```

---

#### slides_reorder

Move a slide to a new position.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `fromIndex` | number | Yes | Current slide index |
| `toIndex` | number | Yes | Target slide index |

**Returns:**
```typescript
{
  success: boolean;
  markdown: string;
}
```

---

### Chart Tools

#### chart_create

Generate a chart block for insertion into a slide.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | "bar" \| "line" \| "pie" | Yes | Chart type |
| `title` | string | Yes | Chart title |
| `data` | ChartDataPoint[] | Yes | Array of {label, value} pairs |

**Example:**
```json
{
  "name": "chart_create",
  "arguments": {
    "type": "bar",
    "title": "Q4 Revenue",
    "data": [
      { "label": "Product A", "value": 45000 },
      { "label": "Product B", "value": 32000 },
      { "label": "Product C", "value": 28000 }
    ]
  }
}
```

**Returns:**
```typescript
{
  chartBlock: string;  // Formatted ```chart block
  config: ChartConfig;
}
```

---

#### chart_from_description

Generate a chart from a natural language description.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `description` | string | Yes | Natural language description of desired chart |
| `slideIndex` | number | No | Slide to add chart to. Creates block only if omitted |

**Returns:**
```typescript
{
  chartBlock: string;
  config: ChartConfig;
  inserted: boolean;
  slideIndex?: number;
}
```

---

### Animation Tools

#### animation_create

Generate an animation block.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | "spin" \| "ping" \| "bounce" \| "pulse" \| "fade-in" \| "slide-up" | Yes | Animation type |
| `duration` | string | No | Duration (e.g., "1s", "500ms"). Default: "1s" |
| `delay` | string | No | Delay before animation starts. Default: "0s" |

**Returns:**
```typescript
{
  animationBlock: string;  // Formatted ```animate block
  config: AnimationConfig;
}
```

---

### Theme Tools

#### theme_apply

Apply a theme to the presentation.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `theme` | ThemeName | Yes | Theme name to apply |

**Returns:**
```typescript
{
  success: boolean;
  previousTheme: ThemeName;
  newTheme: ThemeName;
  markdown: string;
}
```

---

#### theme_list

List all available themes with their properties.

**Parameters:** None

**Returns:**
```typescript
{
  themes: Array<{
    name: ThemeName;
    displayName: string;
    colors: {
      '--slide-bg': string;
      '--slide-text': string;
      '--slide-accent': string;
      '--slide-muted': string;
      '--chart-1': string;
      '--chart-2': string;
      '--chart-3': string;
      '--chart-4': string;
      '--chart-5': string;
    };
  }>;
}
```

---

### Template Tools

#### template_list

List all available presentation templates.

**Parameters:** None

**Returns:**
```typescript
{
  templates: Array<{
    id: string;
    name: string;
    description: string;
    slideCount: number;
    hasCharts: boolean;
    hasSpeakerNotes: boolean;
  }>;
}
```

---

#### template_apply

Apply a template to create a new presentation.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `templateId` | string | Yes | Template identifier |
| `variables` | Record<string, string> | No | Variable substitutions |

**Returns:**
```typescript
{
  success: boolean;
  markdown: string;
  slideCount: number;
}
```

---

### Export Tools

#### export_pdf

Export the presentation to PDF format.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `filename` | string | No | Output filename. Auto-generated if omitted |
| `quality` | number | No | JPEG quality (0-1). Default: 0.95 |
| `scale` | number | No | Render scale factor. Default: 3 |

**Returns:**
```typescript
{
  success: boolean;
  filename: string;
  filepath: string;
  fileSize: number;
  slideCount: number;
}
```

---

#### export_pptx

Export to PowerPoint format (compatible with Google Slides, Apple Keynote).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `filename` | string | No | Output filename. Auto-generated if omitted |
| `scale` | number | No | Render scale factor. Default: 2 |

**Returns:**
```typescript
{
  success: boolean;
  filename: string;
  filepath: string;
  fileSize: number;
  slideCount: number;
}
```

---

### Validation Tools

#### slides_validate

Validate markdown content for correctness.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `markdown` | string | Yes | Markdown content to validate |

**Returns:**
```typescript
{
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  slideCount: number;
  hasCharts: boolean;
  hasAnimations: boolean;
  hasSpeakerNotes: boolean;
}
```

---

## Resources Reference

Access presentation data via these URIs:

| URI | MIME Type | Description |
|-----|-----------|-------------|
| `slides://content` | text/markdown | Current presentation markdown |
| `slides://content/parsed` | application/json | Parsed slide structure |
| `slides://templates` | application/json | Available templates |
| `slides://templates/{id}` | text/markdown | Specific template content |
| `slides://themes` | application/json | Available themes and colors |
| `slides://slide/{index}` | text/markdown | Individual slide content |

---

## Prompts Reference

### create_presentation

Generate a complete presentation from a topic.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `topic` | string | Yes | Presentation topic |
| `audience` | string | No | Target audience |
| `slideCount` | number | No | Desired number of slides |
| `style` | string | No | Presentation style (formal, casual, technical) |
| `includeCharts` | boolean | No | Include data visualizations |

---

### add_chart_to_slide

Add a chart visualization to an existing slide.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | number | Yes | Target slide |
| `dataDescription` | string | Yes | Description of data to visualize |
| `preferredType` | "bar" \| "line" \| "pie" | No | Preferred chart type |

---

### improve_slide

Enhance an existing slide's content.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | number | Yes | Slide to improve |
| `aspect` | "clarity" \| "engagement" \| "visuals" \| "all" | No | Focus area |

---

### add_speaker_notes

Generate speaker notes for slides.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | number | No | Specific slide. All slides if omitted |
| `style` | "brief" \| "detailed" \| "script" | No | Note style |

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_MARKDOWN` | Markdown syntax is malformed |
| `INVALID_CHART_CONFIG` | Chart YAML configuration is invalid |
| `INVALID_ANIMATION_CONFIG` | Animation YAML configuration is invalid |
| `SLIDE_NOT_FOUND` | Referenced slide index doesn't exist |
| `TEMPLATE_NOT_FOUND` | Template ID doesn't exist |
| `INVALID_THEME` | Theme name is not recognized |
| `EXPORT_FAILED` | PDF/PPTX generation failed |
| `STORAGE_ERROR` | File system operation failed |
| `VALIDATION_ERROR` | Content validation failed |

---

## Type Definitions

```typescript
type ThemeName = 'light' | 'dark' | 'corporate' | 'warm' | 'nature' | 'highcontrast';

interface ChartConfig {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: Array<{ label: string; value: number }>;
}

interface AnimationConfig {
  type: 'spin' | 'ping' | 'bounce' | 'pulse' | 'fade-in' | 'slide-up';
  duration?: string;
  delay?: string;
}

interface MathVisualConfig {
  type: 'matrix-2x2' | 'determinant' | 'matrix-multiplication' |
        'transformation' | 'function-plot' | 'integral-area';
  equation: string;
  values?: number[][];
  layout?: 'split' | 'flip';
  interactive?: boolean;
  title?: string;
  func?: string;
  domain?: [number, number];
  bounds?: [number, number];
}

type SlideBlock =
  | { type: 'markdown'; content: string }
  | { type: 'chart'; config: ChartConfig }
  | { type: 'animate'; config: AnimationConfig }
  | { type: 'math-visual'; config: MathVisualConfig };

interface ParsedSlide {
  blocks: SlideBlock[];
  notes?: string;
}

interface ValidationError {
  type: 'error';
  slideIndex?: number;
  line?: number;
  message: string;
  code: string;
}

interface ValidationWarning {
  type: 'warning';
  slideIndex?: number;
  line?: number;
  message: string;
  code: string;
  suggestion?: string;
}
```
