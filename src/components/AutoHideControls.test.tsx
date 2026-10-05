import { render, screen, fireEvent } from '@testing-library/react';
import AutoHideControls from './AutoHideControls';

const pointerAt = (type: 'pointerMove' | 'pointerDown', clientX: number, clientY: number) => {
  // jsdom has no PointerEvent constructor, so fire a MouseEvent with the pointer event type
  fireEvent[type](window, { clientX, clientY });
};

describe('AutoHideControls', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  });

  const renderControls = (forceVisible?: boolean) =>
    render(
      <AutoHideControls forceVisible={forceVisible}>
        <button>Export PDF</button>
      </AutoHideControls>
    );

  it('is hidden until the pointer reaches the bottom-left corner', () => {
    renderControls();
    const controls = screen.getByTestId('auto-hide-controls');

    expect(controls).toHaveAttribute('data-visible', 'false');
    expect(controls).toHaveClass('opacity-0', 'pointer-events-none');

    pointerAt('pointerMove', 100, 750);
    expect(controls).toHaveAttribute('data-visible', 'true');
    expect(controls).toHaveClass('opacity-100');
  });

  it('hides again when the pointer leaves the corner', () => {
    renderControls();
    const controls = screen.getByTestId('auto-hide-controls');

    pointerAt('pointerMove', 100, 750);
    pointerAt('pointerMove', 700, 300);
    expect(controls).toHaveAttribute('data-visible', 'false');
  });

  it('reveals on a tap in the corner for touch screens', () => {
    renderControls();

    pointerAt('pointerDown', 50, 790);
    expect(screen.getByTestId('auto-hide-controls')).toHaveAttribute('data-visible', 'true');
  });

  it('stays visible while forceVisible is set', () => {
    renderControls(true);

    pointerAt('pointerMove', 700, 300);
    expect(screen.getByTestId('auto-hide-controls')).toHaveAttribute('data-visible', 'true');
  });

  it('keeps buttons reachable by keyboard', () => {
    renderControls();

    expect(screen.getByRole('button', { name: 'Export PDF' })).toBeInTheDocument();
    expect(screen.getByTestId('auto-hide-controls')).toHaveClass('focus-within:opacity-100');
  });
});
