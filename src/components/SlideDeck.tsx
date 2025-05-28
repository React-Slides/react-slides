// SlideDeck.tsx (excerpt)
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MarkdownSlide from './MarkdownSlide';
import { SlideDeckProps } from '../types';
import { parseSlideContent, SlideBlock } from '../utils/parseSlideContent';

const SlideDeck: React.FC<SlideDeckProps> = ({ markdownContent }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slides, setSlides] = useState<SlideBlock[][]>([]);

  useEffect(() => {
    if (markdownContent) {
      const rawSlides = markdownContent.split(/^---$/m);
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

  if (slides.length === 0) {
    return <div className="h-screen flex items-center justify-center text-2xl text-gray-600">Loading slides...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative">
        {slides[currentSlide].map((block, index) => {
          if (block.type === 'markdown') {
            return <MarkdownSlide key={index} content={block.content} isActive={true} />;
          }
          if (block.type === 'chart') {
            return <div key={index}>[ChartRenderer TODO]</div>; // Replace with <ChartRenderer config={block.config} />
          }
          if (block.type === 'animate') {
            return <div key={index}>[AnimationWrapper TODO]</div>; // Replace with <AnimationWrapper config={block.config}>...</AnimationWrapper>
          }
          return null;
        })}

        {/* Navigation Buttons */}
        <button onClick={prevSlide} disabled={currentSlide === 0} className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-30">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-30">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
      <div className="h-2 bg-gray-200">
        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
      </div>
    </div>
  );
};

export default SlideDeck;