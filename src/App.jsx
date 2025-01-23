import React, { useState, useEffect } from 'react';
import SlideDeck from './components/SlideDeck';

function App() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/sample.md')
      .then(res => res.text())
      .then(text => setMarkdown(text))
      .catch(err => console.error('Error loading markdown:', err));
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl h-full">
        <SlideDeck markdown={markdown} />
      </div>
    </div>
  );
}

export default App;