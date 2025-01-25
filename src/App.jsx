import React, { useState, useEffect } from 'react';
import SlideDeck from './components/SlideDeck';
import ReactMarkdown from 'react-markdown';

/**
 * Main application component that handles the presentation mode switching and content loading.
 * Initially displays the first slide with a start button, then transitions to full presentation mode.
 * 
 * @component
 * @returns {JSX.Element} Either the presentation preview or full SlideDeck component
 */
function App() {
  // State for storing the raw markdown content
  const [markdownContent, setMarkdownContent] = useState('');
  // State for storing parsed slides
  const [slides, setSlides] = useState([]);
  // State for tracking presentation mode
  const [isFullPresentation, setIsFullPresentation] = useState(false);

  /**
   * Effect hook to load and parse the markdown content when component mounts.
   * Fetches content from content.md file and splits it into individual slides.
   */
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

  /**
   * Switches the application to full presentation mode
   */
  const startPresentation = () => {
    setIsFullPresentation(true);
  };

  // Render full presentation mode if active
  if (isFullPresentation) {
    return <SlideDeck markdownContent={markdownContent} />;
  }

  // Render preview mode with first slide and start button
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