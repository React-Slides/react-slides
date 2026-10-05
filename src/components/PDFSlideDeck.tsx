import React from 'react';
import MarkdownSlide from './MarkdownSlide';
import ChartRenderer from './ChartRenderer';
import AnimationWrapper from './AnimationWrapper';
import MathVisualRenderer from './MathVisualRenderer';
import SlideErrorBoundary from './SlideErrorBoundary';
import { parseSlides } from '../utils/parseSlideContent';
import { parseFrontmatter } from '../utils/parseFrontmatter';
import { getTheme, ThemeName } from '../utils/themes';
import { EXPORT_SLIDE_WIDTH, EXPORT_SLIDE_HEIGHT } from '../utils/renderSlidesForExport';
import { SLIDE_CANVAS_PADDING, SLIDE_CONTENT_CLASS } from '../utils/slideCanvas';

interface PDFSlideDeckProps {
  markdownContent: string;
  theme?: ThemeName;
}

const PDFSlideDeck: React.FC<PDFSlideDeckProps> = ({ markdownContent, theme }) => {
  // Parse all slides at once for PDF export
  // Notes are automatically excluded since we only render the blocks
  const { theme: frontmatterTheme, content } = parseFrontmatter(markdownContent);
  const slides = parseSlides(content);

  // Get theme styles as CSS variables; an explicit prop overrides the frontmatter theme
  const themeStyles = getTheme(theme ?? frontmatterTheme);

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
            className="slide-container"
            style={{
              ...themeStyles,
              padding: SLIDE_CANVAS_PADDING,
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
            <div className={`slide-content ${SLIDE_CONTENT_CLASS}${parsedSlide.layout ? ` slide-layout-${parsedSlide.layout}` : ''}`}>
              <SlideErrorBoundary>
                {/* Render markdown content */}
                {markdownBlock && (
                  <div className="mb-0">
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
              </SlideErrorBoundary>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PDFSlideDeck;
