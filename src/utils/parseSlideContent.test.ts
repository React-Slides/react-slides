// utils/parseSlideContent.test.ts
import { parseSlides, splitSlides, parseSlideContent } from './parseSlideContent';

describe('parseSlideContent', () => {
  describe('plain markdown (no special blocks)', () => {
    it('should parse simple markdown content', () => {
      const raw = '# Hello World\n\nThis is a paragraph.';
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('markdown');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toBe(
        '# Hello World\n\nThis is a paragraph.'
      );
      expect(result.notes).toBeUndefined();
    });

    it('should trim whitespace from markdown content', () => {
      const raw = '   \n\n# Title\n\n   ';
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(1);
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toBe('# Title');
    });

    it('should handle markdown with bullet lists', () => {
      const raw = '# Features\n\n- Item 1\n- Item 2\n- Item 3';
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('markdown');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toContain('- Item 1');
    });

    it('should handle markdown with code blocks that are not chart/animate', () => {
      const raw = '# Code Example\n\n```javascript\nconst x = 1;\n```';
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('markdown');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toContain('```javascript');
    });
  });

  describe('chart blocks', () => {
    it('should extract a bar chart block with YAML config', () => {
      const raw = `# Sales Data

\`\`\`chart
type: bar
title: Quarterly Sales
data:
  - label: Q1
    value: 120
  - label: Q2
    value: 150
\`\`\``;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[0].type).toBe('markdown');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toBe('# Sales Data');

      expect(result.blocks[1].type).toBe('chart');
      const chartBlock = result.blocks[1] as { type: 'chart'; config: any };
      expect(chartBlock.config.type).toBe('bar');
      expect(chartBlock.config.title).toBe('Quarterly Sales');
      expect(chartBlock.config.data).toHaveLength(2);
      expect(chartBlock.config.data[0]).toEqual({ label: 'Q1', value: 120 });
    });

    it('should extract a line chart block', () => {
      const raw = `\`\`\`chart
type: line
title: Growth Trend
data:
  - label: Jan
    value: 10
  - label: Feb
    value: 25
\`\`\``;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      const chartBlock = result.blocks[1] as { type: 'chart'; config: any };
      expect(chartBlock.config.type).toBe('line');
      expect(chartBlock.config.title).toBe('Growth Trend');
    });

    it('should extract a pie chart block', () => {
      const raw = `\`\`\`chart
type: pie
title: Market Share
data:
  - label: Product A
    value: 40
  - label: Product B
    value: 60
\`\`\``;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      const chartBlock = result.blocks[1] as { type: 'chart'; config: any };
      expect(chartBlock.config.type).toBe('pie');
    });

    it('should handle chart block with extra whitespace', () => {
      const raw = `# Title

\`\`\`chart
type: bar
data:
  - label: A
    value: 1
\`\`\`

`;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[1].type).toBe('chart');
    });
  });

  describe('animate blocks', () => {
    it('should extract fade-in animation block', () => {
      const raw = `# Animated Slide

\`\`\`animate
type: fade-in
\`\`\``;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[0].type).toBe('markdown');
      expect(result.blocks[1].type).toBe('animate');
      const animateBlock = result.blocks[1] as { type: 'animate'; config: any };
      expect(animateBlock.config.type).toBe('fade-in');
    });

    it('should extract slide-up animation block', () => {
      const raw = `\`\`\`animate
type: slide-up
\`\`\``;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      const animateBlock = result.blocks[1] as { type: 'animate'; config: any };
      expect(animateBlock.config.type).toBe('slide-up');
    });

    it('should extract bounce animation block', () => {
      const raw = `# Bouncy

\`\`\`animate
type: bounce
\`\`\``;
      const result = parseSlideContent(raw);

      const animateBlock = result.blocks[1] as { type: 'animate'; config: any };
      expect(animateBlock.config.type).toBe('bounce');
    });

    it('should extract spin animation block', () => {
      const raw = `\`\`\`animate
type: spin
\`\`\``;
      const result = parseSlideContent(raw);

      const animateBlock = result.blocks[1] as { type: 'animate'; config: any };
      expect(animateBlock.config.type).toBe('spin');
    });

    it('should extract ping animation block', () => {
      const raw = `\`\`\`animate
type: ping
\`\`\``;
      const result = parseSlideContent(raw);

      const animateBlock = result.blocks[1] as { type: 'animate'; config: any };
      expect(animateBlock.config.type).toBe('ping');
    });

    it('should extract pulse animation block', () => {
      const raw = `\`\`\`animate
type: pulse
\`\`\``;
      const result = parseSlideContent(raw);

      const animateBlock = result.blocks[1] as { type: 'animate'; config: any };
      expect(animateBlock.config.type).toBe('pulse');
    });

    it('should handle animate block with additional config properties', () => {
      const raw = `\`\`\`animate
type: fade-in
duration: 500
delay: 100
\`\`\``;
      const result = parseSlideContent(raw);

      const animateBlock = result.blocks[1] as { type: 'animate'; config: any };
      expect(animateBlock.config.type).toBe('fade-in');
      expect(animateBlock.config.duration).toBe(500);
      expect(animateBlock.config.delay).toBe(100);
    });
  });

  describe('speaker notes', () => {
    it('should extract speaker notes from content', () => {
      const raw = `# Slide Title

Some content here.

<!--notes
These are my speaker notes.
They can span multiple lines.
-->`;
      const result = parseSlideContent(raw);

      expect(result.notes).toBe('These are my speaker notes.\nThey can span multiple lines.');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).not.toContain('<!--notes');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).not.toContain('speaker notes');
    });

    it('should handle notes with chart block', () => {
      const raw = `# Chart Slide

\`\`\`chart
type: bar
data:
  - label: A
    value: 1
\`\`\`

<!--notes
Remember to explain the data.
-->`;
      const result = parseSlideContent(raw);

      expect(result.notes).toBe('Remember to explain the data.');
      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[1].type).toBe('chart');
    });

    it('should handle notes at the beginning of content', () => {
      const raw = `<!--notes
Opening notes.
-->

# Title`;
      const result = parseSlideContent(raw);

      expect(result.notes).toBe('Opening notes.');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toBe('# Title');
    });

    it('should handle case-insensitive notes tag', () => {
      const raw = `# Slide

<!--NOTES
Uppercase notes tag.
-->`;
      const result = parseSlideContent(raw);

      expect(result.notes).toBe('Uppercase notes tag.');
    });

    it('should return undefined notes when no notes present', () => {
      const raw = '# No Notes Here';
      const result = parseSlideContent(raw);

      expect(result.notes).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty content', () => {
      const raw = '';
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('markdown');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toBe('');
    });

    it('should handle whitespace-only content', () => {
      const raw = '   \n\n   \t   ';
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(1);
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toBe('');
    });

    it('should handle malformed YAML in chart block gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const raw = `# Chart

\`\`\`chart
type: bar
data:
  - label: A
    value: [invalid yaml
\`\`\``;
      const result = parseSlideContent(raw);

      // Should still parse but with empty config
      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[1].type).toBe('chart');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle malformed YAML in animate block gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const raw = `\`\`\`animate
type: fade-in
  bad indentation: here
\`\`\``;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[1].type).toBe('animate');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should only parse the first special block when multiple exist', () => {
      // Based on the regex, only one match is extracted
      const raw = `# Multiple Blocks

\`\`\`chart
type: bar
data: []
\`\`\`

\`\`\`animate
type: fade-in
\`\`\``;
      const result = parseSlideContent(raw);

      // First block (chart) should be extracted, animate block remains in markdown
      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[1].type).toBe('chart');
      // The animate block should still be in the markdown content
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toContain('```animate');
    });

    it('should handle special block with empty YAML', () => {
      const raw = `# Empty Config

\`\`\`chart
\`\`\``;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[1].type).toBe('chart');
      // Empty YAML loads as undefined; it is normalized to an empty config so renderers don't crash
      const chartBlock = result.blocks[1] as { type: 'chart'; config: any };
      expect(chartBlock.config).toEqual({});
    });

    it('should handle special block only (no other markdown)', () => {
      const raw = `\`\`\`chart
type: pie
data:
  - label: Only
    value: 100
\`\`\``;
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[0].type).toBe('markdown');
      expect((result.blocks[0] as { type: 'markdown'; content: string }).content).toBe('');
      expect(result.blocks[1].type).toBe('chart');
    });

    it('should not match chart/animate if not at start of code block', () => {
      // This tests that regular code blocks with chart/animate mentioned elsewhere are ignored
      const raw = '# Regular Code\n\n```\nchart: this is not a chart block\n```';
      const result = parseSlideContent(raw);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('markdown');
    });

    it('should preserve markdown formatting in remaining content', () => {
      const raw = `# **Bold Title**

_Italic text_ and \`inline code\`

\`\`\`animate
type: bounce
\`\`\`

> A blockquote`;
      const result = parseSlideContent(raw);

      const markdownContent = (result.blocks[0] as { type: 'markdown'; content: string }).content;
      expect(markdownContent).toContain('**Bold Title**');
      expect(markdownContent).toContain('_Italic text_');
      expect(markdownContent).toContain('`inline code`');
      expect(markdownContent).toContain('> A blockquote');
    });
  });

  describe('SlideBlock type returns', () => {
    it('should return markdown type for plain content', () => {
      const result = parseSlideContent('# Test');
      expect(result.blocks[0].type).toBe('markdown');
    });

    it('should return chart type for chart blocks', () => {
      const result = parseSlideContent('```chart\ntype: bar\n```');
      expect(result.blocks.some((b) => b.type === 'chart')).toBe(true);
    });

    it('should return animate type for animate blocks', () => {
      const result = parseSlideContent('```animate\ntype: fade-in\n```');
      expect(result.blocks.some((b) => b.type === 'animate')).toBe(true);
    });

    it('should always include markdown block even with special blocks', () => {
      const result = parseSlideContent('# Title\n\n```chart\ntype: bar\n```');
      expect(result.blocks[0].type).toBe('markdown');
      expect(result.blocks[1].type).toBe('chart');
    });
  });

  describe('ParsedSlide structure', () => {
    it('should return ParsedSlide with blocks array', () => {
      const result = parseSlideContent('# Test');
      expect(result).toHaveProperty('blocks');
      expect(Array.isArray(result.blocks)).toBe(true);
    });

    it('should return ParsedSlide with optional notes', () => {
      const withNotes = parseSlideContent('# Test\n\n<!--notes\nNotes here\n-->');
      const withoutNotes = parseSlideContent('# Test');

      expect(withNotes).toHaveProperty('notes');
      expect(withNotes.notes).toBe('Notes here');
      expect(withoutNotes.notes).toBeUndefined();
    });
  });

  describe('malformed block config', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    afterAll(() => {
      warnSpy.mockRestore();
    });

    it('returns an empty config object for an empty animate block', () => {
      const result = parseSlideContent('```animate\n```');
      expect(result.blocks[1]).toEqual({ type: 'animate', config: {} });
    });

    it('returns an empty config object when the block is plain text', () => {
      const result = parseSlideContent('```chart\njust some text\n```');
      expect(result.blocks[1]).toEqual({ type: 'chart', config: {} });
    });

    it('returns an empty config object when the block is a YAML list', () => {
      const result = parseSlideContent('```math-visual\n- 1\n- 2\n```');
      expect(result.blocks[1]).toEqual({ type: 'math-visual', config: {} });
    });

    it('returns an empty config object when the YAML is invalid', () => {
      const result = parseSlideContent('```chart\ntype: [unclosed\n```');
      expect(result.blocks[1]).toEqual({ type: 'chart', config: {} });
    });
  });

  describe('splitSlides', () => {
    it('splits on lines that are exactly ---', () => {
      expect(splitSlides('# One\n\n---\n\n# Two')).toEqual(['# One\n', '\n# Two']);
    });

    it('handles CRLF line endings and trailing whitespace on separators', () => {
      expect(splitSlides('# One\r\n---  \r\n# Two')).toEqual(['# One', '# Two']);
    });

    it('does not split on --- inside backtick fenced code blocks', () => {
      const md = '# YAML\n```yaml\na: 1\n---\nb: 2\n```\n---\n# Next';
      expect(splitSlides(md)).toEqual(['# YAML\n```yaml\na: 1\n---\nb: 2\n```', '# Next']);
    });

    it('does not split on --- inside tilde fenced code blocks', () => {
      expect(splitSlides('~~~\n---\n~~~')).toHaveLength(1);
    });

    it('only closes a fence with the same character and at least the same length', () => {
      const md = '````\n```\n---\n````\n---\n# Next';
      expect(splitSlides(md)).toHaveLength(2);
    });

    it('does not treat *** or ___ horizontal rules as separators', () => {
      expect(splitSlides('a\n\n***\n\nb\n\n___\n\nc')).toHaveLength(1);
    });

    it('does not treat longer dash runs or indented dashes as separators', () => {
      expect(splitSlides('a\n\n-----\n\nb\n   ---\nc')).toHaveLength(1);
    });
  });

  describe('parseSlides', () => {
    it('drops empty slides, including a trailing separator', () => {
      const slides = parseSlides('# One\n\n---\n\n\n\n---\n\n# Two\n\n---\n');
      expect(slides).toHaveLength(2);
    });

    it('keeps slides that only contain a special block', () => {
      const slides = parseSlides('# One\n---\n```chart\ntype: bar\n```');
      expect(slides).toHaveLength(2);
      expect(slides[1].blocks[1].type).toBe('chart');
    });

    it('keeps slides that only contain speaker notes', () => {
      expect(parseSlides('# One\n---\n<!--notes\nRemember this\n-->')).toHaveLength(2);
    });
  });
});
