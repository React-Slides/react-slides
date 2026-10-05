/** Vite custom HMR event sent by the dev server when a markdown file changes on disk */
export const DECK_FILE_CHANGED_EVENT = 'react-slides:deck-file-changed';

export interface DeckFileChangedPayload {
  /** Path relative to the project root, using forward slashes */
  file: string;
}

/**
 * Reads `?deck=<file>.md` from a query string: the markdown file to present instead of the
 * saved draft. Only relative paths to `.md` files are accepted (no `..`, no absolute paths,
 * no URLs), so the parameter can't point the app somewhere unexpected.
 */
export function getDeckFileParam(search: string): string | null {
  const deck = new URLSearchParams(search).get('deck')?.trim();
  if (!deck) return null;
  if (!/^[\w.-]+(\/[\w.-]+)*$/.test(deck) || !deck.endsWith('.md')) return null;
  // Reject `.`/`..` segments and hidden files
  if (deck.split('/').some(part => part.startsWith('.'))) return null;
  return deck;
}
