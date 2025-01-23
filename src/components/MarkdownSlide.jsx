import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

const MarkdownSlide = ({ content }) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        className="prose prose-lg max-w-none"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownSlide;