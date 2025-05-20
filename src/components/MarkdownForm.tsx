import React, { useState } from 'react';
import { MarkdownFormState } from '../types';

interface MarkdownFormProps {
  onSubmit: (markdown: string) => void;
}

const MarkdownForm: React.FC<MarkdownFormProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState<MarkdownFormState>({
    markdown: '',
    isSubmitting: false,
    error: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setFormState({
      ...formState,
      markdown: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
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
      // Call the onSubmit callback with the markdown content
      onSubmit(formState.markdown);

      // Reset form after successful submission
      setFormState({
        markdown: '',
        isSubmitting: false,
        error: null
      });
    } catch (error) {
      setFormState({
        ...formState,
        isSubmitting: false,
        error: 'Failed to submit markdown content'
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Slides from Markdown</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="markdown" className="block mb-2 text-gray-700">
            Paste your markdown content below (use --- to separate slides):
          </label>
          <textarea
            id="markdown"
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formState.markdown}
            onChange={handleChange}
            placeholder="# Slide Title\n\nContent goes here\n\n---\n\n# Next Slide\n\nMore content..."
          />
        </div>

        {formState.error && (
          <div className="mb-4 text-red-500">{formState.error}</div>
        )}

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {formState.isSubmitting ? 'Submitting...' : 'Create Slides'}
        </button>
      </form>
    </div>
  );
};

export default MarkdownForm;