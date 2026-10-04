// utils/renderSlidesForExport.ts
// Renders every slide offscreen so the PDF/PPTX exporters can capture them.
import { ThemeName } from './themes';

// Pixel size PDFSlideDeck renders each slide at. Export pages must use the same
// aspect ratio or the captured images get cropped or stretched.
export const EXPORT_SLIDE_WIDTH = 1024;
export const EXPORT_SLIDE_HEIGHT = 768;

export interface RenderSlidesOptions {
  // Max time to wait for lazy-loaded visualizations before capturing anyway
  timeoutMs?: number;
  // Extra time after everything has loaded, so chart animations can finish
  settleMs?: number;
}

export interface RenderedSlides {
  slides: HTMLElement[];
  // Unmounts the React root and removes the offscreen container. Safe to call more than once.
  cleanup: () => void;
}

const POLL_INTERVAL_MS = 100;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// PDFSlideDeck mounts its wrapper and every slide in one commit, so once the wrapper
// exists an empty deck is known to be empty and doesn't need to wait out the timeout
const isReady = (container: HTMLElement): boolean =>
  container.querySelector('.pdf-export-container') !== null &&
  container.querySelector('.viz-loading') === null;

export async function renderSlidesForExport(
  markdownContent: string,
  theme: ThemeName,
  { timeoutMs = 10000, settleMs = 1500 }: RenderSlidesOptions = {}
): Promise<RenderedSlides> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);

  let root: { unmount: () => void } | null = null;
  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    root?.unmount();
    container.remove();
  };

  try {
    const { createRoot } = await import('react-dom/client');
    const { default: PDFSlideDeck } = await import('../components/PDFSlideDeck');
    const { createElement } = await import('react');

    const reactRoot = createRoot(container);
    root = reactRoot;
    reactRoot.render(createElement(PDFSlideDeck, { markdownContent, theme }));

    // Wait until slides are mounted and lazy visualizations have replaced their Suspense fallbacks
    const deadline = Date.now() + timeoutMs;
    while (!isReady(container)) {
      if (Date.now() >= deadline) {
        console.warn('Export: timed out waiting for slides to finish loading; capturing current state');
        break;
      }
      await sleep(POLL_INTERVAL_MS);
    }

    const slides = Array.from(container.querySelectorAll<HTMLElement>('.slide-container'));
    if (slides.length > 0) await sleep(settleMs);

    return { slides, cleanup };
  } catch (error) {
    cleanup();
    throw error;
  }
}
