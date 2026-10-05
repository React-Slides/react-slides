import { render, screen } from '@testing-library/react';
import SlideErrorBoundary from './SlideErrorBoundary';

const Boom: React.FC<{ explode: boolean }> = ({ explode }) => {
  if (explode) throw new Error('kaboom');
  return <p>fine</p>;
};

describe('SlideErrorBoundary', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <SlideErrorBoundary>
        <Boom explode={false} />
      </SlideErrorBoundary>
    );
    expect(screen.getByText('fine')).toBeInTheDocument();
  });

  it('renders a fallback with the error message when a child throws', () => {
    render(
      <SlideErrorBoundary>
        <Boom explode />
      </SlideErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveTextContent("This slide couldn't be rendered");
    expect(screen.getByRole('alert')).toHaveTextContent('kaboom');
  });

  it('recovers when resetKey changes', () => {
    const { rerender } = render(
      <SlideErrorBoundary resetKey={1}>
        <Boom explode />
      </SlideErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(
      <SlideErrorBoundary resetKey={2}>
        <Boom explode={false} />
      </SlideErrorBoundary>
    );
    expect(screen.getByText('fine')).toBeInTheDocument();
  });

  it('stays in the error state when resetKey is unchanged', () => {
    const { rerender } = render(
      <SlideErrorBoundary resetKey={1}>
        <Boom explode />
      </SlideErrorBoundary>
    );

    rerender(
      <SlideErrorBoundary resetKey={1}>
        <Boom explode={false} />
      </SlideErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
