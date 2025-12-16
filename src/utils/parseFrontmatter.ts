// utils/parseFrontmatter.ts
// Utilities for parsing and injecting YAML frontmatter in markdown

import yaml from 'js-yaml';
import { ThemeName, DEFAULT_THEME, isValidTheme } from './themes';

export interface ParsedMarkdown {
  theme: ThemeName;
  content: string; // markdown without frontmatter
}

// Regex to match YAML frontmatter at start of document
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n?/;

/**
 * Parse frontmatter from markdown and extract theme
 * Returns theme name and content without frontmatter
 */
export function parseFrontmatter(markdown: string): ParsedMarkdown {
  const match = markdown.match(FRONTMATTER_REGEX);

  if (!match) {
    return {
      theme: DEFAULT_THEME,
      content: markdown,
    };
  }

  const frontmatterYaml = match[1];
  const content = markdown.slice(match[0].length);

  try {
    const frontmatter = yaml.load(frontmatterYaml) as Record<string, unknown>;
    const themeName = frontmatter?.theme as string | undefined;

    return {
      theme: isValidTheme(themeName) ? themeName : DEFAULT_THEME,
      content,
    };
  } catch (e) {
    console.warn('Failed to parse frontmatter:', e);
    return {
      theme: DEFAULT_THEME,
      content,
    };
  }
}

/**
 * Inject or replace theme in markdown frontmatter
 * If frontmatter exists, updates the theme value
 * If no frontmatter, adds one at the start
 */
export function injectTheme(markdown: string, theme: ThemeName): string {
  const match = markdown.match(FRONTMATTER_REGEX);

  if (!match) {
    // No frontmatter - add one
    return `---\ntheme: ${theme}\n---\n\n${markdown}`;
  }

  // Frontmatter exists - parse and update theme
  const frontmatterYaml = match[1];
  const content = markdown.slice(match[0].length);

  try {
    const frontmatter = yaml.load(frontmatterYaml) as Record<string, unknown> || {};
    frontmatter.theme = theme;
    const newFrontmatter = yaml.dump(frontmatter).trim();
    return `---\n${newFrontmatter}\n---\n\n${content}`;
  } catch (e) {
    // If parsing fails, replace entire frontmatter
    return `---\ntheme: ${theme}\n---\n\n${content}`;
  }
}
