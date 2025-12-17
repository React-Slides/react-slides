import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VisualizationProps } from './index';

const TransformationViz: React.FC<VisualizationProps> = ({ config, interactive = true }) => {
  // Extract initial values from config or use defaults
  const initialValues = config.values as number[][] || [[1, 2], [3, 4]];
  const [[initialA, initialB], [initialC, initialD]] = initialValues;

  const [a, setA] = useState(initialA ?? 1);
  const [b, setB] = useState(initialB ?? 0);
  const [c, setC] = useState(initialC ?? 0);
  const [d, setD] = useState(initialD ?? 1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas dimensions - reduced for compact display
  const canvasSize = 300;
  const scale = 35;
  const centerX = 150;
  const centerY = 150;

  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    for (let i = -7; i <= 7; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(canvasSize, centerY + i * scale);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasSize, centerY);
    ctx.stroke();

    // Draw original unit square (blue)
    ctx.fillStyle = '#2196f3';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(centerX, centerY - scale, scale, scale);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 3;
    ctx.strokeRect(centerX, centerY - scale, scale, scale);

    // Draw transformed parallelogram (red)
    const points = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];

    const transformed = points.map(([x, y]) => [
      centerX + (a * x + b * y) * scale,
      centerY - (c * x + d * y) * scale,
    ]);

    ctx.fillStyle = '#f44336';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(transformed[0][0], transformed[0][1]);
    transformed.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#f44336';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(transformed[0][0], transformed[0][1]);
    transformed.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();
    ctx.stroke();

    // Draw corner dots
    ctx.fillStyle = '#d32f2f';
    transformed.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Original', centerX + 5, centerY - scale - 5);
    ctx.fillStyle = '#d32f2f';
    ctx.fillText('Transformed', transformed[2][0] + 5, transformed[2][1] - 5);
  }, [a, b, c, d]);

  useEffect(() => {
    drawVisualization();
  }, [drawVisualization]);

  const determinant = a * d - b * c;

  return (
    <div className="transformation-viz" style={{ width: '100%', maxWidth: '350px' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="transformation-canvas"
        style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      />

      {interactive && (
        <div className="transformation-controls" style={{ padding: '0.5rem', marginTop: '0.25rem' }}>
          <div className="control-group">
            <label style={{ fontSize: '0.8rem' }}>a = {a.toFixed(1)}</label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={a}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setA(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label style={{ fontSize: '0.8rem' }}>b = {b.toFixed(1)}</label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={b}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setB(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label style={{ fontSize: '0.8rem' }}>c = {c.toFixed(1)}</label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={c}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setC(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label style={{ fontSize: '0.8rem' }}>d = {d.toFixed(1)}</label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={d}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setD(parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '0.25rem', fontSize: '0.85rem' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--slide-accent)' }}>
          det(A) = {determinant.toFixed(2)}
        </span>
        <span style={{ marginLeft: '0.5rem', color: 'var(--slide-muted)', fontSize: '0.75rem' }}>
          (Area scaling)
        </span>
      </div>
    </div>
  );
};

export default TransformationViz;
