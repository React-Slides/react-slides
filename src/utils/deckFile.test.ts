import { getDeckFileParam } from './deckFile';

describe('getDeckFileParam', () => {
  it('returns the markdown file named by ?deck=', () => {
    expect(getDeckFileParam('?deck=Do-It-Now.md')).toBe('Do-It-Now.md');
    expect(getDeckFileParam('?deck=decks/q4.review.md&x=1')).toBe('decks/q4.review.md');
  });

  it('returns null when there is no deck parameter', () => {
    expect(getDeckFileParam('')).toBeNull();
    expect(getDeckFileParam('?deck=')).toBeNull();
    expect(getDeckFileParam('?theme=dark')).toBeNull();
  });

  it('rejects anything that is not a relative .md path inside the project', () => {
    expect(getDeckFileParam('?deck=../secrets.md')).toBeNull();
    expect(getDeckFileParam('?deck=decks/../../x.md')).toBeNull();
    expect(getDeckFileParam('?deck=/etc/notes.md')).toBeNull();
    expect(getDeckFileParam('?deck=https://example.com/a.md')).toBeNull();
    expect(getDeckFileParam('?deck=.env.md')).toBeNull();
    expect(getDeckFileParam('?deck=package.json')).toBeNull();
    expect(getDeckFileParam('?deck=slides.md%3Fx')).toBeNull();
  });
});
