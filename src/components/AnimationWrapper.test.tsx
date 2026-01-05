import { render, screen } from '@testing-library/react';
import AnimationWrapper from './AnimationWrapper';

describe('AnimationWrapper', () => {
  it('renders children correctly', () => {
    render(
      <AnimationWrapper config={{ type: 'bounce' }}>
        <span>Test Content</span>
      </AnimationWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct CSS class for bounce animation type', () => {
    render(
      <AnimationWrapper config={{ type: 'bounce' }}>
        <span>Bounce Content</span>
      </AnimationWrapper>
    );

    const wrapper = screen.getByText('Bounce Content').parentElement;
    expect(wrapper).toHaveClass('animate-bounce');
  });

  it('applies correct CSS class for spin animation type', () => {
    render(
      <AnimationWrapper config={{ type: 'spin' }}>
        <span>Spin Content</span>
      </AnimationWrapper>
    );

    const wrapper = screen.getByText('Spin Content').parentElement;
    expect(wrapper).toHaveClass('animate-spin');
  });

  it('applies correct CSS class for ping animation type', () => {
    render(
      <AnimationWrapper config={{ type: 'ping' }}>
        <span>Ping Content</span>
      </AnimationWrapper>
    );

    const wrapper = screen.getByText('Ping Content').parentElement;
    expect(wrapper).toHaveClass('animate-ping');
  });

  it('applies correct CSS class for pulse animation type', () => {
    render(
      <AnimationWrapper config={{ type: 'pulse' }}>
        <span>Pulse Content</span>
      </AnimationWrapper>
    );

    const wrapper = screen.getByText('Pulse Content').parentElement;
    expect(wrapper).toHaveClass('animate-pulse');
  });

  it('applies default animation duration when not specified', () => {
    render(
      <AnimationWrapper config={{ type: 'bounce' }}>
        <span>Default Duration</span>
      </AnimationWrapper>
    );

    const wrapper = screen.getByText('Default Duration').parentElement;
    expect(wrapper).toHaveStyle({ animationDuration: '1s' });
  });

  it('applies default animation delay when not specified', () => {
    render(
      <AnimationWrapper config={{ type: 'bounce' }}>
        <span>Default Delay</span>
      </AnimationWrapper>
    );

    const wrapper = screen.getByText('Default Delay').parentElement;
    expect(wrapper).toHaveStyle({ animationDelay: '0s' });
  });

  it('applies custom animation duration when specified', () => {
    render(
      <AnimationWrapper config={{ type: 'spin', duration: '2s' }}>
        <span>Custom Duration</span>
      </AnimationWrapper>
    );

    const wrapper = screen.getByText('Custom Duration').parentElement;
    expect(wrapper).toHaveStyle({ animationDuration: '2s' });
  });

  it('applies custom animation delay when specified', () => {
    render(
      <AnimationWrapper config={{ type: 'pulse', delay: '500ms' }}>
        <span>Custom Delay</span>
      </AnimationWrapper>
    );

    const wrapper = screen.getByText('Custom Delay').parentElement;
    expect(wrapper).toHaveStyle({ animationDelay: '500ms' });
  });
});
