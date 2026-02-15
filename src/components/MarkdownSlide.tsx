import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
// Note: katex CSS must be imported by the consumer app
import { MarkdownSlideProps } from '../types';

const MarkdownSlide: React.FC<MarkdownSlideProps> = ({ content, isActive: _isActive }) => {
  return (
    <div className="w-full">
      <ReactMarkdown
        className="prose prose-lg max-w-none"
        remarkPlugins={[remarkGfm, remarkMath]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins={[rehypeKatex] as any}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownSlide;