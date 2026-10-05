// utils/parseSlideContent.ts
import yaml from 'js-yaml';

export type MathVisualType =
  | 'matrix-2x2'
  | 'matrix-multiplication'
  | 'determinant'
  | 'transformation'
  | 'function-plot'
  | 'integral-area';

export interface MathVisualConfig {
  type: MathVisualType;
  interactive?: boolean;
  equation: string;
  values?: number[][] | number[];
  title?: string;
  // Function plot specific
  func?: string;
  domain?: [number, number];
  range?: [number, number];
  // Integral specific
  bounds?: [number, number];
  layout?: 'flip' | 'split';
}

export type SlideBlock =
  | { type: 'markdown'; content: string }
  | { type: 'chart'; config: any }
  | { type: 'animate'; config: any }
  | { type: 'math-visual'; config: MathVisualConfig };

/** Slide-wide layouts, set with `<!-- layout: title -->` anywhere in a slide */
export type SlideLayout = 'title';
const SLIDE_LAYOUTS: readonly SlideLayout[] = ['title'];

export interface ParsedSlide {
  blocks: SlideBlock[];
  notes?: string;
  layout?: SlideLayout;
}

/**
 * Extracts a `<!-- layout: name -->` directive. The comment is always removed; an unknown
 * layout name is ignored.
 */
function extractLayout(content: string): { content: string; layout?: SlideLayout } {
  const layoutRegex = /<!--\s*layout:\s*([a-z-]+)\s*-->/i;
  const match = content.match(layoutRegex);
  if (!match) return { content };

  const name = match[1].toLowerCase() as SlideLayout;
  return {
    content: content.replace(layoutRegex, '').trim(),
    layout: SLIDE_LAYOUTS.includes(name) ? name : undefined,
  };
}

/**
 * Extracts speaker notes from slide content.
 * Notes are defined using HTML comment syntax: <!--notes ... -->
 * @param content Raw slide content
 * @returns Object with content (notes removed) and extracted notes
 */
function extractNotes(content: string): { content: string; notes?: string } {
  // Match <!--notes ... --> pattern (case-insensitive, multiline)
  const notesRegex = /<!--\s*notes\s*\n([\s\S]*?)-->/i;
  const match = content.match(notesRegex);

  if (match) {
    const notes = match[1].trim();
    const contentWithoutNotes = content.replace(notesRegex, '').trim();
    return { content: contentWithoutNotes, notes };
  }

  return { content };
}

/**
 * Parses a single slide's raw markdown content into structured blocks.
 * @param raw Markdown string for a single slide
 */
export function parseSlideContent(raw: string): ParsedSlide {
  // First extract the layout directive and speaker notes
  const { content: withoutLayout, layout } = extractLayout(raw);
  const { content: contentWithoutNotes, notes } = extractNotes(withoutLayout);
  const slideMeta = layout ? { notes, layout } : { notes };

  const codeBlockRegex = /```(chart|animate|math-visual)\s*\n([\s\S]*?)```/m;
  const match = contentWithoutNotes.match(codeBlockRegex);

  if (match) {
    const [, blockType, blockBody] = match;
    let config: any = {};

    try {
      const loaded = yaml.load(blockBody);
      // Empty blocks load as undefined and plain text as a string; renderers
      // expect an object, so anything else falls back to an empty config
      if (loaded && typeof loaded === 'object' && !Array.isArray(loaded)) {
        config = loaded;
      } else if (loaded !== undefined && loaded !== null) {
        console.warn(`Ignoring ${blockType} block: expected YAML key/value config`);
      }
    } catch (e) {
      console.warn(`Failed to parse ${blockType} block:`, e);
    }

    const stripped = contentWithoutNotes.replace(codeBlockRegex, '').trim();

    const parsedBlocks: SlideBlock[] = [
      { type: 'markdown', content: stripped },
      { type: blockType as 'chart' | 'animate' | 'math-visual', config }
    ];

    return { blocks: parsedBlocks, ...slideMeta };
  }

  return { blocks: [{ type: 'markdown', content: contentWithoutNotes.trim() }], ...slideMeta };
}

// Matches the opening/closing line of a fenced code block (``` or ~~~, up to 3 spaces indent)
const FENCE_REGEX = /^ {0,3}(`{3,}|~{3,})/;

/**
 * Splits deck markdown into raw slide strings on lines that are exactly `---`.
 * Separators inside fenced code blocks are ignored. Use `***` or `___` for a
 * horizontal rule within a slide.
 * @param markdown Deck markdown (without frontmatter)
 */
export function splitSlides(markdown: string): string[] {
  const slides: string[] = [];
  let current: string[] = [];
  let openFence: string | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const fence = line.match(FENCE_REGEX);
    if (fence) {
      if (openFence === null) {
        openFence = fence[1];
      } else if (fence[1][0] === openFence[0] && fence[1].length >= openFence.length) {
        openFence = null;
      }
    }

    if (openFence === null && /^---\s*$/.test(line)) {
      slides.push(current.join('\n'));
      current = [];
    } else {
      current.push(line);
    }
  }
  slides.push(current.join('\n'));

  return slides;
}

/**
 * Splits and parses deck markdown, dropping slides with no content.
 * @param markdown Deck markdown (without frontmatter)
 */
export function parseSlides(markdown: string): ParsedSlide[] {
  return splitSlides(markdown)
    .map(slide => parseSlideContent(slide))
    .filter(parsed => parsed.notes !== undefined || parsed.blocks.some(block => block.type !== 'markdown' || block.content !== ''));
}
