// src/components/ChartRenderer.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: ChartDataPoint[];
  animation?: {
    duration?: number;
    easing?: string;
  };
}

interface ChartRendererProps {
  config: ChartConfig;
}

// Default colors (Okabe-Ito colorblind-safe palette)
const DEFAULT_COLORS = ['#0072B2', '#E69F00', '#009E73', '#CC79A7', '#56B4E9'];

const ChartRenderer: React.FC<ChartRendererProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);

  // Get chart colors from CSS variables when component mounts
  useEffect(() => {
    if (containerRef.current) {
      const styles = getComputedStyle(containerRef.current);
      const chartColors = [
        styles.getPropertyValue('--chart-1').trim(),
        styles.getPropertyValue('--chart-2').trim(),
        styles.getPropertyValue('--chart-3').trim(),
        styles.getPropertyValue('--chart-4').trim(),
        styles.getPropertyValue('--chart-5').trim(),
      ].map((color, index) => color || DEFAULT_COLORS[index]);

      setColors(chartColors);
    }
  }, []);

  const { type, title, data } = config;

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={colors[1]} strokeWidth={2} />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg shadow-sm border p-6"
      style={{
        backgroundColor: 'var(--slide-bg, #ffffff)',
      }}
    >
      {title && (
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: 'var(--slide-text, #1a1a1a)' }}
        >
          {title}
        </h2>
      )}
      <div className="w-full" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartRenderer;
