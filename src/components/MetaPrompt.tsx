import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const MetaPrompt: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const metaPromptText = `I want you to create a slide deck on the following topic: [YOUR TOPIC HERE]. 

Please follow these guidelines:
1. Format your response as markdown
2. Separate each slide with exactly three hyphens on a single line: "---"
3. Use markdown formatting (headers, bullet points, bold, etc.) to make the content visually organized
4. Start each slide with a clear heading (# Slide Title)
5. Keep each slide focused on a single concept or idea
6. Include 5-8 slides total, including a title slide and a conclusion slide
7. Use bullet points for clarity where appropriate

Structure should be roughly:
- Title slide with presentation title and subtitle
- Introduction slide explaining what the presentation covers
- 2-5 content slides covering key points
- Conclusion slide summarizing main takeaways

After you generate the slide content, I'll paste it into a slide deck generator tool that automatically formats slides based on the markdown and slide separators you provide.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(metaPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">LLM Meta-Prompt Template</h3>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      <div className="bg-white p-4 rounded border border-gray-300 text-sm font-mono whitespace-pre-wrap">
        {metaPromptText}
      </div>
      
      <p className="mt-4 text-gray-600 text-sm">
        Copy this prompt and paste it to Claude, ChatGPT, or any other LLM. Paste the resulting markdown below to generate your slides.
      </p>
    </div>
  );
};

export default MetaPrompt;