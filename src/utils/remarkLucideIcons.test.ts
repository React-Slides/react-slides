import { getLucideIcon, toLucideComponentName } from './remarkLucideIcons';

describe('remarkLucideIcons helpers', () => {
  it('converts kebab-case icon names to lucide-react component names', () => {
    expect(toLucideComponentName('zap')).toBe('Zap');
    expect(toLucideComponentName('alarm-clock')).toBe('AlarmClock');
    expect(toLucideComponentName('bar-chart-2')).toBe('BarChart2');
  });

  it('finds known icons and rejects unknown names', () => {
    expect(getLucideIcon('timer')).toBeDefined();
    expect(getLucideIcon('not-a-real-icon')).toBeUndefined();
  });

  it('does not resolve inherited object properties as icons', () => {
    expect(getLucideIcon('constructor')).toBeUndefined();
    expect(getLucideIcon('to-string')).toBeUndefined();
  });
});
