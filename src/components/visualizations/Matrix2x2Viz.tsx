import React, { useState } from 'react';
import { VisualizationProps } from './index';

const Matrix2x2Viz: React.FC<VisualizationProps> = ({ config, interactive = true }) => {
  // Extract initial values from config or use defaults
  const initialValues = config.values as number[][] || [[1, 2], [3, 4]];
  const [matrix, setMatrix] = useState<number[][]>(initialValues);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!interactive) return;
    const newMatrix = [...matrix];
    newMatrix[row] = [...newMatrix[row]];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  const cellLabels = [
    ['a', 'b'],
    ['c', 'd'],
  ];

  const cellClasses = [
    ['matrix-cell-a', 'matrix-cell-b'],
    ['matrix-cell-c', 'matrix-cell-d'],
  ];

  return (
    <div className="matrix-2x2-viz">
      <div
        className="matrix-viz"
        style={{ gridTemplateColumns: 'repeat(2, 50px)' }}
      >
        {matrix.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`matrix-cell ${cellClasses[rowIdx][colIdx]} ${interactive ? 'editable' : ''}`}
              title={`${cellLabels[rowIdx][colIdx]} = ${cell}`}
            >
              {interactive ? (
                <input
                  type="number"
                  value={cell}
                  onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'inherit',
                  }}
                />
              ) : (
                cell
              )}
            </div>
          ))
        )}
      </div>
      <div className="matrix-labels" style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--slide-muted)' }}>
        <span style={{ color: '#b71c1c' }}>a</span>,{' '}
        <span style={{ color: '#1b5e20' }}>b</span>,{' '}
        <span style={{ color: '#f57f17' }}>c</span>,{' '}
        <span style={{ color: '#0d47a1' }}>d</span>
      </div>
    </div>
  );
};

export default Matrix2x2Viz;
