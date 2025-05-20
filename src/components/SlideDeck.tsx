import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MarkdownSlide from './MarkdownSlide';
import { SlideDeckProps, MarkdownSlide as MarkdownSlideType } from '../types';

const SlideDeck: React.FC<SlideDeckProps> = ({ markdownContent }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slides, setSlides] = useState<MarkdownSlideType[]>([]);

  useEffect(() => {
    if (markdownContent) {
      // Split the markdown by slide separator (---)
      const slideContents = markdownContent.split(/^---$/m);
      
      // Create slide objects with content and index
      const newSlides = slideContents
        .map((content, index) => ({ content: content.trim(), index }))
        .filter(slide => slide.content.length > 0); // Filter out empty slides
      
      setSlides(newSlides);
    }
  }, [markdownContent]);

  const nextSlide = (): void => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = (): void => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // If content is loading or no slides exist
  if (slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading slides...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative">
        {slides.map((slide, index) => (
          <MarkdownSlide
            key={slide.index}
            content={slide.content}
            index={slide.index}
            isActive={index === currentSlide}
          />
        ))}
        
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
            currentSlide === 0 ? 'text-gray-400' : 'text-gray-800 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
            currentSlide === slides.length - 1 ? 'text-gray-400' : 'text-gray-800 hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
      
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