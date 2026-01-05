// Unit tests for the themes system

import { themes, DEFAULT_THEME, themeButtons, getTheme, isValidTheme } from './themes';

const EXPECTED_THEMES = ['light', 'dark', 'corporate', 'warm', 'nature', 'highcontrast'] as const;

const REQUIRED_CSS_VARIABLES = [
  '--slide-bg',
  '--slide-text',
  '--slide-accent',
  '--slide-muted',
] as const;

const CHART_COLOR_VARIABLES = [
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
] as const;

// Regex to validate CSS color values (hex, rgb, rgba, hsl, hsla, named colors)
const CSS_COLOR_REGEX = /^(#([0-9a-fA-F]{3}){1,2}|#([0-9a-fA-F]{4}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*\)|hsla\(\s*\d+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;

describe('themes', () => {
  describe('theme existence', () => {
    it('should have all expected themes', () => {
      const themeNames = Object.keys(themes);
      EXPECTED_THEMES.forEach((themeName) => {
        expect(themeNames).toContain(themeName);
      });
    });

    it('should have exactly 6 themes', () => {
      expect(Object.keys(themes)).toHaveLength(6);
    });

    it.each(EXPECTED_THEMES)('should have "%s" theme defined', (themeName) => {
      expect(themes[themeName]).toBeDefined();
    });
  });

  describe('required CSS variables', () => {
    it.each(EXPECTED_THEMES)('%s theme should have all required CSS variables', (themeName) => {
      const theme = themes[themeName];
      REQUIRED_CSS_VARIABLES.forEach((variable) => {
        expect(theme).toHaveProperty(variable);
        expect(theme[variable]).toBeDefined();
      });
    });

    it.each(EXPECTED_THEMES)('%s theme should have --slide-bg', (themeName) => {
      expect(themes[themeName]['--slide-bg']).toBeDefined();
    });

    it.each(EXPECTED_THEMES)('%s theme should have --slide-text', (themeName) => {
      expect(themes[themeName]['--slide-text']).toBeDefined();
    });

    it.each(EXPECTED_THEMES)('%s theme should have --slide-accent', (themeName) => {
      expect(themes[themeName]['--slide-accent']).toBeDefined();
    });

    it.each(EXPECTED_THEMES)('%s theme should have --slide-muted', (themeName) => {
      expect(themes[themeName]['--slide-muted']).toBeDefined();
    });
  });

  describe('chart colors', () => {
    it.each(EXPECTED_THEMES)('%s theme should have all chart color variables', (themeName) => {
      const theme = themes[themeName];
      CHART_COLOR_VARIABLES.forEach((variable) => {
        expect(theme).toHaveProperty(variable);
        expect(theme[variable]).toBeDefined();
      });
    });

    it.each(CHART_COLOR_VARIABLES)('all themes should have %s defined', (chartVar) => {
      EXPECTED_THEMES.forEach((themeName) => {
        expect(themes[themeName][chartVar]).toBeDefined();
      });
    });
  });

  describe('CSS color value validation', () => {
    it.each(EXPECTED_THEMES)('%s theme should have valid CSS color values for all variables', (themeName) => {
      const theme = themes[themeName];
      const allVariables = [...REQUIRED_CSS_VARIABLES, ...CHART_COLOR_VARIABLES];

      allVariables.forEach((variable) => {
        const value = theme[variable];
        expect(value).toMatch(CSS_COLOR_REGEX);
      });
    });

    it('all theme colors should be valid hex colors', () => {
      Object.entries(themes).forEach(([_themeName, theme]) => {
        Object.entries(theme).forEach(([_variable, value]) => {
          expect(value).toMatch(CSS_COLOR_REGEX);
        });
      });
    });
  });
});

describe('DEFAULT_THEME', () => {
  it('should be "light"', () => {
    expect(DEFAULT_THEME).toBe('light');
  });

  it('should be a valid theme name', () => {
    expect(themes[DEFAULT_THEME]).toBeDefined();
  });
});

describe('themeButtons', () => {
  it('should have entries for all themes', () => {
    const buttonNames = themeButtons.map((btn) => btn.name);
    EXPECTED_THEMES.forEach((themeName) => {
      expect(buttonNames).toContain(themeName);
    });
  });

  it('should have exactly 6 theme buttons', () => {
    expect(themeButtons).toHaveLength(6);
  });

  it('each button should have name, label, and color properties', () => {
    themeButtons.forEach((button) => {
      expect(button).toHaveProperty('name');
      expect(button).toHaveProperty('label');
      expect(button).toHaveProperty('color');
    });
  });

  it('each button color should be a valid CSS color', () => {
    themeButtons.forEach((button) => {
      expect(button.color).toMatch(CSS_COLOR_REGEX);
    });
  });

  it('each button name should correspond to an existing theme', () => {
    themeButtons.forEach((button) => {
      expect(themes[button.name]).toBeDefined();
    });
  });
});

describe('getTheme', () => {
  it('should return the correct theme for valid theme names', () => {
    EXPECTED_THEMES.forEach((themeName) => {
      const result = getTheme(themeName);
      expect(result).toEqual(themes[themeName]);
    });
  });

  it('should return light theme for undefined', () => {
    const result = getTheme(undefined);
    expect(result).toEqual(themes.light);
  });

  it('should return light theme for invalid theme name', () => {
    const result = getTheme('invalid-theme');
    expect(result).toEqual(themes.light);
  });

  it('should return light theme for empty string', () => {
    const result = getTheme('');
    expect(result).toEqual(themes.light);
  });

  it('should be case-sensitive', () => {
    const result = getTheme('Light');
    expect(result).toEqual(themes.light); // Falls back to default
  });
});

describe('isValidTheme', () => {
  it('should return true for all valid theme names', () => {
    EXPECTED_THEMES.forEach((themeName) => {
      expect(isValidTheme(themeName)).toBe(true);
    });
  });

  it('should return false for undefined', () => {
    expect(isValidTheme(undefined)).toBe(false);
  });

  it('should return false for invalid theme name', () => {
    expect(isValidTheme('invalid-theme')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidTheme('')).toBe(false);
  });

  it('should be case-sensitive', () => {
    expect(isValidTheme('Light')).toBe(false);
    expect(isValidTheme('DARK')).toBe(false);
  });

  it('should return false for similar but incorrect names', () => {
    expect(isValidTheme('lights')).toBe(false);
    expect(isValidTheme('Dark')).toBe(false);
    expect(isValidTheme('high-contrast')).toBe(false);
  });
});

describe('theme color contrast (basic checks)', () => {
  it('light theme should have light background and dark text', () => {
    const { '--slide-bg': bg, '--slide-text': text } = themes.light;
    // Light background should start with #f or be white
    expect(bg).toMatch(/^#(f|e|d|c|ffffff)/i);
    // Dark text should start with #1, #2, #3 or be black
    expect(text).toMatch(/^#(0|1|2|3|000000)/i);
  });

  it('dark theme should have dark background and light text', () => {
    const { '--slide-bg': bg, '--slide-text': text } = themes.dark;
    // Dark background should start with #1, #2, #3 or be black
    expect(bg).toMatch(/^#(0|1|2|3|000000)/i);
    // Light text should start with #f, #e, #d or be white
    expect(text).toMatch(/^#(f|e|d|ffffff)/i);
  });

  it('highcontrast theme should have maximum contrast (black bg, white text)', () => {
    expect(themes.highcontrast['--slide-bg']).toBe('#000000');
    expect(themes.highcontrast['--slide-text']).toBe('#ffffff');
  });
});
