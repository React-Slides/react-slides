// src/components/SlideDeck.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SlideDeck from './SlideDeck';

// Mock console.log to suppress slide debug output
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

afterAll(() => {
  consoleSpy.mockRestore();
});

describe('SlideDeck', () => {
  describe('loading state', () => {
    it('shows loading message when content is empty', () => {
      render(<SlideDeck markdownContent="" />);

      expect(screen.getByText('Loading slides...')).toBeInTheDocument();
    });

    it('shows loading message when content is undefined', () => {
      render(<SlideDeck />);

      expect(screen.getByText('Loading slides...')).toBeInTheDocument();
    });
  });

  describe('rendering slides', () => {
    it('renders a single slide', () => {
      render(<SlideDeck markdownContent="# Hello World" />);

      expect(
        screen.getByRole('heading', { level: 1 })
      ).toHaveTextContent('Hello World');
    });

    it('renders multiple slides separated by ---', () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      // Initially shows first slide
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
    });

    it('filters out empty slides', () => {
      const content = `# Slide 1

---



---

# Slide 2`;

      const { container } = render(<SlideDeck markdownContent={content} />);

      // Should only have 2 slides, not 3
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
      expect((container.querySelector('.bg-gray-200 > div') as HTMLElement).style.width).toBe('50%');
    });
  });

  describe('navigation buttons', () => {
    it('renders navigation buttons', () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      // Find buttons by their SVG content (ChevronLeft and ChevronRight)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(2);
    });

    it('disables previous button on first slide', () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      const buttons = screen.getAllByRole('button');
      const prevButton = buttons[0];

      expect(prevButton).toBeDisabled();
    });

    it('enables next button when more slides exist', () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[1];

      expect(nextButton).not.toBeDisabled();
    });

    it('navigates to next slide when next button is clicked', async () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[1];

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });
    });

    it('navigates to previous slide when prev button is clicked', async () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[1];
      const prevButton = buttons[0];

      // Go to slide 2
      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });

      // Go back to slide 1
      fireEvent.click(prevButton);
      await waitFor(() => {
        expect(screen.getByText('Slide 1')).toBeInTheDocument();
      });
    });

    it('disables next button on last slide', async () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[1];

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });
    });
  });

  describe('keyboard navigation', () => {
    it('navigates to next slide with ArrowRight key', async () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      fireEvent.keyDown(window, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });
    });

    it('navigates to previous slide with ArrowLeft key', async () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      // Go to slide 2
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });

      // Go back to slide 1
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      await waitFor(() => {
        expect(screen.getByText('Slide 1')).toBeInTheDocument();
      });
    });

    it('does not navigate past first slide with ArrowLeft', () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      // Press left arrow multiple times
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      // Should still be on slide 1
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
    });

    it('does not navigate past last slide with ArrowRight', async () => {
      const content = `# Slide 1

---

# Slide 2`;

      render(<SlideDeck markdownContent={content} />);

      // Press right arrow multiple times
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });
    });
  });

  describe('rapid navigation', () => {
    it('stops at the last slide when several key presses arrive before a re-render', () => {
      render(<SlideDeck markdownContent={'# Slide 1\n\n---\n\n# Slide 2\n\n---\n\n# Slide 3'} />);

      act(() => {
        for (let i = 0; i < 10; i++) {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        }
      });

      expect(screen.getByText('Slide 3')).toBeInTheDocument();
    });

    it('stops at the first slide on rapid ArrowLeft presses', () => {
      render(<SlideDeck markdownContent={'# Slide 1\n\n---\n\n# Slide 2'} />);
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      act(() => {
        for (let i = 0; i < 10; i++) {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        }
      });

      expect(screen.getByText('Slide 1')).toBeInTheDocument();
    });
  });

  describe('themes', () => {
    it('applies default light theme', () => {
      const { container } = render(
        <SlideDeck markdownContent="# Test" theme="light" />
      );

      const slideContainer = container.querySelector('.h-screen');
      expect(slideContainer).toHaveStyle({
        backgroundColor: 'var(--slide-bg)',
      });
    });

    it('applies dark theme', () => {
      const { container } = render(
        <SlideDeck markdownContent="# Test" theme="dark" />
      );

      const slideContainer = container.querySelector('.h-screen');
      expect(slideContainer).toBeTruthy();
    });
  });

  describe('progress bar', () => {
    it('renders progress bar', () => {
      const { container } = render(
        <SlideDeck markdownContent="# Slide 1\n---\n# Slide 2" />
      );

      const progressBar = container.querySelector('.bg-gray-200');
      expect(progressBar).toBeInTheDocument();
    });

    it('updates progress bar width on navigation', async () => {
      const content = `# Slide 1

---

# Slide 2`;

      const { container } = render(<SlideDeck markdownContent={content} />);

      const progressIndicator = container.querySelector(
        '.bg-gray-200 > div'
      ) as HTMLElement;

      // On slide 1 of 2, width should be 50%
      expect(progressIndicator.style.width).toBe('50%');

      // Navigate to slide 2
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(progressIndicator.style.width).toBe('100%');
      });
    });
  });

  describe('chart blocks', () => {
    it('renders chart block when present', async () => {
      const content = `# Chart Slide

\`\`\`chart
type: bar
title: Test Chart
data:
  - label: A
    value: 10
\`\`\``;

      render(<SlideDeck markdownContent={content} />);

      await waitFor(() => {
        expect(screen.getByText('Test Chart')).toBeInTheDocument();
      });
    });
  });

  describe('animation blocks', () => {
    it('renders animation block when present', () => {
      const content = `# Animation Slide

\`\`\`animate
type: fade-in
\`\`\``;

      render(<SlideDeck markdownContent={content} />);

      expect(screen.getByText(/Animation:/)).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('removes keyboard event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <SlideDeck markdownContent="# Test" />
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('malformed content', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    afterAll(() => {
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('does not crash on an empty chart block', () => {
      render(<SlideDeck markdownContent={'# Title\n```chart\n```'} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
    });

    it('does not crash on an empty animate block', () => {
      render(<SlideDeck markdownContent={'# Title\n```animate\n```'} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
    });

    it('does not crash on a pie chart without data', () => {
      render(<SlideDeck markdownContent={'# Title\n```chart\ntype: pie\n```'} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
    });
  });

  describe('content updates', () => {
    it('clamps the current slide when the deck shrinks', () => {
      const { rerender } = render(<SlideDeck markdownContent={'# One\n---\n# Two\n---\n# Three'} />);

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('Three')).toBeInTheDocument();

      rerender(<SlideDeck markdownContent={'# Only'} />);
      expect(screen.getByText('Only')).toBeInTheDocument();
    });

    it('keeps the current slide when it is still in range', () => {
      const { rerender } = render(<SlideDeck markdownContent={'# One\n---\n# Two'} />);

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      rerender(<SlideDeck markdownContent={'# One\n---\n# Two edited\n---\n# Three'} />);

      expect(screen.getByText('Two edited')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation from form fields', () => {
    const content = '# One\n---\n# Two';

    it.each(['input', 'textarea', 'select'])('ignores arrow keys typed into a %s', tag => {
      render(<SlideDeck markdownContent={content} />);
      const field = document.createElement(tag);
      document.body.appendChild(field);

      fireEvent.keyDown(field, { key: 'ArrowRight' });

      expect(screen.getByText('One')).toBeInTheDocument();
      field.remove();
    });

    it('ignores arrow keys in contentEditable elements', () => {
      render(<SlideDeck markdownContent={content} />);
      const editable = document.createElement('div');
      editable.contentEditable = 'true';
      // jsdom does not implement isContentEditable
      Object.defineProperty(editable, 'isContentEditable', { value: true });
      document.body.appendChild(editable);

      fireEvent.keyDown(editable, { key: 'ArrowRight' });

      expect(screen.getByText('One')).toBeInTheDocument();
      editable.remove();
    });

    it.each(['altKey', 'ctrlKey', 'metaKey'])('ignores arrow keys with %s held', modifier => {
      render(<SlideDeck markdownContent={content} />);

      fireEvent.keyDown(window, { key: 'ArrowRight', [modifier]: true });

      expect(screen.getByText('One')).toBeInTheDocument();
    });

    it('still navigates when arrow keys come from a button', () => {
      render(<SlideDeck markdownContent={content} />);

      fireEvent.keyDown(screen.getAllByRole('button')[0], { key: 'ArrowRight' });

      expect(screen.getByText('Two')).toBeInTheDocument();
    });
  });

  describe('frontmatter', () => {
    const md = '---\ntheme: dark\n---\n# One\n---\n# Two';

    it('does not render frontmatter as a slide', () => {
      const { container } = render(<SlideDeck markdownContent={md} />);

      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.queryByText(/theme: dark/)).not.toBeInTheDocument();
      expect((container.querySelector('.bg-gray-200 > div') as HTMLElement).style.width).toBe('50%');
    });

    it('does not render CRLF frontmatter as a slide', () => {
      const { container } = render(<SlideDeck markdownContent={md.replace(/\n/g, '\r\n')} />);

      expect(screen.queryByText(/theme: dark/)).not.toBeInTheDocument();
      expect((container.querySelector('.bg-gray-200 > div') as HTMLElement).style.width).toBe('50%');
      expect((container.firstChild as HTMLElement).style.getPropertyValue('--slide-bg')).toBe('#1a1a1a');
    });

    it('applies the frontmatter theme when no theme prop is given', () => {
      const { container } = render(<SlideDeck markdownContent={md} />);

      expect((container.firstChild as HTMLElement).style.getPropertyValue('--slide-bg')).toBe('#1a1a1a');
    });

    it('lets an explicit theme prop override the frontmatter theme', () => {
      const { container } = render(<SlideDeck markdownContent={md} theme="light" />);

      expect((container.firstChild as HTMLElement).style.getPropertyValue('--slide-bg')).toBe('#ffffff');
    });

    it('does not split on --- inside code blocks', () => {
      const { container } = render(<SlideDeck markdownContent={'# One\n```yaml\na: 1\n---\nb: 2\n```'} />);

      expect((container.querySelector('.bg-gray-200 > div') as HTMLElement).style.width).toBe('100%');
    });
  });

  describe('fixed 16:9 canvas', () => {
    it('lays slides out on a fixed-size canvas so they look the same on any screen', () => {
      render(<SlideDeck markdownContent="# Slide 1" />);

      const canvas = screen.getByTestId('slide-canvas');
      expect(canvas).toHaveStyle({ width: '1440px', height: '810px' });
      expect(canvas.style.transform).toMatch(/scale\(/);
      expect(canvas).toHaveTextContent('Slide 1');
    });

    it('toggles fullscreen with the F key', () => {
      const requestFullscreen = vi.fn().mockResolvedValue(undefined);
      document.documentElement.requestFullscreen = requestFullscreen;

      render(<SlideDeck markdownContent="# Slide 1" />);
      fireEvent.keyDown(window, { key: 'f' });

      expect(requestFullscreen).toHaveBeenCalledTimes(1);
    });
  });

  describe('slide layouts', () => {
    it('applies the title layout to a slide marked with <!-- layout: title -->', () => {
      render(<SlideDeck markdownContent={'<!-- layout: title -->\n# Deck\n## Do It Now'} />);

      const content = screen.getByTestId('slide-canvas').firstElementChild;
      expect(content).toHaveClass('slide-layout-title');
      expect(content).toHaveAttribute('data-layout', 'title');
      expect(screen.queryByText(/layout:/)).not.toBeInTheDocument();
    });
  });
});
