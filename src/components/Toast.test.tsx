// src/components/Toast.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import ToastContainer from './Toast';
import { ToastProvider, useToast } from '../contexts/ToastContext';
import React from 'react';

// Helper component to trigger toast actions
const ToastTrigger: React.FC<{
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}> = ({ type, message, duration }) => {
  const { addToast } = useToast();

  return (
    <button onClick={() => addToast(type, message, duration)}>
      Add {type} toast
    </button>
  );
};

// Wrapper for testing with provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    {children}
    <ToastContainer />
  </ToastProvider>
);

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders nothing when no toasts exist', () => {
      const { container } = render(
        <TestWrapper>
          <div>App Content</div>
        </TestWrapper>
      );

      // ToastContainer returns null when empty
      expect(container.querySelector('.fixed')).not.toBeInTheDocument();
    });

    it('renders success toast correctly', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="success" message="Operation successful!" />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add success toast'));

      expect(screen.getByText('Operation successful!')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
    });

    it('renders error toast correctly', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="error" message="An error occurred!" />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add error toast'));

      expect(screen.getByText('An error occurred!')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
    });

    it('renders warning toast correctly', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="warning" message="Warning: Check your input" />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add warning toast'));

      expect(screen.getByText('Warning: Check your input')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50');
    });

    it('renders info toast correctly', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="info" message="Here is some info" />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add info toast'));

      expect(screen.getByText('Here is some info')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
    });
  });

  describe('multiple toasts', () => {
    it('renders multiple toasts', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="success" message="Success message" />
          <ToastTrigger type="error" message="Error message" />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add success toast'));
      fireEvent.click(screen.getByText('Add error toast'));

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  describe('dismiss functionality', () => {
    it('removes toast when dismiss button is clicked', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="success" message="Dismissable toast" />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add success toast'));
      expect(screen.getByText('Dismissable toast')).toBeInTheDocument();

      const dismissButton = screen.getByLabelText('Dismiss notification');
      fireEvent.click(dismissButton);

      expect(screen.queryByText('Dismissable toast')).not.toBeInTheDocument();
    });
  });

  describe('auto-dismiss', () => {
    it('auto-removes toast after duration', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="info" message="Auto-dismiss toast" duration={3000} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add info toast'));
      expect(screen.getByText('Auto-dismiss toast')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.queryByText('Auto-dismiss toast')).not.toBeInTheDocument();
    });

    it('does not auto-remove toast with duration 0', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="info" message="Persistent toast" duration={0} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add info toast'));
      expect(screen.getByText('Persistent toast')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Should still be visible
      expect(screen.getByText('Persistent toast')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('toast has role alert', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="success" message="Alert message" />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add success toast'));

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('dismiss button has accessible label', () => {
      render(
        <TestWrapper>
          <ToastTrigger type="success" message="Test toast" />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Add success toast'));

      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    });
  });
});

describe('useToast hook', () => {
  it('throws error when used outside ToastProvider', () => {
    const TestComponent = () => {
      useToast();
      return null;
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    );

    consoleSpy.mockRestore();
  });
});
