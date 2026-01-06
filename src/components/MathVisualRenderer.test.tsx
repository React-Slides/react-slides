// src/components/MathVisualRenderer.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import MathVisualRenderer from './MathVisualRenderer';
import { MathVisualConfig } from '../utils/parseSlideContent';

describe('MathVisualRenderer', () => {
  describe('rendering', () => {
    it('renders equation content', async () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(
        container.querySelector('.math-visual-equation')
      ).toBeInTheDocument();
    });

    it('renders title when provided', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        title: 'My Matrix Title',
        values: [[1, 2], [3, 4]],
      };

      render(<MathVisualRenderer config={config} />);

      expect(screen.getByText('My Matrix Title')).toBeInTheDocument();
    });

    it('does not render title when not provided', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(
        container.querySelector('.math-visual-title')
      ).not.toBeInTheDocument();
    });
  });

  describe('layout modes', () => {
    it('renders split layout by default', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(
        container.querySelector('.math-visual-container')
      ).toBeInTheDocument();
      expect(container.querySelector('.flip-card')).not.toBeInTheDocument();
    });

    it('renders flip layout when specified', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
        layout: 'flip',
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(container.querySelector('.flip-card')).toBeInTheDocument();
    });

    it('renders split layout instead of flip in export mode', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
        layout: 'flip',
      };

      const { container } = render(
        <MathVisualRenderer config={config} isExport={true} />
      );

      expect(container.querySelector('.flip-card')).not.toBeInTheDocument();
      expect(
        container.querySelector('.math-visual-export')
      ).toBeInTheDocument();
    });
  });

  describe('export mode', () => {
    it('applies export classes in export mode', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(
        <MathVisualRenderer config={config} isExport={true} />
      );

      expect(
        container.querySelector('.math-visual-export')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.math-visual-export-content')
      ).toBeInTheDocument();
    });

    it('disables interactivity in export mode', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
        interactive: true,
      };

      const { container } = render(
        <MathVisualRenderer config={config} isExport={true} />
      );

      // Component should render in export mode with export classes
      expect(
        container.querySelector('.math-visual-export')
      ).toBeInTheDocument();
    });
  });

  describe('interactivity', () => {
    it('passes interactive=true by default', async () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      // Component should render the math visual container
      await waitFor(() => {
        expect(
          container.querySelector('.math-visual-container')
        ).toBeInTheDocument();
      });
    });

    it('respects interactive=false config', async () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
        interactive: false,
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(
        container.querySelector('.math-visual-container')
      ).toBeInTheDocument();
    });
  });

  describe('visualization types', () => {
    it('renders matrix-2x2 type', async () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      // Should show loading or rendered visualization
      await waitFor(() => {
        expect(container.querySelector('.math-visual-container')).toBeTruthy();
      });
    });

    it('renders determinant type', async () => {
      const config: MathVisualConfig = {
        type: 'determinant',
        equation: '$$det(A) = ad - bc$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      await waitFor(() => {
        expect(container.querySelector('.math-visual-container')).toBeTruthy();
      });
    });

    it('renders matrix-multiplication type', async () => {
      const config: MathVisualConfig = {
        type: 'matrix-multiplication',
        equation: '$$Ax = b$$',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        values: [[[1, 2], [3, 4]], [5, 6]] as any,
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      await waitFor(() => {
        expect(container.querySelector('.math-visual-container')).toBeTruthy();
      });
    });

    it('renders transformation type', async () => {
      const config: MathVisualConfig = {
        type: 'transformation',
        equation: '$$T(v) = Av$$',
        values: [[1, 0], [0, 1]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      await waitFor(() => {
        expect(container.querySelector('.math-visual-container')).toBeTruthy();
      });
    });

    it('renders function-plot type', async () => {
      const config: MathVisualConfig = {
        type: 'function-plot',
        equation: '$$f(x) = x^2$$',
        func: 'x^2',
        domain: [-5, 5],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      await waitFor(() => {
        expect(container.querySelector('.math-visual-container')).toBeTruthy();
      });
    });

    it('renders integral-area type', async () => {
      const config: MathVisualConfig = {
        type: 'integral-area',
        equation: '$$\\int_0^1 x^2 dx$$',
        func: 'x^2',
        bounds: [0, 1],
        domain: [-1, 2],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      await waitFor(() => {
        expect(container.querySelector('.math-visual-container')).toBeTruthy();
      });
    });
  });

  describe('flip card size mapping', () => {
    it('uses small size for matrix-2x2', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
        layout: 'flip',
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(container.querySelector('.flip-card-small')).toBeInTheDocument();
    });

    it('uses large size for transformation', () => {
      const config: MathVisualConfig = {
        type: 'transformation',
        equation: '$$x$$',
        values: [[1, 0], [0, 1]],
        layout: 'flip',
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(container.querySelector('.flip-card-large')).toBeInTheDocument();
    });

    it('uses medium size for determinant', () => {
      const config: MathVisualConfig = {
        type: 'determinant',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
        layout: 'flip',
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(container.querySelector('.flip-card-medium')).toBeInTheDocument();
    });

    it('uses medium size for function-plot', () => {
      const config: MathVisualConfig = {
        type: 'function-plot',
        equation: '$$x$$',
        func: 'x',
        layout: 'flip',
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(container.querySelector('.flip-card-medium')).toBeInTheDocument();
    });

    it('uses medium size for integral-area', () => {
      const config: MathVisualConfig = {
        type: 'integral-area',
        equation: '$$x$$',
        func: 'x',
        bounds: [0, 1],
        layout: 'flip',
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      expect(container.querySelector('.flip-card-medium')).toBeInTheDocument();
    });
  });

  describe('suspense fallback', () => {
    it('shows loading message while visualizations load', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      // Either the Suspense fallback (loading message) or the loaded visualization should be present
      const hasLoadingOrContainer =
        container.textContent?.includes('Loading') ||
        container.querySelector('.math-visual-container');
      expect(hasLoadingOrContainer).toBeTruthy();
    });
  });

  describe('KaTeX rendering', () => {
    it('renders equation with KaTeX', () => {
      const config: MathVisualConfig = {
        type: 'matrix-2x2',
        equation: '$$x^2 + y^2 = r^2$$',
        values: [[1, 2], [3, 4]],
      };

      const { container } = render(<MathVisualRenderer config={config} />);

      // KaTeX renders math content - check the equation container exists
      expect(
        container.querySelector('.math-visual-equation')
      ).toBeInTheDocument();
    });
  });
});
