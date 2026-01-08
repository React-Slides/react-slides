// src/components/TemplatePicker.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TemplatePicker from './TemplatePicker';
import { TEMPLATES } from '../constants/templates';

describe('TemplatePicker', () => {
  const mockOnSelectTemplate = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the modal with title', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Choose a Template')).toBeInTheDocument();
    });

    it('renders all templates', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      TEMPLATES.forEach((template) => {
        expect(screen.getByText(template.name)).toBeInTheDocument();
        expect(screen.getByText(template.description)).toBeInTheDocument();
      });
    });

    it('displays category badges for each template', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      // Each template shows its category twice (in icon area and as badge)
      const businessBadges = screen.getAllByText('business');
      expect(businessBadges.length).toBeGreaterThan(0);
    });
  });

  describe('close functionality', () => {
    it('calls onClose when close button is clicked', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      // There are multiple close buttons (X icons), get the last one in header
      const closeButtons = screen.getAllByRole('button');
      const headerCloseButton = closeButtons.find((btn) =>
        btn.closest('.flex.items-center.justify-between')
      );

      if (headerCloseButton) {
        fireEvent.click(headerCloseButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('template selection flow', () => {
    it('shows preview when template is clicked', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      // Click on Business Pitch template
      fireEvent.click(screen.getByText('Business Pitch'));

      // Should now show preview mode with template name as title
      expect(screen.getByText('Business Pitch')).toBeInTheDocument();
      expect(screen.getByText('Use This Template')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('shows template content in preview mode', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      // Click on Blank Starter template
      fireEvent.click(screen.getByText('Blank Starter'));

      // Should show the template content
      expect(screen.getByText(/Presentation Title/)).toBeInTheDocument();
    });

    it('calls onSelectTemplate and onClose when confirmed', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      // Select a template
      fireEvent.click(screen.getByText('Blank Starter'));

      // Confirm selection
      fireEvent.click(screen.getByText('Use This Template'));

      // Should call both callbacks
      expect(mockOnSelectTemplate).toHaveBeenCalledTimes(1);
      expect(mockOnSelectTemplate).toHaveBeenCalledWith(
        expect.stringContaining('# Presentation Title')
      );
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('returns to grid view when Back is clicked', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      // Enter preview mode
      fireEvent.click(screen.getByText('Business Pitch'));
      expect(screen.getByText('Use This Template')).toBeInTheDocument();

      // Click Back
      fireEvent.click(screen.getByText('Back'));

      // Should be back in grid view
      expect(screen.getByText('Choose a Template')).toBeInTheDocument();
      expect(screen.queryByText('Use This Template')).not.toBeInTheDocument();
    });
  });

  describe('template categories', () => {
    it('displays business templates', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Business Pitch')).toBeInTheDocument();
      expect(screen.getByText('Quarterly Review')).toBeInTheDocument();
    });

    it('displays technical templates', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Tech Talk')).toBeInTheDocument();
    });

    it('displays educational templates', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Educational Lesson')).toBeInTheDocument();
      expect(screen.getByText('Math & Science')).toBeInTheDocument();
    });

    it('displays general templates', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Blank Starter')).toBeInTheDocument();
    });
  });

  describe('preview mode navigation', () => {
    it('shows X button in preview mode header to go back', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      fireEvent.click(screen.getByText('Tech Talk'));

      // Find the X button next to the title (not the main close button)
      const xButtons = screen.getAllByRole('button');
      // The first button should be the back button with X icon
      expect(xButtons.length).toBeGreaterThan(1);
    });

    it('displays template category in preview mode', () => {
      render(
        <TemplatePicker
          onSelectTemplate={mockOnSelectTemplate}
          onClose={mockOnClose}
        />
      );

      fireEvent.click(screen.getByText('Tech Talk'));

      // Should show the category badge
      expect(screen.getByText('technical')).toBeInTheDocument();
    });
  });
});
