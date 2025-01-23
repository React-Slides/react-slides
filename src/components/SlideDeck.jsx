import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MarkdownSlide from './MarkdownSlide';

const SlideDeck = ({ markdown = '' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const slideContents = markdown.split('---').map(content => content.trim());
    setSlides(slideContents);
  }, [markdown]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowRight') {
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentSlide, slides.length]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <MarkdownSlide content={slides[currentSlide] || ''} />
        
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