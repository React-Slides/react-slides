import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MarkdownSlide from './MarkdownSlide';
import { SlideDeckProps, MarkdownSlide as MarkdownSlideType } from '../types';

const SlideDeck: React.FC<SlideDeckProps> = ({ markdownContent }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slides, setSlides] = useState<MarkdownSlideType[]>([]);

  // Debug the current state
  console.log(`SlideDeck render - currentSlide: ${currentSlide}, slides count: ${slides.length}`);

  useEffect(() => {
    if (markdownContent) {
      // Split the markdown by slide separator (---)
      const slideContents = markdownContent.split(/^---$/m);
      
      // Log the split content for debugging
      console.log(`Split markdown into ${slideContents.length} sections`);
      
      // Create slide objects with content and index
      const newSlides = slideContents
        .map((content, index) => ({ content: content.trim(), index }))
        .filter(slide => slide.content.length > 0); // Filter out empty slides
      
      console.log(`Created ${newSlides.length} valid slides`);
      setSlides(newSlides);
    }
  }, [markdownContent]);

  // Use useCallback to memoize the handlers
  const nextSlide = useCallback((): void => {
    console.log(`nextSlide called, current: ${currentSlide}, max: ${slides.length - 1}`);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prevSlide => prevSlide + 1);
      console.log(`Updated to slide ${currentSlide + 1}`);
    }
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback((): void => {
    console.log(`prevSlide called, current: ${currentSlide}`);
    if (currentSlide > 0) {
      setCurrentSlide(prevSlide => prevSlide - 1);
      console.log(`Updated to slide ${currentSlide - 1}`);
    }
  }, [currentSlide]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      console.log(`Key pressed: ${e.key}`);
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    console.log('Keyboard navigation listeners added');
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      console.log('Keyboard navigation listeners removed');
    };
  }, [nextSlide, prevSlide]); // Use the memoized callbacks

  // If content is loading or no slides exist
  if (slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading slides...</p>
      </div>
    );
  }

  // Create direct click handlers with immediate state updates
  const handleNextClick = () => {
    console.log('Next button clicked');
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevClick = () => {
    console.log('Previous button clicked');
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative">
        {slides.map((slide, index) => (
          <MarkdownSlide
            key={index}
            content={slide.content}
            index={slide.index}
            isActive={index === currentSlide}
          />
        ))}
        
        {/* Use the direct handlers instead of the callbacks */}
        <button
          onClick={handlePrevClick}
          disabled={currentSlide === 0}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-30 ${
            currentSlide === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 bg-white bg-opacity-75 hover:bg-gray-100 shadow-md'
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <button
          onClick={handleNextClick}
          disabled={currentSlide === slides.length - 1}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-30 ${
            currentSlide === slides.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 bg-white bg-opacity-75 hover:bg-gray-100 shadow-md'
          }`}
          aria-label="Next slide"
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
      
      {/* Slide counter with higher z-index */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-75 px-2 py-1 rounded text-sm text-gray-600 z-20">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default SlideDeck;