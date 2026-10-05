# React Slides MCP Server Specification

> Comprehensive specification for the Model Context Protocol (MCP) server that enables AI-assisted slide creation, management, and export.

**Version:** 1.0.0
**Status:** Draft
**Related Issues:** #17, #30, #45

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [MCP Tools](#mcp-tools)
4. [MCP Resources](#mcp-resources)
5. [MCP Prompts](#mcp-prompts)
6. [Data Schemas](#data-schemas)
7. [Storage Strategy](#storage-strategy)
8. [Export Functionality](#export-functionality)
9. [Error Handling](#error-handling)
10. [Implementation Guidelines](#implementation-guidelines)
11. [Examples](#examples)

---

## Overview

### Purpose

The React Slides MCP Server provides a programmatic interface for AI assistants to create, modify, and export presentation slides. It bridges natural language instructions with the react-slides markdown format, enabling seamless AI-driven presentation workflows.

### Goals

1. **Content Creation** - Convert user input into enhanced markdown with embedded charts and animations
2. **Content Access** - Provide read/write access to slide content for retrieval and modification
3. **Export Functionality** - Enable export to PDF and PPTX formats (compatible with Google Slides, Apple Keynote)
4. **Template Management** - Query and apply pre-built presentation templates
5. **Theme Support** - Validate and apply visual themes programmatically

### Technology Stack

- **Language:** TypeScript (compiled to JavaScript)
- **Protocol:** Model Context Protocol (MCP) SDK
- **Runtime:** Node.js
- **Storage:** File system with optional browser localStorage bridge

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI Assistant                              │
│                  (Claude, GPT, etc.)                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │ MCP Protocol (JSON-RPC)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   React Slides MCP Server                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Tools     │  │  Resources  │  │   Prompts   │              │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤              │
│  │ create_slide│  │ content.md  │  │ create_deck │              │
│  │ update_slide│  │ templates/* │  │ add_chart   │              │
│  │ delete_slide│  │ themes      │  │ improve     │              │
│  │ export_pdf  │  │ slides[]    │  │             │              │
│  │ export_pptx │  └─────────────┘  └─────────────┘              │
│  │ apply_theme │                                                 │
│  │ list_slides │                                                 │
│  └─────────────┘                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     Core Utilities                               │
│  ┌───────────────────┐  ┌───────────────────┐                   │
│  │ parseSlideContent │  │ parseFrontmatter  │                   │
│  │ themes.ts         │  │ templates.ts      │                   │
│  └───────────────────┘  └───────────────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│                     Export Engines                               │
│  ┌───────────────────┐  ┌───────────────────┐                   │
│  │ exportSlidesToPDF │  │ exportSlidesToPPTX│                   │
│  │ (html2canvas+jsPDF)│  │ (pptxgenjs)      │                   │
│  └───────────────────┘  └───────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Storage Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │  File System    │  │  localStorage   │                       │
│  │  (content.md)   │  │  (browser)      │                       │
│  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input Processing**
   - AI sends natural language or structured commands via MCP tools
   - Server parses intent and validates parameters

2. **Content Transformation**
   - Raw markdown is parsed using `parseSlideContent()` and `parseFrontmatter()`
   - Charts and animations are extracted and validated
   - Content is structured into `SlideBlock[]` arrays

3. **Output Generation**
   - Modified markdown is written back to storage
   - Export tools render slides and generate PDF/PPTX files
   - Results are returned to the AI assistant

---

## MCP Tools

### Content Management Tools

#### `slides_create`

Create a new slide or complete presentation.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `content` | `string` | Yes | Markdown content for the slide(s) |
| `position` | `number` | No | Insert position (0-indexed). Appends if omitted |
| `theme` | `ThemeName` | No | Theme to apply to presentation |

**Returns:**
```typescript
{
  success: boolean;
  slideCount: number;
  slideIndices: number[];
  markdown: string;
}
```

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

---

#### `slides_read`

Read the current presentation content.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | `number` | No | Specific slide index to read. Returns all if omitted |
| `format` | `"raw" \| "parsed"` | No | Return format. Default: `"raw"` |

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

#### `slides_update`

Update an existing slide's content.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | `number` | Yes | Index of slide to update (0-indexed) |
| `content` | `string` | Yes | New markdown content for the slide |

**Returns:**
```typescript
{
  success: boolean;
  slideIndex: number;
  markdown: string;
}
```

---

#### `slides_delete`

Delete a slide from the presentation.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | `number` | Yes | Index of slide to delete (0-indexed) |

**Returns:**
```typescript
{
  success: boolean;
  remainingSlides: number;
  markdown: string;
}
```

---

#### `slides_reorder`

Move a slide to a new position.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `fromIndex` | `number` | Yes | Current slide index |
| `toIndex` | `number` | Yes | Target slide index |

**Returns:**
```typescript
{
  success: boolean;
  markdown: string;
}
```

---

### Chart Tools

#### `chart_create`

Generate a chart block for insertion into a slide.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `"bar" \| "line" \| "pie"` | Yes | Chart type |
| `title` | `string` | Yes | Chart title |
| `data` | `ChartDataPoint[]` | Yes | Array of label/value pairs |

**Returns:**
```typescript
{
  chartBlock: string;  // Formatted ```chart block
  config: ChartConfig;
}
```

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

---

#### `chart_from_description`

Generate a chart from a natural language description.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `description` | `string` | Yes | Natural language description of desired chart |
| `slideIndex` | `number` | No | Slide to add chart to. Creates block only if omitted |

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

#### `animation_create`

Generate an animation block.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `"spin" \| "ping" \| "bounce" \| "pulse"` | Yes | Animation type |
| `duration` | `string` | No | Duration (e.g., "1s", "500ms"). Default: "1s" |
| `delay` | `string` | No | Delay before animation starts. Default: "0s" |

**Returns:**
```typescript
{
  animationBlock: string;  // Formatted ```animate block
  config: AnimationConfig;
}
```

---

### Theme Tools

#### `theme_apply`

Apply a theme to the presentation.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `theme` | `ThemeName` | Yes | Theme name to apply |

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

#### `theme_list`

List all available themes with their properties.

**Parameters:** None

**Returns:**
```typescript
{
  themes: Array<{
    name: ThemeName;
    displayName: string;
    colors: ThemeColors;
  }>;
}
```

---

### Template Tools

#### `template_list`

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

#### `template_apply`

Apply a template to create a new presentation.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `templateId` | `string` | Yes | Template identifier |
| `variables` | `Record<string, string>` | No | Variable substitutions |

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

#### `export_pdf`

Export the presentation to PDF format.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `filename` | `string` | No | Output filename. Auto-generated if omitted |
| `quality` | `number` | No | JPEG quality (0-1). Default: 0.95 |
| `scale` | `number` | No | Render scale factor. Default: 3 |

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

#### `export_pptx`

Export the presentation to PowerPoint format (compatible with Google Slides, Apple Keynote).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `filename` | `string` | No | Output filename. Auto-generated if omitted |
| `scale` | `number` | No | Render scale factor. Default: 2 |

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

#### `slides_validate`

Validate markdown content for correctness.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `markdown` | `string` | Yes | Markdown content to validate |

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

## MCP Resources

Resources provide read-only access to presentation data.

### `slides://content`

The current presentation markdown content.

**URI:** `slides://content`
**MIME Type:** `text/markdown`

---

### `slides://content/parsed`

Parsed slide structure as JSON.

**URI:** `slides://content/parsed`
**MIME Type:** `application/json`

**Schema:**
```typescript
{
  theme: ThemeName;
  slides: ParsedSlide[];
  metadata: {
    slideCount: number;
    hasCharts: boolean;
    hasAnimations: boolean;
    hasSpeakerNotes: boolean;
  };
}
```

---

### `slides://templates`

Available presentation templates.

**URI:** `slides://templates`
**MIME Type:** `application/json`

---

### `slides://templates/{id}`

Specific template content.

**URI:** `slides://templates/{templateId}`
**MIME Type:** `text/markdown`

---

### `slides://themes`

Available themes and their color schemes.

**URI:** `slides://themes`
**MIME Type:** `application/json`

---

### `slides://slide/{index}`

Individual slide content.

**URI:** `slides://slide/{slideIndex}`
**MIME Type:** `text/markdown`

---

## MCP Prompts

Prompts provide reusable generation patterns.

### `create_presentation`

Generate a complete presentation from a topic.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `topic` | `string` | Yes | Presentation topic |
| `audience` | `string` | No | Target audience |
| `slideCount` | `number` | No | Desired number of slides |
| `style` | `string` | No | Presentation style (formal, casual, technical) |
| `includeCharts` | `boolean` | No | Whether to include data visualizations |

---

### `add_chart_to_slide`

Add a chart visualization to an existing slide.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | `number` | Yes | Target slide |
| `dataDescription` | `string` | Yes | Description of data to visualize |
| `preferredType` | `"bar" \| "line" \| "pie"` | No | Preferred chart type |

---

### `improve_slide`

Enhance an existing slide's content.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | `number` | Yes | Slide to improve |
| `aspect` | `"clarity" \| "engagement" \| "visuals" \| "all"` | No | Focus area |

---

### `add_speaker_notes`

Generate speaker notes for slides.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `slideIndex` | `number` | No | Specific slide. All slides if omitted |
| `style` | `"brief" \| "detailed" \| "script"` | No | Note style |

---

## Data Schemas

### ThemeName

```typescript
type ThemeName =
  | 'light'
  | 'dark'
  | 'corporate'
  | 'warm'
  | 'nature'
  | 'highcontrast';
```

### ThemeColors

```typescript
interface ThemeColors {
  '--slide-bg': string;
  '--slide-text': string;
  '--slide-accent': string;
  '--slide-muted': string;
  '--chart-1': string;
  '--chart-2': string;
  '--chart-3': string;
  '--chart-4': string;
  '--chart-5': string;
}
```

### SlideBlock

```typescript
type SlideBlock =
  | { type: 'markdown'; content: string }
  | { type: 'chart'; config: ChartConfig }
  | { type: 'animate'; config: AnimationConfig };
```

### ParsedSlide

```typescript
interface ParsedSlide {
  blocks: SlideBlock[];
  notes?: string;
}
```

### ChartConfig

```typescript
interface ChartConfig {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: ChartDataPoint[];
}

interface ChartDataPoint {
  label: string;
  value: number;
}
```

### AnimationConfig

```typescript
interface AnimationConfig {
  type: 'spin' | 'ping' | 'bounce' | 'pulse';
  duration?: string;
  delay?: string;
}
```

### ValidationError

```typescript
interface ValidationError {
  type: 'error';
  slideIndex?: number;
  line?: number;
  message: string;
  code: string;
}
```

### ValidationWarning

```typescript
interface ValidationWarning {
  type: 'warning';
  slideIndex?: number;
  line?: number;
  message: string;
  code: string;
  suggestion?: string;
}
```

---

## Storage Strategy

### File System Mode (Default)

The MCP server operates on files in the project directory.

**Content Location:**
- Primary: `./public/content.md`
- Drafts: `./drafts/` directory
- Exports: `./exports/` directory

**Operations:**
```typescript
// Read content
const content = await fs.readFile('./public/content.md', 'utf-8');

// Write content
await fs.writeFile('./public/content.md', markdown, 'utf-8');

// Export files
await fs.writeFile(`./exports/${filename}`, buffer);
```

### Browser Storage Bridge (Optional)

For integration with the web application's localStorage.

**localStorage Key:** `react-slides-draft`

**Bridge API:**
```typescript
interface StorageBridge {
  read(): Promise<string>;
  write(content: string): Promise<void>;
  sync(): Promise<void>;  // Sync file system and localStorage
}
```

### Storage Configuration

```typescript
interface StorageConfig {
  mode: 'filesystem' | 'browser' | 'hybrid';
  contentPath: string;
  draftsPath: string;
  exportsPath: string;
  localStorageKey?: string;
}
```

---

## Export Functionality

### PDF Export Process

1. **Render Slides**
   - Create headless browser context or use Node canvas
   - Render each slide at 1024x768 with theme styling
   - Apply scale factor (default: 3x) for quality

2. **Capture Images**
   - Use html2canvas or Puppeteer to capture slide images
   - Convert to JPEG with configurable quality

3. **Generate PDF**
   - Create landscape PDF document using jsPDF
   - Insert each slide image as a page
   - Apply metadata (title, author, date)

4. **Output**
   - Save to exports directory
   - Return file path and metadata

### PPTX Export Process

1. **Render Slides**
   - Same rendering process as PDF
   - Scale factor default: 2x (balance of quality/size)

2. **Generate PPTX**
   - Create PptxGenJS presentation
   - Configure 16:9 layout
   - Insert slide images with full coverage

3. **Compatibility**
   - Output is compatible with:
     - Microsoft PowerPoint
     - Apple Keynote
     - Google Slides
     - LibreOffice Impress

### Export Configuration

```typescript
interface ExportConfig {
  pdf: {
    quality: number;      // 0-1, default 0.95
    scale: number;        // render scale, default 3
    format: 'jpeg' | 'png';
  };
  pptx: {
    scale: number;        // render scale, default 2
    layout: '16:9' | '4:3';
  };
  outputDir: string;
  filenamePattern: string;  // e.g., "slides_{date}"
}
```

---

## Error Handling

### Error Codes

| Code | Name | Description |
|------|------|-------------|
| `INVALID_MARKDOWN` | Invalid Markdown | Markdown syntax is malformed |
| `INVALID_CHART_CONFIG` | Invalid Chart Config | Chart YAML is invalid |
| `INVALID_ANIMATION_CONFIG` | Invalid Animation Config | Animation YAML is invalid |
| `SLIDE_NOT_FOUND` | Slide Not Found | Referenced slide index doesn't exist |
| `TEMPLATE_NOT_FOUND` | Template Not Found | Template ID doesn't exist |
| `INVALID_THEME` | Invalid Theme | Theme name is not recognized |
| `EXPORT_FAILED` | Export Failed | PDF/PPTX generation failed |
| `STORAGE_ERROR` | Storage Error | File system operation failed |
| `VALIDATION_ERROR` | Validation Error | Content validation failed |

### Error Response Format

```typescript
interface MCPError {
  code: string;
  message: string;
  details?: {
    slideIndex?: number;
    line?: number;
    column?: number;
    suggestion?: string;
  };
}
```

### Error Examples

```json
{
  "code": "INVALID_CHART_CONFIG",
  "message": "Chart data must contain at least one data point",
  "details": {
    "slideIndex": 2,
    "line": 15,
    "suggestion": "Add data points with 'label' and 'value' properties"
  }
}
```

---

## Implementation Guidelines

### Project Structure

```
mcp-server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── server.ts             # Server configuration
│   ├── tools/
│   │   ├── slides.ts         # Slide management tools
│   │   ├── charts.ts         # Chart generation tools
│   │   ├── themes.ts         # Theme tools
│   │   ├── templates.ts      # Template tools
│   │   └── export.ts         # Export tools
│   ├── resources/
│   │   ├── content.ts        # Content resources
│   │   ├── templates.ts      # Template resources
│   │   └── themes.ts         # Theme resources
│   ├── prompts/
│   │   ├── create.ts         # Creation prompts
│   │   └── improve.ts        # Improvement prompts
│   ├── utils/
│   │   ├── parser.ts         # Markdown parsing (reuse from react-slides)
│   │   ├── validator.ts      # Content validation
│   │   └── storage.ts        # Storage abstraction
│   └── types/
│       └── index.ts          # TypeScript definitions
├── package.json
├── tsconfig.json
└── README.md
```

### Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "js-yaml": "^4.1.0",
    "puppeteer": "^21.0.0",
    "jspdf": "^3.0.1",
    "pptxgenjs": "^4.0.1"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "@types/node": "^20.0.0",
    "@types/js-yaml": "^4.0.9"
  }
}
```

### Server Initialization

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'react-slides-mcp',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
  },
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ... tool definitions
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // ... tool implementations
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Reusing React-Slides Utilities

The MCP server should import and reuse existing utilities from react-slides:

```typescript
// Import from react-slides package
import { parseSlideContent, ParsedSlide } from '@react-slides/react-slides';
import { parseFrontmatter, injectTheme } from '@react-slides/react-slides';
import { getTheme, isValidTheme, ThemeName } from '@react-slides/react-slides';
import { TEMPLATES } from '@react-slides/react-slides';
```

---

## Examples

### Example 1: Create a Simple Presentation

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "slides_create",
    "arguments": {
      "content": "# Welcome to React Slides\n\nA markdown-driven presentation tool\n\n---\n\n# Features\n\n- Easy markdown editing\n- Beautiful themes\n- Chart support\n\n---\n\n# Thank You!\n\nQuestions?",
      "theme": "corporate"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "slideCount": 3,
  "slideIndices": [0, 1, 2],
  "markdown": "---\ntheme: corporate\n---\n# Welcome to React Slides\n..."
}
```

### Example 2: Add a Chart to a Slide

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "chart_create",
    "arguments": {
      "type": "pie",
      "title": "Market Share",
      "data": [
        { "label": "Our Product", "value": 35 },
        { "label": "Competitor A", "value": 28 },
        { "label": "Competitor B", "value": 22 },
        { "label": "Others", "value": 15 }
      ]
    }
  }
}
```

**Response:**
```json
{
  "chartBlock": "```chart\ntype: pie\ntitle: Market Share\ndata:\n  - label: Our Product\n    value: 35\n  - label: Competitor A\n    value: 28\n  - label: Competitor B\n    value: 22\n  - label: Others\n    value: 15\n```",
  "config": {
    "type": "pie",
    "title": "Market Share",
    "data": [...]
  }
}
```

### Example 3: Export to PPTX

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "export_pptx",
    "arguments": {
      "filename": "quarterly_review"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "filename": "quarterly_review.pptx",
  "filepath": "./exports/quarterly_review.pptx",
  "fileSize": 2457600,
  "slideCount": 12
}
```

### Example 4: Using a Prompt

**Request:**
```json
{
  "method": "prompts/get",
  "params": {
    "name": "create_presentation",
    "arguments": {
      "topic": "Introduction to Machine Learning",
      "audience": "Business executives",
      "slideCount": 8,
      "style": "formal",
      "includeCharts": true
    }
  }
}
```

**Response:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Create an 8-slide formal presentation about 'Introduction to Machine Learning' for business executives. Include data visualizations where appropriate.\n\nUse the react-slides markdown format with:\n- Slide separators: ---\n- Charts: ```chart blocks with YAML\n- Themes: corporate (recommended for business)\n\nStructure:\n1. Title slide\n2. Problem/opportunity\n3-6. Key concepts with visuals\n7. Business applications\n8. Summary/call to action"
      }
    }
  ]
}
```

---

## Acceptance Criteria

- [ ] All MCP tools documented with parameters and return types
- [ ] All MCP resources defined with URIs and schemas
- [ ] All MCP prompts specified with arguments
- [ ] Data schemas fully typed in TypeScript
- [ ] Storage strategy covers file system and browser modes
- [ ] Export functionality documented for PDF and PPTX
- [ ] Error codes and handling defined
- [ ] Implementation guidelines with project structure
- [ ] Working examples for common use cases
- [ ] Integration with existing react-slides utilities specified

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-16 | Claude | Initial comprehensive specification |

---

## Related Documentation

- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [React Slides README](./README.md)
- [React Slides CLAUDE.md](./CLAUDE.md)
