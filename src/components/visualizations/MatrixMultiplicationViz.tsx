import React, { useState, useMemo } from 'react';
import { VisualizationProps } from './index';

const MatrixMultiplicationViz: React.FC<VisualizationProps> = ({ config, interactive = true }) => {
  // Extract initial values from config or use defaults
  // config.values should be [[matrix], [vector]] where matrix is 2x2 and vector is 2-element
  const configValues = config.values as (number[] | number[][])[] | undefined;
  const rawMatrix = configValues?.[0];
  const rawVector = configValues?.[1];

  // Ensure matrix is a 2D array
  const initialMatrix: number[][] = Array.isArray(rawMatrix) && Array.isArray(rawMatrix[0])
    ? rawMatrix as number[][]
    : [[1, 2], [3, 4]];

  // Ensure vector is a 1D array
  const initialVector: number[] = Array.isArray(rawVector) && typeof rawVector[0] === 'number'
    ? rawVector as number[]
    : [5, 6];

  const [matrix, setMatrix] = useState<number[][]>(initialMatrix);
  const [vector, setVector] = useState<number[]>(initialVector);

  const result = useMemo(() => {
    const [[a, b], [c, d]] = matrix;
    const [x, y] = vector;
    return [a * x + b * y, c * x + d * y];
  }, [matrix, vector]);

  const handleMatrixChange = (row: number, col: number, value: string) => {
    if (!interactive) return;
    const newMatrix = [...matrix];
    newMatrix[row] = [...newMatrix[row]];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  const handleVectorChange = (idx: number, value: string) => {
    if (!interactive) return;
    const newVector = [...vector];
    newVector[idx] = parseFloat(value) || 0;
    setVector(newVector);
  };

  const [[a, b], [c, d]] = matrix;
  const [x, y] = vector;

  return (
    <div className="matrix-multiplication-viz" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Matrix */}
        <div
          className="matrix-viz"
          style={{ gridTemplateColumns: 'repeat(2, 50px)' }}
        >
          {matrix.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <div
                key={`m-${rowIdx}-${colIdx}`}
                className={`matrix-cell ${interactive ? 'editable' : ''}`}
                style={{ background: '#f0f0f0' }}
              >
                {interactive ? (
                  <input
                    type="number"
                    value={cell}
                    onChange={(e) => handleMatrixChange(rowIdx, colIdx, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                    }}
                  />
                ) : (
                  cell
                )}
              </div>
            ))
          )}
        </div>

        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>×</span>

        {/* Vector */}
        <div className="vector-viz">
          {vector.map((val, idx) => (
            <div key={`v-${idx}`} className="vector-cell" style={{ background: '#e3f2fd' }}>
              {interactive ? (
                <input
                  type="number"
                  value={val}
                  onChange={(e) => handleVectorChange(idx, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                />
              ) : (
                val
              )}
            </div>
          ))}
        </div>

        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>=</span>

        {/* Result Vector */}
        <div className="vector-viz">
          {result.map((val, idx) => (
            <div
              key={`r-${idx}`}
              className="vector-cell"
              style={{ background: idx === 0 ? '#c8e6c9' : '#bbdefb' }}
            >
              {val}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
        <div>Row 1: ({a} × {x}) + ({b} × {y}) = {a * x} + {b * y} = <span style={{ color: '#28a745', fontWeight: 'bold' }}>{result[0]}</span></div>
        <div>Row 2: ({c} × {x}) + ({d} × {y}) = {c * x} + {d * y} = <span style={{ color: '#2196f3', fontWeight: 'bold' }}>{result[1]}</span></div>
      </div>
    </div>
  );
};

export default MatrixMultiplicationViz;
