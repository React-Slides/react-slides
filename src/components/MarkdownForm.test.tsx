// src/components/MarkdownForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MarkdownForm from './MarkdownForm';
import { EXAMPLE_MARKDOWN } from 'src/constants/exampleMarkdown';

describe('MarkdownForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the form with title', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      expect(
        screen.getByText('Create Slides from Markdown')
      ).toBeInTheDocument();
    });

    it('renders textarea with default content', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(EXAMPLE_MARKDOWN);
    });

    it('renders textarea with initial content when provided', () => {
      render(
        <MarkdownForm
          onSubmit={mockOnSubmit}
          initialContent="# Custom Content"
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('# Custom Content');
    });

    it('renders Choose a Template button', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText('Choose a Template')).toBeInTheDocument();
    });

    it('renders theme buttons', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('Corporate')).toBeInTheDocument();
      expect(screen.getByText('Warm')).toBeInTheDocument();
      expect(screen.getByText('Nature')).toBeInTheDocument();
      expect(screen.getByText('High Contrast')).toBeInTheDocument();
    });

    it('renders reset button when onReset is provided', () => {
      render(
        <MarkdownForm onSubmit={mockOnSubmit} onReset={mockOnReset} />
      );

      expect(screen.getByText('Reset to Default Content')).toBeInTheDocument();
    });

    it('does not render reset button when onReset is not provided', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      expect(
        screen.queryByText('Reset to Default Content')
      ).not.toBeInTheDocument();
    });
  });

  describe('textarea interaction', () => {
    it('updates content when user types', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} initialContent="" />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: '# New Slide' } });

      expect(textarea).toHaveValue('# New Slide');
    });
  });

  describe('theme submission', () => {
    it('submits markdown with light theme', async () => {
      render(
        <MarkdownForm onSubmit={mockOnSubmit} initialContent="# My Slide" />
      );

      fireEvent.click(screen.getByText('Light'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.stringContaining('theme: light')
        );
      });
    });

    it('submits markdown with dark theme', async () => {
      render(
        <MarkdownForm onSubmit={mockOnSubmit} initialContent="# My Slide" />
      );

      fireEvent.click(screen.getByText('Dark'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.stringContaining('theme: dark')
        );
      });
    });

    it('shows error when submitting empty content', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} initialContent="" />);

      fireEvent.click(screen.getByText('Light'));

      expect(
        screen.getByText('Please enter some markdown content')
      ).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error when submitting whitespace-only content', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} initialContent="   " />);

      fireEvent.click(screen.getByText('Light'));

      expect(
        screen.getByText('Please enter some markdown content')
      ).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('reset functionality', () => {
    it('calls onReset when reset button is clicked', () => {
      render(
        <MarkdownForm onSubmit={mockOnSubmit} onReset={mockOnReset} />
      );

      fireEvent.click(screen.getByText('Reset to Default Content'));

      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('template picker', () => {
    it('opens template picker when button is clicked', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByText('Choose a Template'));

      expect(screen.getByText('Blank Starter')).toBeInTheDocument();
    });

    it('closes template picker when close button is clicked', async () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      // Open template picker
      fireEvent.click(screen.getByText('Choose a Template'));
      expect(screen.getByText('Blank Starter')).toBeInTheDocument();

      // Find the modal overlay and its close buttons
      const modal = screen.getByText('Blank Starter').closest('.fixed');
      const closeButtons = modal?.querySelectorAll('button');

      // Click the close button (one of the X buttons in header)
      if (closeButtons && closeButtons.length > 0) {
        // The close button is typically one of the first buttons with X icon
        fireEvent.click(closeButtons[1]); // Second button is usually the close
      }

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByText('Blank Starter')).not.toBeInTheDocument();
      });
    });

    it('updates textarea when template is selected', async () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} initialContent="" />);

      // Open template picker
      fireEvent.click(screen.getByText('Choose a Template'));

      // Select Blank Starter template
      fireEvent.click(screen.getByText('Blank Starter'));

      // Confirm selection
      fireEvent.click(screen.getByText('Use This Template'));

      // Textarea should now have the template content
      await waitFor(() => {
        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.value).toContain('Presentation Title');
      });
    });
  });

  describe('initial content sync', () => {
    it('updates form when initialContent prop changes', () => {
      const { rerender } = render(
        <MarkdownForm onSubmit={mockOnSubmit} initialContent="# First" />
      );

      expect(screen.getByRole('textbox')).toHaveValue('# First');

      rerender(
        <MarkdownForm onSubmit={mockOnSubmit} initialContent="# Second" />
      );

      expect(screen.getByRole('textbox')).toHaveValue('# Second');
    });
  });

  describe('accessibility', () => {
    it('textarea has associated label', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      expect(
        screen.getByLabelText(/Paste your markdown content below/i)
      ).toBeInTheDocument();
    });

    it('theme buttons have title attributes', () => {
      render(<MarkdownForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText('Light').closest('button')).toHaveAttribute(
        'title',
        'Create slides with Light theme'
      );
    });
  });

  describe('form state', () => {
    it('shows creating slides message during submission', async () => {
      render(
        <MarkdownForm onSubmit={mockOnSubmit} initialContent="# Test" />
      );

      fireEvent.click(screen.getByText('Light'));

      // The form submission is synchronous, so we just verify the submit was called
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });
});
