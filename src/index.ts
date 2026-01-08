// React Slides Library Entry Point
// Import library styles
import './index.css';

// Export main components
// Note: PDFSlideDeck is intentionally not exported - it's an internal component
// used by exportSlidesToPDF/exportSlidesToPPTX via dynamic import
export { default as SlideDeck } from './components/SlideDeck';
export { default as MarkdownSlide } from './components/MarkdownSlide';
export { default as ChartRenderer } from './components/ChartRenderer';
export { default as AnimationWrapper } from './components/AnimationWrapper';
export { default as MarkdownForm } from './components/MarkdownForm';
export { default as TemplatePicker } from './components/TemplatePicker';
export { default as MathVisualRenderer } from './components/MathVisualRenderer';

// Export utility functions
export { parseSlideContent } from './utils/parseSlideContent';
export { parseFrontmatter, injectTheme } from './utils/parseFrontmatter';
export { exportSlidesToPDF } from './utils/exportSlidesToPDF';
export { exportSlidesToPPTX } from './utils/exportSlidesToPPTX';
export { getTheme, themeButtons } from './utils/themes';

// Export templates
export { TEMPLATES, getTemplateById, getTemplatesByCategory } from './constants/templates';
export { EXAMPLE_MARKDOWN } from './constants/exampleMarkdown';

// Export types
export type {
  MarkdownSlide as MarkdownSlideType,
  MarkdownSlideProps,
  SlideDeckProps,
  MarkdownFormState,
  SubmissionResponse,
  ToastType,
  Toast,
} from './types';

export type { Template } from './constants/templates';
export type { ThemeName } from './utils/themes';
export type {
  ParsedSlide,
  SlideBlock,
  MathVisualConfig,
  MathVisualType,
} from './utils/parseSlideContent';
