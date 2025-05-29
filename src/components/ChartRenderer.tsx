// src/components/ChartRenderer.tsx
import React from 'react';
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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#87cefa'];

const ChartRenderer: React.FC<ChartRendererProps> = ({ config }) => {
  console.log("Chart config received:", config);

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
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
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
              {data.map(( _ , index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-6">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
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