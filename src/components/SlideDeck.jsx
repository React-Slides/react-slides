import React, { useState } from 'react';
import MarkdownSlide from './MarkdownSlide';

/**
 * SlideDeck component manages a presentation of markdown slides.
 * It handles slide navigation and displays current slide position.
 * Slides are separated by '---' in the markdown content.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.markdownContent - Raw markdown content containing all slides
 * @returns {JSX.Element} A container with the current slide and navigation controls
 */
const SlideDeck = ({ markdownContent }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Split markdown content into slides using horizontal rule as delimiter
  const slides = markdownContent.split('---').map(slide => slide.trim());
  
  /**
   * Advances to the next slide if not at the end of the deck
   */
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  /**
   * Returns to the previous slide if not at the beginning of the deck
   */
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