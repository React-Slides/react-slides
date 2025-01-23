import React, { useState, useEffect } from 'react';
import SlideDeck from './components/SlideDeck';
import ReactMarkdown from 'react-markdown';

function App() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [isPresentation, setIsPresentation] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');

  useEffect(() => {
    // Load README.md for landing page
    const loadReadme = async () => {
      try {
        const response = await fetch('/README.md');
        const content = await response.text();
        setReadmeContent(content);
      } catch (error) {
        console.error('Error loading README:', error);
      }
    };

    loadReadme();
  }, []);

  const startPresentation = async () => {
    try {
      const response = await fetch('/content.md');
      const content = await response.text();
      setMarkdownContent(content);
      setIsPresentation(true);
    } catch (error) {
      console.error('Error loading slides:', error);
    }
  };

  if (isPresentation) {
    return <SlideDeck markdownContent={markdownContent} />;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <ReactMarkdown>{readmeContent}</ReactMarkdown>
        <button
          onClick={startPresentation}
          className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Presentation
        </button>
      </div>
    </div>
  );
}

export default App;