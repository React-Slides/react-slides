import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
// Note: katex CSS must be imported by the consumer app
import { MarkdownSlideProps } from '../types';
import remarkLucideIcons, { getLucideIcon } from '../utils/remarkLucideIcons';

const markdownComponents = {
  // remarkLucideIcons marks each `:lucide-name:` shortcode as a span with data-lucide-icon
  span: ({ node: _node, ...props }: React.HTMLAttributes<HTMLSpanElement> & { node?: unknown }) => {
    const name = (props as Record<string, unknown>)['data-lucide-icon'];
    const Icon = typeof name === 'string' ? getLucideIcon(name) : undefined;
    if (!Icon) return <span {...props} />;

    return (
      <Icon
        data-lucide-icon={name}
        aria-hidden="true"
        className="lucide-inline-icon"
        style={{
          display: 'inline-block',
          width: '1em',
          height: '1em',
          verticalAlign: '-0.125em',
          color: 'var(--slide-accent)',
        }}
      />
    );
  },
};

const MarkdownSlide: React.FC<MarkdownSlideProps> = ({ content, isActive: _isActive }) => {
  return (
    <div className="w-full">
      <ReactMarkdown
        className="prose prose-lg max-w-none"
        remarkPlugins={[remarkGfm, remarkMath, remarkLucideIcons]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins={[rehypeKatex] as any}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownSlide;
