import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { MarkdownSlideProps } from '../types';

const MarkdownSlide: React.FC<MarkdownSlideProps> = ({ content, isActive }) => {
  // Add console.log to debug when a slide becomes active
  console.log(`Slide isActive: ${isActive}, content starts with: ${content.substring(0, 30)}`);

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