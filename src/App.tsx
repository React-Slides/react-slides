import React, { useState, useEffect } from 'react';
import SlideDeck from './components/SlideDeck';

const App: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch the initial markdown content from the public folder
    const fetchMarkdown = async (): Promise<void> => {
      try {
        const response = await fetch('/content.md');
        const content = await response.text();
        setMarkdownContent(content);
      } catch (error) {
        console.error('Failed to fetch markdown content:', error);
      }
    };

    fetchMarkdown();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl h-full">
        <SlideDeck markdownContent={markdownContent} />
      </div>
    </div>
  );
};

export default App;