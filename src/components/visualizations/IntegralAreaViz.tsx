import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { VisualizationProps } from './index';
import { compileMathExpression, MathFunction } from '../../utils/compileMathExpression';

// Simple numerical integration using trapezoidal rule
const computeIntegral = (fn: MathFunction, a: number, b: number, n: number = 1000): number => {
  const h = (b - a) / n;
  let sum = 0;

  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    const y = fn(x);
    if (isNaN(y)) continue;
    sum += y * (i === 0 || i === n ? 0.5 : 1);
  }

  return sum * h;
};

const IntegralAreaViz: React.FC<VisualizationProps> = ({ config, interactive = true }) => {
  const defaultFunc = config.func || 'x^2';
  const defaultBounds = config.bounds || [0, 2];
  const defaultDomain = config.domain || [-1, 3];

  const [funcStr, setFuncStr] = useState(defaultFunc);
  const [bounds, setBounds] = useState<[number, number]>(defaultBounds);
  const [domain] = useState<[number, number]>(defaultDomain);

  const fn = useMemo(() => compileMathExpression(funcStr), [funcStr]);

  const { data, areaData, integralValue } = useMemo(() => {
    const [xMin, xMax] = domain;
    const [a, b] = bounds;
    const points = [];
    const areaPoints = [];
    const step = (xMax - xMin) / 150;

    for (let x = xMin; x <= xMax; x += step) {
      const y = fn ? fn(x) : NaN;
      if (!isNaN(y) && isFinite(y)) {
        const point = { x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) };
        points.push(point);

        // Only include points within bounds for shaded area
        if (x >= a && x <= b) {
          areaPoints.push({ ...point, area: point.y });
        } else {
          areaPoints.push({ ...point, area: null });
        }
      }
    }

    const integral = fn ? computeIntegral(fn, a, b) : 0;

    return {
      data: points,
      areaData: areaPoints,
      integralValue: parseFloat(integral.toFixed(4)),
    };
  }, [fn, bounds, domain]);

  const yDomain = useMemo(() => {
    if (config.range) return config.range;
    if (data.length === 0) return [-1, 5];

    const yValues = data.map((p) => p.y).filter((y) => isFinite(y));
    if (yValues.length === 0) return [-1, 5];

    const yMin = Math.min(0, Math.min(...yValues));
    const yMax = Math.max(...yValues);
    const padding = (yMax - yMin) * 0.1 || 1;

    return [yMin - padding, yMax + padding];
  }, [data, config.range]);

  return (
    <div className="integral-area-viz" style={{ width: '100%', maxWidth: '500px' }}>
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
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
            <div style={{ flex: 1 }}>
              <label>a = {bounds[0].toFixed(1)}</label>
              <input
                type="range"
                min={domain[0]}
                max={bounds[1] - 0.1}
                step="0.1"
                value={bounds[0]}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setBounds([parseFloat(e.target.value), bounds[1]])}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>b = {bounds[1].toFixed(1)}</label>
              <input
                type="range"
                min={bounds[0] + 0.1}
                max={domain[1]}
                step="0.1"
                value={bounds[1]}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setBounds([bounds[0], parseFloat(e.target.value)])}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={areaData} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
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
            width={35}
          />
          <ReferenceLine x={0} stroke="#333" strokeWidth={1} />
          <ReferenceLine y={0} stroke="#333" strokeWidth={1} />
          <ReferenceLine x={bounds[0]} stroke="#28a745" strokeWidth={2} strokeDasharray="5 5" />
          <ReferenceLine x={bounds[1]} stroke="#28a745" strokeWidth={2} strokeDasharray="5 5" />
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? value.toFixed(4) : '-')}
            labelFormatter={(label) => `x = ${typeof label === 'number' ? label.toFixed(4) : label}`}
          />
          <Area
            type="monotone"
            dataKey="area"
            stroke="var(--slide-accent)"
            strokeWidth={2}
            fill="var(--slide-accent)"
            fillOpacity={0.3}
            connectNulls={false}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="var(--slide-accent)"
            strokeWidth={2}
            fill="none"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--slide-accent)' }}>
          {'\u222B'}<sub>{bounds[0]}</sub><sup>{bounds[1]}</sup> {funcStr} dx = {integralValue}
        </div>
      </div>
    </div>
  );
};

export default IntegralAreaViz;
