import { parseFrontmatter, injectTheme } from './parseFrontmatter';

describe('parseFrontmatter', () => {
  describe('extracting theme from frontmatter', () => {
    it('extracts theme when valid theme is specified', () => {
      const markdown = `---
theme: dark
---
# Hello World`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('dark');
      expect(result.content).toBe('# Hello World');
    });

    it('extracts corporate theme correctly', () => {
      const markdown = `---
theme: corporate
---
# Slide Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('corporate');
    });

    it('extracts warm theme correctly', () => {
      const markdown = `---
theme: warm
---
# Slide Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('warm');
    });

    it('extracts nature theme correctly', () => {
      const markdown = `---
theme: nature
---
# Slide Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('nature');
    });

    it('extracts highcontrast theme correctly', () => {
      const markdown = `---
theme: highcontrast
---
# Slide Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('highcontrast');
    });

    it('extracts light theme correctly', () => {
      const markdown = `---
theme: light
---
# Slide Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
    });

    it('preserves additional frontmatter fields while extracting theme', () => {
      const markdown = `---
theme: dark
author: John Doe
date: 2024-01-01
---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('dark');
      expect(result.content).toBe('# Content');
    });
  });

  describe('default values when no frontmatter', () => {
    it('returns default theme (light) when no frontmatter present', () => {
      const markdown = '# Hello World\n\nThis is content without frontmatter.';

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe(markdown);
    });

    it('returns default theme for empty string', () => {
      const result = parseFrontmatter('');

      expect(result.theme).toBe('light');
      expect(result.content).toBe('');
    });

    it('returns default theme when only content with dashes (not frontmatter)', () => {
      const markdown = '# Title\n\n---\n\nThis is a horizontal rule, not frontmatter.';

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe(markdown);
    });

    it('returns default theme when frontmatter has no theme field', () => {
      const markdown = `---
author: Jane Doe
date: 2024-01-01
---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe('# Content');
    });
  });

  describe('malformed YAML handling', () => {
    it('returns default theme for invalid YAML syntax', () => {
      const markdown = `---
theme: [invalid yaml
this is broken:
---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe('# Content');
    });

    it('returns default theme for invalid theme value', () => {
      const markdown = `---
theme: nonexistent-theme
---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe('# Content');
    });

    it('returns default theme when theme is a number', () => {
      const markdown = `---
theme: 123
---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe('# Content');
    });

    it('returns default theme when theme is null', () => {
      const markdown = `---
theme: null
---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe('# Content');
    });

    it('returns default theme when theme is an object', () => {
      const markdown = `---
theme:
  name: dark
  variant: blue
---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe('# Content');
    });

    it('returns default theme when theme is an array', () => {
      const markdown = `---
theme:
  - dark
  - light
---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe('# Content');
    });

    it('handles empty frontmatter block', () => {
      const markdown = `---
---
# Content`;

      const result = parseFrontmatter(markdown);

      // Empty frontmatter doesn't match the regex (no content between --- markers)
      // so the whole thing is returned as content
      expect(result.theme).toBe('light');
      expect(result.content).toBe(markdown);
    });

    it('handles frontmatter with only whitespace', () => {
      const markdown = `---

---
# Content`;

      const result = parseFrontmatter(markdown);

      expect(result.theme).toBe('light');
      expect(result.content).toBe('# Content');
    });
  });

  describe('content extraction', () => {
    it('removes frontmatter from content', () => {
      const markdown = `---
theme: dark
---
# Slide 1

Content here

---

# Slide 2

More content`;

      const result = parseFrontmatter(markdown);

      expect(result.content).not.toContain('theme: dark');
      expect(result.content).toContain('# Slide 1');
      expect(result.content).toContain('# Slide 2');
    });

    it('preserves slide separators in content', () => {
      const markdown = `---
theme: light
---
# First Slide
---
# Second Slide`;

      const result = parseFrontmatter(markdown);

      expect(result.content).toBe('# First Slide\n---\n# Second Slide');
    });

    it('handles content with multiple newlines after frontmatter', () => {
      const markdown = `---
theme: dark
---


# Content`;

      const result = parseFrontmatter(markdown);

      // The regex captures up to the closing --- and optional single newline
      // So multiple newlines are preserved in content
      expect(result.content).toBe('\n\n# Content');
    });
  });
});

describe('injectTheme', () => {
  describe('injecting theme into markdown without frontmatter', () => {
    it('adds frontmatter with theme to content without frontmatter', () => {
      const markdown = '# Hello World';

      const result = injectTheme(markdown, 'dark');

      expect(result).toContain('---');
      expect(result).toContain('theme: dark');
      expect(result).toContain('# Hello World');
    });

    it('adds frontmatter at the beginning of the document', () => {
      const markdown = '# Title\n\nSome content';

      const result = injectTheme(markdown, 'corporate');

      expect(result.startsWith('---\ntheme: corporate\n---')).toBe(true);
    });
  });

  describe('replacing theme in existing frontmatter', () => {
    it('replaces existing theme value', () => {
      const markdown = `---
theme: light
---
# Content`;

      const result = injectTheme(markdown, 'dark');

      expect(result).toContain('theme: dark');
      expect(result).not.toContain('theme: light');
    });

    it('preserves other frontmatter fields when replacing theme', () => {
      const markdown = `---
theme: light
author: John Doe
date: 2024-01-01
---
# Content`;

      const result = injectTheme(markdown, 'corporate');

      expect(result).toContain('theme: corporate');
      expect(result).toContain('author: John Doe');
      expect(result).toContain('date:');
    });

    it('adds theme to frontmatter that has no theme field', () => {
      const markdown = `---
author: Jane Doe
---
# Content`;

      const result = injectTheme(markdown, 'warm');

      expect(result).toContain('theme: warm');
      expect(result).toContain('author: Jane Doe');
    });
  });

  describe('handling malformed frontmatter', () => {
    it('replaces malformed frontmatter with valid theme frontmatter', () => {
      const markdown = `---
invalid: [yaml
broken:
---
# Content`;

      const result = injectTheme(markdown, 'nature');

      expect(result).toContain('theme: nature');
      expect(result).toContain('# Content');
    });
  });

  describe('round-trip consistency', () => {
    it('maintains theme after parse and inject cycle', () => {
      const original = `---
theme: corporate
---
# Slide Content`;

      const parsed = parseFrontmatter(original);
      const reinjected = injectTheme(parsed.content, parsed.theme);
      const reparsed = parseFrontmatter(reinjected);

      expect(reparsed.theme).toBe('corporate');
    });

    it('can change theme and maintain content', () => {
      const original = `---
theme: light
---
# Slide 1
---
# Slide 2`;

      const parsed = parseFrontmatter(original);
      const withNewTheme = injectTheme(parsed.content, 'dark');
      const reparsed = parseFrontmatter(withNewTheme);

      expect(reparsed.theme).toBe('dark');
      expect(reparsed.content).toContain('# Slide 1');
      expect(reparsed.content).toContain('# Slide 2');
    });
  });
});
