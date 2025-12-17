// Visualization types and registry
import { MathVisualConfig, MathVisualType } from '../../utils/parseSlideContent';

export interface VisualizationProps {
  config: MathVisualConfig;
  interactive?: boolean;
}

// Re-export types for convenience
export type { MathVisualConfig, MathVisualType };

// Visualization registry - will be populated as components are created
export const visualizationRegistry: Record<
  MathVisualType,
  React.ComponentType<VisualizationProps> | null
> = {
  'matrix-2x2': null,
  'matrix-multiplication': null,
  'determinant': null,
  'transformation': null,
  'function-plot': null,
  'integral-area': null,
};
