import { ThemeName, getTheme } from './themes';
import { renderSlidesForExport, EXPORT_SLIDE_WIDTH, EXPORT_SLIDE_HEIGHT } from './renderSlidesForExport';

/**
 * Export slides to PPTX using image-based approach (same as PDF export)
 * Captures each slide as rendered in browser for visual fidelity
 */
export const exportSlidesToPPTX = async (
  markdownContent: string,
  theme: ThemeName = 'light'
): Promise<void> => {
  // Dynamic import of optional dependencies with graceful error handling
  let html2canvas: typeof import('html2canvas').default;
  let PptxGenJS: typeof import('pptxgenjs').default;

  try {
    const html2canvasModule = await import('html2canvas');
    html2canvas = html2canvasModule.default;
  } catch {
    throw new Error(
      'PPTX export requires html2canvas. Install it with: npm install html2canvas'
    );
  }

  try {
    const pptxModule = await import('pptxgenjs');
    PptxGenJS = pptxModule.default;
  } catch {
    throw new Error(
      'PPTX export requires pptxgenjs. Install it with: npm install pptxgenjs'
    );
  }

  // Get theme colors for background
  const bgColor = getTheme(theme)['--slide-bg'];

  const { slides, cleanup } = await renderSlidesForExport(markdownContent, theme);

  try {
    if (slides.length === 0) {
      throw new Error('No slides to export');
    }

    // Create PowerPoint presentation with a layout matching the rendered slide's
    // aspect ratio, so full-slide images aren't stretched
    const pptx = new PptxGenJS();
    pptx.defineLayout({
      name: 'REACT_SLIDES',
      width: 10,
      height: (10 * EXPORT_SLIDE_HEIGHT) / EXPORT_SLIDE_WIDTH,
    });
    pptx.layout = 'REACT_SLIDES';
    pptx.title = 'React Slides Export';
    pptx.author = 'React Slides';

    for (const slideElement of slides) {
      // Capture slide as canvas image with theme background
      const canvas = await html2canvas(slideElement, {
        backgroundColor: bgColor,
        scale: 2, // Good balance of quality vs file size
        useCORS: true,
        allowTaint: false
      });

      const imgData = canvas.toDataURL('image/png');

      // Add image to fill the entire slide
      const slide = pptx.addSlide();
      slide.addImage({
        data: imgData,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%'
      });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `slides_${timestamp}.pptx`;

    await pptx.writeFile({ fileName: filename });

    console.log(`PPTX exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting slides to PPTX:', error);
    throw error;
  } finally {
    cleanup();
  }
};
