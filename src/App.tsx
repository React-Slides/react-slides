import React, { useState, useEffect } from 'react';
import SlideDeck from './components/SlideDeck';
import MarkdownForm from './components/MarkdownForm';

const App: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const handleSubmit = (markdown: string): void => {
    setMarkdownContent(markdown);
    setIsEditing(false);
  };

  const handleExportToPDF = (): void => {
    // TODO Implement pdf ecport functionality
    console.log('Export to pdf clicked');
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {isEditing ? (
        <div className="max-w-4xl mx-auto py-8 px-4">
          <MarkdownForm onSubmit={handleSubmit} />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col">
          <div className="flex-1 relative">
            <SlideDeck markdownContent={markdownContent} />
          </div>
          
          {/* Button group in bottom-left */}
          <div className="fixed bottom-4 left-4 flex gap-2 z-20">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Slides
            </button>
            <button
              onClick={handleExportToPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export to PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;