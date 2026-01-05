// src/components/ChartRenderer.test.tsx
import { render, screen } from '@testing-library/react';
import ChartRenderer from './ChartRenderer';

// Mock ResizeObserver which Recharts ResponsiveContainer requires
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock getBoundingClientRect for ResponsiveContainer
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 500,
  height: 400,
  top: 0,
  left: 0,
  bottom: 400,
  right: 500,
  x: 0,
  y: 0,
  toJSON: () => {},
}));

const sampleData = [
  { label: 'Q1', value: 100 },
  { label: 'Q2', value: 200 },
  { label: 'Q3', value: 150 },
];

describe('ChartRenderer', () => {
  describe('Bar Chart', () => {
    it('renders without crashing for bar chart type', () => {
      const config = {
        type: 'bar' as const,
        title: 'Bar Chart Test',
        data: sampleData,
      };

      const { container } = render(<ChartRenderer config={config} />);
      expect(container).toBeTruthy();
    });
  });

  describe('Line Chart', () => {
    it('renders without crashing for line chart type', () => {
      const config = {
        type: 'line' as const,
        title: 'Line Chart Test',
        data: sampleData,
      };

      const { container } = render(<ChartRenderer config={config} />);
      expect(container).toBeTruthy();
    });
  });

  describe('Pie Chart', () => {
    it('renders without crashing for pie chart type', () => {
      const config = {
        type: 'pie' as const,
        title: 'Pie Chart Test',
        data: sampleData,
      };

      const { container } = render(<ChartRenderer config={config} />);
      expect(container).toBeTruthy();
    });
  });

  describe('Chart Title', () => {
    it('displays chart title when provided', () => {
      const config = {
        type: 'bar' as const,
        title: 'My Custom Chart Title',
        data: sampleData,
      };

      render(<ChartRenderer config={config} />);
      expect(screen.getByText('My Custom Chart Title')).toBeInTheDocument();
    });

    it('does not render title element when title is empty', () => {
      const config = {
        type: 'bar' as const,
        title: '',
        data: sampleData,
      };

      render(<ChartRenderer config={config} />);
      const headings = screen.queryAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(0);
    });
  });

  describe('Empty Data', () => {
    it('handles empty data array for bar chart', () => {
      const config = {
        type: 'bar' as const,
        title: 'Empty Bar Chart',
        data: [],
      };

      const { container } = render(<ChartRenderer config={config} />);
      expect(container).toBeTruthy();
      expect(screen.getByText('Empty Bar Chart')).toBeInTheDocument();
    });

    it('handles empty data array for line chart', () => {
      const config = {
        type: 'line' as const,
        title: 'Empty Line Chart',
        data: [],
      };

      const { container } = render(<ChartRenderer config={config} />);
      expect(container).toBeTruthy();
      expect(screen.getByText('Empty Line Chart')).toBeInTheDocument();
    });

    it('handles empty data array for pie chart', () => {
      const config = {
        type: 'pie' as const,
        title: 'Empty Pie Chart',
        data: [],
      };

      const { container } = render(<ChartRenderer config={config} />);
      expect(container).toBeTruthy();
      expect(screen.getByText('Empty Pie Chart')).toBeInTheDocument();
    });
  });

  describe('Unsupported Chart Type', () => {
    it('displays error message for unsupported chart type', () => {
      const config = {
        type: 'radar' as unknown as 'bar' | 'line' | 'pie',
        title: 'Unsupported Chart',
        data: sampleData,
      };

      render(<ChartRenderer config={config} />);
      expect(screen.getByText('Unsupported chart type: radar')).toBeInTheDocument();
    });
  });
});
