import React, { useState, useEffect } from 'react';
import SlideDeck from './components/SlideDeck';
import ReactMarkdown from 'react-markdown';

function App() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [slides, setSlides] = useState([]);
  const [isFullPresentation, setIsFullPresentation] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('./content.md');
        const content = await response.text();
        setMarkdownContent(content);
        // Split content into slides
        const allSlides = content.split('---').map(slide => slide.trim());
        setSlides(allSlides);
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, []);

  const startPresentation = () => {
    setIsFullPresentation(true);
  };

  if (isFullPresentation) {
    return <SlideDeck markdownContent={markdownContent} />;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <ReactMarkdown>{slides[0] || ''}</ReactMarkdown>
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