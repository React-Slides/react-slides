import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { VisualizationProps } from './index';

// Safe evaluation of simple mathematical functions
const evaluateFunction = (funcStr: string, x: number): number => {
  try {
    // Replace common math functions with Math equivalents
    const safeFunc = funcStr
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/abs/g, 'Math.abs')
      .replace(/log/g, 'Math.log')
      .replace(/exp/g, 'Math.exp')
      .replace(/pow/g, 'Math.pow')
      .replace(/PI/g, 'Math.PI')
      .replace(/E(?![a-z])/g, 'Math.E')
      .replace(/\^/g, '**');

    // Create a function that takes x and evaluates the expression
    const fn = new Function('x', `return ${safeFunc}`);
    const result = fn(x);
    return isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
};

const FunctionPlotViz: React.FC<VisualizationProps> = ({ config, interactive = true }) => {
  const defaultFunc = config.func || 'x^2';
  const defaultDomain = config.domain || [-5, 5];

  const [funcStr, setFuncStr] = useState(defaultFunc);
  const [domain, setDomain] = useState<[number, number]>(defaultDomain);

  const data = useMemo(() => {
    const [xMin, xMax] = domain;
    const points = [];
    const step = (xMax - xMin) / 100;

    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateFunction(funcStr, x);
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
      }
    }

    return points;
  }, [funcStr, domain]);

  const yDomain = useMemo(() => {
    if (config.range) return config.range;
    if (data.length === 0) return [-10, 10];

    const yValues = data.map((p) => p.y).filter((y) => isFinite(y));
    if (yValues.length === 0) return [-10, 10];

    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const padding = (yMax - yMin) * 0.1 || 1;

    return [yMin - padding, yMax + padding];
  }, [data, config.range]);

  return (
    <div className="function-plot-viz" style={{ width: '100%', maxWidth: '500px' }}>
      {interactive && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <label style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>f(x) =</label>
            <input
              type="text"
              value={funcStr}
              onChange={(e) => setFuncStr(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="e.g., x^2, sin(x)"
              style={{
                flex: 1,
                padding: '0.35rem 0.5rem',
                fontSize: '0.9rem',
                border: '1px solid var(--slide-muted)',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div style={{ flex: 1 }}>
              <label>x: [{domain[0]}, {domain[1]}]</label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <input
                  type="range"
                  min="-10"
                  max="0"
                  step="0.5"
                  value={domain[0]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setDomain([parseFloat(e.target.value), domain[1]])}
                  style={{ flex: 1 }}
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={domain[1]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setDomain([domain[0], parseFloat(e.target.value)])}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="x"
            type="number"
            domain={domain}
            tickCount={5}
            stroke="var(--slide-text)"
            fontSize={10}
          />
          <YAxis
            type="number"
            domain={yDomain as [number, number]}
            tickCount={5}
            stroke="var(--slide-text)"
            fontSize={10}
            width={40}
          />
          <ReferenceLine x={0} stroke="#333" strokeWidth={1} />
          <ReferenceLine y={0} stroke="#333" strokeWidth={1} />
          <Tooltip
            formatter={(value: number) => value.toFixed(4)}
            labelFormatter={(label: number) => `x = ${label.toFixed(4)}`}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="var(--slide-accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {!interactive && (
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--slide-muted)' }}>
          f(x) = {funcStr}
        </div>
      )}
    </div>
  );
};

export default FunctionPlotViz;
