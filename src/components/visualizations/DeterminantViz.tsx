import React, { useState, useMemo } from 'react';
import { VisualizationProps } from './index';

const DeterminantViz: React.FC<VisualizationProps> = ({ config, interactive = true }) => {
  // Extract initial values from config or use defaults
  const initialValues = config.values as number[][] || [[1, 2], [3, 4]];
  const [matrix, setMatrix] = useState<number[][]>(initialValues);

  const determinant = useMemo(() => {
    const [[a, b], [c, d]] = matrix;
    return a * d - b * c;
  }, [matrix]);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!interactive) return;
    const newMatrix = [...matrix];
    newMatrix[row] = [...newMatrix[row]];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  const [[a, b], [c, d]] = matrix;
  const ad = a * d;
  const bc = b * c;

  const cellClasses = [
    ['matrix-cell-a', 'matrix-cell-b'],
    ['matrix-cell-c', 'matrix-cell-d'],
  ];

  return (
    <div className="determinant-viz">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div
          className="matrix-viz"
          style={{ gridTemplateColumns: 'repeat(2, 50px)' }}
        >
          {matrix.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`matrix-cell ${cellClasses[rowIdx][colIdx]} ${interactive ? 'editable' : ''}`}
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
      </div>

      <div className="determinant-formula">
        det(A) = <span className="highlight-ad">ad</span> - <span className="highlight-bc">bc</span>
      </div>

      <div className="determinant-formula">
        = <span className="highlight-ad">({a})({d})</span> - <span className="highlight-bc">({b})({c})</span>
        <br />
        = <span className="highlight-ad">{ad}</span> - <span className="highlight-bc">{bc}</span>
      </div>

      <div className="determinant-result">
        det(A) = {determinant}
      </div>

      <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--slide-muted)' }}>
        {determinant < 0
          ? 'Negative determinant: transformation flips orientation'
          : determinant === 0
          ? 'Zero determinant: transformation collapses space (singular matrix)'
          : 'Positive determinant: transformation preserves orientation'}
      </p>
    </div>
  );
};

export default DeterminantViz;
