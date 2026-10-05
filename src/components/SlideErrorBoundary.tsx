import React from 'react';

interface SlideErrorBoundaryProps {
  children: React.ReactNode;
  // Changing this value clears a caught error (e.g. on slide navigation or new content)
  resetKey?: unknown;
}

interface SlideErrorBoundaryState {
  error: Error | null;
}

// Contains render errors to a single slide so one malformed block can't take down the deck
class SlideErrorBoundary extends React.Component<SlideErrorBoundaryProps, SlideErrorBoundaryState> {
  state: SlideErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): SlideErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Failed to render slide:', error, info.componentStack);
  }

  componentDidUpdate(prevProps: SlideErrorBoundaryProps): void {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="rounded-lg border p-6 text-center"
          style={{ borderColor: 'var(--slide-muted)', color: 'var(--slide-text)' }}
        >
          <h2 className="text-xl font-semibold mb-2">This slide couldn't be rendered</h2>
          <p className="text-sm" style={{ color: 'var(--slide-muted)' }}>
            {this.state.error.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default SlideErrorBoundary;
