// Shared by the on-screen deck (SlideDeck) and PDF/PPTX export (PDFSlideDeck), so an exported
// slide is laid out exactly like the slide on screen.

// Slides are laid out on a fixed 16:9 canvas, then scaled to the window (on screen) or
// captured at this size (export)
export const SLIDE_CANVAS_WIDTH = 1440;
export const SLIDE_CANVAS_HEIGHT = 810;
export const SLIDE_CANVAS_PADDING = 48;
// Content taller than the canvas shrinks to fit, but never below this
export const MIN_CONTENT_SCALE = 0.6;
// Width class for the content column inside the canvas
export const SLIDE_CONTENT_CLASS = 'max-w-6xl mx-auto w-full';

/** Scale for slide content of the given (untransformed) height so it fits the canvas */
export function fitContentScale(contentHeight: number): number {
  const available = SLIDE_CANVAS_HEIGHT - 2 * SLIDE_CANVAS_PADDING;
  return contentHeight > available ? Math.max(MIN_CONTENT_SCALE, available / contentHeight) : 1;
}
