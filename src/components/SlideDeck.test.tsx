// src/components/SlideDeck.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

      render(<SlideDeck markdownContent={content} />);

      // Should only have 2 slides, not 3
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
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
});
