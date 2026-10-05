import { icons } from 'lucide-react';

/**
 * Inline icon shortcodes for slide markdown: `:lucide-zap:` renders the Lucide `zap` icon.
 * Names are the kebab-case names shown on lucide.dev. An optional `@<n>x` suffix scales the
 * icon relative to the surrounding text, e.g. `:lucide-brain@4x:` (whole numbers 1–9; a decimal
 * like `@1.5x` would make remark-gfm read `name@1.5x` as an email address and link it).
 * An unknown name stays as plain text.
 */
const LUCIDE_SHORTCODE = /:lucide-([a-z0-9]+(?:-[a-z0-9]+)*)(?:@([1-9])x)?:/g;

/** `bar-chart-2` -> `BarChart2`, the key lucide-react uses in its `icons` map. */
export function toLucideComponentName(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function getLucideIcon(name: string) {
  const key = toLucideComponentName(name);
  return Object.prototype.hasOwnProperty.call(icons, key)
    ? icons[key as keyof typeof icons]
    : undefined;
}

interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: { hName: string; hProperties: Record<string, unknown> };
}

function splitText(value: string): MdastNode[] | null {
  const nodes: MdastNode[] = [];
  let last = 0;

  for (const match of value.matchAll(LUCIDE_SHORTCODE)) {
    const [, name, scale] = match;
    if (!getLucideIcon(name)) continue;

    const start = match.index ?? 0;
    if (start > last) nodes.push({ type: 'text', value: value.slice(last, start) });
    // Rendered by MarkdownSlide's `span` component, which swaps in the icon
    nodes.push({
      type: 'lucideIcon',
      data: {
        hName: 'span',
        hProperties: scale ? { dataLucideIcon: name, dataLucideScale: scale } : { dataLucideIcon: name },
      },
    });
    last = start + match[0].length;
  }

  if (nodes.length === 0) return null;
  if (last < value.length) nodes.push({ type: 'text', value: value.slice(last) });
  return nodes;
}

function transform(node: MdastNode): void {
  if (!node.children) return;

  node.children = node.children.flatMap(child => {
    // Only plain text: code and inline code keep the shortcode literally
    if (child.type === 'text' && child.value) {
      return splitText(child.value) ?? [child];
    }
    transform(child);
    return [child];
  });
}

export default function remarkLucideIcons() {
  return (tree: MdastNode) => transform(tree);
}
