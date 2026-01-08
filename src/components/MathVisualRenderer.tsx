import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
// Note: katex CSS must be imported by the consumer app
import FlipCard from './FlipCard';
import { MathVisualConfig } from '../utils/parseSlideContent';

interface MathVisualRendererProps {
  config: MathVisualConfig;
  isExport?: boolean;
}

// Lazy imports for visualization components
const Matrix2x2Viz = React.lazy(() => import('./visualizations/Matrix2x2Viz'));
const MatrixMultiplicationViz = React.lazy(() => import('./visualizations/MatrixMultiplicationViz'));
const DeterminantViz = React.lazy(() => import('./visualizations/DeterminantViz'));
const TransformationViz = React.lazy(() => import('./visualizations/TransformationViz'));
const FunctionPlotViz = React.lazy(() => import('./visualizations/FunctionPlotViz'));
const IntegralAreaViz = React.lazy(() => import('./visualizations/IntegralAreaViz'));

// Map visualization types to appropriate flip card sizes
const getFlipCardSize = (vizType: string): 'small' | 'medium' | 'large' => {
  switch (vizType) {
    case 'matrix-2x2':
      return 'small';
    case 'transformation':
      return 'large';
    case 'determinant':
    case 'matrix-multiplication':
    case 'function-plot':
    case 'integral-area':
    default:
      return 'medium';
  }
};

const MathVisualRenderer: React.FC<MathVisualRendererProps> = ({
  config,
  isExport = false,
}) => {
  const interactive = config.interactive !== false && !isExport;

  // Render the equation using ReactMarkdown with KaTeX
  const renderEquation = () => (
    <div className="math-visual-equation">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins={[rehypeKatex] as any}
      >
        {config.equation}
      </ReactMarkdown>
    </div>
  );

  // Render the appropriate visualization component
  const renderVisualization = () => {
    const props = { config, interactive };

    return (
      <React.Suspense fallback={<div className="viz-loading">Loading visualization...</div>}>
        {config.type === 'matrix-2x2' && <Matrix2x2Viz {...props} />}
        {config.type === 'matrix-multiplication' && <MatrixMultiplicationViz {...props} />}
        {config.type === 'determinant' && <DeterminantViz {...props} />}
        {config.type === 'transformation' && <TransformationViz {...props} />}
        {config.type === 'function-plot' && <FunctionPlotViz {...props} />}
        {config.type === 'integral-area' && <IntegralAreaViz {...props} />}
      </React.Suspense>
    );
  };

  // For interactive flip card (only if explicitly requested and not exporting)
  if (config.layout === 'flip' && !isExport) {
    return (
      <div className="math-visual-container">
        {config.title && <h3 className="math-visual-title">{config.title}</h3>}
        <FlipCard
          front={renderEquation()}
          back={renderVisualization()}
          size={getFlipCardSize(config.type)}
          className="math-visual-flip-card"
        />
      </div>
    );
  }

  // Default: Show split/combined view (side-by-side or stacked)
  return (
    <div className={isExport ? "math-visual-export" : "math-visual-container"}>
      {config.title && <h3 className="math-visual-title">{config.title}</h3>}
      <div className={isExport ? "math-visual-export-content" : "flex flex-col md:flex-row gap-8 items-center justify-center w-full"}>
        <div className={isExport ? "math-visual-export-equation" : "flex-1 flex justify-center"}>
          {renderEquation()}
        </div>
        <div className={isExport ? "math-visual-export-viz" : "flex-1 flex justify-center w-full"}>
          {renderVisualization()}
        </div>
      </div>
    </div>
  );
};

export default MathVisualRenderer;
