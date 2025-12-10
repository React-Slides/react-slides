import React, { useState, useEffect } from 'react';
import SlideDeck from './components/SlideDeck';
import MarkdownForm from './components/MarkdownForm';
import { exportSlidesToPDF } from './utils/exportSlidesToPDF';
import { exportSlidesToPPTX } from './utils/exportSlidesToPPTX';

const App: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isExportingPPTX, setIsExportingPPTX] = useState<boolean>(false);

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

  // ✅ Safe PDF export handler that avoids circular structure errors
  const handleExportPDF = async (): Promise<void> => {
    if (!markdownContent) {
      console.warn('No content available for export');
      return;
    }

    setIsExporting(true);
    try {
      await exportSlidesToPDF(markdownContent);
      console.log('PDF export completed successfully');
    } catch (error) {
      console.error('Export failed:', error instanceof Error ? error.message : 'Unknown error');
      // You could add a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPTX = async (): Promise<void> => {
    if (!markdownContent) {
      console.warn('No content available for export');
      return;
    }

    setIsExportingPPTX(true);
    try {
      await exportSlidesToPPTX(markdownContent);
      console.log('PPTX export completed successfully');
    } catch (error) {
      console.error('Export failed:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExportingPPTX(false);
    }
  };

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
          
          {/* Action buttons */}
          <button
            onClick={() => setIsEditing(true)}
            className="fixed bottom-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 z-20"
          >
            Edit Slides
          </button>
          
          {/* ✅ Export PDF button - positioned next to Edit Slides button */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting || !markdownContent}
            className="fixed bottom-4 left-32 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>

          {/* Export PPTX button */}
          <button
            onClick={handleExportPPTX}
            disabled={isExportingPPTX || !markdownContent}
            className="fixed bottom-4 left-64 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          >
            {isExportingPPTX ? 'Exporting...' : 'Export PPTX'}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;