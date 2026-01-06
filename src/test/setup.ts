import '@testing-library/jest-dom';

// Mock ResizeObserver which Recharts ResponsiveContainer requires
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock getBoundingClientRect for ResponsiveContainer
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 500,
  height: 400,
  top: 0,
  left: 0,
  bottom: 400,
  right: 500,
  x: 0,
  y: 0,
  toJSON: () => {},
}));
