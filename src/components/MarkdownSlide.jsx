import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownSlide = ({ content }) => {
  return (
    <div className="markdown-slide h-full w-full p-8 overflow-auto">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        className="prose prose-lg max-w-none"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownSlide;