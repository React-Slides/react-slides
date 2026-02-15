// src/components/MarkdownSlide.test.tsx
import { render, screen } from '@testing-library/react';
import MarkdownSlide from './MarkdownSlide';


describe('MarkdownSlide', () => {
  describe('rendering', () => {
    it('renders basic markdown content', () => {
      render(
        <MarkdownSlide content="# Hello World" index={0} isActive={true} />
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Hello World'
      );
    });

    it('renders paragraph content', () => {
      render(
        <MarkdownSlide
          content="This is a paragraph."
          index={0}
          isActive={true}
        />
      );

      expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
    });

    it('renders multiple heading levels', () => {
      const content = `# H1

## H2

### H3`;

      render(<MarkdownSlide content={content} index={0} isActive={true} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('H1');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('H2');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('H3');
    });

    it('renders bullet lists', () => {
      const content = `- Item 1
- Item 2
- Item 3`;

      render(<MarkdownSlide content={content} index={0} isActive={true} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders numbered lists', () => {
      const content = `1. First
2. Second
3. Third`;

      render(<MarkdownSlide content={content} index={0} isActive={true} />);

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('renders bold and italic text', () => {
      render(
        <MarkdownSlide
          content="**bold** and *italic*"
          index={0}
          isActive={true}
        />
      );

      expect(screen.getByText('bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
    });

    it('renders inline code', () => {
      render(
        <MarkdownSlide
          content="Use `console.log()` for debugging"
          index={0}
          isActive={true}
        />
      );

      expect(screen.getByText('console.log()')).toBeInTheDocument();
    });

    it('renders code blocks', () => {
      render(
        <MarkdownSlide
          content="```javascript\nconst x = 1;\n```"
          index={0}
          isActive={true}
        />
      );

      expect(screen.getByText(/const x = 1/)).toBeInTheDocument();
    });

    it('renders blockquotes', () => {
      render(
        <MarkdownSlide
          content="> This is a quote"
          index={0}
          isActive={true}
        />
      );

      expect(screen.getByText('This is a quote')).toBeInTheDocument();
    });

    it('renders links', () => {
      render(
        <MarkdownSlide
          content="[Link Text](https://example.com)"
          index={0}
          isActive={true}
        />
      );

      const link = screen.getByRole('link', { name: 'Link Text' });
      expect(link).toHaveAttribute('href', 'https://example.com');
    });
  });

  describe('GFM features', () => {
    it('renders strikethrough text', () => {
      render(
        <MarkdownSlide
          content="~~strikethrough~~"
          index={0}
          isActive={true}
        />
      );

      expect(screen.getByText('strikethrough')).toBeInTheDocument();
    });

    it('renders tables', () => {
      const tableMarkdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
      `.trim();

      render(
        <MarkdownSlide content={tableMarkdown} index={0} isActive={true} />
      );

      expect(screen.getByText('Header 1')).toBeInTheDocument();
      expect(screen.getByText('Cell 1')).toBeInTheDocument();
    });

    it('renders task lists', () => {
      const content = `- [x] Done
- [ ] Not done`;

      const { container } = render(
        <MarkdownSlide content={content} index={0} isActive={true} />
      );

      // Task lists render with checkboxes
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(2);
      // First checkbox should be checked
      expect(checkboxes[0]).toBeChecked();
      // Second checkbox should not be checked
      expect(checkboxes[1]).not.toBeChecked();
    });
  });

  describe('math rendering', () => {
    it('renders inline math', () => {
      render(
        <MarkdownSlide
          content="The equation $E = mc^2$ is famous."
          index={0}
          isActive={true}
        />
      );

      // KaTeX renders math equations - check that content exists
      expect(screen.getByText(/The equation/)).toBeInTheDocument();
    });

    it('renders display math', () => {
      render(
        <MarkdownSlide
          content="$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$"
          index={0}
          isActive={true}
        />
      );

      // The component should render without crashing
      const { container } = render(
        <MarkdownSlide
          content="$$x^2$$"
          index={0}
          isActive={true}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('CSS classes', () => {
    it('applies prose classes', () => {
      const { container } = render(
        <MarkdownSlide content="# Test" index={0} isActive={true} />
      );

      expect(container.querySelector('.prose')).toBeInTheDocument();
      expect(container.querySelector('.prose-lg')).toBeInTheDocument();
    });
  });

  describe('empty content', () => {
    it('handles empty content gracefully', () => {
      const { container } = render(
        <MarkdownSlide content="" index={0} isActive={true} />
      );

      expect(container).toBeTruthy();
    });

    it('handles whitespace-only content', () => {
      const { container } = render(
        <MarkdownSlide content="   \n\n   " index={0} isActive={true} />
      );

      expect(container).toBeTruthy();
    });
  });
});
