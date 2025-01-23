import React, { useState } from 'react';
import MarkdownSlide from './MarkdownSlide';

const SlideDeck = ({ markdownContent }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Split markdown content into slides using horizontal rule as delimiter
  const slides = markdownContent.split('---').map(slide => slide.trim());
  
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="slide-deck h-screen w-screen flex flex-col">
      <div className="flex-1 relative">
        <MarkdownSlide content={slides[currentSlide]} />
      </div>
      
      <div className="flex justify-between p-4 bg-gray-100">
        <button 
          onClick={previousSlide}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentSlide === 0}
        >
          Previous
        </button>
        <span>{currentSlide + 1} / {slides.length}</span>
        <button 
          onClick={nextSlide}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SlideDeck;