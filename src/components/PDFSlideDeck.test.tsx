// src/components/PDFSlideDeck.test.tsx
import { render, screen } from '@testing-library/react';
import PDFSlideDeck from './PDFSlideDeck';

// Mock console.log to suppress slide debug output
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

afterAll(() => {
  consoleSpy.mockRestore();
});

describe('PDFSlideDeck', () => {
  describe('rendering', () => {
    it('renders all slides at once', () => {
      const content = `# Slide 1

---

# Slide 2

---

# Slide 3`;

      render(<PDFSlideDeck markdownContent={content} />);

      // All slides should be visible (unlike SlideDeck which shows one at a time)
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
      expect(screen.getByText('Slide 2')).toBeInTheDocument();
      expect(screen.getByText('Slide 3')).toBeInTheDocument();
    });

    it('renders with pdf-export-container class', () => {
      const { container } = render(
        <PDFSlideDeck markdownContent="# Test" />
      );

      expect(
        container.querySelector('.pdf-export-container')
      ).toBeInTheDocument();
    });

    it('renders slide containers on the same 16:9 canvas as the on-screen deck', () => {
      const { container } = render(
        <PDFSlideDeck markdownContent="# Test" />
      );

      const slideContainer = container.querySelector('.slide-container');
      expect(slideContainer).toHaveStyle({
        width: '1440px',
        height: '810px',
      });
    });
  });

  describe('markdown content', () => {
    it('renders markdown headings', () => {
      render(<PDFSlideDeck markdownContent="# Main Title" />);

      expect(
        screen.getByRole('heading', { level: 1 })
      ).toHaveTextContent('Main Title');
    });

    it('renders markdown paragraphs', () => {
      render(<PDFSlideDeck markdownContent="This is a paragraph." />);

      expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
    });

    it('renders markdown lists', () => {
      const { container } = render(
        <PDFSlideDeck markdownContent="- Item 1\n- Item 2\n- Item 3" />
      );

      // Verify that the list is rendered
      const list = container.querySelector('ul');
      expect(list).toBeInTheDocument();
      // Check that list items exist
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('themes', () => {
    it('applies light theme by default', () => {
      const { container } = render(
        <PDFSlideDeck markdownContent="# Test" />
      );

      const slideContainer = container.querySelector('.slide-container');
      expect(slideContainer).toHaveStyle({
        backgroundColor: 'var(--slide-bg)',
      });
    });

    it('applies dark theme when specified', () => {
      const { container } = render(
        <PDFSlideDeck markdownContent="# Test" theme="dark" />
      );

      const slideContainer = container.querySelector('.slide-container');
      expect(slideContainer).toBeTruthy();
    });

    it('applies corporate theme when specified', () => {
      const { container } = render(
        <PDFSlideDeck markdownContent="# Test" theme="corporate" />
      );

      const slideContainer = container.querySelector('.slide-container');
      expect(slideContainer).toBeTruthy();
    });
  });

  describe('slide separation', () => {
    it('renders correct number of slides', () => {
      const content = `# Slide 1

---

# Slide 2`;

      const { container } = render(
        <PDFSlideDeck markdownContent={content} />
      );

      // Should have 2 slide containers for 2 content slides
      const slideContainers = container.querySelectorAll('.slide-container');
      expect(slideContainers.length).toBe(2);
    });

    it('renders slides separated by ---', () => {
      const content = `# First

---

# Second

---

# Third`;

      render(<PDFSlideDeck markdownContent={content} />);

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  describe('chart blocks', () => {
    it('renders chart in slide', () => {
      const content = `# Chart Slide

\`\`\`chart
type: bar
title: PDF Chart
data:
  - label: A
    value: 10
  - label: B
    value: 20
\`\`\``;

      render(<PDFSlideDeck markdownContent={content} />);

      expect(screen.getByText('PDF Chart')).toBeInTheDocument();
    });
  });

  describe('animation blocks', () => {
    it('renders animation block in static state', () => {
      const content = `# Animation Slide

\`\`\`animate
type: fade-in
\`\`\``;

      render(<PDFSlideDeck markdownContent={content} />);

      expect(screen.getByText(/Animation: fade-in/)).toBeInTheDocument();
    });
  });

  describe('math-visual blocks', () => {
    it('renders math-visual in export mode', async () => {
      const content = `# Math Slide

\`\`\`math-visual
type: matrix-2x2
values: [[1, 2], [3, 4]]
equation: |
  $$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$$
\`\`\``;

      const { container } = render(
        <PDFSlideDeck markdownContent={content} />
      );

      // Math visual should be rendered in export mode
      expect(
        container.querySelector('.math-visual-export')
      ).toBeInTheDocument();
    });
  });

  describe('page breaks', () => {
    it('sets page-break-after style on slides', () => {
      const { container } = render(
        <PDFSlideDeck markdownContent="# Test" />
      );

      const slideContainer = container.querySelector('.slide-container');
      expect(slideContainer).toHaveStyle({
        pageBreakAfter: 'always',
      });
    });
  });

  describe('multiple special blocks', () => {
    it('handles slide with markdown and chart', () => {
      const content = `# Mixed Slide

Some text content

\`\`\`chart
type: pie
title: Mixed Chart
data:
  - label: A
    value: 50
  - label: B
    value: 50
\`\`\``;

      render(<PDFSlideDeck markdownContent={content} />);

      expect(screen.getByText('Mixed Slide')).toBeInTheDocument();
      expect(screen.getByText('Some text content')).toBeInTheDocument();
      expect(screen.getByText('Mixed Chart')).toBeInTheDocument();
    });
  });

  describe('frontmatter', () => {
    const md = '---\ntheme: dark\n---\n# One\n---\n# Two';

    it('does not render frontmatter as a slide', () => {
      const { container } = render(<PDFSlideDeck markdownContent={md} />);

      expect(container.querySelectorAll('.slide-container')).toHaveLength(2);
      expect(screen.queryByText(/theme: dark/)).not.toBeInTheDocument();
    });

    it('applies the frontmatter theme when no theme prop is given', () => {
      const { container } = render(<PDFSlideDeck markdownContent={md} />);
      const slide = container.querySelector('.slide-container') as HTMLElement;

      expect(slide.style.getPropertyValue('--slide-bg')).toBe('#1a1a1a');
    });

    it('lets an explicit theme prop override the frontmatter theme', () => {
      const { container } = render(<PDFSlideDeck markdownContent={md} theme="light" />);
      const slide = container.querySelector('.slide-container') as HTMLElement;

      expect(slide.style.getPropertyValue('--slide-bg')).toBe('#ffffff');
    });
  });
});
