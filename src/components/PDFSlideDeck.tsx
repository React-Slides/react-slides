import React from 'react';
import MarkdownSlide from './MarkdownSlide';
import ChartRenderer from './ChartRenderer';
import AnimationWrapper from './AnimationWrapper';
import MathVisualRenderer from './MathVisualRenderer';
import { parseSlideContent } from '../utils/parseSlideContent';
import { getTheme, ThemeName } from '../utils/themes';
import { EXPORT_SLIDE_WIDTH, EXPORT_SLIDE_HEIGHT } from '../utils/renderSlidesForExport';

interface PDFSlideDeckProps {
  markdownContent: string;
  theme?: ThemeName;
}

const PDFSlideDeck: React.FC<PDFSlideDeckProps> = ({ markdownContent, theme = 'light' }) => {
  // Get theme styles as CSS variables
  const themeStyles = getTheme(theme);

  // Parse all slides at once for PDF export
  // Notes are automatically excluded since we only render the blocks
  const rawSlides = markdownContent.split(/^---$/m);
  const slides = rawSlides
    .map(slide => parseSlideContent(slide))
    .filter(parsed => parsed.blocks.length > 0);

  return (
    <div className="pdf-export-container">
      {slides.map((parsedSlide, index) => {
        const slideBlocks = parsedSlide.blocks;
        const markdownBlock = slideBlocks.find(block => block.type === 'markdown');
        const chartBlock = slideBlocks.find(block => block.type === 'chart');
        const animateBlock = slideBlocks.find(block => block.type === 'animate');
        const mathVisualBlock = slideBlocks.find(block => block.type === 'math-visual');

        return (
          <div
            key={index}
            className="slide-container p-8"
            style={{
              ...themeStyles,
              width: `${EXPORT_SLIDE_WIDTH}px`,
              height: `${EXPORT_SLIDE_HEIGHT}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pageBreakAfter: 'always',
              backgroundColor: 'var(--slide-bg)',
              color: 'var(--slide-text)',
            } as React.CSSProperties}
          >
            <div className="max-w-4xl mx-auto w-full">
              {/* Render markdown content */}
              {markdownBlock && (
                <div className="mb-8">
                  <MarkdownSlide
                    index={index}
                    content={markdownBlock.content}
                    isActive={true}
                  />
                </div>
              )}

              {/* Render chart in final state */}
              {chartBlock && (
                <div className="relative">
                  <ChartRenderer config={chartBlock.config} />
                </div>
              )}

              {/* Render animation in final state (static) */}
              {animateBlock && (
                <div className="relative">
                  <AnimationWrapper config={animateBlock.config}>
                    <div className="text-center p-8">
                      <h2 className="text-2xl font-bold">Animation: {animateBlock.config.type}</h2>
                    </div>
                  </AnimationWrapper>
                </div>
              )}

              {/* Render math-visual in export mode (static, no flip) */}
              {mathVisualBlock && (
                <div className="relative">
                  <MathVisualRenderer config={mathVisualBlock.config} isExport={true} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PDFSlideDeck;
