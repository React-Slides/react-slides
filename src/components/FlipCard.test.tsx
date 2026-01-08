// src/components/FlipCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import FlipCard from './FlipCard';

describe('FlipCard', () => {
  const frontContent = <div>Front Content</div>;
  const backContent = <div>Back Content</div>;

  describe('rendering', () => {
    it('renders front and back content', () => {
      render(<FlipCard front={frontContent} back={backContent} />);

      expect(screen.getByText('Front Content')).toBeInTheDocument();
      expect(screen.getByText('Back Content')).toBeInTheDocument();
    });

    it('applies size class correctly', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} size="large" />
      );

      expect(container.querySelector('.flip-card-large')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} className="custom-class" />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('defaults to medium size', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} />
      );

      expect(container.querySelector('.flip-card-medium')).toBeInTheDocument();
    });
  });

  describe('click interaction', () => {
    it('flips when clicked', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} />
      );

      const card = container.querySelector('.flip-card');
      expect(card).not.toHaveClass('flipped');

      fireEvent.click(card!);
      expect(card).toHaveClass('flipped');
    });

    it('toggles flip state on subsequent clicks', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} />
      );

      const card = container.querySelector('.flip-card')!;

      fireEvent.click(card);
      expect(card).toHaveClass('flipped');

      fireEvent.click(card);
      expect(card).not.toHaveClass('flipped');
    });

    it('does not flip when disabled', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} disabled={true} />
      );

      const card = container.querySelector('.flip-card')!;
      fireEvent.click(card);

      expect(card).not.toHaveClass('flipped');
    });
  });

  describe('keyboard interaction', () => {
    it('flips on Enter key', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} />
      );

      const card = container.querySelector('.flip-card')!;
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(card).toHaveClass('flipped');
    });

    it('flips on Space key', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} />
      );

      const card = container.querySelector('.flip-card')!;
      fireEvent.keyDown(card, { key: ' ' });

      expect(card).toHaveClass('flipped');
    });

    it('does not flip on other keys', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} />
      );

      const card = container.querySelector('.flip-card')!;
      fireEvent.keyDown(card, { key: 'Tab' });

      expect(card).not.toHaveClass('flipped');
    });

    it('does not flip on keyboard when disabled', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} disabled={true} />
      );

      const card = container.querySelector('.flip-card')!;
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(card).not.toHaveClass('flipped');
    });
  });

  describe('accessibility', () => {
    it('has button role', () => {
      render(<FlipCard front={frontContent} back={backContent} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has tabIndex 0 when not disabled', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} />
      );

      const card = container.querySelector('.flip-card');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('has tabIndex -1 when disabled', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} disabled={true} />
      );

      const card = container.querySelector('.flip-card');
      expect(card).toHaveAttribute('tabIndex', '-1');
    });

    it('has appropriate aria-label when not flipped', () => {
      render(<FlipCard front={frontContent} back={backContent} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Click to show visualization'
      );
    });

    it('has appropriate aria-label when flipped', () => {
      const { container } = render(
        <FlipCard front={frontContent} back={backContent} />
      );

      const card = container.querySelector('.flip-card')!;
      fireEvent.click(card);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Click to show equation'
      );
    });
  });
});
