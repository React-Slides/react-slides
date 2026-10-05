import { renderSlidesForExport } from './renderSlidesForExport';

const FAST = { timeoutMs: 5000, settleMs: 0 };

describe('renderSlidesForExport', () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  afterAll(() => {
    logSpy.mockRestore();
  });

  it('renders one slide container per slide offscreen', async () => {
    const { slides, cleanup } = await renderSlidesForExport('# One\n---\n# Two\n---\n# Three', 'light', FAST);

    expect(slides).toHaveLength(3);
    expect(slides[1]).toHaveTextContent('Two');
    expect(document.body.contains(slides[0])).toBe(true);
    cleanup();
  });

  it('cleanup removes the offscreen container and is safe to call twice', async () => {
    const before = document.body.childElementCount;
    const { slides, cleanup } = await renderSlidesForExport('# One', 'light', FAST);
    expect(document.body.childElementCount).toBe(before + 1);

    cleanup();
    cleanup();

    expect(document.body.childElementCount).toBe(before);
    expect(document.body.contains(slides[0])).toBe(false);
  });

  it('applies the html2canvas text-baseline fix only while an export is active', async () => {
    const fixStyle = () => document.querySelector('style[data-react-slides-export]');
    expect(fixStyle()).toBeNull();

    const { cleanup } = await renderSlidesForExport('# One', 'light', FAST);
    expect(fixStyle()?.textContent).toContain('body > div > img');

    cleanup();
    expect(fixStyle()).toBeNull();
  });

  it('renders slides on the 16:9 canvas used on screen', async () => {
    const { slides, cleanup } = await renderSlidesForExport('# One', 'light', FAST);

    expect(slides[0]).toHaveStyle({ width: '1440px', height: '810px' });
    expect(slides[0].querySelector('.slide-content')).toHaveClass('max-w-6xl');
    cleanup();
  });

  it('returns an empty deck without waiting for the timeout', async () => {
    vi.resetModules();
    vi.doMock('../components/PDFSlideDeck', async () => {
      const React = await import('react');
      return { default: () => React.createElement('div', { className: 'pdf-export-container' }) };
    });
    const { renderSlidesForExport: render } = await import('./renderSlidesForExport');

    const start = Date.now();
    const { slides, cleanup } = await render('', 'light', { timeoutMs: 5000, settleMs: 5000 });

    expect(slides).toHaveLength(0);
    expect(Date.now() - start).toBeLessThan(1000);
    cleanup();
    vi.doUnmock('../components/PDFSlideDeck');
    vi.resetModules();
  });

  it('waits for lazy-loaded visualizations instead of capturing the loading fallback', async () => {
    const markdown = '# Plot\n```math-visual\ntype: function-plot\nequation: "$$x^2$$"\nfunc: x^2\n```';
    const { slides, cleanup } = await renderSlidesForExport(markdown, 'light', FAST);

    expect(slides[0].querySelector('.viz-loading')).toBeNull();
    expect(slides[0].querySelector('.function-plot-viz')).not.toBeNull();
    cleanup();
  });
});

describe('renderSlidesForExport timeout', () => {
  afterEach(() => {
    vi.doUnmock('../components/PDFSlideDeck');
    vi.resetModules();
  });

  it('captures the current state after the timeout if loading never finishes', async () => {
    vi.resetModules();
    // A deck whose visualization fallback never goes away
    vi.doMock('../components/PDFSlideDeck', async () => {
      const React = await import('react');
      return {
        default: () =>
          React.createElement('div', { className: 'slide-container' },
            React.createElement('div', { className: 'viz-loading' }, 'Loading visualization...')),
      };
    });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { renderSlidesForExport: render } = await import('./renderSlidesForExport');

    const { slides, cleanup } = await render('# x', 'light', { timeoutMs: 200, settleMs: 0 });

    expect(slides).toHaveLength(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('timed out'));
    cleanup();
    warnSpy.mockRestore();
  });
});
