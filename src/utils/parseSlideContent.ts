// utils/parseSlideContent.ts
import yaml from 'js-yaml';

export type SlideBlock =
  | { type: 'markdown'; content: string }
  | { type: 'chart'; config: any }
  | { type: 'animate'; config: any };

/**
 * Parses a single slide's raw markdown content into structured blocks.
 * @param raw Markdown string for a single slide
 */
export function parseSlideContent(raw: string): SlideBlock[] {
  const codeBlockRegex = /```(chart|animate)\s*\n([\s\S]*?)```/m;
  const match = raw.match(codeBlockRegex);

  if (match) {
    const [, blockType, blockBody] = match;
    let config: any = {};

    try {
      config = yaml.load(blockBody);
    } catch (e) {
      console.warn(`Failed to parse ${blockType} block:`, e);
    }

    const stripped = raw.replace(codeBlockRegex, '').trim();

    const parsedBlocks: SlideBlock[] = [
      { type: 'markdown', content: stripped },
      { type: blockType as 'chart' | 'animate', config }
    ];

    console.log("Parsed Blocks:", parsedBlocks);
    return parsedBlocks;
  }

  console.log("No match found, parsed markdown-only block:", [{ type: 'markdown', content: raw.trim() }]);
  return [{ type: 'markdown', content: raw.trim() }];
}




