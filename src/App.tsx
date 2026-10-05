import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SlideDeck from './components/SlideDeck';
import MarkdownForm from './components/MarkdownForm';
import AutoHideControls from './components/AutoHideControls';
import { exportSlidesToPDF } from './utils/exportSlidesToPDF';
import { exportSlidesToPPTX } from './utils/exportSlidesToPPTX';
import { parseFrontmatter } from './utils/parseFrontmatter';
import { ThemeName } from './utils/themes';
import { useToast } from './contexts/ToastContext';
import { DECK_FILE_CHANGED_EVENT, DeckFileChangedPayload, getDeckFileParam } from './utils/deckFile';

const STORAGE_KEY = 'react-slides-draft';

const App: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isExportingPPTX, setIsExportingPPTX] = useState<boolean>(false);
  const { addToast } = useToast();
  // `?deck=My-Talk.md` presents that file instead of the saved draft, and reloads it on save
  const [deckFile] = useState(() => getDeckFileParam(window.location.search));

  // Parse frontmatter to extract theme and content
  const { theme, content } = useMemo(() => {
    if (!markdownContent) {
      return { theme: 'light' as ThemeName, content: undefined };
    }
    return parseFrontmatter(markdownContent);
  }, [markdownContent]);

  const loadDeckFile = useCallback(async (file: string): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}${file}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setMarkdownContent(await response.text());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      addToast('error', `Failed to load ${file}: ${message}`);
    }
  }, [addToast]);

  // Load content: a ?deck= file if given, else the saved draft, else content.md
  useEffect(() => {
    const loadContent = async (): Promise<void> => {
      if (deckFile) {
        await loadDeckFile(deckFile);
        return;
      }

      // Check localStorage for saved draft
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        setMarkdownContent(savedDraft);
        return;
      }

      // Fall back to fetching default content
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}content.md`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const content = await response.text();
        setMarkdownContent(content);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        addToast('error', `Failed to load content: ${message}`);
      }
    };

    loadContent();
  }, [addToast, deckFile, loadDeckFile]);

  // In dev, reload the ?deck= file whenever it's saved (see deckFileReload in vite.config.ts).
  // The slide position is kept because SlideDeck only receives new content.
  useEffect(() => {
    const hot = import.meta.hot;
    if (!deckFile || !hot) return;

    const handleChange = (payload: DeckFileChangedPayload) => {
      if (payload.file === deckFile) void loadDeckFile(deckFile);
    };
    hot.on(DECK_FILE_CHANGED_EVENT, handleChange);
    return () => hot.off(DECK_FILE_CHANGED_EVENT, handleChange);
  }, [deckFile, loadDeckFile]);

  // Save to localStorage whenever content changes. A ?deck= file is the source of truth,
  // so it doesn't overwrite the saved draft.
  useEffect(() => {
    if (markdownContent !== undefined && !deckFile) {
      localStorage.setItem(STORAGE_KEY, markdownContent);
    }
  }, [markdownContent, deckFile]);

  // Clear saved draft and reload default content
  const handleResetToDefault = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}content.md`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const content = await response.text();
      setMarkdownContent(content);
      addToast('info', 'Content reset to default');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      addToast('error', `Failed to reset content: ${message}`);
    }
  }, [addToast]);

  const handleSubmit = (markdown: string): void => {
    setMarkdownContent(markdown);
    setIsEditing(false);
  };

  // Safe PDF export handler with toast notifications
  const handleExportPDF = async (): Promise<void> => {
    if (!content) {
      addToast('warning', 'No content available for export');
      return;
    }

    setIsExporting(true);
    try {
      await exportSlidesToPDF(content, theme);
      addToast('success', 'PDF exported successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      addToast('error', `PDF export failed: ${message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPTX = async (): Promise<void> => {
    if (!content) {
      addToast('warning', 'No content available for export');
      return;
    }

    setIsExportingPPTX(true);
    try {
      await exportSlidesToPPTX(content, theme);
      addToast('success', 'PPTX exported successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      addToast('error', `PPTX export failed: ${message}`);
    } finally {
      setIsExportingPPTX(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {isEditing ? (
        <div className="max-w-4xl mx-auto py-8 px-4">
          <MarkdownForm
            onSubmit={handleSubmit}
            initialContent={markdownContent}
            onReset={handleResetToDefault}
          />
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
            <SlideDeck markdownContent={content} theme={theme} />
          </div>

          {/* Action buttons: hidden while presenting, shown when the pointer nears the bottom-left */}
          <AutoHideControls forceVisible={isExporting || isExportingPPTX}>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Slides
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting || !content}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>

            <button
              onClick={handleExportPPTX}
              disabled={isExportingPPTX || !content}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExportingPPTX ? 'Exporting...' : 'Export PPTX'}
            </button>
          </AutoHideControls>
        </div>
      )}
    </div>
  );
};

export default App;
