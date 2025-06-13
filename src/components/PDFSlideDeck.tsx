import React from 'react';
import MarkdownSlide from './MarkdownSlide';
import ChartRenderer from './ChartRenderer';
import AnimationWrapper from './AnimationWrapper';
import { parseSlideContent, SlideBlock } from '../utils/parseSlideContent';

interface PDFSlideDeckProps {
  markdownContent: string;
}

const PDFSlideDeck: React.FC<PDFSlideDeckProps> = ({ markdownContent }) => {
  // Parse all slides at once for PDF export
  const rawSlides = markdownContent.split(/^---$/m);
  const slides = rawSlides
    .map(slide => parseSlideContent(slide))
    .filter(blocks => blocks.length > 0);

  return (
    <div className="pdf-export-container">
      {slides.map((slideBlocks, index) => {
        const markdownBlock = slideBlocks.find(block => block.type === 'markdown');
        const chartBlock = slideBlocks.find(block => block.type === 'chart');
        const animateBlock = slideBlocks.find(block => block.type === 'animate');

        return (
          <div 
            key={index}
            className="slide-container p-8 bg-white"
            style={{
              width: '1024px',
              height: '768px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pageBreakAfter: 'always'
            }}
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PDFSlideDeck;