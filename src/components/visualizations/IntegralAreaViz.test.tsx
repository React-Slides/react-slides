// src/components/visualizations/IntegralAreaViz.test.tsx
import { render, screen } from '@testing-library/react';
import IntegralAreaViz from './IntegralAreaViz';
import { MathVisualConfig } from '../../utils/parseSlideContent';

const baseConfig: MathVisualConfig = {
  type: 'integral-area',
  equation: '',
  bounds: [0, 1],
  domain: [-1, 2],
};

describe('IntegralAreaViz', () => {
  it('shows the computed integral for a valid expression', () => {
    render(<IntegralAreaViz config={{ ...baseConfig, func: '2*x' }} />);

    expect(screen.getByText(/dx = 1$/)).toBeInTheDocument();
  });

  it('reports an invalid expression instead of an integral of 0', () => {
    render(<IntegralAreaViz config={{ ...baseConfig, func: 'x +* 2' }} />);

    expect(screen.getByText(/dx = invalid expression/)).toBeInTheDocument();
    expect(screen.queryByText(/dx = 0$/)).not.toBeInTheDocument();
  });
});
