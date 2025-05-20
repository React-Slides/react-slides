import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownSlideProps } from '../types';

const MarkdownSlide: React.FC<MarkdownSlideProps> = ({ content, isActive }) => {
  return (
    <div 
      className={`absolute inset-0 p-8 transition-opacity duration-300 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 -z-10'
      }`}
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