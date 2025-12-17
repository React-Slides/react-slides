// SlideDeck.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MarkdownSlide from './MarkdownSlide';
import ChartRenderer from './ChartRenderer';
import AnimationWrapper from './AnimationWrapper';
import MathVisualRenderer from './MathVisualRenderer';
import { SlideDeckProps } from '../types';
import { parseSlideContent, ParsedSlide } from '../utils/parseSlideContent';
import { getTheme } from '../utils/themes';

const SlideDeck: React.FC<SlideDeckProps> = ({ markdownContent, theme = 'light' }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slides, setSlides] = useState<ParsedSlide[]>([]);

  // Get theme styles as CSS variables
  const themeStyles = getTheme(theme);

  useEffect(() => {
    if (markdownContent) {
      const rawSlides = markdownContent.split(/^---$/m);
      const parsedSlides = rawSlides
        .map(slide => parseSlideContent(slide))
        .filter(parsed => parsed.blocks.length > 0);
      setSlides(parsedSlides);
    }
  }, [markdownContent]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (slides.length === 0) {
    return (
      <div
        className="h-screen flex items-center justify-center text-2xl"
        style={{
          ...themeStyles,
          backgroundColor: 'var(--slide-bg)',
          color: 'var(--slide-text)',
        } as React.CSSProperties}
      >
        Loading slides...
      </div>
    );
  }

  const currentParsedSlide = slides[currentSlide];
  const currentSlideBlocks = currentParsedSlide.blocks;
  const markdownBlock = currentSlideBlocks.find(block => block.type === 'markdown');
  const chartBlock = currentSlideBlocks.find(block => block.type === 'chart');
  const animateBlock = currentSlideBlocks.find(block => block.type === 'animate');
  const mathVisualBlock = currentSlideBlocks.find(block => block.type === 'math-visual');
  // Notes are stored in currentParsedSlide.notes but not rendered in normal view

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        ...themeStyles,
        backgroundColor: 'var(--slide-bg)',
        color: 'var(--slide-text)',
      } as React.CSSProperties}
    >
      <div className="flex-1 relative">
        {/* Single container for all slide content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-center">
          <div className="max-w-4xl mx-auto w-full">
            {/* Render markdown content if present */}
            {markdownBlock && (
              <div className="mb-8">
                <MarkdownSlide
                  index={0}
                  content={markdownBlock.content}
                  isActive={true}
                />
              </div>
            )}

            {/* Render chart if present */}
            {chartBlock && (
              <div className="relative z-20">
                <ChartRenderer config={chartBlock.config} />
              </div>
            )}

            {/* Render animation if present */}
            {animateBlock && (
              <div className="relative z-20">
                <AnimationWrapper config={animateBlock.config}>
                  <div className="text-center p-8">
                    <h2 className="text-2xl font-bold">Animation: {animateBlock.config.type}</h2>
                  </div>
                </AnimationWrapper>
              </div>
            )}

            {/* Render math-visual if present */}
            {mathVisualBlock && (
              <div className="relative z-20">
                <MathVisualRenderer config={mathVisualBlock.config} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg disabled:opacity-50 z-30"
        >
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg disabled:opacity-50 z-30"
        >
          <ChevronRight className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            backgroundColor: 'var(--slide-accent)',
          }}
        />
      </div>
    </div>
  );
};

export default SlideDeck;
