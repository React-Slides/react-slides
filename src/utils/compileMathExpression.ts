// utils/compileMathExpression.ts
// Safe compiler for single-variable math expressions used by function-plot and
// integral-area visualizations. Expressions come from slide markdown, which may
// be untrusted, so this never hands input to eval/new Function: it parses a
// whitelisted grammar into closures.
//
// Grammar:
//   expr    := term (('+' | '-') term)*
//   term    := unary (('*' | '/') unary)*
//   unary   := ('+' | '-') unary | power
//   power   := primary (('^' | '**') unary)?        (right-associative)
//   primary := number | 'x' | constant | func '(' expr (',' expr)* ')' | '(' expr ')'

export type MathFunction = (x: number) => number;

type Node = (x: number) => number;

const CONSTANTS: Record<string, number> = {
  PI: Math.PI,
  pi: Math.PI,
  E: Math.E,
  e: Math.E,
};

const FUNCTIONS: Record<string, { arity: number | 'variadic'; fn: (...args: number[]) => number }> = {
  sin: { arity: 1, fn: Math.sin },
  cos: { arity: 1, fn: Math.cos },
  tan: { arity: 1, fn: Math.tan },
  asin: { arity: 1, fn: Math.asin },
  acos: { arity: 1, fn: Math.acos },
  atan: { arity: 1, fn: Math.atan },
  sinh: { arity: 1, fn: Math.sinh },
  cosh: { arity: 1, fn: Math.cosh },
  tanh: { arity: 1, fn: Math.tanh },
  sqrt: { arity: 1, fn: Math.sqrt },
  cbrt: { arity: 1, fn: Math.cbrt },
  abs: { arity: 1, fn: Math.abs },
  log: { arity: 1, fn: Math.log }, // natural log, matching previous behavior
  ln: { arity: 1, fn: Math.log },
  log10: { arity: 1, fn: Math.log10 },
  log2: { arity: 1, fn: Math.log2 },
  exp: { arity: 1, fn: Math.exp },
  floor: { arity: 1, fn: Math.floor },
  ceil: { arity: 1, fn: Math.ceil },
  round: { arity: 1, fn: Math.round },
  sign: { arity: 1, fn: Math.sign },
  pow: { arity: 2, fn: Math.pow },
  min: { arity: 'variadic', fn: Math.min },
  max: { arity: 'variadic', fn: Math.max },
};

const hasOwn = (obj: object, key: string): boolean => Object.prototype.hasOwnProperty.call(obj, key);

const MAX_LENGTH = 500;
const MAX_DEPTH = 64;

type Token =
  | { kind: 'num'; value: number }
  | { kind: 'ident'; value: string }
  | { kind: 'op'; value: string };

function tokenize(src: string): Token[] | null {
  const tokens: Token[] = [];
  const re = /\s*(?:(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(\*\*|[-+*/^(),]))/y;
  let pos = 0;
  while (pos < src.length) {
    if (/^\s*$/.test(src.slice(pos))) break;
    re.lastIndex = pos;
    const m = re.exec(src);
    if (!m) return null;
    if (m[1] !== undefined) tokens.push({ kind: 'num', value: parseFloat(m[1]) });
    else if (m[2] !== undefined) tokens.push({ kind: 'ident', value: m[2] });
    else tokens.push({ kind: 'op', value: m[3] });
    pos = re.lastIndex;
  }
  return tokens;
}

class Parser {
  private i = 0;
  private depth = 0;
  constructor(private tokens: Token[]) {}

  parse(): Node {
    const node = this.expr();
    if (this.i !== this.tokens.length) throw new Error('Unexpected token');
    return node;
  }

  private peekOp(...ops: string[]): string | null {
    const t = this.tokens[this.i];
    return t && t.kind === 'op' && ops.includes(t.value) ? t.value : null;
  }

  private expect(op: string): void {
    if (!this.peekOp(op)) throw new Error(`Expected '${op}'`);
    this.i++;
  }

  private enter(): void {
    if (++this.depth > MAX_DEPTH) throw new Error('Expression too deeply nested');
  }

  private expr(): Node {
    this.enter();
    let left = this.term();
    let op: string | null;
    while ((op = this.peekOp('+', '-'))) {
      this.i++;
      const l = left;
      const r = this.term();
      left = op === '+' ? x => l(x) + r(x) : x => l(x) - r(x);
    }
    this.depth--;
    return left;
  }

  private term(): Node {
    let left = this.unary();
    let op: string | null;
    while ((op = this.peekOp('*', '/'))) {
      this.i++;
      const l = left;
      const r = this.unary();
      left = op === '*' ? x => l(x) * r(x) : x => l(x) / r(x);
    }
    return left;
  }

  private unary(): Node {
    const op = this.peekOp('+', '-');
    if (op) {
      this.i++;
      this.enter();
      const operand = this.unary();
      this.depth--;
      return op === '-' ? x => -operand(x) : operand;
    }
    return this.power();
  }

  private power(): Node {
    const base = this.primary();
    if (this.peekOp('^', '**')) {
      this.i++;
      this.enter();
      const exponent = this.unary();
      this.depth--;
      return x => Math.pow(base(x), exponent(x));
    }
    return base;
  }

  private primary(): Node {
    const t = this.tokens[this.i];
    if (!t) throw new Error('Unexpected end of expression');

    if (t.kind === 'num') {
      this.i++;
      const v = t.value;
      return () => v;
    }

    if (t.kind === 'ident') {
      this.i++;
      if (t.value === 'x') return x => x;
      // Own-property checks so names like 'constructor' or '__proto__' never resolve
      if (hasOwn(CONSTANTS, t.value)) {
        const v = CONSTANTS[t.value];
        return () => v;
      }
      const def = hasOwn(FUNCTIONS, t.value) ? FUNCTIONS[t.value] : undefined;
      if (!def) throw new Error(`Unknown identifier '${t.value}'`);
      this.expect('(');
      const args: Node[] = [this.expr()];
      while (this.peekOp(',')) {
        this.i++;
        args.push(this.expr());
      }
      this.expect(')');
      if (def.arity !== 'variadic' && args.length !== def.arity) {
        throw new Error(`${t.value} expects ${def.arity} argument(s)`);
      }
      const fn = def.fn;
      return x => fn(...args.map(a => a(x)));
    }

    if (t.value === '(') {
      this.i++;
      const inner = this.expr();
      this.expect(')');
      return inner;
    }

    throw new Error(`Unexpected '${t.value}'`);
  }
}

/**
 * Compile a math expression in `x` into a function.
 * Returns null if the expression is invalid. The returned function yields NaN
 * for non-finite results.
 */
export function compileMathExpression(src: string): MathFunction | null {
  if (typeof src !== 'string' || src.length > MAX_LENGTH) return null;
  const tokens = tokenize(src);
  if (!tokens || tokens.length === 0) return null;
  try {
    const node = new Parser(tokens).parse();
    return x => {
      const result = node(x);
      return Number.isFinite(result) ? result : NaN;
    };
  } catch {
    return null;
  }
}
