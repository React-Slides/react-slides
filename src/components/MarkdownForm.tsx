import React, { useState } from 'react';
import { MarkdownFormState } from '../types';
import MetaPrompt from './MetaPrompt';
import { EXAMPLE_MARKDOWN } from 'src/constants/exampleMarkdown';
import { themeButtons, ThemeName } from '../utils/themes';
import { injectTheme } from '../utils/parseFrontmatter';

interface MarkdownFormProps {
  onSubmit: (markdown: string) => void;
}

const MarkdownForm: React.FC<MarkdownFormProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState<MarkdownFormState>({
    markdown: EXAMPLE_MARKDOWN,
    isSubmitting: false,
    error: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setFormState({
      ...formState,
      markdown: e.target.value
    });
  };

  const handleThemeClick = (themeName: ThemeName): void => {
    if (!formState.markdown.trim()) {
      setFormState({
        ...formState,
        error: 'Please enter some markdown content'
      });
      return;
    }

    setFormState({
      ...formState,
      isSubmitting: true,
      error: null
    });

    try {
      // Inject theme into frontmatter and update textarea
      const updatedMarkdown = injectTheme(formState.markdown, themeName);

      // Update the textarea to show the frontmatter
      setFormState({
        ...formState,
        markdown: updatedMarkdown,
        isSubmitting: false,
        error: null
      });

      // Submit the markdown with theme
      onSubmit(updatedMarkdown);
    } catch (error) {
      setFormState({
        ...formState,
        isSubmitting: false,
        error: 'Failed to create slides'
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Create Slides from Markdown</h2>

      <MetaPrompt />

      <div>
        <div className="mb-4">
          <label htmlFor="markdown" className="block mb-2 text-gray-700 font-medium">
            Paste your markdown content below:
          </label>
          <textarea
            id="markdown"
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            value={formState.markdown}
            onChange={handleChange}
            placeholder="# Slide Title\n\nContent goes here\n\n---\n\n# Next Slide\n\nMore content..."
          />
        </div>

        {formState.error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {formState.error}
          </div>
        )}

        {/* Theme selection buttons */}
        <div className="mb-2">
          <label className="block mb-2 text-gray-700 font-medium">
            Create Slides:
          </label>
          <div className="flex flex-wrap gap-2">
            {themeButtons.map((theme) => (
              <button
                key={theme.name}
                type="button"
                onClick={() => handleThemeClick(theme.name)}
                disabled={formState.isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                title={`Create slides with ${theme.label} theme`}
              >
                {/* Color swatch */}
                <span
                  className="w-4 h-4 rounded border border-gray-400"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-gray-700">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {formState.isSubmitting && (
          <div className="mt-2 text-gray-600">Creating slides...</div>
        )}
      </div>
    </div>
  );
};

export default MarkdownForm;
