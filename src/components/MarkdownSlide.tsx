import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownSlideProps } from '../types';

const MarkdownSlide: React.FC<MarkdownSlideProps> = ({ content, isActive }) => {
  // Add console.log to debug when a slide becomes active
  console.log(`Slide isActive: ${isActive}, content starts with: ${content.substring(0, 30)}`);
  
  return (
    <div 
      className={`absolute inset-0 p-8 transition-opacity duration-300 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 -z-10'
      }`}
      style={{
        // Force visibility styles to make sure they're applied
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 10 : -10,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
        <ReactMarkdown 
          className="prose prose-lg max-w-none"
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownSlide;