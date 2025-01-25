import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * MarkdownSlide component renders Markdown content as a slide
 * using react-markdown with GitHub Flavored Markdown support.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.content - The Markdown content to be rendered
 * @returns {JSX.Element} A div containing the rendered Markdown content
 */
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