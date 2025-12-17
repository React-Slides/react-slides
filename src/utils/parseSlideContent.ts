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
}

export type SlideBlock =
  | { type: 'markdown'; content: string }
  | { type: 'chart'; config: any }
  | { type: 'animate'; config: any }
  | { type: 'math-visual'; config: MathVisualConfig };

export interface ParsedSlide {
  blocks: SlideBlock[];
  notes?: string;
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
  // First extract speaker notes
  const { content: contentWithoutNotes, notes } = extractNotes(raw);

  const codeBlockRegex = /```(chart|animate|math-visual)\s*\n([\s\S]*?)```/m;
  const match = contentWithoutNotes.match(codeBlockRegex);

  if (match) {
    const [, blockType, blockBody] = match;
    let config: any = {};

    try {
      config = yaml.load(blockBody);
    } catch (e) {
      console.warn(`Failed to parse ${blockType} block:`, e);
    }

    const stripped = contentWithoutNotes.replace(codeBlockRegex, '').trim();

    const parsedBlocks: SlideBlock[] = [
      { type: 'markdown', content: stripped },
      { type: blockType as 'chart' | 'animate' | 'math-visual', config }
    ];

    console.log("Parsed Blocks:", parsedBlocks);
    return { blocks: parsedBlocks, notes };
  }

  console.log("No match found, parsed markdown-only block:", [{ type: 'markdown', content: contentWithoutNotes.trim() }]);
  return { blocks: [{ type: 'markdown', content: contentWithoutNotes.trim() }], notes };
}




