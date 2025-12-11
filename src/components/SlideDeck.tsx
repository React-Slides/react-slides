// SlideDeck.tsx (Fixed)
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MarkdownSlide from './MarkdownSlide';
import ChartRenderer from './ChartRenderer'
import AnimationWrapper from './AnimationWrapper';
import { SlideDeckProps } from '../types';
import { parseSlideContent, SlideBlock } from '../utils/parseSlideContent';

const SlideDeck: React.FC<SlideDeckProps> = ({ markdownContent }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slides, setSlides] = useState<SlideBlock[][]>([]);

  useEffect(() => {
    if (markdownContent) {
      const rawSlides = markdownContent.split(/^---$/m);

      console.log("raw slides just before being parsed, line 17 SlideDeck.tsx: ", rawSlides)

      const parsedSlides = rawSlides
        .map(slide => parseSlideContent(slide))
        .filter(blocks => blocks.length > 0);
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
    return <div className="h-screen flex items-center justify-center text-2xl text-gray-600">Loading slides...</div>;
  }

  const currentSlideBlocks = slides[currentSlide];
  const markdownBlock = currentSlideBlocks.find(block => block.type === 'markdown');
  const chartBlock = currentSlideBlocks.find(block => block.type === 'chart');
  const animateBlock = currentSlideBlocks.find(block => block.type === 'animate');

  return (
    <div className="h-screen flex flex-col">
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
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide} 
          disabled={currentSlide === 0} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg disabled:opacity-50 z-30"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextSlide} 
          disabled={currentSlide === slides.length - 1} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg disabled:opacity-50 z-30"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-300" 
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} 
        />
      </div>
    </div>
  );
};

export default SlideDeck;